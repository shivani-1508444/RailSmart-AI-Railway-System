<div align="center">

# 🚆 RailSmart

### AI-Powered Smart Train Booking & Railway Travel Management System

A full-stack MERN platform that delivers an IRCTC-like train booking experience — powered by an AI assistant, live tracking, and smart predictions.

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

**RailSmart** is a full-stack, AI-powered railway travel platform built with the **MERN Stack** (React + Vite, Node.js + Express, MongoDB, Socket.IO, Chart.js), implementing all specifications from the Software Requirements Specification (SRS).

It includes real-time train search, PNR tracking, AI waitlist prediction, voice search, e-catering, and a full-fledged admin control center — delivering the complete experience of a modern railway booking system.

---

## 🌟 Core Features & Modules

### 1. 🚅 High-Speed Train Search & Discovery
- Search by From Station, To Station, Date, Class (1A, 2A, 3A, CC, EC, SL), and Quota (General, Tatkal, Ladies, Senior Citizen).
- Real-time seat availability (CNF, RAC, WL) and dynamic fare calculation.

### 2. 🤖 RailBot — AI Assistant
- A natural language conversational assistant for train schedules, PNR tracking, waitlist prediction, and meal ordering.

### 3. 🔮 AI Waitlist Confirmation Predictor
- Estimates cancellation probability using statistical and historical data — complete with travel tips and a confidence score.

### 4. 🎙️ Voice Search Assistant
- Uses the Web Speech API to convert voice commands into train search inputs.

### 5. 🎫 Multi-Passenger Booking & Digital QR E-Ticket
- Multi-passenger support with berth preference selection (Lower, Middle, Upper, Side Lower, Side Upper, Window).
- Instant UPI / Card sandbox checkout.
- Digital QR e-ticket generator with a printable boarding pass.

### 6. 🔍 10-Digit PNR Status & Charting
- Real-time PNR lookup with a passenger status timeline and live coach allotment.

### 7. 📡 Live Train Running Status & Delay Tracker
- Interactive station route timeline, delay indicators, and platform numbers.

### 8. 🍱 Railway e-Catering & Seat Meal Delivery
- Select a station → Browse restaurants (Haldiram's, Domino's, Behrouz Biryani, IRCTC) → Add to cart → Live delivery tracking to your coach and berth.

### 9. 🛡️ Security Login Alerts & Journey Reminders
- Device, browser, and IP security logs.
- Automated journey departure and meal delivery reminder scheduler.

### 10. 🌐 Multi-Language & Theme Support
- Instant toggle between English & Hindi.
- Dark/Light theme customization.

### 11. 📊 Admin Control Center
- Analytics & Revenue charts (Chart.js Bar & Doughnut).
- Full CRUD train fleet management.
- Centralized view of all passenger bookings and user accounts.

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

---

## 🚀 Quick Start Guide

### 1️⃣ Start the Server

```bash
cd railsmart
node server/server.js
```

> Or simply double-click `START_RAILSMART.bat`.

### 2️⃣ Access the Application

Open your browser at:

👉 **`http://localhost:5001`**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 **Passenger** | `user@railsmart.com` | `user123` |
| 🛠️ **Admin** | `admin@railsmart.com` | `admin123` |

> Or use the **1-Click Demo** buttons on the Login page.

---

## 💳 Future Paid API Integrations

The following paid APIs are planned for future integration into RailSmart to provide real-time railway services, AI assistance, payments, and communication features:

| API / Service | Purpose |
|---|---|
| 🚆 **Railway API — RailRadar** | Train search, railway data, and related train services |
| 🤖 **AI API — Google Gemini API** | AI-powered RailBot assistant and intelligent travel assistance |
| 💳 **Payment API — Razorpay** | Secure online payment processing for train bookings |
| 📡 **Real-Time Train API — RailRadar Live Status API** | Live train running status, delays, and real-time tracking |
| 📱 **SMS API — Twilio** | Booking confirmations, alerts, OTPs, and journey notifications |
| 📧 **Email API — Resend** | Booking confirmations, tickets, alerts, and email notifications |

> **Note:** These paid APIs are planned for future implementation. API keys and credentials will be stored securely using environment variables and will not be exposed in the public repository.

---

## 🗺️ Roadmap

- [ ] Real API integrations (RailRadar, Gemini, Razorpay, Twilio, Resend)
- [ ] Mobile app version (React Native)
- [ ] Advanced seat map visualization
- [ ] Loyalty / rewards program

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature idea, please open an issue or submit a pull request.

---

## 📄 License

No license has been specified for this project yet — add one based on your needs (MIT recommended for open-source projects).

