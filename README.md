# LegalDeck – Online Legal Consultation Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

LegalDeck is a secure, scalable online platform that connects users with verified lawyers. Users can book appointments, upload legal documents, chat securely, track case stages, and post reviews—all from a single app.

---

## 🚀 Getting Started

First, install dependencies and start the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

---

## 🧩 Project Structure

- **Frontend:** Next.js 14 (App Router), Tailwind CSS.
- **Backend:** Node.js (API Routes), Mongoose (MongoDB ODM)  
- **Database:** MongoDB  
- **Authentication:** Google OAuth 2.0  
- **Payments:** Razorpay Integration  
- **Communication:** TalkJS for chat, Gmail API (email reminders), Google Calendar API (event scheduling)  
- **File Upload:** Secure encrypted document handling  
<!-- - **Deployment:** Vercel / Google Cloud (preferred) -->

---

## 🔑 Core Features

### 1. 🔍 Lawyer Discovery & Booking
- Filter by expertise, location, pricing, availability
- Real-time calendar integration with Google Calendar API
- Razorpay-enabled appointment booking and payment

### 2. 📄 Secure Document Upload
- End-to-end encrypted file uploads
- Case documents accessible only to assigned lawyers
- Optional e-signature support

### 3. 💬 Virtual Consultation & Chat
- Secure chat via **TalkJS**  
- Google Meet integration for video consultations  
- Automated email & WhatsApp reminders

### 4. 💳 Transparent Payments
- Razorpay integration with multiple payment options (UPI, Cards, Net Banking)
- Escrow-style system—funds released post-consultation

### 5. 📈 Case Tracking
- Real-time case updates, court dates, legal news
- Stage-wise progress updates by the lawyer
- Notifications via email and in-app alerts

### 6. ✅ Lawyer & Client Verification
- KYC system for lawyers (Aadhar, Bar ID, etc.)
- Verified badge display on lawyer profiles
- Public rating and review system for user transparency

---

## 📦 Tech Stack

| Component             | Technology           |
|-----------------------|----------------------|
| Frontend              | Next.js, Tailwind CSS|
| Backend               | Node.js, API Routes  |
| Database              | MongoDB + Mongoose   |
| Authentication        | Google OAuth 2.0     |
| Payments              | Razorpay API         |
| Chat & Messaging      | TalkJS               |
| Email/Calendar APIs   | Google APIs (Gmail, Calendar) |
| Deployment            | Vercel / Google Cloud|

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Razorpay Docs](https://razorpay.com/docs/)
- [TalkJS Docs](https://talkjs.com/docs/)
- [Google APIs Overview](https://developers.google.com/products)

---

## 🚀 Deploying on Vercel

The fastest way to go live is using [Vercel](https://vercel.com/new), the creators of Next.js.

Refer to the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🤝 Contributions & Feedback

This is an open project aimed at making legal services accessible digitally. Contributions are welcome!