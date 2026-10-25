# Railway Prep AI — Architecture Specification

## 1. System Overview
Railway Prep AI is engineered with a dual-target architecture:
1. **Full-Stack Production Web Application (Port 3000)**:
   - **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Responsive Android Frame Simulator / Responsive Desktop Mode.
   - **Backend Proxy**: Express + `@google/genai` TypeScript SDK (`gemini-3.8-flash`) mounting Vite middlewares. Provides `/api/ai/chat`, `/api/questions/generate`, `/api/ai/validate-connection`, and `/api/health`.
   - **Client Persistence**: IndexedDB & LocalStorage layer implementing Repository and Room-like offline-first cache for questions, test attempts, bookmarks, and preferences.
2. **Native Android Source Tree (`android/app/src/main/`)**:
   - **Language**: Kotlin 2.0+
   - **UI**: Jetpack Compose + Material 3 with Railway Prep Navy/Electric Teal Design System
   - **Architecture**: Clean Architecture MVVM (Model-View-ViewModel) + Repository Pattern
   - **Database**: Room Database (`AppDatabase`, `QuestionDao`, `TestResultDao`, `BookmarkDao`)
   - **Concurrency**: Coroutines & StateFlow / SharedFlow
   - **Networking**: Retrofit 2 + OkHttp 3 / Gemini SDK Client
   - **Package**: `com.daman.railwayprep`

## 2. Data Flow & AI Orchestration
```
+-----------------------------------------------------------+
|              Railway Prep AI Presentation Layer           |
| (Dashboard, Practice, CBT Mock Test, AI Tutor, Reference) |
+-----------------------------+-----------------------------+
                              |
                     Repository Layer
            (ExamRepository & AiTutorRepository)
                              |
        +---------------------+---------------------+
        |                                           |
+-------v---------+                       +---------v---------+
| Local Database  |                       | Remote AI Service |
| (Room / Storage)|                       | (Express + Gemini)|
+-----------------+                       +-------------------+
```

## 3. CBT-1 Exam & Scoring Logic
- **Total Questions**: 100
- **Total Duration**: 90 Minutes (5400 seconds)
- **Marking Scheme**:
  - Correct: `+1.000`
  - Incorrect: `-0.3333333333` (Exact 1/3 penalty)
  - Unanswered: `0.000`
- **Timer Engine**: Target Timestamp Deadline (`targetEndTime = Date.now() + remainingMs`). Invariant to background tabs, throttling, and screen sleep.
