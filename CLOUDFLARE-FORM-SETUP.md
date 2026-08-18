# Cloudflare Quote Form Setup

This site submits the Contact / Request Quote form to `POST /api/quote` through a Cloudflare Pages Function.

Do not commit secret values to the repository. Configure all private values in the Cloudflare dashboard.

## Required Cloudflare Environment Variables / Secrets

Configure these for the Pages project:

- `TURNSTILE_SECRET_KEY`
- `CF_ACCOUNT_ID`
- `CF_EMAIL_API_TOKEN`
- `QUOTE_EMAIL_TO`
- `QUOTE_EMAIL_FROM`

Expected email values:

- `QUOTE_EMAIL_TO`: `info@stellarfpc.com`
- `QUOTE_EMAIL_FROM`: for example `noreply@stellarfpc.ca` after the sender domain is onboarded for Cloudflare Email Sending.

The Cloudflare API token should use only the minimum Email Sending permission required by the Cloudflare Email Service REST API.

## Public Turnstile Site Key

The public Turnstile site key belongs in `contact.html`:

```html
<div class="cf-turnstile" data-sitekey="0x4AAAAAAETeo7bCItWuuZdf"></div>
```

Use the public site key from Cloudflare Turnstile.

Never place the Turnstile secret key in HTML, JavaScript, GitHub, or the repository. Store it only as `TURNSTILE_SECRET_KEY` in Cloudflare Pages environment variables / secrets.

## Turnstile Setup

1. Open Cloudflare Dashboard.
2. Go to Turnstile.
3. Create a widget for `stellarfpc.ca`.
4. Copy the Site Key and Secret Key.
5. Put the Site Key in `contact.html` as described above.
6. Store the Secret Key only as `TURNSTILE_SECRET_KEY` in Cloudflare Pages environment variables / secrets.

## Cloudflare Email Service Setup

1. Open Cloudflare Dashboard.
2. Go to Email Service / Email Sending.
3. Onboard the sender domain, preferably `stellarfpc.ca`.
4. Allow Cloudflare to create the required SPF/DKIM/email DNS records.
5. Create an API token with only the Email Sending permission required by the REST API.
6. Configure these Cloudflare Pages Function variables / secrets:
   - `CF_ACCOUNT_ID`
   - `CF_EMAIL_API_TOKEN`
   - `QUOTE_EMAIL_FROM`
   - `QUOTE_EMAIL_TO`
7. Use `info@stellarfpc.com` for `QUOTE_EMAIL_TO`.
8. Use a sender such as `noreply@stellarfpc.ca` for `QUOTE_EMAIL_FROM` once the domain is properly onboarded.

Do not alter the site's existing business email setup unless necessary.

## Testing

1. Open `contact.html`.
2. Complete the form and Turnstile challenge.
3. Submit the form.
4. Confirm the request redirects to `thank-you.html`.
5. Confirm the email arrives at `QUOTE_EMAIL_TO`.
6. Confirm direct visits to `thank-you.html` do not fire the Google Ads conversion.
