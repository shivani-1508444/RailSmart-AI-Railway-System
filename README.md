# 🚆 RailSmart — AI-Powered Smart Train Booking & Railway Travel Management System

RailSmart is a full-stack, AI-powered railway travel platform built with the MERN Stack (React + Vite, Node.js + Express, MongoDB, Socket.IO, Chart.js) implementing all specifications from the Software Requirements Specification (SRS).

---

## 🌟 Core Features & Modules

1. **🚅 High-Speed Train Search & Discovery:**
   - Search by From Station, To Station, Date, Class (1A, 2A, 3A, CC, EC, SL), and Quota (General, Tatkal, Ladies, Senior Citizen).
   - Real-time seat availability (CNF, RAC, WL) & dynamic fare calculations.

2. **🤖 RailBot AI Assistant:**
   - Natural language conversational assistant for train schedules, PNR tracking, waitlist prediction, and meal ordering.

3. **🔮 AI Waitlist Confirmation Predictor:**
   - Statistical and historical cancellation probability estimator with travel tips and confidence scores.

4. **🎙️ Voice Search Assistant:**
   - Web Speech API converting voice commands into train search inputs.

5. **🎫 Multi-Passenger Booking & Digital QR E-Ticket:**
   - Multi-passenger support with berth preferences (Lower, Middle, Upper, Side Lower, Side Upper, Window).
   - Instant UPI / Card Sandbox checkout.
   - Digital QR E-Ticket generator with printable boarding pass.

6. **🔍 10-Digit PNR Status & Charting:**
   - Real-time PNR lookup with passenger status timeline and live coach allotment.

7. **📡 Live Train Running Status & Delay Tracker:**
   - Interactive station route timeline, delay indicators, and platform numbers.

8. **🍱 Railway e-Catering & Seat Meal Delivery:**
   - Select station -> Browse restaurants (Haldiram's, Domino's, Behrouz Biryani, IRCTC) -> Add to cart -> Live delivery tracking to your coach and berth.

9. **🛡️ Security Login Alerts & Journey Reminders:**
   - Device, browser, and IP security logs.
   - Automated journey departure & meal delivery reminder scheduler.

10. **🌐 Multi-Language (English & हिंदी) & Dark/Light Theme:**
    - Instant language toggle and theme customization.

11. **📊 Admin Control Center:**
    - Analytics & Revenue charts (Chart.js Bar & Doughnut), Train fleet management (CRUD), all passenger bookings, and user accounts.

---

## 🚀 Quick Start Guide

### 1. Start Server
```bash
cd railsmart
node server/server.js
```
*Or double click `START_RAILSMART.bat`.*

### 2. Access Application
Open your browser at:
👉 **`http://localhost:5001`**

### 3. Demo Credentials
- **Passenger Account:** `user@railsmart.com` / `user123`
- **Admin Portal:** `admin@railsmart.com` / `admin123`
*(Or click the 1-Click Demo buttons on the Login page)*

## 💳 Future Paid API Integrations

The following paid APIs are planned for future integration into RailSmart to provide real-time railway services, AI assistance, payments, and communication features:

| API / Service                                          | Purpose                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| 🚆 **Railway API — RailRadar**                         | Train search, railway data, and related train services          |
| 🤖 **AI API — Google Gemini API**                      | AI-powered RailBot assistant and intelligent travel assistance  |
| 💳 **Payment API — Razorpay**                          | Secure online payment processing for train bookings             |
| 📡 **Real-Time Train API — RailRadar Live Status API** | Live train running status, delays, and real-time tracking       |
| 📱 **SMS API — Twilio**                                | Booking confirmations, alerts, OTPs, and journey notifications  |
| 📧 **Email API — Resend**                              | Booking confirmations, tickets, alerts, and email notifications |

> **Note:** These paid APIs are planned for future implementation. API keys and credentials will be stored securely using environment variables and will not be exposed in the public repository.
