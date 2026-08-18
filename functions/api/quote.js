const FIELD_LIMITS = {
  name: 150,
  email: 254,
  phone: 50,
  company: 200,
  buildingAddress: 300,
  service: 150,
  message: 5000,
  source: 150,
};

const REQUIRED_FIELDS = ["name", "email", "service", "message"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function cleanValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateSubmission(fields) {
  for (const field of REQUIRED_FIELDS) {
    if (!fields[field]) {
      return `${field} is required`;
    }
  }

  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (fields[field] && fields[field].length > limit) {
      return `${field} is too long`;
    }
  }

  if (!EMAIL_PATTERN.test(fields.email)) {
    return "email is invalid";
  }

  return "";
}

async function verifyTurnstile({ secret, token, remoteIp }) {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);

  if (remoteIp) {
    body.append("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json().catch(() => null);
  return Boolean(result && result.success);
}

function buildEmail({ fields, submittedAt, clientIp }) {
  const subject = `New StellarFPC Quote Request - ${fields.service}`;
  const details = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Company / Organization", fields.company],
    ["Building Address", fields.buildingAddress],
    ["Service Needed", fields.service],
    ["Source", fields.source],
    ["Submitted", submittedAt],
    ["Client IP", clientIp],
  ];
  const textLines = [
    "New StellarFPC Website Quote Request",
    "",
    "Name:",
    fields.name,
    "",
    "Email:",
    fields.email,
    "",
    "Phone:",
    fields.phone,
    "",
    "Company / Organization:",
    fields.company,
    "",
    "Building Address:",
    fields.buildingAddress,
    "",
    "Service Needed:",
    fields.service,
    "",
    "Message:",
    fields.message,
    "",
    "Source:",
    fields.source,
    "",
    "Submitted:",
    submittedAt,
    "",
    "Client IP:",
    clientIp,
  ];
  const detailRows = details
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value || "-")}</td></tr>`)
    .join("");
  const html = `<!doctype html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; color: #121a26; line-height: 1.5;">
    <h1 style="font-size: 22px; margin: 0 0 18px;">New StellarFPC Website Quote Request</h1>
    <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
      ${detailRows}
    </table>
    <h2 style="font-size: 18px; margin: 24px 0 8px;">Message</h2>
    <div style="white-space: pre-wrap; padding: 16px; border-left: 4px solid #b4202a; background: #f6f7f9;">${escapeHtml(fields.message)}</div>
  </body>
</html>`;

  return {
    subject,
    text: textLines.join("\n"),
    html,
  };
}

async function sendEmail({ env, fields, submittedAt, clientIp }) {
  const email = buildEmail({ fields, submittedAt, clientIp });
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/email/sending/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.CF_EMAIL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: env.QUOTE_EMAIL_TO,
      from: env.QUOTE_EMAIL_FROM,
      reply_to: fields.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result || result.success !== true) {
    console.error("Cloudflare Email Service send failed", {
      status: response.status,
      success: result && result.success,
      errors: result && result.errors,
    });
    return false;
  }

  return true;
}

export async function handleQuoteRequest(request, env) {
  try {
    const missingEnv = ["TURNSTILE_SECRET_KEY", "CF_ACCOUNT_ID", "CF_EMAIL_API_TOKEN", "QUOTE_EMAIL_TO", "QUOTE_EMAIL_FROM"].filter((key) => !env[key]);

    if (missingEnv.length) {
      console.error("Quote form is missing required environment configuration", { missingEnv });
      return jsonResponse({ success: false, error: "Server configuration error" }, 500);
    }

    const formData = await request.formData();
    const fields = Object.fromEntries(
      Object.keys(FIELD_LIMITS).map((field) => [field, cleanValue(formData.get(field))])
    );
    const turnstileToken = cleanValue(formData.get("cf-turnstile-response"));
    const validationError = validateSubmission(fields);

    if (validationError || !turnstileToken) {
      return jsonResponse({ success: false, error: "Invalid submission" }, 400);
    }

    const clientIp = request.headers.get("CF-Connecting-IP") || "";
    const turnstileOk = await verifyTurnstile({
      secret: env.TURNSTILE_SECRET_KEY,
      token: turnstileToken,
      remoteIp: clientIp,
    });

    if (!turnstileOk) {
      return jsonResponse({ success: false, error: "Security verification failed" }, 403);
    }

    const submittedAt = new Date().toISOString();
    const emailOk = await sendEmail({ env, fields, submittedAt, clientIp });

    if (!emailOk) {
      return jsonResponse({ success: false, error: "Could not send request" }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Quote form request failed", { message: error && error.message });
    return jsonResponse({ success: false, error: "Could not submit request" }, 500);
  }
}

export async function onRequestPost(context) {
  return handleQuoteRequest(context.request, context.env);
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }

  return jsonResponse({ success: false, error: "Method not allowed" }, 405);
}
