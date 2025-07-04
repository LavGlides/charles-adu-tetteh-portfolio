# Email Setup Guide for Portfolio Contact Forms

## 📧 Email Configuration Setup

This guide will help you set up email functionality for your portfolio's contact forms.

### 1. Create Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "App" → "Mail"
4. Generate a 16-character app password
5. **Save this password** - you'll need it for the environment variables

### 2. Environment Variables Setup

1. **Create `.env.local`** in your project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

2. **Fill in your credentials** in `.env.local`:

```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-16-character-app-password
PORTFOLIO_URL=https://your-portfolio-domain.com
```

### 3. Test the Email Functionality

1. **Start your development server**:

```bash
pnpm dev
```

2. **Visit your contact page**: `http://localhost:3000#contact`

3. **Test both forms**:
   - Contact Me form
   - Book Service form

### 4. Email Templates

Your emails will include:

#### Contact Form Email

- **Subject**: `Portfolio Contact: [Subject]`
- **Styled HTML email** with contact details
- **Portfolio branding** and professional layout
- **Quick reply link** for easy response

#### Service Request Email

- **Subject**: `🚀 New Service Request: [Project Type]`
- **Detailed project information** with budget and timeline
- **Color-coded badges** for easy scanning
- **Quick action links** for immediate response

### 5. Features Included

✅ **Professional Email Templates** - Beautifully designed HTML emails  
✅ **Portfolio Branding** - Consistent with your purple theme  
✅ **Client Information** - All form data properly formatted  
✅ **Quick Actions** - Direct reply and meeting schedule links  
✅ **Error Handling** - Graceful failure handling with user feedback  
✅ **Form Validation** - Both client and server-side validation  
✅ **Success Notifications** - User feedback with toast notifications

### 6. Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables** to your hosting platform
2. **Update PORTFOLIO_URL** to your actual domain
3. **Test email functionality** in production

### 7. Alternative Email Services

If you prefer not to use Gmail, you can modify `lib/email.ts`:

#### For Outlook:

```typescript
const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

#### For Custom SMTP:

```typescript
const transporter = nodemailer.createTransport({
  host: "your-smtp-server.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 8. Security Notes

🔒 **Never commit `.env.local`** to version control  
🔒 **Use app passwords** not your regular Gmail password  
🔒 **Validate all inputs** both client and server side  
🔒 **Rate limiting** can be added for production use

### 9. Troubleshooting

**Email not sending?**

- Check your app password is correct
- Ensure 2FA is enabled on Gmail
- Check server logs for error messages
- Verify environment variables are loaded

**Forms not submitting?**

- Check browser console for errors
- Verify API routes are working
- Test with simple data first

**Styling issues in emails?**

- Some email clients strip CSS
- Templates use inline styles for compatibility
- Test with different email providers

---

Your portfolio now has professional email functionality! 🎉
