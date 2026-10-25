# 🚆 Railway Prep AI — Made by Daman
> **Product Vision**: *Learn Smarter. Practice Better. Prepare with Confidence. Made by Daman.*
> **Package**: `com.daman.railwayprep`

---

## 🌟 Overview
**Railway Prep AI** is an advanced, production-grade learning and examination preparation platform engineered specifically for aspirants of Indian Railways Recruitment Exams:
- **RRB NTPC (Under-Graduate & Graduate — CEN 07/2024 & CEN 07/2026)**
- **RRB Group D (Level 1)**
- **RRB Assistant Loco Pilot (ALP) & Technicians**
- **RPF Sub-Inspector & Constable**

It combines an authentic **Computer Based Test (CBT) simulator**, an **interactive practice engine**, a **24/7 trilingual AI Railway Tutor (Daman AI)** powered by **Google Gemini 3.8 Flash**, and an authoritative **CEN 07/2026 official reference center**.

---

## 🚀 Key Features

### 1. ⏱️ Authentic CBT-1 Exam Simulator
- **Exam Scheme**: 100 Multiple Choice Questions (30 Mathematics, 30 Reasoning, 40 General Awareness/Science).
- **Duration**: 90 Minutes with a monotonic deadline countdown timer invariant to backgrounding or screen sleep.
- **Scoring Rules**:
  - Correct Answer: `+1.000`
  - Incorrect Answer: `-0.333` (Exact 1/3 negative marking penalty)
  - Unanswered: `0.000`
- **Interactive Question Palette**: Live status tags for *Answered (Green)*, *Not Answered (Red)*, *Not Visited (Gray)*, *Marked for Review (Purple)*, and *Answered & Marked for Review*.
- **Comprehensive Scorecard**: Net score, time taken, net accuracy %, subject-wise performance bars, question-by-question review, and 1-click **"Ask AI Tutor about this question"**.

### 2. 🧠 Daman AI Railway Tutor
- Integrated with **Google Gemini 3.8 Flash** via secure server proxy.
- **Trilingual Support**: हिन्दी (Devanagari), English, and natural Hinglish (Romanized Hindi).
- Step-by-step mathematical reasoning, shortcut tricks (शॉर्टकट ट्रिक्स), and formula summaries.
- One-click context sharing from Practice questions or Mock exams.

### 3. 🎯 Practice Engine with AI Question Generation
- Subject-wise and topic-wise filtering across Mathematics, Reasoning, General Awareness, and General Science.
- Real-time on-demand AI question generator crafting original exam-standard questions with four distinct choices, 0-based correct answer, and explanation.
- Built-in curated question bank with 120+ authentic railway questions available 100% offline.

### 4. 📜 Official CEN 07/2026 NTPC Under-Graduate Reference Hub
- Comprehensive searchable hub for the CEN 07/2026 official notification.
- Details for posts: *Commercial cum Ticket Clerk (Level 3)*, *Accounts Clerk cum Typist (Level 2)*, *Junior Clerk cum Typist (Level 2)*, and *Trains Clerk (Level 2)*.
- Medical standards criteria: **A-3**, **B-2**, and **C-2** distance and near visual acuity requirements.
- Stage-by-stage selection criteria (CBT-1, CBT-2, Typing Skill Test, DV & Medical).

### 5. 📊 Real Data-Driven Analytics & Revision Bank
- Calculated strictly from real database records (never fabricated).
- **Targeted Revision Bank**: Isolates all questions answered incorrectly in any session so students can practice only their weak points until mastered.
- Saved & bookmarked questions list.
- Data export in JSON format.

---

## 📱 Dual-Target Platform Delivery
1. **Interactive Full-Stack Web Application**:
   - Running live on port `3000` with Express + `@google/genai` TypeScript SDK.
   - Built-in **Android Phone Frame Simulator** (allows toggling between realistic flagship Android frame and full-width responsive desktop view).
2. **Native Android Source Tree (`android/`)**:
   - Package: `com.daman.railwayprep`
   - Language: Kotlin 2.0+
   - UI: Jetpack Compose + Material 3 (Dark Navy `#0A1128` + Electric Teal `#00E5FF`)
   - Persistence: Room Database (`AppDatabase`, `QuestionDao`, `MockTestDao`)
   - Architecture: Clean MVVM + Repository Pattern

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend / AI**: Express, Node.js 22, `@google/genai` SDK (`gemini-3.8-flash`)
- **Android**: Kotlin, Jetpack Compose, Material 3, Room, Coroutines, Flow, Retrofit
- **Branding**: Original vector logo `train-logo.svg` (Locomotive + AI neural spark + Knowledge motif)
- **Creator**: Made by Daman
