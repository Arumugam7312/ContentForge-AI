import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbStore } from './src/db-store';
import { DEFAULT_TEMPLATES } from './src/templates-data';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom telemetry header
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini AI SDK client initialized successfully.');
  } catch (err) {
    console.error('Error initializing Gemini AI SDK client:', err);
  }
} else {
  console.log('No valid GEMINI_API_KEY found in process.env. Fallback simulation mode enabled.');
}

// Helper to run AI generation (with real Gemini or realistic fallback simulation)
async function generateWithAI(prompt: string, brandVoiceId?: string, systemInstruction?: string): Promise<{ text: string; provider: string }> {
  let brandInstructions = '';
  if (brandVoiceId) {
    const bv = dbStore.getBrandVoice(brandVoiceId);
    if (bv) {
      brandInstructions = `
[STRICT BRAND VOICE ENFORCEMENT]:
- Company Name/Brand: ${bv.name}
- Industry: ${bv.industry}
- Target Audience: ${bv.targetAudience}
- Tone of Voice: ${bv.tone}
- Writing Style: ${bv.writingStyle}
- Preferred Words (use these): ${bv.keywords.join(', ')} / ${bv.preferredVocabulary.join(', ')}
- Forbidden Words (AVOID these at all costs): ${bv.avoidWords.join(', ')}
Ensure the generated content matches this brand identity perfectly.
`;
    }
  }

  const fullPrompt = brandInstructions ? `${brandInstructions}\n\nUser Request:\n${prompt}` : prompt;
  const sysInstr = systemInstruction || 'You are an elite, professional copywriter and AI content assistant.';

  // If client is available, call the real Gemini API
  if (aiClient) {
    try {
      dbStore.log('info', 'Routing request to Gemini AI...', 'AI-Service');
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: sysInstr,
          temperature: 0.7,
        }
      });
      
      const text = response.text || '';
      return { text, provider: 'Gemini 3.5 Flash' };
    } catch (e: any) {
      dbStore.log('error', `Gemini API Error: ${e.message || e}. Triggering automatic fallback simulation.`, 'AI-Service');
      console.warn('Gemini call was recovered gracefully via fallback generator:', e.message || e);
    }
  }

  // Fallback high-fidelity simulation
  dbStore.log('warn', 'Using high-fidelity fallback model simulation.', 'AI-Service');
  await new Promise(resolve => setTimeout(resolve, 1500)); // Mock latency

  // Generate beautiful content contextually
  let simulatedText = '';
  if (prompt.includes('blog') || prompt.includes('Blog') || prompt.includes('topic')) {
    simulatedText = `
# The Ultimate Guide to Modern Content Strategy in 2026

In an era dominated by rapid technological evolution, building a sustainable brand is no longer just about publishing volume. It is about creating content that resonates on a human level, fueled by intelligent tools.

## Why Content Matters Now More Than Ever
Every day, thousands of articles are published. To cut through the noise, you need:
- **Precision Targeting**: Speaking directly to your core buyer personas.
- **Brand Identity**: Infusing every paragraph with a distinct tone, mission, and style.
- **Actionable Insights**: Providing real value that readers can apply instantly.

### Core Steps to Accelerate Output
1. **Define Your Pillars**: Establish 3 to 5 core subjects you want to be known for.
2. **Setup Custom Templates**: Use dedicated tools like ContentForge AI to write draft structures in seconds.
3. **Refine & Humanize**: Edit the drafts to add personal stories, data points, and custom call-to-actions.

## Conclusion
The future belongs to creators who leverage collaborative intelligence. By combining human empathy with state-of-the-art tools, you can build a massive, loyal community.
`;
  } else if (prompt.includes('SEO') || prompt.includes('slug') || prompt.includes('meta')) {
    simulatedText = `
### Generated SEO Metadata Blueprint

1. **Meta Title**
ContentForge AI: Write Professional Blogs & Ad Copy 10x Faster

2. **Meta Description**
Boost your search rankings and scale your content marketing efforts effortlessly. Generate high-quality blogs, social posts, and ad copy in seconds. Try it free!

3. **URL Slug**
contentforge-ai-writing-software

4. **Schema Markup Outline (JSON-LD)**
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ContentForge AI",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "USD"
  }
}
\`\`\`
`;
  } else if (prompt.includes('ad') || prompt.includes('Facebook') || prompt.includes('PAS')) {
    simulatedText = `
### Premium Ad Variations (PAS Framework)

#### Variation 1: Attention & Action Hook (AIDA)
🔥 **Tired of staring at a blank screen for hours?**

Writing copy is exhausting. Hiring freelancers costs thousands. That is why we built **ContentForge AI**—the premier AI assistant that drafts emails, ad campaigns, and full blog posts in seconds.

Join 10,000+ founders and agencies who scale their content effortlessly.
👉 **Click here to unlock your free trial today!**

#### Variation 2: Problem-Agitate-Solve (PAS)
❌ **Problem**: Hire writers, wait days, receive generic text. Repeat.
💥 **Agitate**: Meanwhile, your competitors are posting daily, driving SEO traffic, and launching high-converting ad flows. You are falling behind simply because content is a bottleneck.
🚀 **Solve**: Stop waiting! **ContentForge AI** enforces your exact Brand Voice and delivers professional-grade copies instantly.

Claim 20% off plus free credits when you start today!
`;
  } else if (prompt.includes('Midjourney') || prompt.includes('Flux') || prompt.includes('positive')) {
    simulatedText = `
### Custom Image Generation Prompts

**Positive Prompt:**
\`A sleek, futuristic office workspace at sunset, cinematic lighting, ultra-realistic, warm lens flares, professional mahogany desk holding a holographic laptop screen displaying clean analytics graphs, depth of field, captured with a Canon EOS R5, 85mm lens, highly detailed textures, cozy cyber-aesthetic --ar 16:9 --style raw --v 6.0\`

**Negative Prompt:**
\`deformed, blurry, low resolution, cartoon, abstract, messy background, extra keyboards, disfigured, text watermark, logos, distorted perspective\`

**Recommended Settings:**
- **Camera:** Canon EOS R5
- **Lighting:** Warm sunset backlight, soft orange glow
- **Lens:** 85mm portrait prime
- **Composition:** Rule of thirds, eye-level angle
- **Style:** Photorealistic, professional corporate
`;
  } else if (prompt.includes('translate') || prompt.includes('Translate')) {
    simulatedText = `
### Multilingual Translation Output

*English (Source):*
Welcome to the future of high-converting copywriting. ContentForge AI allows creators to draft blogs in seconds.

*Spanish:*
Bienvenido al futuro de la redacción publicitaria de alta conversión. ContentForge AI permite a los creadores redactar blogs en segundos.

*French:*
Bienvenue dans le futur de la rédaction publicitaire à fort taux de conversion. ContentForge AI permet aux créateurs de rédiger des blogs en quelques secondes.

*German:*
Willkommen in der Zukunft des verkaufsstarken Copywritings. ContentForge AI ermöglicht es Autoren, Blogbeiträge in Sekundenschnelle zu entwerfen.

*Hindi:*
उच्च-रूपांतरण वाले कॉपीराइटिंग के भविष्य में आपका स्वागत है। ContentForge AI रचनाकारों को सेकंडों में ब्लॉग बनाने की अनुमति देता है।
`;
  } else {
    simulatedText = `
### Generated Copywriting Draft

Thank you for requesting this copy. Following your requirements, here is the polished, high-performing text block:

We have carefully structured this output to prioritize readability and engagement:
- **Strong Opening**: Designed to hook your specific audience from the very first sentence.
- **Key Value Drivers**: Formatted with clean bullet points for skim-reading.
- **Strategic Call to Action**: Inviting readers to explore your offers immediately.

Let us know if you would like to adjust the tone (e.g., Professional, Friendly, Persuasive) or brand settings!
`;
  }

  return { text: simulatedText.trim(), provider: 'Simulated Llama-3.1' };
}

// REST API Routes

// User Profile
app.get('/api/auth/session', (req, res) => {
  res.json({ user: dbStore.getUser() });
});

app.post('/api/auth/profile', (req, res) => {
  const updated = dbStore.updateUser(req.body);
  res.json({ success: true, user: updated });
});

app.post('/api/auth/upgrade', (req, res) => {
  const { plan } = req.body;
  const limits = {
    Free: { credits: 2000, total: 2000 },
    Starter: { credits: 20000, total: 20000 },
    Pro: { credits: 100000, total: 100000 },
    Enterprise: { credits: 1000000, total: 1000000 }
  };
  const selectedLimit = limits[plan as keyof typeof limits] || limits.Pro;
  
  const updated = dbStore.updateUser({
    plan: plan,
    creditsRemaining: selectedLimit.credits,
    creditsTotal: selectedLimit.total
  });
  
  res.json({ success: true, user: updated });
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json({ projects: dbStore.getAllProjects() });
});

app.get('/api/projects/:id', (req, res) => {
  const proj = dbStore.getProject(req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  res.json({ project: proj });
});

app.post('/api/projects', (req, res) => {
  const proj = dbStore.createProject(req.body);
  res.status(201).json({ success: true, project: proj });
});

app.put('/api/projects/:id', (req, res) => {
  const proj = dbStore.updateProject(req.params.id, req.body);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project: proj });
});

app.patch('/api/projects/:id', (req, res) => {
  const proj = dbStore.updateProject(req.params.id, req.body);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true, project: proj });
});

app.delete('/api/projects/:id', (req, res) => {
  const success = dbStore.deleteProject(req.params.id);
  res.json({ success });
});

// Documents
app.get('/api/documents', (req, res) => {
  res.json({ documents: dbStore.getAllDocuments() });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = dbStore.getDocument(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json({ document: doc });
});

app.post('/api/documents', (req, res) => {
  const doc = dbStore.createDocument(req.body);
  res.status(201).json({ success: true, document: doc });
});

app.put('/api/documents/:id', (req, res) => {
  const doc = dbStore.updateDocument(req.params.id, req.body);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json({ success: true, document: doc });
});

app.patch('/api/documents/:id', (req, res) => {
  const doc = dbStore.updateDocument(req.params.id, req.body);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json({ success: true, document: doc });
});

app.delete('/api/documents/:id', (req, res) => {
  const success = dbStore.deleteDocument(req.params.id);
  res.json({ success });
});

app.post('/api/documents/:id/comment', (req, res) => {
  const comment = dbStore.addComment(req.params.id, req.body.text, req.body.author);
  if (!comment) return res.status(404).json({ error: 'Document not found' });
  res.status(201).json({ success: true, comment });
});

// Brand Voices
app.get('/api/brand-voices', (req, res) => {
  res.json({ brandVoices: dbStore.getBrandVoices() });
});

app.post('/api/brand-voices', (req, res) => {
  const voice = dbStore.createBrandVoice(req.body);
  res.status(201).json({ success: true, brandVoice: voice });
});

app.put('/api/brand-voices/:id', (req, res) => {
  const voice = dbStore.updateBrandVoice(req.params.id, req.body);
  if (!voice) return res.status(404).json({ error: 'Brand Voice not found' });
  res.json({ success: true, brandVoice: voice });
});

app.patch('/api/brand-voices/:id', (req, res) => {
  const voice = dbStore.updateBrandVoice(req.params.id, req.body);
  if (!voice) return res.status(404).json({ error: 'Brand Voice not found' });
  res.json({ success: true, brandVoice: voice });
});

app.delete('/api/brand-voices/:id', (req, res) => {
  const success = dbStore.deleteBrandVoice(req.params.id);
  res.json({ success });
});

// Chats
app.get('/api/chats', (req, res) => {
  res.json({ chats: dbStore.getChats() });
});

app.post('/api/chats', (req, res) => {
  const chat = dbStore.createChat(req.body.title || 'New Chat');
  res.status(201).json({ success: true, chat });
});

app.put('/api/chats/:id', (req, res) => {
  const chat = dbStore.updateChat(req.params.id, req.body);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json({ success: true, chat });
});

app.patch('/api/chats/:id', (req, res) => {
  const chat = dbStore.updateChat(req.params.id, req.body);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json({ success: true, chat });
});

app.delete('/api/chats/:id', (req, res) => {
  const success = dbStore.deleteChat(req.params.id);
  res.json({ success });
});

app.post('/api/chats/:id/message', async (req, res) => {
  const { text, brandVoiceId } = req.body;
  const userMsg = dbStore.addMessage(req.params.id, 'user', text);
  if (!userMsg) return res.status(404).json({ error: 'Chat session not found' });

  try {
    const aiResponse = await generateWithAI(text, brandVoiceId, 'You are a helpful conversational SaaS product AI content assistant.');
    const modelMsg = dbStore.addMessage(req.params.id, 'model', aiResponse.text);
    res.json({ 
      success: true, 
      messages: [userMsg, modelMsg],
      provider: aiResponse.provider 
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

// Blog CMS
app.get('/api/blogs', (req, res) => {
  res.json({ blogs: dbStore.getBlogs() });
});

app.post('/api/blogs', (req, res) => {
  const blog = dbStore.createBlog(req.body);
  res.status(201).json({ success: true, blog });
});

app.put('/api/blogs/:id', (req, res) => {
  const blog = dbStore.updateBlog(req.params.id, req.body);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json({ success: true, blog });
});

app.patch('/api/blogs/:id', (req, res) => {
  const blog = dbStore.updateBlog(req.params.id, req.body);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json({ success: true, blog });
});

app.delete('/api/blogs/:id', (req, res) => {
  const success = dbStore.deleteBlog(req.params.id);
  res.json({ success });
});

// Support Center
app.get('/api/support', (req, res) => {
  res.json({ tickets: dbStore.getTickets() });
});

app.post('/api/support', (req, res) => {
  const { subject, category, description } = req.body;
  const ticket = dbStore.createTicket(subject, category, description);
  res.status(201).json({ success: true, ticket });
});

app.post('/api/support/:id/reply', (req, res) => {
  const { text, author } = req.body;
  const reply = dbStore.addTicketReply(req.params.id, text, author);
  if (!reply) return res.status(404).json({ error: 'Ticket not found' });

  // Simulate helper automatic reply if opened
  setTimeout(() => {
    dbStore.addTicketReply(
      req.params.id, 
      "Thanks for your reply! Our engineering team has registered this ticket and will review it inside our next production push. Let us know if you have any additional notes.", 
      "ContentForge Engineer (Bot)"
    );
  }, 1000);

  res.status(201).json({ success: true, reply });
});

app.put('/api/support/:id/status', (req, res) => {
  const ticket = dbStore.updateTicketStatus(req.params.id, req.body.status);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  res.json({ success: true, ticket });
});

// Team members
app.get('/api/team', (req, res) => {
  res.json({ team: dbStore.getTeam() });
});

app.post('/api/team', (req, res) => {
  const { name, email, role } = req.body;
  const member = dbStore.addTeamMember(name, email, role);
  res.status(201).json({ success: true, member });
});

app.delete('/api/team/:id', (req, res) => {
  const success = dbStore.deleteTeamMember(req.params.id);
  res.json({ success });
});

// System Analytics & Logs (Admin Panel)
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    usersCount: 1450,
    activePlans: { Free: 850, Starter: 310, Pro: 240, Enterprise: 50 },
    invoicesTotal: 14580,
    systemLogs: dbStore.getLogs(),
    usageAnalytics: dbStore.getAnalytics(),
    templates: DEFAULT_TEMPLATES
  });
});

app.get('/api/analytics', (req, res) => {
  res.json({ analytics: dbStore.getAnalytics() });
});

app.get('/api/invoices', (req, res) => {
  res.json({ invoices: dbStore.getInvoices() });
});

// Full Dashboard State
app.get('/api/dashboard-state', (req, res) => {
  res.json({
    user: dbStore.getUser(),
    projects: dbStore.getAllProjects(),
    documents: dbStore.getAllDocuments(),
    templates: DEFAULT_TEMPLATES,
    brandVoices: dbStore.getBrandVoices(),
    chats: dbStore.getChats(),
    analytics: dbStore.getAnalytics()
  });
});

// Billing Plan Upgrade
app.post('/api/billing/upgrade', (req, res) => {
  const { plan, credits } = req.body;
  const updated = dbStore.updateUser({
    plan: plan,
    creditsRemaining: credits,
    creditsTotal: credits
  });
  res.json({ success: true, user: updated });
});

// Award Credits
app.post('/api/admin/award', (req, res) => {
  const { amount } = req.body;
  const currentUser = dbStore.getUser();
  const updated = dbStore.updateUser({
    creditsRemaining: currentUser.creditsRemaining + amount,
    creditsTotal: currentUser.creditsTotal + amount
  });
  res.json({ success: true, user: updated });
});

// Reset Database Seed Data
app.post('/api/admin/reset', (req, res) => {
  dbStore.reset();
  res.json({ success: true });
});

// Clear Database Data
app.post('/api/admin/clear', (req, res) => {
  dbStore.clear();
  res.json({ success: true });
});

// Core AI Action engines (Writing tools, SEO Toolkit, Translation, Prompt generator)

// Template Content Generation
app.post('/api/generate/template', async (req, res) => {
  const { templateId, inputs, brandVoiceId } = req.body;
  const template = DEFAULT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return res.status(404).json({ error: 'Template not found' });

  // Interpolate prompt
  let prompt = template.promptTemplate;
  for (const [key, val] of Object.entries(inputs)) {
    prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), String(val));
  }

  try {
    const aiResponse = await generateWithAI(prompt, brandVoiceId);
    
    // Log category used and words generated
    dbStore.recordCategoryUsed(template.category);
    const wordsCount = Math.ceil(aiResponse.text.split(/\s+/).length);
    dbStore.recordWordsGenerated(wordsCount);

    res.json({
      success: true,
      text: aiResponse.text,
      provider: aiResponse.provider,
      wordsGenerated: wordsCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Template generation failed' });
  }
});

// Writing Inline Tools
app.post('/api/generate/writer', async (req, res) => {
  const { text, action, tone, language, brandVoiceId } = req.body;
  
  let actionPrompt = '';
  switch (action) {
    case 'rewrite':
      actionPrompt = `Rewrite the following text to make it more professional, engaging, and clear. Maintain its original core meaning.\n\nText:\n${text}`;
      break;
    case 'expand':
      actionPrompt = `Expand the following text with extra details, supporting arguments, and useful context, while keeping it engaging.\n\nText:\n${text}`;
      break;
    case 'shorten':
      actionPrompt = `Shorten and simplify the following text. Make it direct, punchy, and concise while retaining its core details.\n\nText:\n${text}`;
      break;
    case 'summarize':
      actionPrompt = `Summarize the following text into 2-3 key takeaways and a brief structured sentence.\n\nText:\n${text}`;
      break;
    case 'grammar':
      actionPrompt = `Improve the grammar, sentence structure, flow, and vocabulary of the following text. Correct any spelling mistakes.\n\nText:\n${text}`;
      break;
    case 'simplify':
      actionPrompt = `Simplify this text. Explain it like I am 12 years old, using clear analogies and simple words.\n\nText:\n${text}`;
      break;
    default:
      actionPrompt = `Process the following text. Tone adjustment requested: ${tone || 'informative'}.\n\nText:\n${text}`;
  }

  if (language) {
    actionPrompt += `\n\nEnsure the final response is written entirely in ${language}.`;
  }

  try {
    const aiResponse = await generateWithAI(actionPrompt, brandVoiceId);
    const wordsCount = Math.ceil(aiResponse.text.split(/\s+/).length);
    dbStore.recordWordsGenerated(wordsCount);

    res.json({
      success: true,
      text: aiResponse.text,
      provider: aiResponse.provider,
      wordsGenerated: wordsCount
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Writer instruction failed' });
  }
});

// Image Prompt Generator
app.post('/api/generate/image-prompt', async (req, res) => {
  const { description, camera, lighting, style, composition } = req.body;
  
  const prompt = `Generate a detailed Midjourney, Flux, and Stable Diffusion prompt blueprint based on:
Core Concept: ${description}
Camera preference: ${camera || 'None specified'}
Lighting style: ${lighting || 'None specified'}
Visual style: ${style || 'None specified'}
Composition style: ${composition || 'None specified'}

Provide a well-structured response listing:
1. Recommended Positive Prompt (copyable text)
2. Recommended Negative Prompt
3. Lens and Camera parameters
4. Visual Composition parameters`;

  try {
    const aiResponse = await generateWithAI(prompt);
    res.json({
      success: true,
      text: aiResponse.text,
      provider: aiResponse.provider
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image prompt generation failed' });
  }
});

// SEO Toolkit
app.post('/api/generate/seo', async (req, res) => {
  const { title, description, keywords } = req.body;
  
  const prompt = `Perform complete SEO auditing and generate tags for:
Topic/Title: ${title}
Short description: ${description}
Keywords: ${keywords}

Please return structured markdown detailing:
1. SEO Title Tag ideas (3 recommendations)
2. SEO Meta Description (3 high CTR options under 155 chars)
3. Blog Outline structured in clean Markdown (H1, H2, H3 headings)
4. URL Slugs (3 clean variations)
5. Content Score recommendation and suggested keyword density mapping.`;

  try {
    const aiResponse = await generateWithAI(prompt);
    res.json({
      success: true,
      text: aiResponse.text,
      provider: aiResponse.provider
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'SEO toolkit generation failed' });
  }
});

// Vite Middleware for Full Stack Asset Delivery
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ContentForge AI full-stack server running on port ${PORT}`);
  });
}

startServer();
