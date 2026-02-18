
/**
 * Email Helper Library for EduAgency
 * Powered by Resend
 */

// Placeholder for the Resend client.
// export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccessEmail(email: string, name: string, courseName: string, accessLink: string) {
  console.log(`Sending access email to ${email} for course ${courseName}`);
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 32px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: #2563eb; width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 32px; font-style: italic;">E</div>
      </div>
      <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; text-align: center; margin-bottom: 20px;">Your ${courseName} Access is Ready! 🎉</h1>
      <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 16px; color: #475569; line-height: 1.6;">Great news! Your payment has been confirmed by our administrative team. You now have permanent access to <strong>${courseName}</strong>.</p>
      
      <div style="margin: 40px 0; text-align: center;">
        <a href="${accessLink}" style="background-color: #2563eb; color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 900; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);">
          Start Learning Now
        </a>
      </div>

      <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 30px;">
        <p style="font-size: 14px; color: #64748b; font-style: italic; margin: 0;">
          আপনার পেমেন্ট সফলভাবে যাচাই করা হয়েছে। এখন আপনি কোর্সটি শুরু করতে পারেন। উপরের বাটনে ক্লিক করে আপনার ড্যাশবোর্ডে প্রবেশ করুন।
        </p>
      </div>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.6;">
        If you have any questions, simply reply to this email.<br/>
        &copy; ${new Date().getFullYear()} EduAgency. Dhaka, Bangladesh.
      </p>
    </div>
  `;

  // return await resend.emails.send({
  //   from: 'EduAgency <no-reply@eduagency.io>',
  //   to: email,
  //   subject: `Access Granted: ${courseName} 🎉`,
  //   html,
  // });
}

export async function sendRejectionEmail(email: string, name: string, courseName: string, reason: string) {
  console.log(`Sending rejection email to ${email}`);
  
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #fee2e2; border-radius: 32px; background: #ffffff;">
      <h1 style="color: #dc2626; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Payment Verification Update</h1>
      <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hello ${name},</p>
      <p style="font-size: 16px; color: #475569; line-height: 1.6;">Unfortunately, your enrollment for <strong>${courseName}</strong> could not be confirmed at this time.</p>
      
      <div style="background: #fff1f2; padding: 24px; border-radius: 16px; margin: 30px 0; border-left: 4px solid #f43f5e;">
        <p style="font-size: 14px; color: #9f1239; font-weight: 700; margin-bottom: 8px;">Reason for Rejection:</p>
        <p style="font-size: 15px; color: #be123c; margin: 0;">${reason}</p>
      </div>

      <p style="font-size: 16px; color: #475569; line-height: 1.6;">
        Please double-check your Transaction ID and ensure the screenshot is clear. You can attempt to enroll again through the course page.
      </p>

      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        &copy; ${new Date().getFullYear()} EduAgency.
      </p>
    </div>
  `;

  // return await resend.emails.send({
  //   from: 'EduAgency <support@eduagency.io>',
  //   to: email,
  //   subject: `Enrollment Update: ${courseName}`,
  //   html,
  // });
}

export async function sendEnrollmentConfirmation(email: string, name: string, courseName: string) {
  // logic to send initial "we received your payment, verifying now" email
}
