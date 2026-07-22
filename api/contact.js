import nodemailer from 'nodemailer';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').slice(0, 2000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function adminEmailHtml(data) {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;background-color:#f5f5f5;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,0.1);">
  <tr>
    <td style="background:#1b1a18;padding:25px;text-align:center;">
      <img src="https://shiltech.org/assets/images/lg.png" alt="SHILTECH" style="height:60px;margin-bottom:10px;" />
      <p style="margin:4px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c86eaa;font-weight:600;">Engineering Services</p>
    </td>
  </tr>
  <tr>
    <td style="padding:35px;color:#333;">
      <h2 style="margin-top:0;font-size:22px;">New Quote Request</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">A new quote request has been submitted through the website. Details are below:</p>
      <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;margin-top:15px;border:1px solid #eee;">
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;width:40%;">Full Name</td><td style="border:1px solid #eee;">${escapeHtml(data.fullName)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Company</td><td style="border:1px solid #eee;">${escapeHtml(data.company || '—')}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Email</td><td style="border:1px solid #eee;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Phone Number</td><td style="border:1px solid #eee;">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Service Required</td><td style="border:1px solid #eee;">${escapeHtml(data.service)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Project Description</td><td style="border:1px solid #eee;">${escapeHtml(data.description)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Date Submitted</td><td style="border:1px solid #eee;">${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</td></tr>
      </table>
      <p style="margin-top:20px;font-size:15px;color:#333;">Please respond to this enquiry as soon as possible.</p>
      <p style="font-size:15px;color:#333;">– SHILTECH Engineering Services</p>
    </td>
  </tr>
  <tr>
    <td style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#777;">
      &copy; ${year} SHILTECH Engineering Services. All rights reserved.
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function customerEmailHtml(data) {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;background-color:#f5f5f5;">
<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,0.1);">
  <tr>
    <td style="background:#1b1a18;padding:25px;text-align:center;">
      <img src="https://shiltech.org/assets/images/lg.png" alt="SHILTECH" style="height:60px;margin-bottom:10px;" />
      <p style="margin:4px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c86eaa;font-weight:600;">Engineering Services</p>
    </td>
  </tr>
  <tr>
    <td style="padding:35px;color:#333;">
      <h2 style="margin-top:0;font-size:22px;">Quote Request Received</h2>
      <p style="font-size:16px;line-height:1.6;color:#555;">
        Hi <strong>${escapeHtml(data.fullName)}</strong>,
      </p>
      <p style="font-size:16px;line-height:1.6;color:#555;">
        Thank you for reaching out to SHILTECH Engineering Services. We have successfully received your project enquiry and one of our specialists will review the information you have provided.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#555;">
        We will contact you as soon as possible to discuss your project and provide a quotation.
      </p>
      <p style="font-size:16px;line-height:1.6;color:#555;">Below is a copy of your request for your records:</p>

      <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;margin-top:15px;border:1px solid #eee;">
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;width:40%;">Full Name</td><td style="border:1px solid #eee;">${escapeHtml(data.fullName)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Email</td><td style="border:1px solid #eee;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Phone Number</td><td style="border:1px solid #eee;">${escapeHtml(data.phone)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Service Required</td><td style="border:1px solid #eee;">${escapeHtml(data.service)}</td></tr>
        <tr><td style="font-weight:bold;background:#f5eef5;border:1px solid #eee;">Project Description</td><td style="border:1px solid #eee;">${escapeHtml(data.description)}</td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
        <tr><td>
          <h3 style="margin:0 0 12px;font-size:18px;color:#1b1a18;">What happens next?</h3>
          <table width="100%" cellpadding="6" cellspacing="0">
            <tr><td style="font-size:15px;color:#555;line-height:1.6;">&#10003; We review your project requirements.</td></tr>
            <tr><td style="font-size:15px;color:#555;line-height:1.6;">&#10003; We may contact you for additional details.</td></tr>
            <tr><td style="font-size:15px;color:#555;line-height:1.6;">&#10003; We prepare a customised quotation.</td></tr>
            <tr><td style="font-size:15px;color:#555;line-height:1.6;">&#10003; We get back to you as soon as possible.</td></tr>
          </table>
        </td></tr>
      </table>

      <p style="margin-top:28px;font-size:15px;color:#555;">Thank you for choosing SHILTECH Engineering Services.</p>
      <p style="font-size:15px;color:#333;">Best regards,<br/>SHILTECH Engineering Services Team</p>
    </td>
  </tr>
  <tr>
    <td style="background:#fafafa;padding:18px;text-align:center;font-size:12px;color:#777;">
      &copy; ${year} SHILTECH Engineering Services. All rights reserved.
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, company, email, phone, service, description } = req.body || {};

  const name = sanitize(fullName);
  const comp = sanitize(company);
  const mail = sanitize(email);
  const phoneNum = sanitize(phone);
  const svc = sanitize(service);
  const desc = sanitize(description);

  if (!name || !mail || !phoneNum) {
    return res.status(400).json({ message: 'Full name, email, and phone are required.' });
  }
  if (!isValidEmail(mail)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const data = { fullName: name, company: comp, email: mail, phone: phoneNum, service: svc, description: desc };

  try {
    await transport.sendMail({
      from: `"SHILTECH Website" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL,
      replyTo: mail,
      subject: `New Quote Request — ${name}`,
      html: adminEmailHtml(data)
    });

    try {
      await transport.sendMail({
        from: `"SHILTECH Engineering Services" <${process.env.SMTP_EMAIL}>`,
        to: mail,
        replyTo: process.env.SMTP_EMAIL,
        subject: `We've Received Your Quote Request`,
        html: customerEmailHtml(data)
      });
    } catch (custErr) {
      console.error('Customer email failed:', custErr);
    }

    return res.status(200).json({ message: 'Quote request submitted successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ message: 'Failed to send email. Please try again or contact us via WhatsApp.' });
  }
}
