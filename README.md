<div align="center">

# 🚆 RailSmart

### AI-Powered Smart Train Booking & Railway Travel Management System

Ek full-stack MERN platform jo IRCTC jaisi train booking experience deta hai — saath mein AI assistant, live tracking, aur smart predictions ke saath.

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Core Features](#-core-features--modules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Demo Credentials](#-demo-credentials)
- [Future API Integrations](#-future-paid-api-integrations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Overview

**RailSmart** ek full-stack, AI-powered railway travel platform hai jo **MERN Stack** (React + Vite, Node.js + Express, MongoDB, Socket.IO, Chart.js) par bana hai aur Software Requirements Specification (SRS) ki saari specifications implement karta hai.

Isme real-time train search, PNR tracking, AI waitlist prediction, voice search, e-catering, aur ek full-fledged admin control center shaamil hai — ek modern railway booking system ka poora experience.

---

## 🌟 Core Features & Modules

### 1. 🚅 High-Speed Train Search & Discovery
- From Station, To Station, Date, Class (1A, 2A, 3A, CC, EC, SL), aur Quota (General, Tatkal, Ladies, Senior Citizen) ke basis par search.
- Real-time seat availability (CNF, RAC, WL) aur dynamic fare calculation.

### 2. 🤖 RailBot — AI Assistant
- Natural language conversational assistant jo train schedules, PNR tracking, waitlist prediction, aur meal ordering me help karta hai.

### 3. 🔮 AI Waitlist Confirmation Predictor
- Statistical aur historical data ke basis par cancellation probability estimate karta hai — travel tips aur confidence score ke saath.

### 4. 🎙️ Voice Search Assistant
- Web Speech API se voice commands ko train search inputs me convert karta hai.

### 5. 🎫 Multi-Passenger Booking & Digital QR E-Ticket
- Multiple passengers ke saath berth preference selection (Lower, Middle, Upper, Side Lower, Side Upper, Window).
- Instant UPI / Card sandbox checkout.
- Printable boarding pass ke saath digital QR e-ticket generator.

### 6. 🔍 10-Digit PNR Status & Charting
- Real-time PNR lookup with passenger status timeline aur live coach allotment.

### 7. 📡 Live Train Running Status & Delay Tracker
- Interactive station route timeline, delay indicators, aur platform numbers.

### 8. 🍱 Railway e-Catering & Seat Meal Delivery
- Station select karo → Restaurants browse karo (Haldiram's, Domino's, Behrouz Biryani, IRCTC) → Cart me add karo → Coach aur berth tak live delivery tracking.

### 9. 🛡️ Security Login Alerts & Journey Reminders
- Device, browser, aur IP ke security logs.
- Automated journey departure aur meal delivery reminder scheduler.

### 10. 🌐 Multi-Language & Theme Support
- English & हिंदी ke beech instant toggle.
- Dark/Light theme customization.

### 11. 📊 Admin Control Center
- Analytics & Revenue charts (Chart.js Bar & Doughnut).
- Train fleet management (full CRUD).
- Saari passenger bookings aur user accounts ka centralized view.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React + Vite, React Hook Form + Zod, TanStack Query, Tailwind CSS, Socket.IO Client |
| **Backend** | Node.js, Express.js, Mongoose, Socket.IO, node-cron |
| **Database** | MongoDB |
| **Auth** | JWT + bcrypt |
| **Real-time Data** | RailRadar API (live train status, PNR status, schedules) |
| **Charts** | Chart.js (Bar & Doughnut) |

---

## 📂 Project Structure

railsmart/
├── client/
│ └── src/
│ ├── components/ # ChatbotWidget, VoiceSearchWidget, ErrorBoundary, Navbar, Footer, TrainCard...
│ ├── context/ # AuthContext, LanguageContext, ThemeContext
│ ├── locales/ # en.json, hi.json
│ ├── pages/ # Home, SearchResults, BookingPage, Dashboard, LiveStatus,
│ │ # PNRStatus, FoodOrder, RefundTrackerPage, GroupBookingPage...
│ └── services/ # api.js, authService, bookingService, trainService...
│
├── server/
│ ├── config/db.js
│ ├── models/ # User, Train, Booking, FoodOrder, GroupBooking, Notification, Refund...
│ ├── routes/ # auth, trains, bookings, ai, features
│ ├── controllers/ # authController, trainController, bookingController, chatbotController...
│ ├── middleware/authMiddleware.js
│ ├── utils/ # liveStatus, trainCatalog, generatePNR, voiceBooking, confirmationPrediction
│ └── data/seed/ # sample seed data
│
└── package.json


---

## 🚀 Quick Start Guide

### 1️⃣ Start the Server

```bash
cd railsmart
node server/server.js
```

> Ya phir `START_RAILSMART.bat` par simply double-click karo.

### 2️⃣ Access the Application

Browser me open karo:

👉 **`http://localhost:5001`**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 **Passenger** | `user@railsmart.com` | `user123` |
| 🛠️ **Admin** | `admin@railsmart.com` | `admin123` |

> Ya Login page par diye gaye **1-Click Demo** buttons bhi use kar sakte ho.

---

## 💳 Future Paid API Integrations

Ye paid APIs future me RailSmart me integrate ki jaayengi taaki real-time railway services, AI assistance, payments, aur communication features aur powerful ho sakein:

| API / Service | Purpose |
|---|---|
| 🚆 **Railway API — RailRadar** | Train search, railway data, aur related train services |
| 🤖 **AI API — Google Gemini API** | AI-powered RailBot assistant aur intelligent travel assistance |
| 💳 **Payment API — Razorpay** | Secure online payment processing for train bookings |
| 📡 **Real-Time Train API — RailRadar Live Status API** | Live train running status, delays, aur real-time tracking |
| 📱 **SMS API — Twilio** | Booking confirmations, alerts, OTPs, aur journey notifications |
| 📧 **Email API — Resend** | Booking confirmations, tickets, alerts, aur email notifications |

> **Note:** Ye saari paid APIs future implementation ke liye planned hain. API keys aur credentials environment variables me securely store kiye jaayenge aur public repository me expose nahi honge.

---

## 🗺️ Roadmap

- [ ] Real API integrations (RailRadar, Gemini, Razorpay, Twilio, Resend)
- [ ] Mobile app version (React Native)
- [ ] Advanced seat map visualization
- [ ] Loyalty / rewards program

---

## 🤝 Contributing

Contributions welcome hain! Agar koi bug mila ya feature idea hai, ek issue open karo ya pull request bhejo.

---

## 📄 License

Is project ka license abhi specify nahi kiya gaya hai — apni zaroorat ke hisaab se add karo (MIT recommended for open-source projects).
