export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type SubscriptionPlan = 'Free' | 'Starter' | 'Pro' | 'Enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: SubscriptionPlan;
  creditsRemaining: number;
  creditsTotal: number;
  wordsGenerated: number;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface DocumentComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface DocumentVersion {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  author: string;
}

export interface Document {
  id: string;
  projectId: string;
  title: string;
  content: string;
  templateId?: string;
  brandVoiceId?: string;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  comments: DocumentComment[];
  versions: DocumentVersion[];
}

export interface BrandVoice {
  id: string;
  name: string;
  industry: string;
  targetAudience: string;
  writingStyle: string;
  tone: string;
  mission: string;
  vision: string;
  keywords: string[];
  preferredVocabulary: string[];
  avoidWords: string[];
}

export interface TemplateInputField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder: string;
  options?: string[];
  required?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Marketing' | 'Blog' | 'Social Media' | 'Email' | 'Business' | 'SEO';
  icon: string;
  inputFields: TemplateInputField[];
  promptTemplate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  groundingSources?: { uri: string; title: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  isPinned: boolean;
  messages: ChatMessage[];
}

export interface SupportTicketReply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  description: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
  replies: SupportTicketReply[];
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'Draft' | 'Published';
  publishedAt?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  slug: string;
}

export interface UsageAnalytics {
  dailyWords: { date: string; count: number }[];
  categoryUsage: { name: string; count: number }[];
  providerUsage: { name: string; count: number }[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  plan: SubscriptionPlan;
  status: 'Paid' | 'Pending' | 'Failed';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  service: string;
}
