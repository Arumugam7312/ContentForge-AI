import * as fs from 'fs';
import * as path from 'path';
import { 
  UserProfile, Project, Document, BrandVoice, ChatSession, 
  SupportTicket, BlogArticle, Invoice, TeamMember, SystemLog, UsageAnalytics,
  DocumentComment, ChatMessage
} from './types';

interface DBState {
  user: UserProfile;
  projects: Project[];
  documents: Document[];
  brandVoices: BrandVoice[];
  chats: ChatSession[];
  supportTickets: SupportTicket[];
  blogArticles: BlogArticle[];
  invoices: Invoice[];
  teamMembers: TeamMember[];
  systemLogs: SystemLog[];
  analytics: UsageAnalytics;
}

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'db.json');

const INITIAL_ANALYTICS: UsageAnalytics = {
  dailyWords: [
    { date: '2026-07-01', count: 12500 },
    { date: '2026-07-02', count: 18400 },
    { date: '2026-07-03', count: 9800 },
    { date: '2026-07-04', count: 4200 },
    { date: '2026-07-05', count: 5100 },
    { date: '2026-07-06', count: 22100 },
    { date: '2026-07-07', count: 15420 }
  ],
  categoryUsage: [
    { name: 'Blog', count: 45 },
    { name: 'Social Media', count: 72 },
    { name: 'Email', count: 34 },
    { name: 'Marketing', count: 28 },
    { name: 'SEO', count: 19 },
    { name: 'Business', count: 12 }
  ],
  providerUsage: [
    { name: 'Gemini (Free)', count: 184 },
    { name: 'Llama 3.1 (Ollama)', count: 22 },
    { name: 'Qwen 2.5 (OpenRouter)', count: 4 }
  ]
};

const SEED_DATA: DBState = {
  user: {
    id: 'u1',
    name: 'Alex Creator',
    email: 'alex@contentforge.ai',
    role: 'Admin',
    plan: 'Pro',
    creditsRemaining: 84580,
    creditsTotal: 100000,
    wordsGenerated: 15420,
    joinedAt: '2026-01-10T12:00:00Z'
  },
  projects: [
    {
      id: 'p1',
      name: 'My Niche Blog Website',
      description: 'Articles, keyword-rich summaries, and content blueprints for my niche digital marketing blog.',
      tags: ['Blog', 'Productivity'],
      isFavorite: true,
      isArchived: false,
      createdAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'p2',
      name: 'ContentForge AI Launch Ads',
      description: 'Landing page blueprints, ad copy, cold sequences, and newsletters for launching ContentForge.',
      tags: ['SaaS', 'Marketing'],
      isFavorite: false,
      isArchived: false,
      createdAt: '2026-04-15T14:30:00Z'
    }
  ],
  documents: [
    {
      id: 'd1',
      projectId: 'p1',
      title: '10 Game-Changing Remote Work Hacks',
      content: `# 10 Game-Changing Remote Work Hacks

Remote work is no longer just a trend—it is a modern standard of productivity. However, staying focused inside the comfort of your home requires clear structural boundaries. Here are some of the most effective hacks for high output:

## 1. Implement a Hard Digital Cutoff
To prevent screen fatigue and maintain work-life balance, set a strict alarm at 6:00 PM. Shut down all browser tabs and close your laptop immediately.

## 2. Leverage Pomodoro Stacking
Work in blocks of 50 minutes followed by 10-minute active stretch breaks. Stacking 4 of these blocks creates a massive deep-work morning session.

## 3. Standardize Your Brand Voice
Use ContentForge AI to ensure all newsletters and guides reflect a bold, inspiring tone. Consistency is key to customer trust!`,
      tags: ['Blog', 'SaaS'],
      isFavorite: true,
      isArchived: false,
      createdAt: '2026-05-01T09:00:00Z',
      updatedAt: '2026-07-06T15:00:00Z',
      comments: [
        { id: 'com_1', author: 'Sarah Editor', text: 'This intro is superb! Can we expand more on the Pomodoro stacking?', timestamp: '2026-07-06T15:02:00Z' }
      ],
      versions: [
        { id: 'v1_original', timestamp: '2026-05-01T09:00:00Z', title: 'Remote Work Hacks', content: '# Remote Work Hacks\n\nTips to stay focused when working remotely...', author: 'Alex Creator' }
      ]
    },
    {
      id: 'd2',
      projectId: 'p2',
      title: 'PAS Framework Launch Ad Copy',
      content: `### Facebook Ad Variation (PAS Framework)

**Problem:** Generating high-converting copywriting takes hours, and hiring copywriters costs thousands.
**Agitate:** ...and when you hire freelancers, the tone is mismatched, deadlines are missed, and costs skyrocket.
**Solve:** Enter **ContentForge AI**. Generate blog articles, high-performing ads, email campaigns, and SEO blueprints in seconds—powered by state-of-the-art models.

👉 Start your free trial today and save 90% of your copywriting time.`,
      tags: ['Ads', 'Marketing'],
      isFavorite: false,
      isArchived: false,
      createdAt: '2026-06-15T10:00:00Z',
      updatedAt: '2026-06-15T10:15:00Z',
      comments: [],
      versions: []
    }
  ],
  brandVoices: [
    {
      id: 'bv1',
      name: 'ContentForge AI Corporate',
      industry: 'Software / SaaS',
      targetAudience: 'Content Marketers, Indie Hackers, Copywriting Agencies',
      writingStyle: 'Direct, value-driven, authoritative, highly professional',
      tone: 'Inspiring and Insightful',
      mission: 'To make professional content creation effortless and scalable for everyone.',
      vision: 'A world where content barriers are eliminated using collaborative intelligence.',
      keywords: ['frictionless', 'scalable', 'insightful', 'high-performing'],
      preferredVocabulary: ['streamline', 'leverage', 'empower', 'acceleration'],
      avoidWords: ['synergy', 'disruptive', 'slop', 'cheap']
    }
  ],
  chats: [
    {
      id: 'c1',
      title: 'Blog Content Idea Pitching',
      createdAt: '2026-07-06T12:00:00Z',
      isPinned: true,
      messages: [
        {
          id: 'm1',
          role: 'user',
          text: 'Generate 3 engaging headlines for a software startup launch.',
          timestamp: '2026-07-06T12:00:00Z'
        },
        {
          id: 'm2',
          role: 'model',
          text: `Here are 3 high-converting headlines for your software startup:

1. **"The Content Barrier: Broken. Write 10x Faster Today."**
2. **"No Freelancers. No Delay. Just High-Performing Content Instantly."**
3. **"Effortless Brand Copywriting Meets State-of-the-Art Intelligence."**`,
          timestamp: '2026-07-06T12:01:00Z'
        }
      ]
    }
  ],
  supportTickets: [
    {
      id: 't1',
      subject: 'Custom Custom Template Import',
      category: 'Templates',
      description: 'I would love to import a custom CSV file to populate template input fields. Is this feature coming soon?',
      status: 'Open',
      createdAt: '2026-07-05T08:00:00Z',
      replies: [
        {
          id: 'r1',
          author: 'Customer Support',
          text: 'Hi Alex! That is on our Q3 roadmap. We are actively designing CSV templates!',
          timestamp: '2026-07-05T09:30:00Z'
        }
      ]
    }
  ],
  blogArticles: [
    {
      id: 'ba1',
      title: 'How ContentForge AI Streamlines Content Campaigns',
      content: `AI-assisted content generation is rapidly becoming standard in high-growth marketing teams. By combining custom templates with specialized brand voice configs, companies can maintain exact branding while accelerating article output by over 500%.

In this article, we break down how to set up your primary and secondary brand voice blueprints and deploy them into standard marketing workflows...`,
      category: 'Guides',
      tags: ['SaaS', 'Marketing', 'AI'],
      status: 'Published',
      publishedAt: '2026-06-10T12:00:00Z',
      seoTitle: 'Streamline Content Campaigns with AI Copywriters',
      seoDescription: 'Learn how to use custom brand voices and AI templates to skyrocket your blog production.',
      seoKeywords: 'AI copywriter, content campaigns, brand voice setup',
      slug: 'how-to-streamline-content-campaigns'
    }
  ],
  invoices: [
    { id: 'inv_01', date: '2026-05-01', amount: 49, plan: 'Pro', status: 'Paid' },
    { id: 'inv_02', date: '2026-06-01', amount: 49, plan: 'Pro', status: 'Paid' },
    { id: 'inv_03', date: '2026-07-01', amount: 49, plan: 'Pro', status: 'Paid' }
  ],
  teamMembers: [
    { id: 'tm1', name: 'Alex Creator', email: 'alex@contentforge.ai', role: 'Admin', joinedAt: '2026-01-10T12:00:00Z' },
    { id: 'tm2', name: 'Sarah Editor', email: 'sarah@contentforge.ai', role: 'Editor', joinedAt: '2026-02-15T09:00:00Z' },
    { id: 'tm3', name: 'John Guest', email: 'john@contentforge.ai', role: 'Viewer', joinedAt: '2026-03-20T14:00:00Z' }
  ],
  systemLogs: [
    { id: 'sl1', timestamp: '2026-07-07T07:10:00Z', level: 'info', message: 'ContentForge database loaded successfully', service: 'Database' },
    { id: 'sl2', timestamp: '2026-07-07T07:11:15Z', level: 'info', message: 'Google Gemini client initialized successfully with User-Agent custom telemetry', service: 'AI-Service' },
    { id: 'sl3', timestamp: '2026-07-07T07:12:30Z', level: 'warn', message: 'Admin dashboard metrics loaded in 14ms', service: 'System' }
  ],
  analytics: INITIAL_ANALYTICS
};

export class DatabaseStore {
  private state: DBState;

  constructor() {
    this.state = this.load();
  }

  private load(): DBState {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.error('Error loading database file, falling back to seed data:', e);
    }
    this.saveState(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA)); // Clone
  }

  private saveState(data: DBState): void {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database file:', e);
    }
  }

  private persist(): void {
    this.saveState(this.state);
  }

  // User methods
  getUser(): UserProfile {
    return this.state.user;
  }

  updateUser(user: Partial<UserProfile>): UserProfile {
    this.state.user = { ...this.state.user, ...user };
    this.persist();
    this.log('info', `User profile updated for ${this.state.user.name}`, 'Auth-Service');
    return this.state.user;
  }

  // Project methods
  getProjects(): Project[] {
    return this.state.projects.filter(p => !p.isArchived);
  }

  getAllProjects(): Project[] {
    return this.state.projects;
  }

  getProject(id: string): Project | undefined {
    return this.state.projects.find(p => p.id === id);
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'isFavorite' | 'isArchived'>): Project {
    const newProject: Project = {
      ...project,
      id: 'proj_' + Math.random().toString(36).substr(2, 9),
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString()
    };
    this.state.projects.push(newProject);
    this.persist();
    this.log('info', `Project "${newProject.name}" created`, 'Database');
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.state.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.state.projects[index] = { ...this.state.projects[index], ...updates };
    this.persist();
    this.log('info', `Project "${this.state.projects[index].name}" updated`, 'Database');
    return this.state.projects[index];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.state.projects.length;
    this.state.projects = this.state.projects.filter(p => p.id !== id);
    // Also delete or orphan documents
    this.state.documents = this.state.documents.filter(d => d.projectId !== id);
    const deleted = this.state.projects.length < initialLen;
    if (deleted) {
      this.persist();
      this.log('warn', `Project ${id} and its associated documents were deleted`, 'Database');
    }
    return deleted;
  }

  // Document methods
  getDocuments(): Document[] {
    return this.state.documents.filter(d => !d.isArchived);
  }

  getAllDocuments(): Document[] {
    return this.state.documents;
  }

  getDocument(id: string): Document | undefined {
    return this.state.documents.find(d => d.id === id);
  }

  createDocument(doc: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'versions' | 'isFavorite' | 'isArchived'>): Document {
    const newDoc: Document = {
      ...doc,
      id: 'doc_' + Math.random().toString(36).substr(2, 9),
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      versions: [
        {
          id: 'v_init_' + Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toISOString(),
          title: doc.title,
          content: doc.content,
          author: this.state.user.name
        }
      ]
    };
    this.state.documents.push(newDoc);
    this.persist();
    this.log('info', `Document "${newDoc.title}" created`, 'Database');
    return newDoc;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | undefined {
    const index = this.state.documents.findIndex(d => d.id === id);
    if (index === -1) return undefined;

    const currentDoc = this.state.documents[index];
    
    // Save version history if content changed majorly
    const contentChanged = updates.content !== undefined && updates.content !== currentDoc.content;
    const versions = [...currentDoc.versions];

    if (contentChanged && currentDoc.content.trim().length > 0) {
      versions.push({
        id: 'v_' + Math.random().toString(36).substr(2, 5),
        timestamp: new Date().toISOString(),
        title: currentDoc.title,
        content: currentDoc.content,
        author: this.state.user.name
      });
    }

    this.state.documents[index] = { 
      ...currentDoc, 
      ...updates, 
      versions,
      updatedAt: new Date().toISOString() 
    };
    this.persist();
    return this.state.documents[index];
  }

  deleteDocument(id: string): boolean {
    const initialLen = this.state.documents.length;
    this.state.documents = this.state.documents.filter(d => d.id !== id);
    const deleted = this.state.documents.length < initialLen;
    if (deleted) {
      this.persist();
      this.log('info', `Document ${id} deleted`, 'Database');
    }
    return deleted;
  }

  addComment(id: string, text: string, author: string): DocumentComment | undefined {
    const index = this.state.documents.findIndex(d => d.id === id);
    if (index === -1) return undefined;

    const comment: DocumentComment = {
      id: 'com_' + Math.random().toString(36).substr(2, 5),
      author,
      text,
      timestamp: new Date().toISOString()
    };

    this.state.documents[index].comments.push(comment);
    this.persist();
    this.log('info', `Comment added to Document ${id}`, 'Collaboration');
    return comment;
  }

  // Brand voice methods
  getBrandVoices(): BrandVoice[] {
    return this.state.brandVoices;
  }

  getBrandVoice(id: string): BrandVoice | undefined {
    return this.state.brandVoices.find(b => b.id === id);
  }

  createBrandVoice(voice: Omit<BrandVoice, 'id'>): BrandVoice {
    const newVoice: BrandVoice = {
      ...voice,
      id: 'bv_' + Math.random().toString(36).substr(2, 9)
    };
    this.state.brandVoices.push(newVoice);
    this.persist();
    this.log('info', `Brand voice "${newVoice.name}" added`, 'Database');
    return newVoice;
  }

  updateBrandVoice(id: string, updates: Partial<BrandVoice>): BrandVoice | undefined {
    const index = this.state.brandVoices.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    this.state.brandVoices[index] = { ...this.state.brandVoices[index], ...updates };
    this.persist();
    this.log('info', `Brand voice "${this.state.brandVoices[index].name}" updated`, 'Database');
    return this.state.brandVoices[index];
  }

  deleteBrandVoice(id: string): boolean {
    const initialLen = this.state.brandVoices.length;
    this.state.brandVoices = this.state.brandVoices.filter(b => b.id !== id);
    const deleted = this.state.brandVoices.length < initialLen;
    if (deleted) {
      this.persist();
      this.log('info', `Brand voice ${id} deleted`, 'Database');
    }
    return deleted;
  }

  // Chats methods
  getChats(): ChatSession[] {
    return this.state.chats;
  }

  getChat(id: string): ChatSession | undefined {
    return this.state.chats.find(c => c.id === id);
  }

  createChat(title: string): ChatSession {
    const newChat: ChatSession = {
      id: 'chat_' + Math.random().toString(36).substr(2, 9),
      title,
      createdAt: new Date().toISOString(),
      isPinned: false,
      messages: []
    };
    this.state.chats.push(newChat);
    this.persist();
    this.log('info', `Chat session "${title}" created`, 'Chat-Service');
    return newChat;
  }

  updateChat(id: string, updates: Partial<ChatSession>): ChatSession | undefined {
    const index = this.state.chats.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.state.chats[index] = { ...this.state.chats[index], ...updates };
    this.persist();
    return this.state.chats[index];
  }

  deleteChat(id: string): boolean {
    const initialLen = this.state.chats.length;
    this.state.chats = this.state.chats.filter(c => c.id !== id);
    const deleted = this.state.chats.length < initialLen;
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  addMessage(chatId: string, role: 'user' | 'model', text: string, groundingSources?: { uri: string; title: string }[]): ChatMessage | undefined {
    const index = this.state.chats.findIndex(c => c.id === chatId);
    if (index === -1) return undefined;

    const newMessage: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      role,
      text,
      timestamp: new Date().toISOString(),
      groundingSources
    };

    this.state.chats[index].messages.push(newMessage);
    
    // Auto-consume credits for messages
    if (role === 'model') {
      const estimatedWords = Math.ceil(text.split(/\s+/).length);
      this.recordWordsGenerated(estimatedWords);
    }
    
    this.persist();
    return newMessage;
  }

  // Blog CMS
  getBlogs(): BlogArticle[] {
    return this.state.blogArticles;
  }

  createBlog(blog: Omit<BlogArticle, 'id'>): BlogArticle {
    const newBlog: BlogArticle = {
      ...blog,
      id: 'blog_' + Math.random().toString(36).substr(2, 9)
    };
    this.state.blogArticles.push(newBlog);
    this.persist();
    this.log('info', `Blog post "${newBlog.title}" added`, 'Blog-CMS');
    return newBlog;
  }

  updateBlog(id: string, updates: Partial<BlogArticle>): BlogArticle | undefined {
    const index = this.state.blogArticles.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    this.state.blogArticles[index] = { ...this.state.blogArticles[index], ...updates };
    this.persist();
    return this.state.blogArticles[index];
  }

  deleteBlog(id: string): boolean {
    const initialLen = this.state.blogArticles.length;
    this.state.blogArticles = this.state.blogArticles.filter(b => b.id !== id);
    const deleted = this.state.blogArticles.length < initialLen;
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  // Support
  getTickets(): SupportTicket[] {
    return this.state.supportTickets;
  }

  createTicket(subject: string, category: string, description: string): SupportTicket {
    const newTicket: SupportTicket = {
      id: 'tkt_' + Math.random().toString(36).substr(2, 9),
      subject,
      category,
      description,
      status: 'Open',
      createdAt: new Date().toISOString(),
      replies: []
    };
    this.state.supportTickets.push(newTicket);
    this.persist();
    this.log('info', `Support ticket created: ${subject}`, 'Support');
    return newTicket;
  }

  addTicketReply(ticketId: string, text: string, author: string): any {
    const index = this.state.supportTickets.findIndex(t => t.id === ticketId);
    if (index === -1) return undefined;
    const reply = {
      id: 'rep_' + Math.random().toString(36).substr(2, 5),
      author,
      text,
      timestamp: new Date().toISOString()
    };
    this.state.supportTickets[index].replies.push(reply);
    this.persist();
    return reply;
  }

  updateTicketStatus(ticketId: string, status: 'Open' | 'Resolved'): SupportTicket | undefined {
    const index = this.state.supportTickets.findIndex(t => t.id === ticketId);
    if (index === -1) return undefined;
    this.state.supportTickets[index].status = status;
    this.persist();
    return this.state.supportTickets[index];
  }

  // Invoices & Billing
  getInvoices(): Invoice[] {
    return this.state.invoices;
  }

  // Team Collaboration
  getTeam(): TeamMember[] {
    return this.state.teamMembers;
  }

  addTeamMember(name: string, email: string, role: 'Admin' | 'Editor' | 'Viewer'): TeamMember {
    const member: TeamMember = {
      id: 'tm_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      joinedAt: new Date().toISOString()
    };
    this.state.teamMembers.push(member);
    this.persist();
    this.log('info', `Team member ${name} invited as ${role}`, 'Collaboration');
    return member;
  }

  deleteTeamMember(id: string): boolean {
    const initialLen = this.state.teamMembers.length;
    this.state.teamMembers = this.state.teamMembers.filter(t => t.id !== id);
    const deleted = this.state.teamMembers.length < initialLen;
    if (deleted) {
      this.persist();
    }
    return deleted;
  }

  // System Logs
  getLogs(): SystemLog[] {
    return this.state.systemLogs;
  }

  log(level: 'info' | 'warn' | 'error', message: string, service: string): void {
    const newLog: SystemLog = {
      id: 'log_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      service
    };
    this.state.systemLogs.unshift(newLog);
    if (this.state.systemLogs.length > 100) {
      this.state.systemLogs.pop();
    }
    this.persist();
  }

  // Analytics & word calculations
  getAnalytics(): UsageAnalytics {
    return this.state.analytics;
  }

  recordWordsGenerated(count: number): void {
    this.state.user.wordsGenerated += count;
    this.state.user.creditsRemaining = Math.max(0, this.state.user.creditsRemaining - count);
    
    // Add to today's analytics count
    const todayStr = new Date().toISOString().split('T')[0];
    const dayIndex = this.state.analytics.dailyWords.findIndex(dw => dw.date === todayStr);
    if (dayIndex !== -1) {
      this.state.analytics.dailyWords[dayIndex].count += count;
    } else {
      this.state.analytics.dailyWords.push({ date: todayStr, count });
      if (this.state.analytics.dailyWords.length > 7) {
        this.state.analytics.dailyWords.shift();
      }
    }
    this.persist();
  }

  recordCategoryUsed(category: string): void {
    const catIndex = this.state.analytics.categoryUsage.findIndex(c => c.name === category);
    if (catIndex !== -1) {
      this.state.analytics.categoryUsage[catIndex].count += 1;
    } else {
      this.state.analytics.categoryUsage.push({ name: category, count: 1 });
    }
    this.persist();
  }

  reset(): void {
    this.state = JSON.parse(JSON.stringify(SEED_DATA));
    this.persist();
    this.log('warn', 'Database reset to default seed data', 'System');
  }

  clear(): void {
    this.state = {
      user: {
        id: 'u1',
        name: 'Alex Creator',
        email: 'alex@contentforge.ai',
        role: 'Admin',
        plan: 'Free',
        creditsRemaining: 0,
        creditsTotal: 2000,
        wordsGenerated: 0,
        joinedAt: new Date().toISOString()
      },
      projects: [],
      documents: [],
      brandVoices: [],
      chats: [],
      supportTickets: [],
      blogArticles: [],
      invoices: [],
      teamMembers: [],
      systemLogs: [],
      analytics: {
        dailyWords: [],
        categoryUsage: [],
        providerUsage: []
      }
    };
    this.persist();
    this.log('warn', 'Database cleared successfully', 'System');
  }
}

export const dbStore = new DatabaseStore();
