# Email Verification Setup Guide

Your backend uses **Resend** for sending verification emails. Here's how to set it up for deployment.

## Option 1: Resend (Recommended - Free Tier Available)

### Step 1: Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Key
1. Go to **API Keys** in your Resend dashboard
2. Click **Create API Key**
3. Name it (e.g., "Telehealth Backend")
4. Copy the API key (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)
1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Add your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually takes a few minutes)

### Step 4: Set Environment Variables

Add these to your deployment platform's environment variables:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**OR** (if your platform doesn't support uppercase):

```env
Resend_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** If you haven't verified a domain yet, you can use Resend's test domain:
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Resend Free Tier Limits:
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ Perfect for development and small projects

---

## Option 2: SMTP (Alternative - Works on Any Platform)

If Resend doesn't work on your deployment platform, you can switch to SMTP.

### Supported SMTP Providers:
- **Gmail** (with App Password)
- **Outlook/Hotmail**
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **Amazon SES** (free tier: 62,000 emails/month)

### Setup Instructions:

1. **Uncomment SMTP code** in `email.service.ts`
2. **Set environment variables:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

### Gmail Setup Example:
1. Enable 2-Factor Authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an App Password for "Mail"
4. Use that password as `SMTP_PASS`

---

## Testing Email Setup

After deployment, test by:
1. Registering a new account
2. Check your email for the verification code
3. Check server logs for any email errors

---

## Troubleshooting

### Error: "Invalid API Key"
- Check that `RESEND_API_KEY` is set correctly
- Make sure there are no extra spaces
- Try using `Resend_API_KEY` instead

### Error: "Domain not verified"
- Use `onboarding@resend.dev` for testing
- Or verify your domain in Resend dashboard

### Emails not sending
- Check server logs for error messages
- Verify environment variables are set
- Test API key in Resend dashboard

---

## Quick Setup for Common Platforms

### Railway
1. Go to your project → Variables
2. Add:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
3. Redeploy

### Render
1. Go to your service → Environment
2. Add:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
3. Save and redeploy

### Fly.io
```bash
fly secrets set RESEND_API_KEY=re_xxx
fly secrets set RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## Need Help?

If you're still having issues:
1. Check the server logs for specific error messages
2. Verify your API key is active in Resend dashboard
3. Make sure your domain is verified (if using custom domain)
4. Try the test domain `onboarding@resend.dev` first

