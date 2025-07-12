# 🩺 MedCall

**MedCall** is a full-stack doctor appointment management platform that connects patients and verified doctors for real-time video consultations. Patients can easily book, manage, and cancel appointments using a secure credit-based system, all within a clean and modern UI.

---

## 🚀 Built With

![Next.js](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Clerk](https://img.shields.io/badge/Clerk-3E2EFF?style=for-the-badge&logo=clerk&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-008AFF?style=for-the-badge&logo=data:image/svg+xml;base64,...&logoColor=white)
![Vonage](https://img.shields.io/badge/Vonage-000000?style=for-the-badge&logo=vonage&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCN](https://img.shields.io/badge/ShadCN_UI-1E293B?style=for-the-badge)

---

## 🧠 Tech Stack Breakdown

| Layer               | Tech                         | Description |
|--------------------|------------------------------|-------------|
| 🧑‍💻 Frontend       | **React.js** (via **Next.js**) | Component-driven UI architecture |
| 🧭 Framework        | **Next.js 14+**              | SSR, routing, server actions, and edge capabilities |
| 🎨 UI/Styling       | **Tailwind CSS**, **ShadCN UI** | Utility-first CSS with clean, headless UI components |
| 👥 Authentication   | **Clerk.dev**                | User sessions, roles (doctor/patient), and secure auth |
| 💬 Video Calls      | **Vonage Video API (OpenTok)** | Secure and scalable real-time video chat |
| 💾 ORM / DB Access  | **Prisma ORM**               | Type-safe DB access for PostgreSQL |
| 🗃 Database         | **Neon**                     | Serverless PostgreSQL with branch support |
| 🔁 State Management | **React Hooks**, `useContext` | Frontend reactivity and global state sharing |
| ⚙ Backend Logic     | **Next.js Server Actions**   | Secure mutations and DB transactions |
| 🚀 Deployment       | **Vercel** *(recommended)*    | Optimized for serverless & Next.js apps |

---

## ✨ Features

- 👨‍⚕️ Doctor registration with verification and credentials
- 👩‍🦰 Patient booking system with time-slot selection
- 💳 Appointment credits system with balance tracking
- 📞 Secure video consultations via Vonage
- ✅ Status-based appointment controls (Scheduled, Completed, Cancelled)
- 🔒 Clerk-powered secure sign up/login for both roles
- 📲 Mobile-friendly responsive UI with ShadCN UI

---

## 📂 Project Structure

/app → Next.js routes, layouts, and pages
/components → Reusable UI components (ShadCN-based)
/lib → Server actions, API wrappers, validators
/prisma → Database schema and Prisma client
/styles → Global Tailwind styles

yaml
---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/medcall.git
cd medcall
```
## .env file structure
DATABASE_URL=your_neon_postgres_url
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_APPLICATION_ID=your_vonage_app_id
VONAGE_PRIVATE_KEY_PATH=./vonage.key 