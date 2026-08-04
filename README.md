# 🚀 Talent IQ – AI-Powered Secure Interview Platform

<div align="center">

![MERN](https://img.shields.io/badge/MERN-Full%20Stack-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb)
![Stream](https://img.shields.io/badge/Stream-Video%20%26%20Chat-005FFF?style=for-the-badge)

### Conduct Secure, Real-Time Technical Interviews with Built-in Proctoring

*A modern interview platform combining HD video, live chat, MCQ assessments, automated evaluation, and real-time security monitoring.*

</div>

---

# 📖 Overview

**Talent IQ** is a full-stack interview platform built using the **MERN stack** that enables organizations to conduct secure online interviews.

Unlike traditional video meeting platforms, Talent IQ integrates:

* 🎥 HD Video Interviews
* 💬 Live Chat
* 📝 Timed MCQ Assessments
* 🔐 Real-Time Security Monitoring
* 📊 Automatic Evaluation
* 📈 Candidate Reports

The platform focuses on providing a smooth interview experience while helping recruiters maintain interview integrity through browser-based proctoring.

---

# ✨ Features

## 👨‍💼 Recruiter / Host

* Create interviews
* Schedule interview duration
* Configure security settings
* Generate secure interview links
* Start interviews
* Monitor participants
* View candidate reports
* Review security violations
* Automatic interview completion

---

## 👨‍🎓 Candidate

* Join using secure invitation link
* HD Video Interview
* Live Chat
* Timed MCQ Assessment
* Automatic submission on timeout
* View interview result
* Review attempted answers

---

# 🔒 Security Features

Talent IQ includes multiple browser-based security layers.

### ✅ Tab Switch Detection

Warns when candidates leave the interview tab.

---

### ✅ Copy & Paste Protection

Detects:

* Copy
* Cut
* Paste

Attempts during interview.

---

### ✅ Fullscreen Enforcement

Candidates must remain in fullscreen mode.

Leaving fullscreen generates security warnings.

---

### ✅ Face Detection

Detects:

* No face visible
* Multiple faces

using **MediaPipe Face Landmarker**.

---

### ✅ Looking Away Detection

Monitors head orientation and detects repeated looking away from the screen.

---

### ✅ Suspicious Hand Gesture Detection

Uses **MediaPipe Hand Landmarker** to detect suspicious hand movements that may indicate cheating.

---

### ✅ Camera Disconnect Detection

Detects:

* Camera turned off
* Camera disconnected
* Permission revoked

---

### ✅ Automatic Warning System

Each security violation:

* gets recorded
* increases warning count
* terminates interview automatically after reaching warning limit

---

# 🎥 Video & Communication

Powered by **Stream Video SDK** and **Stream Chat**

Features include:

* HD Video Calling
* Participant Management
* Live Messaging
* Secure Authentication
* Meeting Rooms

---

# 📝 MCQ Assessment

Recruiters can:

* Create MCQs
* Multiple options
* Set marks
* Automatic evaluation

Candidates receive:

* Timed assessment
* Automatic submission
* Instant result generation

---

# 📊 Reports

Candidate Report includes:

* Score
* Correct Answers
* Wrong Answers
* Warning Count
* Security Events Timeline
* Submitted Answers

Recruiters can review candidate performance after interview completion.

---

# 🛠 Tech Stack

## Frontend

* React 19
* React Router
* Redux Toolkit
* RTK Query
* Tailwind CSS
* DaisyUI
* Clerk Authentication
* Stream Video SDK
* Stream Chat SDK
* MediaPipe
* React Hot Toast
* Lucide Icons

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Clerk Authentication
* Stream Video SDK
* Stream Chat SDK

---

## Database

MongoDB

Collections:

* Users
* Interviews
* Interview Sessions
* Candidate Answers
* Security Events

---

# 📁 Project Structure

```
Talent-IQ
│
├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   ├── api
│   ├── layouts
│   └── utils
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── configs
│   └── utils
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone <repository-url>
```

```
cd Talent-IQ
```

---

## Backend

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

MONGODB_URI=

CLERK_SECRET_KEY=

STREAM_API_KEY=
STREAM_SECRET_KEY=

FRONTEND_URL=
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=

VITE_CLERK_PUBLISHABLE_KEY=
```

Run

```bash
npm run dev
```

---

# 🌐 Production Build

```bash
npm run build
```

---

# ⚡ Performance Optimizations

* Route-based Lazy Loading
* Code Splitting
* RTK Query Caching
* Optimized Bundle Loading
* Component Reusability
* Optional Chaining for Safe Access
* Responsive UI
* Modular Architecture

---

# 🔮 Planned Improvements

* Redis Caching
* RabbitMQ Background Jobs
* Email Invitations
* Email Notifications
* Interview Recordings
* Coding Editor
* AI Interview Analytics
* Dashboard Analytics
* Resume Parsing
* Question Bank
* CSV/PDF Report Export
* Docker Support
* CI/CD Pipeline
* Automated Testing
* System Design Enhancements

---

# 📸 Screenshots

> Add screenshots here after deployment.

* Home Page
* Dashboard
* Create Interview
* Join Interview
* Interview Room
* Security Monitoring
* Candidate Result
* Reports

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Rudra Verma**

Full Stack Developer (MERN)

* React
* Next.js
* Node.js
* Express.js
* MongoDB
* Java
* TypeScript

---

# ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

<div align="center">

### Built with ❤️ using MERN, Stream and MediaPipe

**Talent IQ — Making Online Interviews Smarter, Safer and More Reliable.**

</div>
