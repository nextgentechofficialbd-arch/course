
/**
 * Email Helper Library for EduAgency
 * Powered by Resend
 */

// This is a placeholder for the Resend client. 
// In a real project: import { Resend } from 'resend'; const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccessEmail(email: string, name: string, courseName: string, accessLink: string) {
  console.log(`Sending access email to ${email} for course ${courseName}`);
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px;">
      <h1 style="color: #2563eb; font-size: 24px;">Your ${courseName} Access is Ready! 🎉</h1>
      <p style="font-size: 16px; color: #475569;">Hello ${name},</p>
      <p style="font-size: 16px; color: #475569;">Your payment has been confirmed! You now have full access to the course content.</p>
      
      <div style="margin: 30px 0;">
        <a href="${accessLink}" style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
          Start Learning Now
        </a>
      </div>

      <p style="font-size: 16px; color: #475569; font-style: italic;">
        আপনার পেমেন্ট সফলভাবে যাচাই করা হয়েছে। এখন আপনি কোর্সটি শুরু করতে পারেন। নিচের বাটনে ক্লিক করুন।
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        &copy; ${new Date().getFullYear()} EduAgency. All rights reserved.
      </p>
    </div>
  `;

  // resend.emails.send({ from: 'EduAgency <no-reply@eduagency.io>', to: email, subject: `Your ${courseName} Access is Ready! 🎉`, html });
}

export async function sendRejectionEmail(email: string, name: string, courseName: string, reason: string) {
  console.log(`Sending rejection email to ${email}`);
}

export async function sendEnrollmentConfirmation(email: string, name: string, courseName: string) {
  console.log(`Sending confirmation email to ${email}`);
}
