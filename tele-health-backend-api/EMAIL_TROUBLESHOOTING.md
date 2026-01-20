# Email Troubleshooting Guide

## Why Emails Are Not Being Sent

If emails are not being sent, check the following:

### 1. **Check Environment Variables**

Make sure your `.env` file has:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Important:** 
- The `SENDGRID_FROM_EMAIL` must be a **verified sender** in your SendGrid account
- For testing, you can use a single sender verification
- For production, you need domain authentication

### 2. **Test Email Configuration**

Run the test script:
```bash
npm run test:email your-email@example.com
```

This will:
- Check if environment variables are set
- Attempt to send a test email
- Show detailed error messages if it fails

### 3. **Common SendGrid Errors**

#### Error: "The from address does not match a verified Sender Identity"
**Solution:** 
1. Go to SendGrid Dashboard → Settings → Sender Authentication
2. Verify your sender email address
3. Or set up domain authentication

#### Error: "Invalid API Key"
**Solution:**
1. Go to SendGrid Dashboard → Settings → API Keys
2. Create a new API Key with "Full Access" or "Mail Send" permissions
3. Copy the key (it's only shown once!)
4. Update your `.env` file

#### Error: "Forbidden" (403)
**Solution:**
- Your API key might not have the right permissions
- Create a new API key with "Mail Send" permission

### 4. **Check Server Logs**

When you register a user, check your server console for:
- `✅ Verification email sent to...` - Success
- `❌ FAILED TO SEND VERIFICATION EMAIL` - Failure with detailed error

### 5. **SendGrid Account Status**

- Free tier: 100 emails/day
- Check your SendGrid dashboard for:
  - Account status
  - Email activity
  - Bounce/spam reports

### 6. **Quick Diagnostic Steps**

1. **Check if variables are loaded:**
   ```bash
   npm run test:email
   ```

2. **Check server health endpoint:**
   ```bash
   curl http://localhost:5000/health
   ```
   Look for `hasSendGridKey: true` and `hasSendGridFromEmail: true`

3. **Check server logs** when registering:
   - Look for the detailed error messages
   - Check SendGrid response body for specific errors

### 7. **Testing in Development**

For development, you can:
1. Use SendGrid's test mode (emails go to a test inbox)
2. Use a verified personal email as `SENDGRID_FROM_EMAIL`
3. Check SendGrid Activity Feed to see if emails were attempted

### 8. **Still Not Working?**

1. **Verify SendGrid Setup:**
   - Log into SendGrid dashboard
   - Check API Keys section
   - Check Sender Authentication
   - Check Activity Feed for recent attempts

2. **Check Email Service Logs:**
   - The improved logging will show detailed errors
   - Look for SendGrid response body in error logs

3. **Test Directly:**
   ```bash
   npm run test:email your-email@example.com
   ```

## Need Help?

If emails still aren't working:
1. Run `npm run test:email your-email@example.com`
2. Copy the full error message
3. Check SendGrid dashboard Activity Feed
4. Verify your sender email is verified in SendGrid

