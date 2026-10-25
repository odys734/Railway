# Railway Prep AI — Made by Daman
## Comprehensive Project Specification

- **Product Name**: Railway Prep AI
- **Full Brand**: Railway Prep AI — Made by Daman
- **Application ID / Package**: `com.daman.railwayprep`
- **Primary Target Audience**: Aspirants of Indian Railways Recruitment Exams (RRB NTPC Under-Graduate CEN 07/2024 / CEN 07/2026, RRB NTPC Graduate, RRB Group D, RRB ALP, RRB Technician, RPF SI/Constable)
- **Visual Identity**: Premium Dark Navy (`#0A1128`), Electric Teal (`#00E5FF`), Steel Slate (`#1E293B`), Accent Blue (`#00B4D8`). Dark & Light theme with System fallback.
- **Languages Supported**: हिन्दी (Hindi), English, Hinglish (Bilingual Romanized Hindi).
- **Core Pillars**:
  1. **First-Launch Onboarding & API Config**: Language picker, personalized learning preferences, AI Provider setup (Gemini 3.8 Flash, backend proxy, direct key validation with live latency check).
  2. **Comprehensive CBT Mock Exam Simulator**: 100 questions / 90 mins (CBT-1 authentic pattern: 30 Mathematics, 30 Reasoning, 40 General Awareness/Science), +1 mark for correct, -1/3 (0.33) negative marking penalty, real deadline-based monotonic timer, question palette with status badges (Not Visited, Unanswered, Answered, Marked for Review), and instant result analysis with weak-area diagnostics.
  3. **Practice Engine**: Subject-wise (Maths, Reasoning, GA, Science), topic-wise, mixed-quiz mode, instant feedback or exam-style modes, bookmarked questions, and report questionable items.
  4. **AI-Powered Question Generation**: Server-side structured generation using `@google/genai` (with `gemini-3.8-flash`) with deterministic schema validation, duplicate detection, and rich curated local question bank fallback.
  5. **AI Railway Tutor (Daman AI)**: Natural conversational tutoring in Hindi, English, or Hinglish with step-by-step mathematical reasoning, shortcut tricks (शॉर्टकट ट्रिक्स), formulas, and direct context sharing from practice & mock test questions.
  6. **Official Notification & Syllabus Reference**: CEN 07/2026 NTPC Under-Graduate official rules, vacancies (Commercial cum Ticket Clerk, Accounts Clerk, Junior Clerk, Trains Clerk), eligibility, age limits, medical standards (A-2, A-3, B-2, C-2), stage-wise syllabus, and negative marking rules.
  7. **Analytics & Progress**: Real calculated metrics (total attempted, accuracy rate, subject mastery, test histories, revision list of incorrect answers, export capabilities).
  8. **Android & Web Delivery**: Mobile-first responsive Web preview running on port 3000 + complete Kotlin Jetpack Compose Android codebase in `android/` ready for Gradle build and APK deployment.
