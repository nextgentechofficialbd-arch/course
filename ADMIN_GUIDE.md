
# 🎓 Administrator Operational Guide

Welcome to the EduAgency Control Center. This guide covers daily management tasks.

## 💳 1. Managing Enrollments
When a student pays via bKash or Nagad, their status is **Pending**.
1. Navigate to **Enrollments** sidebar item.
2. Click the **Eye Icon** to view the payment screenshot.
3. Cross-reference the **Transaction ID** with your SMS statements.
4. Click **Confirm (Green Check)**:
   - This automatically sends a welcome email with their access token.
   - The student can then set their password and start learning.
5. Click **Reject (Red X)**:
   - Provide a clear reason (e.g., "Amount paid doesn't match tuition fee").
   - An email is sent notifying the student to re-enroll.

## 📚 2. Adding a New Course
1. Go to **Courses** → **Add Course**.
2. Provide a Title, price in BDT, and a high-quality thumbnail URL.
3. After saving, click the **List Icon** on the course card to manage the curriculum.
4. Add modules one by one. Use the **Order Index** to determine the sequence.

## 🎟 3. Creating Promo Codes
1. Go to **Promo Codes**.
2. Click **Create Code**.
3. Use a simple name like `LAUNCH50` or `EID20`.
4. Set the **Max Uses** to limit how many students can use it.
5. Deactivate codes anytime by clicking the toggle switch.

## 🛡 4. Security & Access
- **Monitoring**: Check **IP Logs** to see if a student is sharing their account (multiple IPs in a short timeframe).
- **Blocking**: If you detect suspicious activity, copy the IP address and use the "Blacklist IP" tool. This immediately cuts off access for that user.
- **Manual Reset**: If a student loses access, you can find their record in **Enrollments** and provide their unique `access_token` link manually.
