import { OfficialPost, MedicalStandard } from '../types';

export interface OfficialNotificationData {
  notificationNumber: string;
  title: string;
  issuedBy: string;
  description: string;
  importantDates: {
    label: string;
    value: string;
  }[];
  posts: OfficialPost[];
  selectionStages: {
    stage: string;
    title: string;
    description: string;
  }[];
  examPatternCbt1: {
    duration: string;
    totalQuestions: number;
    negativeMarking: string;
    subjects: {
      name: string;
      questions: number;
      marks: number;
    }[];
  };
  examPatternCbt2: {
    duration: string;
    totalQuestions: number;
    negativeMarking: string;
    subjects: {
      name: string;
      questions: number;
      marks: number;
    }[];
  };
  medicalStandards: MedicalStandard[];
  syllabus: {
    subject: string;
    topics: string[];
  }[];
  ageRelaxations: {
    category: string;
    relaxation: string;
  }[];
}

export const cenNotificationData: OfficialNotificationData = {
  notificationNumber: 'CEN 07/2024 & CEN 07/2026 (NTPC Under-Graduate)',
  title: 'Centralised Employment Notice for Non-Technical Popular Categories (Under-Graduate Posts)',
  issuedBy: 'Government of India, Ministry of Railways, Railway Recruitment Boards (RRBs)',
  description: 'Official recruitment guidelines and standards for 12th Pass Under-Graduate level posts across all 21 Railway Recruitment Boards.',
  importantDates: [
    { label: 'Notification Publication', value: 'Official Railway Gazette' },
    { label: 'Application Window', value: 'Online Registration via RRB Central Portals' },
    { label: '1st Stage CBT (CBT-1)', value: 'Tentatively Scheduled / Active Preparation Phase' },
    { label: 'Typing Skill Test (TST)', value: 'Post-CBT 2 for Clerical Cadres' },
    { label: 'Document Verification & Medical', value: 'Final Stage for Empanelment' },
  ],
  posts: [
    {
      title: 'Commercial cum Ticket Clerk',
      payLevel: 3,
      initialPay: '₹21,700 + Allowances',
      medicalStandard: 'B-2',
      minEduQualification: '12th (+2 Stage) or its equivalent examination with not less than 50% marks in the aggregate (50% marks condition relaxed for SC/ST/PwBD/Ex-SM).',
      approxVacancies: 2022,
      description: 'Handles passenger ticketing, reservation, luggage booking, and goods parcel supervision at stations.',
    },
    {
      title: 'Accounts Clerk cum Typist',
      payLevel: 2,
      initialPay: '₹19,900 + Allowances',
      medicalStandard: 'C-2',
      minEduQualification: '12th (+2 Stage) or its equivalent with 50% marks in aggregate. Typing proficiency in English (30 wpm) or Hindi (25 wpm) on Computer.',
      approxVacancies: 361,
      description: 'Maintains railway financial ledgers, salary disbursement, billing, and accounting entries.',
    },
    {
      title: 'Junior Clerk cum Typist',
      payLevel: 2,
      initialPay: '₹19,900 + Allowances',
      medicalStandard: 'C-2',
      minEduQualification: '12th (+2 Stage) or its equivalent with 50% marks in aggregate. Typing proficiency in English (30 wpm) or Hindi (25 wpm) on Computer.',
      approxVacancies: 990,
      description: 'Performs administrative clerical tasks, correspondence, personnel management, and records filing across railway divisional offices.',
    },
    {
      title: 'Trains Clerk',
      payLevel: 2,
      initialPay: '₹19,900 + Allowances',
      medicalStandard: 'A-3',
      minEduQualification: '12th (+2 Stage) or its equivalent with not less than 50% marks in aggregate. No typing test required.',
      approxVacancies: 72,
      description: 'Maintains records of train rakes, wagons, coaches, load composition, and yard movements.',
    },
  ],
  selectionStages: [
    {
      stage: '1st Stage Computer Based Test (CBT-1)',
      title: 'Common Screening Examination',
      description: 'Screening test for all applicants. 100 Multiple Choice Questions (90 Minutes). Normalized marks used to shortlist candidates for 2nd Stage CBT at 15 times the notified vacancies.',
    },
    {
      stage: '2nd Stage Computer Based Test (CBT-2)',
      title: 'Merit Selection Examination',
      description: '120 Multiple Choice Questions (90 Minutes). Separate CBT-2 conducted for Level 2 and Level 3 posts.',
    },
    {
      stage: 'Typing Skill Test (TST)',
      title: 'Qualifying Typing Examination',
      description: 'Mandatory for Accounts Clerk & Junior Clerk cum Typist. 30 WPM in English or 25 WPM in Hindi on computer without spell-check/editing tools (8 times vacancies called).',
    },
    {
      stage: 'Document Verification (DV) & Medical Examination',
      title: 'Empanelment and Physical Fitness Check',
      description: 'Verification of original certificates followed by strict medical fitness test according to the post medical code (A-3, B-2, C-2).',
    },
  ],
  examPatternCbt1: {
    duration: '90 Minutes (120 Minutes for eligible PwBD candidates with scribe)',
    totalQuestions: 100,
    negativeMarking: '1/3rd (0.333) mark deducted for each incorrect answer. Unanswered questions attract 0 deduction.',
    subjects: [
      { name: 'Mathematics', questions: 30, marks: 30 },
      { name: 'General Intelligence & Reasoning', questions: 30, marks: 30 },
      { name: 'General Awareness & Science', questions: 40, marks: 40 },
    ],
  },
  examPatternCbt2: {
    duration: '90 Minutes (120 Minutes for eligible PwBD candidates)',
    totalQuestions: 120,
    negativeMarking: '1/3rd (0.333) mark penalty for each wrong answer.',
    subjects: [
      { name: 'General Awareness & Science', questions: 50, marks: 50 },
      { name: 'Mathematics', questions: 35, marks: 35 },
      { name: 'General Intelligence & Reasoning', questions: 35, marks: 35 },
    ],
  },
  medicalStandards: [
    {
      code: 'A-3',
      generalFitness: 'Physically fit in all respects.',
      distanceVision: '6/9, 6/9 with or without glasses (power of lenses not to exceed 2D).',
      nearVision: 'Sn: 0.6, 0.6 with or without glasses.',
      otherTests: 'Must pass tests for Colour Vision, Binocular Vision, Night Vision, and Myopic conditions. Required for Trains Clerk.',
      applicablePosts: ['Trains Clerk'],
    },
    {
      code: 'B-2',
      generalFitness: 'Physically fit in all respects.',
      distanceVision: '6/9, 6/12 with or without glasses (power of lenses not to exceed 4D).',
      nearVision: 'Sn: 0.6, 0.6 with or without glasses when reading or close work is required.',
      otherTests: 'Must pass test for Field of Vision (Binocular Vision). Applicable for Commercial cum Ticket Clerk.',
      applicablePosts: ['Commercial cum Ticket Clerk'],
    },
    {
      code: 'C-2',
      generalFitness: 'Physically fit in all respects.',
      distanceVision: '6/12, nil with or without glasses.',
      nearVision: 'Sn: 0.6 combined with or without glasses for close work.',
      otherTests: 'Relaxed visual standards for clerical and typing office desks.',
      applicablePosts: ['Junior Clerk cum Typist', 'Accounts Clerk cum Typist'],
    },
  ],
  syllabus: [
    {
      subject: 'Mathematics',
      topics: [
        'Number System & Decimals',
        'Fractions, LCM and HCF',
        'Ratio and Proportions',
        'Percentage & Mensuration',
        'Time and Work, Pipes & Cisterns',
        'Time and Distance, Relative Speed of Trains',
        'Simple and Compound Interest',
        'Profit and Loss, Discounts',
        'Elementary Algebra, Polynomials',
        'Geometry and Trigonometry basics',
        'Elementary Statistics (Mean, Median, Mode)',
      ],
    },
    {
      subject: 'General Intelligence and Reasoning',
      topics: [
        'Analogies & Classification',
        'Completion of Number and Alphabetical Series',
        'Coding and Decoding',
        'Mathematical Operations',
        'Similarities and Differences',
        'Relationships & Blood Relations',
        'Analytical Reasoning & Puzzles',
        'Syllogism (Statements & Conclusions)',
        'Venn Diagrams & Set Representations',
        'Direction and Distance Sense Test',
        'Data Sufficiency & Decision Making',
      ],
    },
    {
      subject: 'General Awareness & Science',
      topics: [
        'Current Events of National and International Importance',
        'Games and Sports (Olympics, Asian Games, Cricket)',
        'Art and Culture of India',
        'Indian Literature & Famous Books',
        'Monuments and Places of India',
        'General Science and Life Sciences (up to 10th CBSE - Physics, Chemistry, Biology)',
        'History of India and Freedom Struggle (1857 to 1947)',
        'Physical, Social and Economic Geography of India and World',
        'Indian Polity and Governance (Constitution and Political System)',
        'Indian Economy & Union Budget basics',
        'Indian Railways History, Zones, Heritage & Technical Advancements',
      ],
    },
  ],
  ageRelaxations: [
    { category: 'SC / ST Candidates', relaxation: '5 Years' },
    { category: 'OBC (Non-Creamy Layer)', relaxation: '3 Years' },
    { category: 'Ex-Servicemen (UR)', relaxation: 'Service period + 3 Years' },
    { category: 'PwBD (UR)', relaxation: '10 Years' },
    { category: 'PwBD (OBC-NCL)', relaxation: '13 Years' },
    { category: 'PwBD (SC/ST)', relaxation: '15 Years' },
    { category: 'Candidates with 3 Years Regular Service in Railways', relaxation: 'Up to 40 Years of age (45 for SC/ST)' },
  ],
};
