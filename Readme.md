AI Interview Coach & Job Resume AnalyzerA comprehensive, AI-powered platform designed to bridge the gap between candidate resumes and target job descriptions. This application utilizes a dual-AI architecture to generate highly personalized interview preparation reports, skill gap analyses, and ATS-optimized PDF resumes at lightning speed.📖 Project OverviewThis project serves as a full-stack SaaS application, offering candidates a data-driven approach to interview preparation. By leveraging the ultra-fast Groq API for deep text analysis and the Google Gemini API for structural document generation, the platform provides targeted technical and behavioral questions, actionable roadmaps, and instant resume tailoring. A built-in subscription model controls usage tiers, seamlessly handling payments and access control.✨ Core FeaturesIntelligent Resume Parsing: Extracts and analyzes candidate data directly from uploaded PDF resumes.Contextual AI Analysis (Powered by Groq): Cross-references the resume, self-description, and target job role to calculate a precise "Match Score" with high-speed inference.Dynamic Interview Generation: Creates tailored technical and behavioral questions complete with model answers.Actionable Preparation Roadmap: Generates a day-by-day study plan targeting identified skill gaps.ATS-Optimized Resume Builder (Powered by Gemini): Compiles an HTML resume tailored to the specific job and converts it to a downloadable PDF.Tiered Subscription Model: Implements a freemium architecture (Free/PRO tiers) with automated usage tracking and report limits.Secure Payment Gateway: Integrates Razorpay for seamless, secure PRO plan upgrades and subscription management.Robust Authentication: Secures user data and report history using JSON Web Tokens (JWT) and encrypted passwords.🛠 Tech StackDomainTechnologies UsedFrontendReact.js, React Router DOM, Axios, SCSSBackendNode.js, Express.jsDatabase & ORMPostgreSQL (Prisma ORM) & MongoDB (Mongoose)AI IntegrationGroq API (Analytics & Scoring), Google Gemini API (Resume Generation)PDF ProcessingPDF-Parse (Extraction), Puppeteer (Generation)AuthenticationJWT, bcryptPaymentsRazorpay API🔄 System WorkflowAuthentication: User registers or logs in securely.Data Input: User uploads a current resume (PDF) and inputs the target Company Name, Job Description, and a brief Self-Description.Authorization Check: The system verifies the user's subscription tier.AI Analytical Processing: The backend extracts text via pdf-parse and sends the compiled context to the Groq API.Report Generation: Groq returns a structured JSON object containing the Match Score, Questions, Skill Gaps, and Roadmap.Database Storage: The report is saved, and the user's generated report counter is incremented.Resume Export: For PRO users, the system uses the Google Gemini API to render a new, highly targeted ATS-friendly HTML resume, which is then exported as a downloadable PDF.Monetization: Users can upgrade to PRO at any time via the Razorpay checkout flow, instantly unlocking unlimited reports and PDF generation.📂 Project StructureThe frontend is organized using a feature-based architecture, isolating domains like AI, Authentication, and Subscriptions into their own dedicated modules.Plaintext├── Frontend
│   ├── public
│   ├── src
│   │   ├── features
│   │   │   ├── ai (hooks, pages, services, styles, interview.context.jsx)
│   │   │   ├── auth (components, hooks, pages, services, auth.context.jsx)
│   │   │   └── subscription (hooks, pages, services, styles, subscription.context.jsx)
│   │   ├── styles
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
The backend utilizes a robust MVC-style architecture, integrating both Prisma and Mongoose configurations, and segregating AI services for Groq and Gemini.Plaintext├── Backend
│   ├── prisma
│   │   └── schema.prisma
│   ├── src
│   │   ├── config (database.js, prisma.js, razorpay.js)
│   │   ├── controllers (ai.controller.js, auth.controller.js, subscription.controller.js)
│   │   ├── middlewares (auth, file, report limit, requireProPlan)
│   │   ├── models (blacklist, interviewReport, user)
│   │   ├── routes (ai.routes.js, auth.routes.js, subscription.routes.js)
│   │   └── services (ai.service.js, ai.service2.js)
│   ├── .env
│   └── prisma.config.ts