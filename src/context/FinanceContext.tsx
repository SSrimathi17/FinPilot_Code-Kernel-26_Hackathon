import React, { createContext, useContext, useState, useEffect } from "react";
import {
  IncomeItem,
  ExpenseItem,
  CategoryBudget,
  SavingsGoal,
  VaultDocument,
  NotificationItem,
  EducationCourse,
  VerifiedResource,
  InvestmentEduOption,
} from "../types";

interface FinanceContextType {
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  budgets: CategoryBudget[];
  savingsGoals: SavingsGoal[];
  vaultDocuments: VaultDocument[];
  documents: VaultDocument[];
  notifications: NotificationItem[];
  courses: EducationCourse[];
  verifiedResources: VerifiedResource[];
  investmentOptions: InvestmentEduOption[];

  // Actions
  addIncome: (income: Omit<IncomeItem, "id">) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<ExpenseItem, "id">) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (category: ExpenseItem["category"], allocated: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, "id" | "currentAmount" | "isCompleted" | "milestones">) => void;
  depositToGoal: (id: string, amount: number) => void;
  toggleMilestone: (goalId: string, index: number) => void;
  addVaultDocument: (doc: Omit<VaultDocument, "id" | "uploadDate">) => void;
  uploadDocument: (doc: Omit<VaultDocument, "id" | "uploadDate">) => void;
  deleteVaultDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  completeQuiz: (courseId: string, score: number) => void;

  // Calculated Metrics
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  netCashFlow: number;
  healthScore: number;
}

const initialIncomes: IncomeItem[] = [
  {
    id: "inc_1",
    title: "Software Engineering Salary",
    amount: 3800,
    category: "Salary",
    date: "2026-07-01",
    isRecurring: true,
    notes: "Monthly tech paycheck",
  },
  {
    id: "inc_2",
    title: "UI Design Client Freelance",
    amount: 650,
    category: "Freelancing",
    date: "2026-07-12",
    isRecurring: false,
    notes: "Landing page design milestone",
  },
  {
    id: "inc_3",
    title: "Quarterly Dividend Payout",
    amount: 120,
    category: "Investments",
    date: "2026-07-18",
    isRecurring: true,
    notes: "Index fund dividend yield",
  },
];

const initialExpenses: ExpenseItem[] = [
  {
    id: "exp_1",
    title: "Apartment Rent & Lease",
    amount: 1100,
    category: "Housing & Rent",
    date: "2026-07-02",
    isRecurring: true,
    paymentMethod: "NetBanking",
  },
  {
    id: "exp_2",
    title: "Whole Foods Grocery",
    amount: 245,
    category: "Food & Dining",
    date: "2026-07-05",
    isRecurring: false,
    paymentMethod: "Card",
  },
  {
    id: "exp_3",
    title: "Electric & Wi-Fi Utility",
    amount: 135,
    category: "Utilities",
    date: "2026-07-08",
    isRecurring: true,
    paymentMethod: "UPI",
  },
  {
    id: "exp_4",
    title: "City Metro & Rideshare",
    amount: 85,
    category: "Transport",
    date: "2026-07-11",
    isRecurring: false,
    paymentMethod: "Card",
  },
  {
    id: "exp_5",
    title: "Udemy Tech Certificate Course",
    amount: 60,
    category: "Education",
    date: "2026-07-15",
    isRecurring: false,
    paymentMethod: "UPI",
  },
  {
    id: "exp_6",
    title: "Weekend Dinner & Movie",
    amount: 92,
    category: "Entertainment",
    date: "2026-07-19",
    isRecurring: false,
    paymentMethod: "UPI",
  },
];

const initialBudgets: CategoryBudget[] = [
  { category: "Housing & Rent", allocated: 1200, spent: 1100, iconName: "Home" },
  { category: "Food & Dining", allocated: 450, spent: 245, iconName: "Utensils" },
  { category: "Utilities", allocated: 180, spent: 135, iconName: "Zap" },
  { category: "Transport", allocated: 150, spent: 85, iconName: "Car" },
  { category: "Education", allocated: 200, spent: 60, iconName: "BookOpen" },
  { category: "Entertainment", allocated: 200, spent: 92, iconName: "Film" },
  { category: "Shopping", allocated: 300, spent: 140, iconName: "ShoppingBag" },
  { category: "Healthcare", allocated: 150, spent: 40, iconName: "HeartPulse" },
];

const initialSavingsGoals: SavingsGoal[] = [
  {
    id: "goal_1",
    title: "6-Month Emergency Safety Net",
    targetAmount: 6000,
    currentAmount: 4200,
    category: "Emergency Fund",
    targetDate: "2026-12-31",
    isCompleted: false,
    milestones: [
      { title: "First $1,000 Saved", amount: 1000, completed: true },
      { title: "3 Months Rent Covered", amount: 3300, completed: true },
      { title: "Full 6 Months Secured", amount: 6000, completed: false },
    ],
  },
  {
    id: "goal_2",
    title: "Electric Two-Wheeler Downpayment",
    targetAmount: 2200,
    currentAmount: 1650,
    category: "Vehicle",
    targetDate: "2026-10-15",
    isCompleted: false,
    milestones: [
      { title: "25% Deposit", amount: 550, completed: true },
      { title: "50% Halfway Mark", amount: 1100, completed: true },
      { title: "Ready for Dealership", amount: 2200, completed: false },
    ],
  },
  {
    id: "goal_3",
    title: "Professional Certification & Laptop Upgrade",
    targetAmount: 1500,
    currentAmount: 900,
    category: "Education",
    targetDate: "2026-11-30",
    isCompleted: false,
    milestones: [
      { title: "Exam Fees Locked", amount: 400, completed: true },
      { title: "Hardware Fund 60%", amount: 900, completed: true },
      { title: "Purchase Ready", amount: 1500, completed: false },
    ],
  },
];

const initialDocuments: VaultDocument[] = [
  {
    id: "doc_1",
    title: "Annual Tax Assessment Form W-2 / 16",
    category: "Tax Receipt",
    uploadDate: "2026-03-15",
    fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    fileType: "PDF",
    fileSize: "1.4 MB",
    isEncrypted: true,
  },
  {
    id: "doc_2",
    title: "National Passport Scan & ID",
    category: "Government ID",
    uploadDate: "2026-01-10",
    fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    fileType: "PNG",
    fileSize: "850 KB",
    isEncrypted: true,
  },
  {
    id: "doc_3",
    title: "Health & Medical Insurance Policy",
    category: "Passbook",
    uploadDate: "2026-05-01",
    fileUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
    fileType: "PDF",
    fileSize: "2.1 MB",
    isEncrypted: true,
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Budget Alert: Food & Dining",
    message: "You have used 54% of your monthly dining budget with 10 days remaining.",
    type: "budget_alert",
    date: "2 hours ago",
    read: false,
    actionUrl: "budget",
  },
  {
    id: "notif_2",
    title: "Bill Due Reminder: Electricity",
    message: "Utility bill payment of $135 is scheduled in 3 days.",
    type: "bill_reminder",
    date: "Yesterday",
    read: false,
    actionUrl: "expense",
  },
  {
    id: "notif_3",
    title: "Emergency Fund Goal Updated!",
    message: "Congratulations! You crossed 70% milestone for your Emergency Fund.",
    type: "goal_update",
    date: "2 days ago",
    read: true,
    actionUrl: "savings",
  },
  {
    id: "notif_4",
    title: "AI Literacy Tip of the Day",
    message: "Automating 10% of income on salary day reduces impulse spending by 35%.",
    type: "edu_tip",
    date: "3 days ago",
    read: true,
    actionUrl: "education",
  },
];

const initialCourses: EducationCourse[] = [
  {
    id: "course_1",
    title: "Mastering the 50/30/20 Budgeting Method",
    description: "Learn how to divide your net income into 50% Needs, 30% Wants, and 20% Savings & Debt Repayment effortlessly.",
    level: "Beginner",
    category: "Budgeting",
    duration: "15 mins",
    modulesCount: 4,
    completed: false,
    quizQuestions: [
      {
        question: "Under the 50/30/20 rule, what percentage of income goes to Needs?",
        options: ["20%", "30%", "50%", "70%"],
        correctAnswer: 2,
        explanation: "50% is allocated for essential living expenses like rent, utilities, and groceries.",
      },
      {
        question: "Which of the following is considered a 'Want' rather than a 'Need'?",
        options: ["Electricity Bill", "Groceries", "Streaming Subscription", "Health Insurance"],
        correctAnswer: 2,
        explanation: "Streaming subscriptions are non-essential entertainment desires (Wants).",
      },
    ],
  },
  {
    id: "course_2",
    title: "Building an Unshakable Emergency Fund",
    description: "Discover why every student and young earner needs 3–6 months of living expenses saved in accessible, safe accounts.",
    level: "Beginner",
    category: "Smart Savings",
    duration: "20 mins",
    modulesCount: 5,
    completed: true,
    score: 100,
    quizQuestions: [
      {
        question: "How many months of expenses should a standard emergency fund cover?",
        options: ["1 month", "3 to 6 months", "12 to 24 months", "Only $100"],
        correctAnswer: 1,
        explanation: "3 to 6 months gives adequate cushion against job changes, medical emergencies, or unforeseen repairs.",
      },
    ],
  },
  {
    id: "course_3",
    title: "Fixed Deposits & Govt Savings Schemes Demystified",
    description: "A complete non-speculative guide to government-backed savings bonds, fixed deposits, and guaranteed return vehicles.",
    level: "Intermediate",
    category: "Investing 101",
    duration: "25 mins",
    modulesCount: 6,
    completed: false,
    quizQuestions: [
      {
        question: "What is a primary advantage of Government-backed savings bonds?",
        options: ["100% Guaranteed risk-free safety", "Stock market double digit returns", "Daily price fluctuations", "Zero tax benefits"],
        correctAnswer: 0,
        explanation: "Government backing guarantees principal safety and fixed interest returns.",
      },
    ],
  },
];

const initialResources: VerifiedResource[] = [
  {
    id: "res_1",
    name: "Apex National Public Bank - Central Branch",
    type: "Bank",
    address: "742 Financial Ave, Downtown Plaza",
    distance: "0.8 miles away",
    rating: 4.8,
    phone: "+1 (555) 234-5678",
    website: "https://bank.example.com",
    lat: 37.7749,
    lng: -122.4194,
    verified: true,
    workingHours: "9:00 AM - 4:30 PM (Mon-Fri)",
  },
  {
    id: "res_2",
    name: "Government Revenue & Land Registration Office",
    type: "Government Office",
    address: "100 Civic Center Blvd, Suite 200",
    distance: "1.4 miles away",
    rating: 4.5,
    phone: "+1 (555) 876-5432",
    website: "https://gov.example.com/registration",
    lat: 37.7833,
    lng: -122.4167,
    verified: true,
    workingHours: "8:30 AM - 5:00 PM (Mon-Fri)",
  },
  {
    id: "res_3",
    name: "Horizon Certified Property Surveyors & Valuers",
    type: "Surveyor",
    address: "312 Beacon Street, Tower B",
    distance: "2.1 miles away",
    rating: 4.9,
    phone: "+1 (555) 345-6789",
    website: "https://surveyors.example.com",
    lat: 37.769,
    lng: -122.428,
    verified: true,
    workingHours: "9:00 AM - 6:00 PM (Mon-Sat)",
  },
  {
    id: "res_4",
    name: "Prestige Certified Legal & Tax Counsel",
    type: "Lawyer",
    address: "50 Lawyers Square, Floor 4",
    distance: "1.2 miles away",
    rating: 4.7,
    phone: "+1 (555) 901-2345",
    website: "https://legalcounsel.example.com",
    lat: 37.778,
    lng: -122.41,
    verified: true,
    workingHours: "9:30 AM - 6:30 PM (Mon-Fri)",
  },
];

const initialInvestments: InvestmentEduOption[] = [
  {
    id: "inv_1",
    name: "Fixed Deposit (FD) / Certificate of Deposit",
    category: "Fixed Deposit",
    riskLevel: "Very Low",
    expectedReturns: "6.5% - 7.5% p.a.",
    minInvestment: "$100",
    lockInPeriod: "7 days to 5 years",
    description: "A secure term deposit offered by licensed banks with guaranteed interest yield upon maturity.",
    pros: ["Guaranteed return", "High safety", "Flexible tenure choice", "Overdraft loan facility against FD"],
    cons: ["Returns may barely beat high inflation", "Penalty for early premature withdrawal"],
    suitableFor: "Risk-averse individuals, emergency capital reserves, short-to-medium term savings.",
    taxBenefits: true,
  },
  {
    id: "inv_2",
    name: "Sovereign Gold Bonds & Digital Gold",
    category: "Gold",
    riskLevel: "Low",
    expectedReturns: "Historical 8% - 11% CAGR + 2.5% fixed interest",
    minInvestment: "$50",
    lockInPeriod: "5 - 8 Years (SGB)",
    description: "Government-backed digital or physical gold instruments that protect wealth against currency devaluation.",
    pros: ["Zero storage or theft risk for digital/SGB", "Generates 2.5% annual interest payout", "Capital gain tax exemptions on maturity"],
    cons: ["Gold prices fluctuate based on global macroeconomic factors", "Lock-in period for max tax benefits"],
    suitableFor: "Long-term inflation hedge, family asset preservation, diversification.",
    taxBenefits: true,
  },
  {
    id: "inv_3",
    name: "Government Public Provident & Savings Certificates",
    category: "Government Schemes",
    riskLevel: "Very Low",
    expectedReturns: "7.1% - 8.2% p.a. (Compounded annually)",
    minInvestment: "$25",
    lockInPeriod: "5 to 15 Years",
    description: "Sovereign-backed long-term accumulation scheme designed for retirement, education, and tax deduction.",
    pros: ["EEE Tax Status (Exempt deposit, exempt interest, exempt withdrawal)", "100% Sovereign protection", "Power of compounding over 15 yrs"],
    cons: ["Strict lock-in limitations", "Annual capping limits"],
    suitableFor: "Long-term security, tax savings under government regulations, retirement cushion.",
    taxBenefits: true,
  },
  {
    id: "inv_4",
    name: "Index Mutual Funds & Diversified Basket (Basics)",
    category: "Mutual Fund Basics",
    riskLevel: "Moderate",
    expectedReturns: "10% - 13% long term average",
    minInvestment: "$10",
    lockInPeriod: "None (Open-ended)",
    description: "Passive pooling of capital tracking top 50/500 market benchmark companies without active fund manager speculation.",
    pros: ["Instant diversification across hundreds of companies", "Low expense ratio fees", "High liquid access to funds"],
    cons: ["Market risk exposure during economic downturns", "Short term price volatility"],
    suitableFor: "Young professionals with 5+ year time horizons building wealth systematically.",
    taxBenefits: false,
  },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    const saved = localStorage.getItem("finsmart_incomes");
    return saved ? JSON.parse(saved) : initialIncomes;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem("finsmart_expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem("finsmart_budgets");
    return saved ? JSON.parse(saved) : initialBudgets;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem("finsmart_savings");
    return saved ? JSON.parse(saved) : initialSavingsGoals;
  });

  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem("finsmart_documents");
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem("finsmart_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [courses, setCourses] = useState<EducationCourse[]>(() => {
    const saved = localStorage.getItem("finsmart_courses");
    return saved ? JSON.parse(saved) : initialCourses;
  });

  useEffect(() => {
    localStorage.setItem("finsmart_incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("finsmart_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("finsmart_budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("finsmart_savings", JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem("finsmart_documents", JSON.stringify(vaultDocuments));
  }, [vaultDocuments]);

  useEffect(() => {
    localStorage.setItem("finsmart_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("finsmart_courses", JSON.stringify(courses));
  }, [courses]);

  // Actions
  const addIncome = (income: Omit<IncomeItem, "id">) => {
    const newItem: IncomeItem = { ...income, id: `inc_${Date.now()}` };
    setIncomes((prev) => [newItem, ...prev]);
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  const addExpense = (expense: Omit<ExpenseItem, "id">) => {
    const newItem: ExpenseItem = { ...expense, id: `exp_${Date.now()}` };
    setExpenses((prev) => [newItem, ...prev]);

    // Update spent in matching category budget
    setBudgets((prev) =>
      prev.map((b) =>
        b.category === expense.category
          ? { ...b, spent: b.spent + expense.amount }
          : b
      )
    );
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (target) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === target.category
            ? { ...b, spent: Math.max(0, b.spent - target.amount) }
            : b
        )
      );
    }
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBudget = (category: ExpenseItem["category"], allocated: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, allocated } : b))
    );
  };

  const addSavingsGoal = (
    goal: Omit<SavingsGoal, "id" | "currentAmount" | "isCompleted" | "milestones">
  ) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      currentAmount: 0,
      isCompleted: false,
      milestones: [
        { title: "First 25% Seeded", amount: goal.targetAmount * 0.25, completed: false },
        { title: "Halfway Mark (50%)", amount: goal.targetAmount * 0.5, completed: false },
        { title: "Target Accomplished (100%)", amount: goal.targetAmount, completed: false },
      ],
    };
    setSavingsGoals((prev) => [newGoal, ...prev]);
  };

  const depositToGoal = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newCurrent = g.currentAmount + amount;
        const isCompleted = newCurrent >= g.targetAmount;
        const updatedMilestones = g.milestones.map((m) => ({
          ...m,
          completed: m.completed || newCurrent >= m.amount,
        }));
        return {
          ...g,
          currentAmount: newCurrent,
          isCompleted,
          milestones: updatedMilestones,
        };
      })
    );
  };

  const toggleMilestone = (goalId: string, index: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextMs = [...g.milestones];
        nextMs[index] = { ...nextMs[index], completed: !nextMs[index].completed };
        return { ...g, milestones: nextMs };
      })
    );
  };

  const addVaultDocument = (doc: Omit<VaultDocument, "id" | "uploadDate">) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setVaultDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteVaultDocument = (id: string) => {
    setVaultDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const completeQuiz = (courseId: string, score: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, completed: true, score } : c))
    );
  };

  // Calculations
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const netCashFlow = totalIncome - totalExpense;

  // Calculate dynamic health score
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const healthScore = Math.min(
    100,
    Math.max(30, Math.round(50 + savingsRate * 0.8 + (savingsGoals.length > 0 ? 10 : 0)))
  );

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        expenses,
        budgets,
        savingsGoals,
        vaultDocuments,
        documents: vaultDocuments,
        notifications,
        courses,
        verifiedResources: initialResources,
        investmentOptions: initialInvestments,
        addIncome,
        deleteIncome,
        addExpense,
        deleteExpense,
        updateBudget,
        addSavingsGoal,
        depositToGoal,
        toggleMilestone,
        addVaultDocument,
        uploadDocument: addVaultDocument,
        deleteVaultDocument,
        deleteDocument: deleteVaultDocument,
        markNotificationRead,
        clearNotifications,
        completeQuiz,
        totalIncome,
        totalExpense,
        totalSavings,
        netCashFlow,
        healthScore,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within a FinanceProvider");
  return context;
};
