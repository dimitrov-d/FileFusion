import nodemailer from 'nodemailer';

const getEmailTemplate = (templateName, data) => {
  const templates = {
    default: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>FileFusion: You've received a file!</title>
                <style>
                    /* General styles */
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    .header { background-color: #007BFF; color: #fff; padding: 20px 0; text-align: center; border-radius: 8px 8px 0 0; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 20px; }
                    .highlight { background-color: #f9f9f9; padding: 15px; border-left: 5px solid #007BFF; margin-bottom: 20px; }
                    .footer { text-align: center; padding: 10px 0; border-top: 1px solid #ddd; }
                    .cta-button { display: inline-block; padding: 12px 25px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>You have a New file</h1>
                    </div>
                    <div class="content">
                        <div class="highlight">
                            <p>Hi there,</p>
                            <p>You've received a new file from ${data.email}. Click the button below to download it.</p>
                        </div>
                    </div>
                    <div class="footer">
                        <a href="${data.link}" class="cta-button">Download File</a>
                    </div>
                </div>
            </body>
            </html>
        `,
    encrypted: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>FileFusion: You've received a file!</title>
                <style>
                    /* General styles */
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; color: #333; }
                    .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                    .header { background-color: #007BFF; color: #fff; padding: 20px 0; text-align: center; border-radius: 8px 8px 0 0; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .content { padding: 20px; }
                    .highlight { background-color: #f9f9f9; padding: 15px; border-left: 5px solid #007BFF; margin-bottom: 20px; }
                    .message-box { padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f0f0f0; margin-bottom: 20px; }
                    .footer { text-align: center; padding: 10px 0; border-top: 1px solid #ddd; }
                    .cta-button { display: inline-block; padding: 12px 25px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>You have a new encrypted file</h1>
                    </div>
                    <div class="content">
                        <div class="highlight">
                            <p>Hi there,</p>
                            <p>You've received a new file from ${data.email}. You can download it securely using the button below.</p>
                            <p>Please note the following: </p>
                            <p>- Decryption key is linked to NFT with ID ${data.nftId}</p>
                            <p>- <strong>Authorized Decryption Address:</strong> ${data.targetWalletAddress}</p>
                        </div>
                        <div class="message-box">
                            <p>We hope you enjoy your file!</p>
                            <p>Sincerely,</p>
                            <p>The FileFusion Team</p>
                        </div>
                    </div>
                    <div class="footer">
                        <a href="${data.link}" class="cta-button">Access Decryption Page</a>
                    </div>
                </div>
            </body>
            </html>
        `,
  };

  return templates[templateName] || templates.default;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      to,
      subject,
      text,
      from,
      fromName,
      link,
      templateName,
      nftId,
      targetWalletAddress,
    } = req.body;

    if (!to || !subject || !text || !from || !fromName || !link) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const templateData = {
      email: from,
      link,
      nftId,
      targetWalletAddress,
    };

    const htmlTemplate = getEmailTemplate(templateName, templateData);
    console.log(" process.env.EMAIL_USER", process.env.EMAIL_USER);
    console.log(" process.env.EMAIL_PASS", process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.verify(function (error, success) {
      if (error) {
        console.error('Transporter error:', error);
        return res
          .status(500)
          .json({ error: 'Transporter configuration error' });
      } else {
        console.log('Server is ready to take our messages:', success);
      }
    });

    const mailOptions = {
      from: `${fromName} <${from}>`,
      to,
      subject,
      text,
      html: htmlTemplate,
    };

    console.log('Sending email with the following details:');
    console.log('To:', to);
    console.log('From:', from);
    console.log('Subject:', subject);
    console.log('Text:', text);

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
