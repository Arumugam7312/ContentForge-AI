import { Template } from './types';

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'blog-post-writer',
    name: 'Blog Post Outline & Article',
    description: 'Generate a comprehensive blog post outline and structured article based on keywords and target audience.',
    category: 'Blog',
    icon: 'BookOpen',
    inputFields: [
      { name: 'topic', label: 'Blog Topic / Title', type: 'text', placeholder: 'e.g., The Future of Remote Work in 2026', required: true },
      { name: 'keywords', label: 'SEO Keywords (comma separated)', type: 'text', placeholder: 'e.g., remote work trends, virtual collaboration, hybrid office', required: true },
      { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., HR managers, startup founders, tech employees', required: true },
      { name: 'tone', label: 'Writing Tone', type: 'select', placeholder: 'Select tone', options: ['Professional', 'Informative', 'Casual', 'Conversational', 'Empathetic', 'Thoughtful'], required: true },
      { name: 'length', label: 'Target Length (Words)', type: 'number', placeholder: 'e.g., 800', required: false }
    ],
    promptTemplate: `Write a high-quality blog post about "{topic}". 
SEO Keywords to target: {keywords}.
Target Audience: {audience}.
Tone of Voice: {tone}.
Target Length: {length} words.

Please structure the response with:
1. An eye-catching, SEO-optimized Title.
2. A compelling introduction that grabs attention.
3. Logical headings (H2, H3) and detailed, high-value paragraphs.
4. Actionable bullet points or lists for readability.
5. A strong conclusion with a clear call-to-action.`
  },
  {
    id: 'seo-meta-generator',
    name: 'SEO Meta Tags Generator',
    description: 'Generate highly optimized Meta Titles, Meta Descriptions, slugs, and structured schema suggestions.',
    category: 'SEO',
    icon: 'Search',
    inputFields: [
      { name: 'pageTitle', label: 'Page / Product Name', type: 'text', placeholder: 'e.g., ContentForge AI Copywriting Software', required: true },
      { name: 'description', label: 'Brief Page Description', type: 'textarea', placeholder: 'e.g., An AI-powered SaaS that helps marketers write blogs and ads 10x faster.', required: true },
      { name: 'keywords', label: 'Primary Target Keywords', type: 'text', placeholder: 'e.g., AI copywriter, SaaS content generator, blog writing tool', required: true }
    ],
    promptTemplate: `Generate optimized SEO metadata for a webpage:
Page/Product: {pageTitle}
Description: {description}
Target Keywords: {keywords}

Please provide:
1. **SEO Meta Title**: (Under 60 characters, keyword-rich, compelling)
2. **SEO Meta Description**: (Under 160 characters, with a clear call-to-action)
3. **SEO-Friendly URL Slug**: (Clean, lowercase, hyphen-separated)
4. **Structured Data Schema Suggestions**: (Which schema type to use e.g. Product, SoftwareApplication, Article, and key properties)`
  },
  {
    id: 'facebook-instagram-ads',
    name: 'Facebook & Instagram Ad Copy',
    description: 'Write high-converting social media ad copy following successful direct-response marketing frameworks.',
    category: 'Social Media',
    icon: 'Facebook',
    inputFields: [
      { name: 'product', label: 'Product or Service Name', type: 'text', placeholder: 'e.g., EcoGlow Solar Lights', required: true },
      { name: 'offer', label: 'The Core Offer / Discount', type: 'text', placeholder: 'e.g., Save 20% + Free Shipping on your first order', required: true },
      { name: 'painPoints', label: 'Customer Pain Points / Desires', type: 'textarea', placeholder: 'e.g., High electric bills, dark yard, bulky ugly lights', required: true },
      { name: 'framework', label: 'Marketing Framework', type: 'select', placeholder: 'Select framework', options: ['AIDA (Attention, Interest, Desire, Action)', 'PAS (Problem, Agitate, Solve)', 'BAB (Before, After, Bridge)'], required: true }
    ],
    promptTemplate: `Create high-converting Facebook and Instagram Ad copy using the {framework} framework.
Product/Service: {product}
Core Offer: {offer}
Customer Pain Points / Desires: {painPoints}

Provide 3 different variations of the copy:
- **Variation 1: Hook-heavy** (Focuses on an intense attention-grabbing first line)
- **Variation 2: Story-driven** (Focuses on the customer transformation)
- **Variation 3: Short & Punchy** (Direct benefit + strong CTA)

Ensure each variation includes engaging emojis and a clear Call To Action (CTA).`
  },
  {
    id: 'linkedin-thought-leadership',
    name: 'LinkedIn Thought Leadership Post',
    description: 'Draft highly engaging, professional LinkedIn posts that position you as an expert and drive organic reach.',
    category: 'Social Media',
    icon: 'Linkedin',
    inputFields: [
      { name: 'topic', label: 'Topic or Lesson Learned', type: 'textarea', placeholder: 'e.g., Why most startups fail in their first year is poor product-market fit, not funding.', required: true },
      { name: 'takeaway', label: 'Core Takeaway / Advice', type: 'text', placeholder: 'e.g., Validate your idea with 50 customer interviews before writing any code.', required: true },
      { name: 'tone', label: 'Professional Tone', type: 'select', placeholder: 'Select tone', options: ['Inspiring', 'Analytical', 'Authentic/Vulnerable', 'Educational', 'Bold/Contrarian'], required: true }
    ],
    promptTemplate: `Write an engaging LinkedIn thought leadership post about:
Topic: {topic}
Core Takeaway: {takeaway}
Tone: {tone}

Please format the post with:
1. A powerful hook (first 1-2 lines) to get users to click "see more".
2. Spacious formatting (short paragraphs of 1-2 sentences).
3. A personal story, lesson, or analytical breakdown.
4. Bullets or numbered lists to make the tips easily digestible.
5. An engaging question at the end to invite discussion and comments.
6. Relevant hashtags (max 3-5).`
  },
  {
    id: 'cold-email-sequence',
    name: 'Cold Outreach Email',
    description: 'Generate highly personalized, high-response B2B cold sales or partnership emails.',
    category: 'Email',
    icon: 'Mail',
    inputFields: [
      { name: 'sender', label: 'Your Name & Company', type: 'text', placeholder: 'e.g., Sarah from DesignStudio', required: true },
      { name: 'recipientRole', label: 'Recipient Role / Title', type: 'text', placeholder: 'e.g., Marketing Director at E-commerce brands', required: true },
      { name: 'valueProp', label: 'Your Value Proposition', type: 'textarea', placeholder: 'e.g., We design high-converting landing pages that increase conversion rates by 25% on average.', required: true },
      { name: 'cta', label: 'Call To Action (CTA)', type: 'text', placeholder: 'e.g., Free 15-minute CRO teardown of your current landing page', required: true }
    ],
    promptTemplate: `Write a highly personalized, friendly, and non-spammy cold outreach email.
Sender: {sender}
Recipient: {recipientRole}
Core Value Proposition: {valueProp}
Call to Action (CTA): {cta}

Please generate:
1. **Subject Line Ideas**: (3 options, short, casual, high open-rate, e.g., "quick question about {recipientRole}")
2. **Email Body**:
   - A personalized opener (referencing their busy role).
   - A soft, highly relevant pitch highlighting the core benefit.
   - Social proof or a metric proving credibility.
   - The low-friction Call to Action (CTA).
   - A clean professional signature.`
  },
  {
    id: 'product-description-shopify',
    name: 'Shopify / Amazon Product Description',
    description: 'Write an optimized, persuasive product description featuring benefits, tech specs, and target audience alignment.',
    category: 'Marketing',
    icon: 'ShoppingBag',
    inputFields: [
      { name: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g., Aura Smart Sleep Mask', required: true },
      { name: 'features', label: 'Key Features (bullet points)', type: 'textarea', placeholder: 'e.g., 100% light blocking, built-in Bluetooth speakers, contoured eye space, washable silk', required: true },
      { name: 'audience', label: 'Target Buyer Persona', type: 'text', placeholder: 'e.g., Insomniacs, frequent travelers, night-shift workers', required: true }
    ],
    promptTemplate: `Write an enticing, benefits-driven e-commerce product description for:
Product: {productName}
Key Features: {features}
Target Buyer Persona: {audience}

Generate a structured description including:
1. **Catchy Product Tagline**: (One sentence hook)
2. **The "Why You Need This" Story**: (Compelling benefits-driven introduction of 2 paragraphs)
3. **Key Benefits**: (A bulleted list connecting features to emotional benefits)
4. **Technical Specifications**: (A clean formatted section)
5. **Call To Action**: (Encourage purchase or adding to cart)`
  },
  {
    id: 'business-pitch-deck',
    name: 'Startup Pitch Generator',
    description: 'Generate a structured startup pitch deck outline including problem, solution, market size, and model.',
    category: 'Business',
    icon: 'Briefcase',
    inputFields: [
      { name: 'startupName', label: 'Startup Name', type: 'text', placeholder: 'e.g., FoodLoop', required: true },
      { name: 'elevatorPitch', label: 'Elevator Pitch (one sentence)', type: 'textarea', placeholder: 'e.g., We connect local restaurants with excess food to consumers at a 70% discount to eliminate food waste.', required: true },
      { name: 'targetMarket', label: 'Target Market & Size', type: 'text', placeholder: 'e.g., Eco-conscious urban consumers, budget students', required: true },
      { name: 'businessModel', label: 'Revenue / Business Model', type: 'text', placeholder: 'e.g., 15% transaction fee on every food bag sold', required: true }
    ],
    promptTemplate: `Generate a compelling startup pitch deck outline and narrative script for:
Startup Name: {startupName}
Elevator Pitch: {elevatorPitch}
Target Market: {targetMarket}
Business Model: {businessModel}

Please provide a slide-by-slide outline (10 slides):
- Slide 1: Title & Vision
- Slide 2: The Problem (Emotional, clear)
- Slide 3: The Solution (How {startupName} solves it)
- Slide 4: Market Opportunity (TAM, SAM, SOM based on {targetMarket})
- Slide 5: Product / Technology (How it works simply)
- Slide 6: Business Model (How we make money: {businessModel})
- Slide 7: Go-To-Market Strategy
- Slide 8: Competitive Analysis
- Slide 9: The Ask / Funding Requirements
- Slide 10: Team & Contact

Include a 2-3 sentence talking track script for each slide to guide the founder during the pitch.`
  },
  {
    id: 'landing-page-copy',
    name: 'Landing Page Copywriter',
    description: 'Generate landing page copy including headlines, subheadings, feature sections, and testimonials.',
    category: 'Marketing',
    icon: 'Layout',
    inputFields: [
      { name: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'e.g., ContentForge AI', required: true },
      { name: 'service', label: 'What your product does', type: 'textarea', placeholder: 'e.g., An enterprise-grade AI platform that writes blog articles, ad copy, and SEO meta tags in seconds.', required: true },
      { name: 'benefits', label: '3 Main Core Benefits', type: 'textarea', placeholder: 'e.g., Save 90% writing time, rank higher on Google, keep consistent brand voice', required: true }
    ],
    promptTemplate: `Write high-converting, modern SaaS landing page copy for:
Brand Name: {brandName}
Product/Service: {service}
Core Benefits: {benefits}

Structure the landing page with the following sections:
1. **Hero Section**:
   - A bold, punchy H1 Headline (focused on the ultimate transformation).
   - An engaging H2 Subheadline (elaborating on what it is).
   - Primary Call To Action (CTA) button text.
2. **Social Proof Section**: (Mock logos & placement description)
3. **Core Benefits Grid**: (3 sections, each with a Title, Subtitle, and 1 paragraph explaining how you achieve the benefit)
4. **Features Showcase**: (A visual-focused description of the interface features)
5. **Pricing CTA Block**: (Encourage starting a free trial)`
  }
];
