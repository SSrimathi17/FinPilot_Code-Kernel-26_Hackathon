export type NavigationTab =
  | "home"
  | "income"
  | "expense"
  | "budget"
  | "savings"
  | "investment"
  | "ai_assistant"
  | "education"
  | "resource_locator"
  | "document_vault"
  | "reports"
  | "notifications"
  | "voice_assistant"
  | "profile"
  | "settings";

export type AuthState = "splash" | "welcome" | "auth" | "authenticated";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  occupation: "Student" | "Fresher" | "First-Time Earner" | "Young Professional" | "Family" | "Other";
  currency: string;
  language: string;
  monthlyIncomeTarget: number;
  monthlyExpenseLimit: number;
  financialHealthScore: number;
}

export interface IncomeItem {
  id: string;
  title: string;
  amount: number;
  category: "Salary" | "Freelancing" | "Business" | "Investments" | "Allowance" | "Other";
  date: string;
  isRecurring: boolean;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: "Food & Dining" | "Housing & Rent" | "Transport" | "Utilities" | "Education" | "Entertainment" | "Healthcare" | "Shopping" | "Savings & Invest" | "Other";
  date: string;
  isRecurring: boolean;
  receiptUrl?: string;
  paymentMethod: "UPI" | "Card" | "Cash" | "NetBanking";
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseItem["category"];
  allocated: number;
  spent: number;
  iconName: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: "Emergency Fund" | "Vehicle" | "Education" | "Vacation" | "House" | "Tech Gadget" | "Other";
  targetDate: string;
  milestones: { title: string; amount: number; completed: boolean }[];
  isCompleted: boolean;
}

export interface InvestmentEduOption {
  id: string;
  name: string;
  category: "Gold" | "Fixed Deposit" | "Government Schemes" | "Real Estate / Land" | "Mutual Fund Basics";
  riskLevel: "Very Low" | "Low" | "Moderate" | "High";
  expectedReturns: string;
  minInvestment: string;
  lockInPeriod: string;
  description: string;
  pros: string[];
  cons: string[];
  suitableFor: string;
  taxBenefits: boolean;
}

export interface EducationCourse {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Budgeting" | "Investing 101" | "Debt Management" | "Tax Basics" | "Smart Savings";
  duration: string;
  modulesCount: number;
  quizQuestions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  completed: boolean;
  score?: number;
}

export interface VerifiedResource {
  id: string;
  name: string;
  type: "Bank" | "Jewellery Shop" | "Government Office" | "Surveyor" | "Lawyer" | "Property Consultant";
  address: string;
  distance: string;
  rating: number;
  phone: string;
  website: string;
  lat: number;
  lng: number;
  verified: boolean;
  workingHours: string;
}

export interface DocumentVaultItem {
  id: string;
  title: string;
  category: "Tax Receipt" | "Salary Slips" | "Passbook" | "Government ID" | "Property Deed" | "Tax Forms" | "Identity Cards" | "Property Deeds" | "Insurance Policies" | "Bank Statements" | "Receipts & Invoices";
  uploadDate: string;
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  isEncrypted?: boolean;
  ocrData?: {
    extractedText: string;
    issuedBy?: string;
  };
}

export type VaultDocument = DocumentVaultItem;


export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "budget_alert" | "bill_reminder" | "goal_update" | "edu_tip" | "ai_insight";
  date: string;
  read: boolean;
  actionUrl?: NavigationTab;
}

export interface AIChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
