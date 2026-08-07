export const profile = {
  name: "Md. Mahir Musleh",
  displayName: "Mahir Musleh",
  role: "Senior Solution Architect",
  tagline:
    "I architect and build scalable software, from backend systems and APIs to AI-driven platforms, turning complex requirements into reliable products.",
  location: "Dhaka, Bangladesh",
  email: "arc.mahir@gmail.com",
  phone: "+8801794770308",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/mahir009" },
    { label: "Email", href: "mailto:arc.mahir@gmail.com" },
    { label: "GitHub", href: "https://github.com/acnologiaslayer" },
  ],
};

export const stats = [
  { value: "12+", label: "Years building" },
  { value: "12", label: "Companies & teams" },
  { value: "8", label: "Teams led" },
  { value: "20+", label: "Technologies" },
];

export type CaseStudySection = { heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  accent: string;
  featured?: boolean;
  // Case study detail
  client?: string;
  role?: string;
  timeline?: string;
  summary: string;
  challenge: string;
  approach: string[];
  outcomes: string[];
  sections?: CaseStudySection[];
};

export const projects: Project[] = [
  {
    slug: "ai-data-interpretation-platform",
    title: "AI Data-Interpretation Platform",
    category: "AI / Machine Learning",
    year: "2024–26",
    description:
      "Led a team designing and deploying advanced AI models for improved data interpretation, training and fine-tuning ML pipelines for accuracy and reliability at BoomersHub.",
    tags: ["Python", "LangChain", "LLMs", "Automation"],
    accent: "#6366F1",
    featured: true,
    client: "BoomersHub LLC",
    role: "Technical Lead",
    timeline: "2024 – 2026",
    summary:
      "A production AI platform that turns messy operational data into reliable, interpretable insight, backed by trained and fine-tuned ML models and intelligent automation.",
    challenge:
      "The team needed to move beyond brittle rule-based reporting to models that could interpret large volumes of operational data accurately and explain their reasoning, without sacrificing reliability in production.",
    approach: [
      "Led the design and implementation of advanced AI models focused on improved data interpretation.",
      "Built retrieval and orchestration flows with LangChain to ground model output in real data.",
      "Trained and fine-tuned machine-learning models iteratively to raise accuracy and reliability.",
      "Developed intelligent automation scripts to streamline operational workflows around the models.",
    ],
    outcomes: [
      "Shipped production AI models that improved data interpretation quality for the business.",
      "Increased model accuracy and reliability through a disciplined fine-tuning loop.",
      "Reduced manual operational effort via automation, freeing the team for higher-value work.",
    ],
  },
  {
    slug: "enterprise-platform-architecture",
    title: "Enterprise Platform Architecture",
    category: "Solution Architecture",
    year: "2021-2023",
    description:
      "Architected strategic enterprise and internal products at ADN DigiNet, leading development teams through readiness, release cycles and deployment pipelines.",
    tags: ["NestJS", "PostgreSQL", "Docker", "AWS"],
    accent: "#A855F7",
    featured: true,
    client: "ADN DigiNet Limited",
    role: "Software Architect",
    timeline: "2021 – 2023",
    summary:
      "End-to-end architecture for the company's strategic enterprise and internal products, from requirement analysis through release and deployment.",
    challenge:
      "Multiple enterprise and internal products needed a coherent, scalable architecture and a repeatable path from requirement to production, while several development teams shipped in parallel.",
    approach: [
      "Ran requirement collection and analysis, then designed the architecture for each strategic product.",
      "Led internal and enterprise product development teams through readiness and delivery.",
      "Planned product release and update cycles to keep parallel workstreams aligned.",
      "Standardised deployment pipelines for consistent, repeatable releases.",
    ],
    outcomes: [
      "Delivered strategic products on a scalable, documented architecture.",
      "Enabled multiple teams to ship in parallel without stepping on each other.",
      "Established predictable release and update cycles across the product portfolio.",
    ],
  },
  {
    slug: "system-integration-interoperability",
    title: "System Integration & Interoperability",
    category: "Backend Engineering",
    year: "2025",
    description:
      "Integrated multiple systems into seamless interoperability at Selise Digital Platforms, enforcing coding standards and optimising cloud resource usage.",
    tags: ["TypeScript", "Express.js", "CI/CD", "GCP"],
    accent: "#22D3EE",
    client: "Selise Digital Platforms",
    role: "Senior Software Architect",
    timeline: "2025",
    summary:
      "Connected disparate systems into a seamlessly interoperable whole, with quality enforced through reviews and standards, and cloud resource usage tuned for cost.",
    challenge:
      "Several independent systems needed to talk to each other reliably, while maintaining code quality and keeping cloud costs under control across the platform.",
    approach: [
      "Integrated multiple systems to achieve seamless interoperability across platforms.",
      "Enforced strict adherence to coding standards through regular code reviews.",
      "Optimised cloud resource usage while deploying and operating the integrations.",
      "Documented the architectural designs to support knowledge transfer across the team.",
    ],
    outcomes: [
      "Achieved reliable interoperability between previously siloed systems.",
      "Raised and sustained code quality through consistent review practices.",
      "Lowered cloud resource waste through deliberate optimisation.",
    ],
  },
  {
    slug: "e-learning-backend-apis",
    title: "E-learning Backend & APIs",
    category: "API Development",
    year: "2021",
    description:
      "Designed and optimised a back-end application and API layer for an e-learning platform, enabling clean interaction with front-end clients.",
    tags: ["Node.js", "MongoDB", "REST APIs"],
    accent: "#34D399",
    client: "RedOrange Media and Communications",
    role: "Database & API Development Expert",
    timeline: "2021",
    summary:
      "A clean, well-structured back-end and API layer for an e-learning platform, designed for front-end clients to consume with minimal friction.",
    challenge:
      "The e-learning platform needed a dependable back-end and a clear API surface that front-end applications could integrate against quickly and safely.",
    approach: [
      "Designed and planned the back-end application for the e-learning platform.",
      "Implemented and optimised the application for performance and maintainability.",
      "Built APIs that let the front-end applications interact cleanly with the back-end.",
    ],
    outcomes: [
      "Delivered a stable back-end foundation for the e-learning product.",
      "Provided a clear API contract that accelerated front-end integration.",
      "Optimised the implementation for smoother day-to-day operation.",
    ],
  },
];

export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  featured?: boolean;
};

// Full career history from CV (most recent first)
export const experience: Experience[] = [
  {
    role: "Senior Solution Architect",
    company: "Intelligent Machines",
    location: "Dhaka",
    period: "Feb 2026 – Present",
    featured: true,
    points: [
      "Lead teams to successful deployment of software applications and end-to-end architectural solutions.",
      "Design scalable architectures with an eye on future growth and proactive risk resolution.",
      "Deliver bespoke IT solutions by analysing customer requirements with stakeholders, and manage vendor relationships for cost-effective procurement.",
    ],
  },
  {
    role: "Technical Lead",
    company: "BoomersHub LLC",
    location: "Cary, North Carolina",
    period: "Jul 2024 – Jan 2026",
    featured: true,
    points: [
      "Led a team designing and implementing advanced AI models for improved data interpretation.",
      "Trained and fine-tuned machine learning models to increase accuracy and reliability.",
      "Streamlined operational workflows with intelligent automation scripts and researched the latest AI trends.",
    ],
  },
  {
    role: "Senior Software Architect",
    company: "Selise Digital Platforms",
    location: "Dhaka, Bangladesh",
    period: "Apr 2025 – Dec 2025 (concurrent)",
    featured: true,
    points: [
      "Integrated multiple systems into seamless interoperability across cloud platforms.",
      "Championed agile methodologies and enforced coding standards through regular reviews.",
      "Optimised codebase and cloud resource usage, and documented architectural designs for knowledge transfer.",
    ],
  },
  {
    role: "Technical Lead",
    company: "Spaceship Singapore",
    location: "Singapore",
    period: "Jan 2024 – Jul 2024",
    points: [
      "Managed a team of 8 delivering resolutions and product updates.",
      "Devised full-scale technical plans covering specifications, milestones and gateways.",
      "Tracked delivery with Jira and removed bottlenecks to raise productivity.",
    ],
  },
  {
    role: "Software Architect",
    company: "ADN DigiNet Limited",
    location: "Dhaka, Bangladesh",
    period: "Nov 2021 – Dec 2023",
    featured: true,
    points: [
      "Designed and architected strategic products for enterprise and internal teams.",
      "Led product development teams and oversaw readiness, release and update cycles.",
    ],
  },
  {
    role: "Director",
    company: "InflexionPoint Technologies (BD) Ltd",
    location: "Dhaka, Bangladesh",
    period: "Feb 2021 – Oct 2021",
    points: [
      "Designed and architected strategic products and managed deployment pipelines.",
      "Prepared documents for tenders and EOIs and brought in enterprise product requirements.",
    ],
  },
  {
    role: "Co-Founder & VP, Technology",
    company: "TiGrow Technologies Limited",
    location: "Dhaka, Bangladesh",
    period: "Feb 2020 – Oct 2021",
    points: [
      "Led the product development team and oversaw product readiness.",
      "Planned release cycles and managed the deployment pipelines.",
    ],
  },
  {
    role: "Database & API Development Expert",
    company: "RedOrange Media and Communications",
    location: "Dhaka, Bangladesh",
    period: "Feb 2021 – May 2021",
    points: [
      "Designed and implemented the back-end for an e-learning platform.",
      "Built and optimised APIs for front-end applications to consume.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Misfit Technologies Limited",
    location: "Dhaka, Bangladesh",
    period: "Jan 2018 – Dec 2019",
    points: [
      "Designed and developed client-facing web applications and an AI-based chatbot interface.",
      "Developed and managed e-commerce, SaaS and PaaS products.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Fantom IT Limited",
    location: "Dhaka, Bangladesh",
    period: "Aug 2016 – Dec 2017",
    points: [
      "Delivered client-facing projects and company products with project and product management.",
      "Requirement collection, analysis and manual testing of implementations.",
    ],
  },
  {
    role: "Junior Software Development Engineer",
    company: "Threat Equation Pte",
    location: "Singapore",
    period: "Jun 2015 – Dec 2015",
    points: [
      "Designed and planned a cyber threat-detection plugin.",
      "Led a team of five through implementation and reported to the CTO.",
    ],
  },
  {
    role: "Hardware Designer & Programmer",
    company: "BiTec Software",
    location: "Dhaka, Bangladesh",
    period: "Mar 2014 – May 2015",
    points: [
      "Designed and built a tracking device for riverine vehicles.",
      "Implemented the back-end server and fleet-management application.",
    ],
  },
];

export type SkillGroup = { title: string; icon: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    items: [
      "TypeScript", "JavaScript", "Python", "Java", "PHP", "C#", "C++",
      "Ruby", "SQL", "MATLAB", "VHDL", "Verilog HDL", "Embedded C",
    ],
  },
  {
    title: "Frameworks",
    icon: "layers",
    items: [
      "NestJS", "Spring Boot", "Express.js", "Fastify", "Laravel", "Django",
      "FastAPI", "Flask", "GraphQL", "LangChain", "LangGraph", "LangSmith",
      "React", "Next.js", "Gatsby", "AngularJS",
    ],
  },
  {
    title: "Databases",
    icon: "database",
    items: [
      "PostgreSQL", "MySQL", "MariaDB", "MongoDB", "Google BigQuery",
      "Neo4j", "Amazon Neptune",
      "ChromaDB", "Weaviate",
    ],
  },
  {
    title: "Analytics & BI",
    icon: "database",
    items: [
      "Looker Studio", "Tableau", "BigQuery reporting pipelines",
      "Embedded analytics dashboards",
    ],
  },
  {
    title: "DevOps & Cloud",
    icon: "cloud",
    items: [
      "Docker", "Kubernetes", "Helm", "Istio", "Traefik",
      "Terraform", "Ansible", "GitHub Actions", "Nginx",
      "AWS", "GCP", "Azure", "DigitalOcean",
    ],
  },
];

export const services = [
  {
    no: "01",
    icon: "compass",
    title: "Solution & Software Architecture",
    body: "Scalable, future-proof system design, from requirement analysis to end-to-end architecture and deployment pipelines.",
    deliverables: ["System design", "Cloud architecture", "Tech strategy"],
  },
  {
    no: "02",
    icon: "server",
    title: "Backend & API Engineering",
    body: "Robust services and APIs in NestJS, Express, Fastify, Django and FastAPI, backed by SQL and NoSQL data layers.",
    deliverables: ["REST / API design", "Database modelling", "Integrations"],
  },
  {
    no: "03",
    icon: "sparkles",
    title: "AI & LLM Engineering",
    body: "Intelligent features and automation using LangChain, LangGraph and vector databases, trained and tuned for reliability.",
    deliverables: ["LLM apps", "ML fine-tuning", "Automation"],
  },
];

export const process = [
  { step: "01", icon: "compass", title: "Discovery", body: "Collect and analyse requirements, align on goals and constraints." },
  { step: "02", icon: "layers", title: "Architect", body: "Design scalable, documented architecture for current and future needs." },
  { step: "03", icon: "code", title: "Build", body: "Deliver clean, standards-driven code with reviews and CI/CD." },
  { step: "04", icon: "rocket", title: "Deploy", body: "Ship to cloud, optimise resources and hand off with documentation." },
];
