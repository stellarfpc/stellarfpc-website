# Cloudflare Quote Form Setup

This site submits the Contact / Request Quote form to `POST /api/quote` through the `stellarfpc-website` Cloudflare Worker.

Do not commit secret values to the repository. Configure all private values in the Cloudflare dashboard.

## Required Cloudflare Environment Variables / Secrets

Configure these for the Cloudflare Worker:

- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `QUOTE_EMAIL_TO`
- `QUOTE_EMAIL_FROM`

Expected email values:

- `QUOTE_EMAIL_TO`: `info@stellarfpc.com`
- `QUOTE_EMAIL_FROM`: for example `StellarFPC <noreply@stellarfpc.ca>` after the sender domain is verified in Resend.

The Resend API key should be stored only as `RESEND_API_KEY` in Cloudflare Worker secrets.

## Public Turnstile Site Key

The public Turnstile site key belongs in `contact.html`:

```html
<div class="cf-turnstile" data-sitekey="0x4AAAAAAETeo7bCItWuuZdf"></div>
```

Use the public site key from Cloudflare Turnstile.

Never place the Turnstile secret key in HTML, JavaScript, GitHub, or the repository. Store it only as `TURNSTILE_SECRET_KEY` in Cloudflare Worker secrets.

## Turnstile Setup

1. Open Cloudflare Dashboard.
2. Go to Turnstile.
3. Create a widget for `stellarfpc.ca`.
4. Copy the Site Key and Secret Key.
5. Put the Site Key in `contact.html` as described above.
6. Store the Secret Key only as `TURNSTILE_SECRET_KEY` in Cloudflare Worker secrets.

## Resend Email Setup

1. Open the Resend dashboard.
2. Add and verify the sender domain, preferably `stellarfpc.ca`.
3. Add the DNS records Resend provides for SPF/DKIM/domain verification.
4. Create a Resend API key for sending email.
5. Configure these Cloudflare Worker variables / secrets:
   - `RESEND_API_KEY`
   - `QUOTE_EMAIL_FROM`
   - `QUOTE_EMAIL_TO`
6. Use `info@stellarfpc.com` for `QUOTE_EMAIL_TO`.
7. Use a verified sender such as `StellarFPC <noreply@stellarfpc.ca>` for `QUOTE_EMAIL_FROM`.

Do not alter the site's existing business email setup unless necessary.

## Testing

1. Open `contact.html`.
2. Complete the form and Turnstile challenge.
3. Submit the form.
4. Confirm the request redirects to `thank-you.html`.
5. Confirm the email arrives at `QUOTE_EMAIL_TO`.
6. Confirm direct visits to `thank-you.html` do not fire the Google Ads conversion.
