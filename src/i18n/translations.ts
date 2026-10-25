import { Language } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  madeBy: string;
  nav: {
    home: string;
    practice: string;
    mockTest: string;
    aiTutor: string;
    analytics: string;
    reference: string;
    settings: string;
  };
  dashboard: {
    greeting: string;
    targetExam: string;
    startLearning: string;
    startMockTest: string;
    dailyGoal: string;
    streak: string;
    questionsSolved: string;
    accuracy: string;
    testsCompleted: string;
    featurePracticeTitle: string;
    featurePracticeDesc: string;
    featureMockTitle: string;
    featureMockDesc: string;
    featureTutorTitle: string;
    featureTutorDesc: string;
    featureRefTitle: string;
    featureRefDesc: string;
    subjectMastery: string;
    weakAreas: string;
    recentActivity: string;
    noActivityYet: string;
  };
  practice: {
    title: string;
    subtitle: string;
    selectSubject: string;
    selectTopic: string;
    allTopics: string;
    difficulty: string;
    generateAiBtn: string;
    generating: string;
    submitAnswer: string;
    nextQuestion: string;
    prevQuestion: string;
    solution: string;
    shortcutTip: string;
    askTutor: string;
    bookmark: string;
    bookmarked: string;
    report: string;
    instantFeedback: string;
    examStyleFeedback: string;
  };
  mockExam: {
    title: string;
    cbt1Title: string;
    cbt1Desc: string;
    quickMockTitle: string;
    quickMockDesc: string;
    startExamBtn: string;
    instructionsTitle: string;
    timerRemaining: string;
    clearResponse: string;
    markForReview: string;
    saveAndNext: string;
    submitExam: string;
    questionPalette: string;
    confirmSubmitTitle: string;
    confirmSubmitDesc: string;
    cancel: string;
    confirmSubmit: string;
    answered: string;
    notAnswered: string;
    notVisited: string;
    markedReview: string;
    answeredMarked: string;
  };
  result: {
    title: string;
    subtitle: string;
    totalScore: string;
    maxScore: string;
    timeTaken: string;
    correct: string;
    incorrect: string;
    unanswered: string;
    accuracy: string;
    negativeDeduction: string;
    subjectAnalysis: string;
    questionReview: string;
    retake: string;
    backToDashboard: string;
    askTutorQuestion: string;
  };
  tutor: {
    title: string;
    subtitle: string;
    welcomeMsg: string;
    placeholder: string;
    send: string;
    suggestedPrompts: string[];
    contextBanner: string;
    clearChat: string;
    copy: string;
    copied: string;
  };
  reference: {
    title: string;
    subtitle: string;
    tabOverview: string;
    tabPosts: string;
    tabPattern: string;
    tabMedical: string;
    tabSyllabus: string;
    importantDates: string;
    vacancies: string;
    eligibility: string;
    ageLimit: string;
    searchPlaceholder: string;
  };
  settings: {
    title: string;
    language: string;
    theme: string;
    darkTheme: string;
    lightTheme: string;
    systemTheme: string;
    aiProvider: string;
    apiKey: string;
    apiKeyHint: string;
    testConnection: string;
    testing: string;
    connectionSuccess: string;
    connectionFailed: string;
    clearKey: string;
    dailyGoal: string;
    resetData: string;
    resetConfirm: string;
    resetDone: string;
    aboutTitle: string;
    exportData: string;
  };
  onboarding: {
    welcome: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    enterName: string;
    chooseLanguage: string;
    configureAi: string;
    geminiOption: string;
    skipKey: string;
    getStarted: string;
    next: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Railway Prep AI',
    appTagline: 'Learn Smarter. Practice Better. Prepare with Confidence.',
    madeBy: 'Made by Daman',
    nav: {
      home: 'Dashboard',
      practice: 'Practice',
      mockTest: 'CBT Mock Test',
      aiTutor: 'AI Tutor',
      analytics: 'Analytics',
      reference: 'Official CEN 07/2026',
      settings: 'Settings',
    },
    dashboard: {
      greeting: 'Welcome back',
      targetExam: 'Target: RRB NTPC Under-Graduate & Graduate',
      startLearning: 'Start Practice',
      startMockTest: 'Take Full CBT Mock',
      dailyGoal: 'Daily Question Target',
      streak: 'Study Streak',
      questionsSolved: 'Questions Solved',
      accuracy: 'Overall Accuracy',
      testsCompleted: 'Mock Tests Taken',
      featurePracticeTitle: 'Subject Practice',
      featurePracticeDesc: 'Targeted topic questions with instant formulas & tricks',
      featureMockTitle: 'Full CBT-1 Simulator',
      featureMockDesc: '100 Qs • 90 Mins • Authentic 1/3 negative marking',
      featureTutorTitle: 'Daman AI Tutor',
      featureTutorDesc: 'Step-by-step problem solver & shortcut reasoning guru',
      featureRefTitle: 'Official CEN Reference',
      featureRefDesc: 'Vacancies, medical standards, eligibility & syllabus',
      subjectMastery: 'Subject Mastery Breakdown',
      weakAreas: 'Identified Weak Areas',
      recentActivity: 'Recent Performance',
      noActivityYet: 'No practice sessions yet. Start your first quiz today!',
    },
    practice: {
      title: 'Practice Engine',
      subtitle: 'Solve curated questions or generate unlimited AI practice drills',
      selectSubject: 'Select Subject',
      selectTopic: 'Select Topic',
      allTopics: 'All Topics',
      difficulty: 'Difficulty',
      generateAiBtn: 'Generate AI Questions',
      generating: 'AI Generating Questions...',
      submitAnswer: 'Submit Answer',
      nextQuestion: 'Next Question',
      prevQuestion: 'Previous',
      solution: 'Detailed Solution',
      shortcutTip: '⚡ Smart Railway Shortcut Trick',
      askTutor: 'Ask AI Tutor to Explain',
      bookmark: 'Bookmark',
      bookmarked: 'Saved',
      report: 'Report Question',
      instantFeedback: 'Instant Feedback Mode',
      examStyleFeedback: 'Exam Style Mode',
    },
    mockExam: {
      title: 'CBT Examination Simulator',
      cbt1Title: 'RRB NTPC CBT-1 Full Simulation',
      cbt1Desc: '100 Questions (30 Maths, 30 Reasoning, 40 GA) • 90 Minutes • -1/3 Negative Marking',
      quickMockTitle: 'Rapid Mini Mock Test',
      quickMockDesc: '25 High-Yield Questions • 25 Minutes • Quick Diagnostic',
      startExamBtn: 'Begin CBT Examination',
      instructionsTitle: 'Official CBT Instructions',
      timerRemaining: 'Time Left',
      clearResponse: 'Clear Response',
      markForReview: 'Mark for Review & Next',
      saveAndNext: 'Save & Next',
      submitExam: 'Submit Test',
      questionPalette: 'Question Palette',
      confirmSubmitTitle: 'Confirm Test Submission',
      confirmSubmitDesc: 'Are you sure you want to finish the exam? Unanswered questions will receive 0 marks.',
      cancel: 'Return to Test',
      confirmSubmit: 'Yes, Submit Test',
      answered: 'Answered',
      notAnswered: 'Not Answered',
      notVisited: 'Not Visited',
      markedReview: 'Marked for Review',
      answeredMarked: 'Answered & Marked for Review',
    },
    result: {
      title: 'CBT-1 Examination Report Card',
      subtitle: 'Official RRB Standard Scoring & Detailed Performance Breakdown',
      totalScore: 'Final Net Score',
      maxScore: 'Maximum Marks',
      timeTaken: 'Time Taken',
      correct: 'Correct Answers (+1)',
      incorrect: 'Incorrect Answers (-0.33)',
      unanswered: 'Unanswered Questions (0)',
      accuracy: 'Net Accuracy',
      negativeDeduction: 'Negative Penalty Deducted',
      subjectAnalysis: 'Subject-wise Performance',
      questionReview: 'Detailed Question Analysis',
      retake: 'Retake Mock Test',
      backToDashboard: 'Back to Dashboard',
      askTutorQuestion: 'Explain this in AI Tutor',
    },
    tutor: {
      title: 'Daman AI Railway Tutor',
      subtitle: '24/7 Personal Railway Exam Mentor powered by Gemini 3.8 Flash',
      welcomeMsg: 'Namaste! I am your Railway Prep AI Tutor. Ask me any Maths problem, Reasoning puzzle, General Science concept, or railway exam strategy!',
      placeholder: 'Ask a question or paste problem text...',
      send: 'Ask',
      suggestedPrompts: [
        'Short trick for Train speed & platform length problems',
        'How does negative marking penalty work in RRB NTPC?',
        'Important Articles of Indian Constitution for Railway exam',
        'Syllogism 2-minute formula with Venn Diagram trick',
      ],
      contextBanner: 'Question context loaded from Practice/Mock test',
      clearChat: 'Clear Conversation',
      copy: 'Copy',
      copied: 'Copied!',
    },
    reference: {
      title: 'Official Notification Hub',
      subtitle: 'RRB NTPC Under-Graduate Notification (CEN 07/2026 / CEN 07/2024)',
      tabOverview: 'Exam Overview',
      tabPosts: 'Posts & Vacancies',
      tabPattern: 'Exam Scheme',
      tabMedical: 'Medical Standards',
      tabSyllabus: 'Detailed Syllabus',
      importantDates: 'Key Timelines & Schedule',
      vacancies: 'Category-wise Vacancies & Pay Scale',
      eligibility: 'Educational Qualifications & Rules',
      ageLimit: 'Age Criteria & Relaxation Guidelines',
      searchPlaceholder: 'Search syllabus, rules, medical codes (e.g. A-2, Typing)...',
    },
    settings: {
      title: 'Settings & Configuration',
      language: 'App Interface Language',
      theme: 'Theme Preference',
      darkTheme: 'Dark Navy (Default)',
      lightTheme: 'Clean Light',
      systemTheme: 'System Match',
      aiProvider: 'AI Engine Configuration',
      apiKey: 'Gemini API Key',
      apiKeyHint: 'Your key stays local on your device or uses secure server proxy. Never exposed in public code.',
      testConnection: 'Test Connection',
      testing: 'Testing Connection...',
      connectionSuccess: 'Connection Verified! Model ready.',
      connectionFailed: 'Connection Failed. Please verify key.',
      clearKey: 'Clear Saved Key',
      dailyGoal: 'Daily Question Solving Goal',
      resetData: 'Reset All Local Data',
      resetConfirm: 'Are you sure? This will clear all your test records and bookmarks.',
      resetDone: 'Local data has been reset.',
      aboutTitle: 'About Railway Prep AI',
      exportData: 'Export Performance Data (JSON)',
    },
    onboarding: {
      welcome: 'Welcome to Railway Prep AI',
      step1Title: 'Select Your Language',
      step1Desc: 'Choose how you want to read questions, solutions, and interface strings.',
      step2Title: 'AI Engine Setup',
      step2Desc: 'Connect Google Gemini to unlock AI-powered question generation and 24/7 tutor.',
      step3Title: 'Personalize Learning',
      step3Desc: 'Tell us your name and daily preparation target.',
      step4Title: 'All Set for Victory!',
      step4Desc: 'Your dashboard is configured for authentic Indian Railways examination success.',
      enterName: 'Enter your aspirant name',
      chooseLanguage: 'Choose Language / भाषा चुनें',
      configureAi: 'Configure AI Provider',
      geminiOption: 'Google Gemini 3.8 Flash (High Speed & Deep Reasoning)',
      skipKey: 'Use Server Proxy / Configure Key Later in Settings',
      getStarted: 'Launch Dashboard',
      next: 'Continue',
    },
  },
  hi: {
    appName: 'Railway Prep AI',
    appTagline: 'स्मार्ट सीखें। बेहतर अभ्यास करें। आत्मविश्वास से तैयारी करें।',
    madeBy: 'Made by Daman',
    nav: {
      home: 'डैशबोर्ड',
      practice: 'अभ्यास प्रश्न',
      mockTest: 'CBT मॉक टेस्ट',
      aiTutor: 'AI ट्यूटर',
      analytics: 'प्रगति विश्लेषण',
      reference: 'आधिकारिक CEN 07/2026',
      settings: 'सेटिंग्स',
    },
    dashboard: {
      greeting: 'स्वागत है',
      targetExam: 'लक्ष्य: RRB NTPC Under-Graduate और Graduate',
      startLearning: 'अभ्यास शुरू करें',
      startMockTest: 'फुल CBT मॉक दें',
      dailyGoal: 'दैनिक प्रश्न लक्ष्य',
      streak: 'अध्ययन स्ट्रीक',
      questionsSolved: 'हल किए गए प्रश्न',
      accuracy: 'कुल सटीकता',
      testsCompleted: 'पूर्ण किए गए मॉक',
      featurePracticeTitle: 'विषयवार अभ्यास',
      featurePracticeDesc: 'शॉर्टकट ट्रिक्स और विस्तृत व्याख्या के साथ प्रश्न',
      featureMockTitle: 'CBT-1 सिमुलेटर',
      featureMockDesc: '100 प्रश्न • 90 मिनट • वास्तविक 1/3 नेगेटिव मार्किंग',
      featureTutorTitle: 'दामन AI ट्यूटर',
      featureTutorDesc: 'स्टेप-बाय-स्टेप गणित समाधान और रीजनिंग मेंटर',
      featureRefTitle: 'आधिकारिक अधिसूचना',
      featureRefDesc: 'पदों की संख्या, मेडिकल मानक, पात्रता एवं संपूर्ण सिलेबस',
      subjectMastery: 'विषयवार पकड़',
      weakAreas: 'कमजोर विषय क्षेत्र',
      recentActivity: 'हालिया प्रदर्शन',
      noActivityYet: 'अभी तक कोई टेस्ट नहीं दिया गया। आज ही शुरुआत करें!',
    },
    practice: {
      title: 'अभ्यास इंजन',
      subtitle: 'प्रमाणित प्रश्नों को हल करें या असीमित AI प्रश्न बनाएं',
      selectSubject: 'विषय चुनें',
      selectTopic: 'टॉपिक चुनें',
      allTopics: 'सभी टॉपिक',
      difficulty: 'कठिनाई स्तर',
      generateAiBtn: 'AI प्रश्न बनाएं',
      generating: 'AI प्रश्न तैयार कर रहा है...',
      submitAnswer: 'उत्तर सबमिट करें',
      nextQuestion: 'अगला प्रश्न',
      prevQuestion: 'पिछला प्रश्न',
      solution: 'विस्तृत हल',
      shortcutTip: '⚡ रेलवे शॉर्टकट ट्रिक (Exam Trick)',
      askTutor: 'AI ट्यूटर से समझें',
      bookmark: 'सुरक्षित करें',
      bookmarked: 'सहेजा गया',
      report: 'त्रुटि रिपोर्ट करें',
      instantFeedback: 'त्वरित उत्तर मोड',
      examStyleFeedback: 'परीक्षा मोड',
    },
    mockExam: {
      title: 'CBT परीक्षा सिमुलेटर',
      cbt1Title: 'RRB NTPC CBT-1 संपूर्ण परीक्षा',
      cbt1Desc: '100 प्रश्न (30 गणित, 30 रीजनिंग, 40 सामान्य ज्ञान) • 90 मिनट • 1/3 नेगेटिव मार्किंग',
      quickMockTitle: 'क्विक मिनी मॉक',
      quickMockDesc: '25 महत्वपूर्ण प्रश्न • 25 मिनट • त्वरित जांच',
      startExamBtn: 'CBT परीक्षा शुरू करें',
      instructionsTitle: 'आधिकारिक CBT निर्देश',
      timerRemaining: 'शेष समय',
      clearResponse: 'उत्तर हटाएं',
      markForReview: 'रिव्यू के लिए मार्क करें & अगला',
      saveAndNext: 'सहेजें & अगला',
      submitExam: 'टेस्ट सबमिट करें',
      questionPalette: 'प्रश्न पैलेट',
      confirmSubmitTitle: 'टेस्ट सबमिशन की पुष्टि करें',
      confirmSubmitDesc: 'क्या आप सचमुच परीक्षा समाप्त करना चाहते हैं? अनुत्तरित प्रश्नों के लिए 0 अंक मिलेंगे।',
      cancel: 'परीक्षा पर लौटें',
      confirmSubmit: 'हाँ, टेस्ट सबमिट करें',
      answered: 'उत्तर दिया',
      notAnswered: 'उत्तर नहीं दिया',
      notVisited: 'नहीं देखा',
      markedReview: 'पुनरावलोकन हेतु चिह्नित',
      answeredMarked: 'उत्तर दिया एवं चिह्नित',
    },
    result: {
      title: 'CBT-1 परीक्षा परिणाम रिपोर्ट',
      subtitle: 'आधिकारिक RRB नेगेटिव मार्किंग और विषयवार संपूर्ण रिपोर्ट',
      totalScore: 'अंतिम प्राप्तांक',
      maxScore: 'पूर्णांक',
      timeTaken: 'लिया गया समय',
      correct: 'सही उत्तर (+1)',
      incorrect: 'गलत उत्तर (-0.33)',
      unanswered: 'छोड़े गए प्रश्न (0)',
      accuracy: 'सटीकता दर',
      negativeDeduction: 'काटे गए नकारात्मक अंक',
      subjectAnalysis: 'विषयवार प्रदर्शन',
      questionReview: 'प्रश्नों का संपूर्ण विश्लेषण',
      retake: 'पुनः मॉक दें',
      backToDashboard: 'डैशबोर्ड पर जाएं',
      askTutorQuestion: 'AI ट्यूटर से यह प्रश्न पूछें',
    },
    tutor: {
      title: 'दामन AI रेलवे ट्यूटर',
      subtitle: 'Gemini 3.8 Flash द्वारा संचालित 24/7 आपका निजी रेलवे मेंटर',
      welcomeMsg: 'नमस्ते! मैं आपका Railway Prep AI ट्यूटर हूँ। मुझसे गणित का कोई भी कठिन सवाल, रीजनिंग पहेली या रेलवे सामान्य विज्ञान पूछें!',
      placeholder: 'प्रश्न पूछें या प्रश्न यहाँ पेस्ट करें...',
      send: 'पूछें',
      suggestedPrompts: [
        'ट्रेन की गति और प्लेटफॉर्म की लंबाई वाले सवालों की शॉर्टकट ट्रिक',
        'RRB NTPC में नेगेटिव मार्किंग से कैसे बचें?',
        'रेलवे परीक्षा के लिए संविधान के सबसे जरूरी अनुच्छेद',
        'न्याय निगमन (Syllogism) का वेन आरेख नियम',
      ],
      contextBanner: 'अभ्यास/मॉक टेस्ट से प्रश्न संदर्भ लोड किया गया',
      clearChat: 'बातचीत साफ़ करें',
      copy: 'कॉपी',
      copied: 'कॉपी हो गया!',
    },
    reference: {
      title: 'आधिकारिक अधिसूचना केंद्र',
      subtitle: 'RRB NTPC Under-Graduate अधिसूचना (CEN 07/2026 / CEN 07/2024)',
      tabOverview: 'परीक्षा अवलोकन',
      tabPosts: 'पद एवं रिक्तियां',
      tabPattern: 'परीक्षा पैटर्न',
      tabMedical: 'मेडिकल मानक',
      tabSyllabus: 'विस्तृत पाठ्यक्रम',
      importantDates: 'महत्वपूर्ण तिथियां',
      vacancies: 'पदानुसार रिक्तियां एवं वेतन स्तर',
      eligibility: 'शैक्षणिक योग्यता एवं नियम',
      ageLimit: 'आयु सीमा एवं छूट नियम',
      searchPlaceholder: 'सिलेबस, नियम, मेडिकल कोड (जैसे A-2, टाइपिंग) खोजें...',
    },
    settings: {
      title: 'सेटिंग्स और कॉन्फ़िगरेशन',
      language: 'ऐप की भाषा',
      theme: 'थीम',
      darkTheme: 'डार्क नेवी (डिफ़ॉल्ट)',
      lightTheme: 'लाइट थीम',
      systemTheme: 'सिस्टम के अनुसार',
      aiProvider: 'AI इंजन कॉन्फ़िगरेशन',
      apiKey: 'Gemini API Key',
      apiKeyHint: 'आपकी कुंजी सुरक्षित स्थानीय डिवाइस या सुरक्षित सर्वर प्रॉक्सी में रहती है।',
      testConnection: 'कनेक्शन जांचें',
      testing: 'जांच जारी है...',
      connectionSuccess: 'कनेक्शन सफल! मॉडल तैयार है।',
      connectionFailed: 'कनेक्शन विफल। कृपया कुंजी पुनः जांचें।',
      clearKey: 'सहेजी गई कुंजी हटाएं',
      dailyGoal: 'प्रतिदिन प्रश्न हल करने का लक्ष्य',
      resetData: 'सारा डेटा रीसेट करें',
      resetConfirm: 'क्या आप सुनिश्चित हैं? इससे सभी टेस्ट रिकॉर्ड मिट जाएंगे।',
      resetDone: 'डेटा सफलतापूर्वक रीसेट कर दिया गया।',
      aboutTitle: 'Railway Prep AI के बारे में',
      exportData: 'प्रगति डेटा एक्सपोर्ट करें (JSON)',
    },
    onboarding: {
      welcome: 'Railway Prep AI में आपका स्वागत है',
      step1Title: 'अपनी भाषा चुनें',
      step1Desc: 'चुनें कि आप प्रश्न, व्याख्या और स्क्रीन किस भाषा में देखना चाहते हैं।',
      step2Title: 'AI इंजन सेटअप',
      step2Desc: 'असीमित प्रश्न और 24/7 ट्यूटर के लिए Google Gemini कनेक्ट करें।',
      step3Title: 'अपनी प्राथमिकताएं बताएं',
      step3Desc: 'अपना नाम और प्रतिदिन का प्रश्न लक्ष्य दर्ज करें।',
      step4Title: 'तैयारी के लिए तैयार!',
      step4Desc: 'आपका डैशबोर्ड रेलवे भर्ती परीक्षा में सफलता के लिए तैयार है।',
      enterName: 'अपना नाम दर्ज करें',
      chooseLanguage: 'भाषा चुनें',
      configureAi: 'AI प्रोवाइडर सेट करें',
      geminiOption: 'Google Gemini 3.8 Flash (तेज और सटीक रीजनिंग)',
      skipKey: 'सर्वर प्रॉक्सी का उपयोग करें / बाद में सेटिंग्स में दर्ज करें',
      getStarted: 'डैशबोर्ड शुरू करें',
      next: 'आगे बढ़ें',
    },
  },
  hinglish: {
    appName: 'Railway Prep AI',
    appTagline: 'Smart Padho. Better Practice Karo. Full Confidence se Clear Karo.',
    madeBy: 'Made by Daman',
    nav: {
      home: 'Dashboard',
      practice: 'Practice',
      mockTest: 'CBT Mock Test',
      aiTutor: 'AI Tutor',
      analytics: 'Analytics',
      reference: 'Official CEN 07/2026',
      settings: 'Settings',
    },
    dashboard: {
      greeting: 'Welcome back',
      targetExam: 'Target: RRB NTPC Under-Graduate & Graduate',
      startLearning: 'Practice Shuru Karo',
      startMockTest: 'Full CBT Mock Test Do',
      dailyGoal: 'Daily Question Target',
      streak: 'Daily Streak',
      questionsSolved: 'Total Solved Questions',
      accuracy: 'Overall Accuracy',
      testsCompleted: 'Mock Tests Completed',
      featurePracticeTitle: 'Subject Wise Practice',
      featurePracticeDesc: 'Topic-wise questions with instant shortcut tricks & explanations',
      featureMockTitle: 'CBT-1 Mock Simulator',
      featureMockDesc: '100 Qs • 90 Mins • Authentic 1/3 negative marking scheme',
      featureTutorTitle: 'Daman AI Tutor',
      featureTutorDesc: 'Step-by-step problem solver & shortcut reasoning guru',
      featureRefTitle: 'Official CEN Reference',
      featureRefDesc: 'Vacancies, medical standards, eligibility aur full syllabus',
      subjectMastery: 'Subject Mastery Breakdown',
      weakAreas: 'Identified Weak Areas',
      recentActivity: 'Recent Performance',
      noActivityYet: 'Abhi tak koi test attempt nahi kiya. Aaj pehla quiz try karo!',
    },
    practice: {
      title: 'Practice Engine',
      subtitle: 'Curated questions solve karo ya instant AI drills generate karo',
      selectSubject: 'Subject Select Karo',
      selectTopic: 'Topic Select Karo',
      allTopics: 'Sabhi Topics',
      difficulty: 'Difficulty Level',
      generateAiBtn: 'AI Questions Banao',
      generating: 'AI Questions generate kar raha hai...',
      submitAnswer: 'Submit Answer',
      nextQuestion: 'Next Question',
      prevQuestion: 'Previous',
      solution: 'Detailed Solution',
      shortcutTip: '⚡ Smart Railway Shortcut Trick',
      askTutor: 'AI Tutor se Samajho',
      bookmark: 'Bookmark Karo',
      bookmarked: 'Saved',
      report: 'Question Report Karo',
      instantFeedback: 'Instant Feedback Mode',
      examStyleFeedback: 'Exam Style Mode',
    },
    mockExam: {
      title: 'CBT Exam Simulator',
      cbt1Title: 'RRB NTPC CBT-1 Full Simulation',
      cbt1Desc: '100 Questions (30 Maths, 30 Reasoning, 40 GA) • 90 Mins • -1/3 Negative Marking',
      quickMockTitle: 'Rapid Mini Mock Test',
      quickMockDesc: '25 High-Yield Questions • 25 Mins • Quick Diagnostic',
      startExamBtn: 'CBT Exam Shuru Karo',
      instructionsTitle: 'Official CBT Instructions',
      timerRemaining: 'Time Left',
      clearResponse: 'Clear Response',
      markForReview: 'Mark for Review & Next',
      saveAndNext: 'Save & Next',
      submitExam: 'Submit Test',
      questionPalette: 'Question Palette',
      confirmSubmitTitle: 'Test Submit Karna Chahte Ho?',
      confirmSubmitDesc: 'Kya aap test submit karna chahte ho? Unanswered questions par 0 marks milenge.',
      cancel: 'Test par Wapas Jao',
      confirmSubmit: 'Haan, Submit Karo',
      answered: 'Answered',
      notAnswered: 'Not Answered',
      notVisited: 'Not Visited',
      markedReview: 'Marked for Review',
      answeredMarked: 'Answered & Marked for Review',
    },
    result: {
      title: 'CBT-1 Scorecard & Analysis',
      subtitle: 'Official RRB 1/3 Negative Marking ke saath Detailed Report',
      totalScore: 'Final Net Score',
      maxScore: 'Maximum Marks',
      timeTaken: 'Time Taken',
      correct: 'Correct Answers (+1)',
      incorrect: 'Incorrect Answers (-0.33)',
      unanswered: 'Skipped Questions (0)',
      accuracy: 'Net Accuracy',
      negativeDeduction: 'Deducted Negative Marks',
      subjectAnalysis: 'Subject-wise Performance',
      questionReview: 'Detailed Question Review',
      retake: 'Retake Mock Test',
      backToDashboard: 'Back to Dashboard',
      askTutorQuestion: 'AI Tutor se ye question pucho',
    },
    tutor: {
      title: 'Daman AI Railway Tutor',
      subtitle: 'Gemini 3.8 Flash se powered 24/7 aapka personal Railway exam mentor',
      welcomeMsg: 'Namaste! Main hoon aapka Railway Prep AI Tutor. Maths, Reasoning, General Science ya exam strategy ka koi bhi doubt pucho!',
      placeholder: 'Apna question pucho ya problem yahan paste karo...',
      send: 'Pucho',
      suggestedPrompts: [
        'Train speed aur platform length problems ki shortcut trick',
        'RRB NTPC me negative marking penalty se kaise bachein?',
        'Railway exam ke liye Indian Constitution ke most important Articles',
        'Syllogism 2-minute formula with Venn Diagram trick',
      ],
      contextBanner: 'Practice/Mock test se question context loaded hai',
      clearChat: 'Clear Conversation',
      copy: 'Copy',
      copied: 'Copied!',
    },
    reference: {
      title: 'Official Notification Hub',
      subtitle: 'RRB NTPC Under-Graduate Notification (CEN 07/2026 / CEN 07/2024)',
      tabOverview: 'Exam Overview',
      tabPosts: 'Posts & Vacancies',
      tabPattern: 'Exam Pattern',
      tabMedical: 'Medical Standards',
      tabSyllabus: 'Detailed Syllabus',
      importantDates: 'Important Timelines',
      vacancies: 'Category-wise Vacancies & Pay Scale',
      eligibility: 'Educational Qualifications',
      ageLimit: 'Age Criteria & Relaxation Rules',
      searchPlaceholder: 'Syllabus, rules, medical codes (e.g. A-2, Typing) search karo...',
    },
    settings: {
      title: 'Settings & Configuration',
      language: 'App Interface Language',
      theme: 'Theme Preference',
      darkTheme: 'Dark Navy (Default)',
      lightTheme: 'Clean Light',
      systemTheme: 'System Match',
      aiProvider: 'AI Engine Configuration',
      apiKey: 'Gemini API Key',
      apiKeyHint: 'Aapki key device par safe rehti hai ya server proxy use karti hai.',
      testConnection: 'Connection Test Karo',
      testing: 'Testing Connection...',
      connectionSuccess: 'Connection Verified! Model ready.',
      connectionFailed: 'Connection Failed. Please check key.',
      clearKey: 'Saved Key Hatao',
      dailyGoal: 'Daily Question Target',
      resetData: 'Saara Data Reset Karo',
      resetConfirm: 'Are you sure? Isse aapke test scores aur bookmarks delete ho jayenge.',
      resetDone: 'Local data reset ho gaya.',
      aboutTitle: 'About Railway Prep AI',
      exportData: 'Export Performance Data (JSON)',
    },
    onboarding: {
      welcome: 'Welcome to Railway Prep AI',
      step1Title: 'Apni Language Chuno',
      step1Desc: 'Decide karo ki questions aur interface kis language me chahiye.',
      step2Title: 'AI Engine Setup',
      step2Desc: 'Google Gemini connect karke unlimited questions aur 24/7 tutor unlock karo.',
      step3Title: 'Personalize Learning',
      step3Desc: 'Apna name aur daily target set karo.',
      step4Title: 'Mission Railway Cleared!',
      step4Desc: 'Aapka dashboard authentic Indian Railways preparation ke liye ready hai.',
      enterName: 'Apna naam enter karo',
      chooseLanguage: 'Language Chuno',
      configureAi: 'AI Provider Configure Karo',
      geminiOption: 'Google Gemini 3.8 Flash (High Speed & Deep Reasoning)',
      skipKey: 'Server Proxy Use Karo / Later in Settings',
      getStarted: 'Dashboard Shuru Karo',
      next: 'Continue',
    },
  },
};
