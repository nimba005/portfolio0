import { useMemo, useState } from 'react';
import agnesLogo from '../assets/img/agnes-logo.png';
import copia from '../assets/img/copia.jpg';
import hng from '../assets/img/hng.jpg';
import passportNew from '../assets/img/passport-new.jpg';
import holbertonLogo from '../assets/img/education/holberton.png';
import masenoLogo from '../assets/img/education/maseno.png';
import adaptationAtlas from '../assets/img/projects/adaptation-atlas.png';
import agnesDstsHub from '../assets/img/projects/agnes-dsts-hub.jpg';
import agnesNegotiationAssistant from '../assets/img/projects/agnes-negotiation-assistant.png';
import climateVerdict from '../assets/img/projects/climate-verdict.png';
import cmatCoteDivoire from '../assets/img/projects/cmat-cote-divoire.png';
import cmatGhana from '../assets/img/projects/cmat-ghana.png';
import cmatKenya from '../assets/img/projects/cmat-kenya.png';
import cmatNigeria from '../assets/img/projects/cmat-nigeria.png';
import cmatZambia from '../assets/img/projects/cmat-zambia.png';
import genderHotspotMap from '../assets/img/projects/gender-hotspot-map.png';
import ipccSummary from '../assets/img/projects/ipcc-summary.png';
import merl from '../assets/img/projects/merl.png';
import ndcScorecard from '../assets/img/projects/ndc-scorecard.png';
import scacafEhub from '../assets/img/projects/scacaf-ehub.png';

// Served from public/ so the URLs stay stable for search engines and shared links.
const cv = '/Eric-John-Nimba-CV.pdf';
const climateEvidenceCommentary = '/publications/africa-climate-evidence-not-dashboards-eric-nimba.pdf';
const auditableAiCommentary = '/publications/auditable-ai-african-public-institutions-eric-nimba.pdf';

const navItems = [
  ['About', '#about', 'person'],
  ['Experience', '#experience', 'business_center'],
  ['Projects', '#projects', 'web'],
  ['Publications', '#publications', 'article'],
  ['Skills', '#skills', 'build'],
  ['Education', '#education', 'school'],
  ['Contact', '#contact', 'mail'],
  ['Curriculum Vitae', cv, 'description'],
];

const heroHighlights = [
  ['location_on', 'AGNES', 'Climate data platform'],
  ['code', 'Full-stack + AI', 'Automation | Dashboards | Tools'],
  ['location_on', 'Nairobi, Kenya', 'Available for remote work'],
];

const aboutCards = [
  {
    title: 'What I Build',
    body:
      'I design and develop practical digital platforms, dashboards, reporting tools, AI assistants, and automation workflows for teams that need clean systems and useful insight.',
  },
  {
    title: 'How I Work',
    body:
      'I care about interfaces that are easy to understand, backends that are reliable, and products that solve real operational problems without unnecessary complexity.',
  },
];

const experience = [
  {
    logo: agnesLogo,
    company: 'African Group of Negotiators Experts Support (AGNES)',
    url: 'https://www.agnesafrica.org/',
    role: 'Full-Stack Software Engineer and ICT Assistant',
    period: 'Aug 2025 - Present',
    points: [
      'Built and maintain the AGNES Decision Support Tools Hub, bringing Africa-wide climate decision tools and national monitoring platforms into one searchable workspace.',
      'Developing climate-focused platforms for NDC tracking, adaptation finance, parliamentary climate oversight, and AI-supported knowledge access.',
      'Supporting internal ICT systems, deployment workflows, data dashboards, and stakeholder-facing digital tools.',
    ],
  },
  {
    logo: hng,
    company: 'HNG Tech',
    role: 'Frontend Developer Intern',
    period: 'Jan 2025 - Apr 2025',
    points: [
      'Built responsive React and TypeScript interfaces from product requirements and design references.',
      'Improved reusable UI patterns, component structure, and frontend implementation quality.',
    ],
  },
  {
    logo: copia,
    company: 'Copia Global',
    role: 'Frontend Developer Intern',
    period: 'Jun 2020 - Aug 2022',
    points: [
      'Supported user interface development for order, delivery, and operations systems.',
      'Worked across practical business workflows with attention to usability and maintainability.',
    ],
  },
];

// Tools served from bare IP addresses link to the hub instead, which stays on HTTPS and survives server moves.
const agnesHub = 'https://dsts.agnesafrica.org/';
const viaHub = 'View in AGNES Hub';

const featuredProject = {
  title: 'AGNES Decision Support Tools Hub',
  image: agnesDstsHub,
  summary:
    'The central workspace for African climate negotiators, parliamentarians, researchers, and partners, moving from climate evidence to policy insight, legal perspective, and accountable delivery.',
  points: [
    'Brings 7 Africa-wide decision tools and 6 national monitoring platforms into one connected hub.',
    'Search and category filters across every tool, with an accessible feedback channel for users.',
    'Built for speed, accessibility, and search visibility on low-bandwidth connections.',
  ],
  tags: ['JavaScript', 'HTML & CSS', 'Accessibility', 'SEO'],
  url: agnesHub,
};

const filters = ['All', 'AI', 'Climate Tech', 'Monitoring'];

const projects = [
  {
    title: 'NDC Capacity Scorecard',
    category: 'Climate Tech',
    image: ndcScorecard,
    summary:
      "Assessment and intelligence platform that tracks countries' NDC commitments and implementation readiness.",
    details: 'Scorecards, dashboards, evidence workflows, AI summaries, and reporting outputs for capacity analysis.',
    tags: ['Django', 'Next.js', 'AI', 'PostgreSQL'],
    url: 'https://ndcscorecard.agnesafrica.org/',
  },
  {
    title: 'SCACAF E-Hub',
    category: 'Climate Tech',
    image: scacafEhub,
    summary:
      'A one-stop climate adaptation finance hub with practical resources, expert support, and a pan-African community of practice.',
    details: 'Helps countries turn NDCs and NAPs into bankable adaptation investments.',
    tags: ['Climate finance', 'Adaptation', 'Knowledge hub'],
    url: 'https://ehub.agnesafrica.org/',
  },
  {
    title: 'Africa Climate Negotiation Assistant',
    category: 'AI',
    image: agnesNegotiationAssistant,
    summary:
      'AI assistant for UNFCCC negotiations, grounded in a curated library of negotiation documents.',
    details: 'Surfaces draft-text context, agenda issues, and Africa-relevant talking points across key tracks.',
    tags: ['AI', 'RAG', 'UNFCCC'],
    url: agnesHub,
    linkLabel: viaHub,
  },
  {
    title: 'IPCC Summary Generator',
    category: 'AI',
    image: ipccSummary,
    summary:
      'AI tool that produces clear, concise summaries of IPCC assessment reports for policymakers.',
    details: 'Highlights key findings, impacts, and action pathways without reading thousands of pages.',
    tags: ['AI', 'Summarisation', 'Climate science'],
    url: agnesHub,
    linkLabel: viaHub,
  },
  {
    title: 'Climate Verdict',
    category: 'AI',
    image: climateVerdict,
    summary: 'AI-powered climate litigation and advisory opinion support tool.',
    details: 'Draws on ICJ, ITLOS, IACtHR, and UNEP climate law sources to support legal research.',
    tags: ['AI', 'Climate law', 'Research'],
    url: agnesHub,
    linkLabel: viaHub,
  },
  {
    title: 'Gender Hotspot Map',
    category: 'Climate Tech',
    image: genderHotspotMap,
    summary:
      'Interactive gender and climate vulnerability hotspot maps across Kenya, Rwanda, Uganda, Botswana, and Ghana.',
    details: 'Supports gender-responsive climate analysis, planning, and targeting.',
    tags: ['Geospatial', 'Gender', 'Vulnerability'],
    url: 'https://agnesafrica.org/KenyaMaps/',
  },
  {
    title: 'Adaptation Atlas',
    category: 'Climate Tech',
    image: adaptationAtlas,
    summary:
      'A data-rich platform connecting scientific knowledge to real-world climate adaptation planning.',
    details: 'Tools for assessing climate risk, vulnerability, and investment options, in partnership with CGIAR.',
    tags: ['Climate data', 'Risk', 'Adaptation'],
    url: 'https://adaptationatlas.cgiar.org/',
  },
  {
    title: 'MERL Data Collection System',
    category: 'Monitoring',
    image: merl,
    summary:
      'Monitoring, Evaluation, Reporting and Learning system for managing climate projects and tracking results.',
    details: 'Organises indicators, outputs, outcomes, reports, and learning loops for project teams.',
    tags: ['MERL', 'Data collection', 'Reporting'],
    url: 'https://merlkenya.org/',
  },
  {
    title: 'CMAT National Monitoring Platforms',
    category: 'Monitoring',
    summary:
      'Country platforms that help parliamentarians and policymakers track climate commitments, legislation, actions, and delivery.',
    details: 'One monitoring and analysis tool, deployed and tailored for five countries.',
    tags: ['Flask', 'Dashboards', 'Parliamentary oversight'],
    countries: [
      { name: 'Kenya', image: cmatKenya, url: 'https://nmaf.135.237.124.159.sslip.io/' },
      { name: 'Zambia', image: cmatZambia, url: 'https://cmat.135.237.124.159.sslip.io/' },
      { name: 'Ghana', image: cmatGhana, url: 'https://ghana.135.237.124.159.sslip.io/' },
      { name: 'Nigeria', image: cmatNigeria, url: `${agnesHub}#national-accountability`, linkLabel: viaHub },
      { name: "Côte d'Ivoire", image: cmatCoteDivoire, url: 'https://cmat-c-te-d-ivoire.onrender.com/' },
    ],
  },
];

const publications = [
  {
    title: 'Africa Does Not Need Another Climate Dashboard. It Needs Evidence That Projects Deliver.',
    standfirst:
      'Why climate-monitoring systems must connect public spending, project evidence and community outcomes.',
    quote:
      'The future of climate accountability is not a prettier screen. It is a trustworthy chain of decisions and outcomes.',
    tags: ['Climate governance', 'MERL', 'Digital public systems'],
    date: 'October 2026',
    readTime: '5 min read',
    file: climateEvidenceCommentary,
    downloadName: 'Eric_Nimba_Climate_Evidence_Commentary.pdf',
  },
  {
    title: 'An AI Answer Is Not a Policy Decision: The Case for Auditable AI in African Public Institutions',
    standfirst:
      'The missing design principles for responsible language-model adoption in public-sector decision support.',
    quote:
      'The best policy assistant is not the one that sounds most confident. It is the one that makes evidence visible, limitations legible and human accountability impossible to bypass.',
    tags: ['AI governance', 'Public sector', 'RAG systems'],
    date: 'October 2026',
    readTime: '5 min read',
    file: auditableAiCommentary,
    downloadName: 'Eric_Nimba_Auditable_AI_Commentary.pdf',
  },
];

// Technology logos from Devicon (MIT), keyed by file name, e.g. 'react' -> assets/img/skills/react.svg.
const skillLogos = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/img/skills/*.svg', { eager: true, import: 'default' })).map(
    ([path, url]) => [path.split('/').pop().replace('.svg', ''), url],
  ),
);

// Each skill is [label] or [label, logo name].
const skillGroups = [
  {
    title: 'Frontend',
    icon: 'web',
    description: 'Responsive, accessible interfaces for dashboards and data-heavy products.',
    skills: [
      ['React', 'react'],
      ['Next.js', 'nextjs'],
      ['JavaScript', 'javascript'],
      ['TypeScript', 'typescript'],
      ['HTML5', 'html5'],
      ['CSS3', 'css3'],
      ['Responsive UI'],
      ['Accessibility'],
      ['SEO'],
    ],
  },
  {
    title: 'Backend & APIs',
    icon: 'dns',
    description: 'Reliable services, REST APIs, and secure access for multi-user platforms.',
    skills: [
      ['Python', 'python'],
      ['Django', 'django'],
      ['Flask', 'flask'],
      ['Node.js', 'nodejs'],
      ['Laravel', 'laravel'],
      ['REST APIs'],
      ['Authentication'],
    ],
  },
  {
    title: 'AI & Data',
    icon: 'psychology',
    description: 'Grounded AI assistants and data workflows that turn documents into decisions.',
    skills: [
      ['RAG systems'],
      ['Prompt engineering'],
      ['Document retrieval'],
      ['AI summarisation'],
      ['Dashboards'],
      ['Evidence workflows'],
      ['Automation'],
    ],
  },
  {
    title: 'Databases',
    icon: 'storage',
    description: 'Data models designed for tracking, reporting, and analysis.',
    skills: [
      ['PostgreSQL', 'postgresql'],
      ['MySQL', 'mysql'],
      ['MongoDB', 'mongodb'],
      ['SQL'],
      ['Data modelling'],
    ],
  },
  {
    title: 'Cloud & DevOps',
    icon: 'cloud_done',
    description: 'Shipping, hosting, and maintaining production platforms.',
    skills: [
      ['Git', 'git'],
      ['GitHub', 'github'],
      ['Azure', 'azure'],
      ['Vercel', 'vercel'],
      ['Render'],
      ['cPanel'],
    ],
  },
  {
    title: 'Climate Domain',
    icon: 'public',
    description: 'Policy context that shapes what gets built and who it serves.',
    skills: [
      ['Climate policy & NDCs'],
      ['UNFCCC negotiations'],
      ['MERL'],
      ['Climate finance'],
      ['Parliamentary oversight'],
      ['Gender & climate'],
    ],
  },
];

const linkedInUrl = 'https://www.linkedin.com/in/eric-nimba-4141592b1/';
const gitHubUrl = 'https://github.com/nimba005';

// Add `period: '2021 - 2023'` to an entry to show its dates.
const education = [
  {
    school: 'Holberton School',
    logo: holbertonLogo,
    url: 'https://www.holbertonschool.com/',
    program: 'Software Engineering',
    body:
      'Project-based software engineering training covering foundations, systems thinking, backend development, and collaborative delivery.',
  },
  {
    school: 'Maseno University',
    logo: masenoLogo,
    url: 'https://www.maseno.ac.ke/',
    program: 'Computer Science and Applied Technology',
    body:
      'Academic foundation in software development, information systems, technical problem solving, and digital products.',
  },
];

// The Certifications block appears automatically once this list has an entry, e.g.
// { name: 'Azure AI Fundamentals', issuer: 'Microsoft', date: 'Mar 2026', url: 'https://...', logo: importedImage }
const certifications = [];

// FormSubmit delivers contact-form messages by email. The address is assembled only when a message is
// sent, so it never appears in the page HTML. After activating FormSubmit, the address can be swapped
// for the random alias from the activation email.
const contactEndpoint = () => `https://formsubmit.co/ajax/${['nimbaoyugi', 'gmail.com'].join('@')}`;

const contactTopics = ['Project inquiry', 'Job opportunity', 'Collaboration or partnership', 'Speaking or consulting', 'Something else'];

const contactServices = [
  ['dashboard', 'Data platforms and dashboards'],
  ['psychology', 'AI assistants and RAG tools'],
  ['eco', 'Climate tech and policy systems'],
  ['bolt', 'Workflow automation'],
];

function LinkedInIcon() {
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="brand-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function SideNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="desktop-nav" aria-label="Main navigation">
        <div className="side-nav">
          <a className="sidebar-logo" href="#top" aria-label="Eric John Nimba home">
            <img className="profile-pic" src={passportNew} alt="Eric John Nimba" />
            <span className="sidebar-name">Eric John Nimba</span>
            <span className="sidebar-role">AI & Automation | Climate Tech</span>
          </a>
          <div className="side-links">
            {navItems.map(([label, href, icon]) => (
              <a key={label} href={href} target={href.endsWith('.pdf') ? '_blank' : undefined} rel="noreferrer">
                <span className="material-icons" aria-hidden="true">{icon}</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <a className="mobile-brand" href="#top" onClick={closeMenu}>
          <strong>Eric John Nimba</strong>
          <span>AI & Climate Tech Engineer</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navItems.map(([label, href, icon]) => (
            <a
              key={label}
              href={href}
              target={href.endsWith('.pdf') ? '_blank' : undefined}
              rel="noreferrer"
              onClick={closeMenu}
            >
              <span className="material-icons" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

function SectionTitle({ children }) {
  return <h2 className="page-title">{children}</h2>;
}

function Hero() {
  return (
    <section id="top" className="section full-height intro">
      <div className="overlay" />
      <div className="container">
        <div className="hero-content">
          <p className="hero-eyebrow">Full-Stack Software Engineer at AGNES | AI & Automation | Climate Tech</p>
          <h1>Eric John Nimba builds practical digital systems for climate research, policy, and decision-making.</h1>
          <p className="hero-role">
            A <span className="typing">full-stack developer turning complex workflows into clear products.</span>
          </p>
          <p className="hero-summary">
            I build dashboards, climate data platforms, AI-assisted tools, and operational systems that help teams
            move from scattered information to usable decisions.
          </p>
          <div className="social">
            <a className="icon-btn" href={linkedInUrl} target="_blank" rel="noopener" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a className="icon-btn" href={gitHubUrl} target="_blank" rel="noopener" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a className="icon-btn" href="#contact" aria-label="Send a message">
              <span className="material-icons" aria-hidden="true">mail</span>
            </a>
          </div>
          <div className="hero-highlights">
            {heroHighlights.map(([icon, value, label]) => (
              <div className="hero-highlight" key={value}>
                <span className="material-icons hero-highlight-icon" aria-hidden="true">{icon}</span>
                <span className="hero-highlight-value">{value}</span>
                <span className="hero-highlight-label">{label}</span>
              </div>
            ))}
          </div>
          <div className="buttons">
            <a className="readme" href="#projects">View Projects</a>
            <a className="contactme" href="#contact">Contact Me</a>
            <a className="contactme secondary-action" href={cv} target="_blank" rel="noreferrer">View CV</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle>About</SectionTitle>
        <p className="section-lead">
          I am Eric John Nimba, a Nairobi-based software engineer at the African Group of Negotiators Experts Support
          (AGNES), focused on building products that are beautiful enough to trust, simple enough to use, and strong
          enough to support real work.
        </p>
        <div className="about-grid">
          {aboutCards.map((card) => (
            <article className="about-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionTitle>Experience</SectionTitle>
        {experience.map((item) => (
          <article className="card experience-card" key={item.company}>
            <div className="card-content">
              <div className="experience-head">
                <img src={item.logo} alt={`${item.company} logo`} loading="lazy" decoding="async" />
                <div>
                  <h3 className="card-title">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noopener">{item.company}</a>
                    ) : (
                      item.company
                    )}
                  </h3>
                  <p className="role">{item.role}</p>
                  <small>{item.period}</small>
                </div>
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectLink({ url, label = 'Open Project' }) {
  const external = !url.startsWith('#');
  return (
    <a className="project-link" href={url} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
      <span>{label}</span>
      <span className="material-icons" aria-hidden="true">{external ? 'arrow_outward' : 'arrow_forward'}</span>
    </a>
  );
}

function FeaturedProject() {
  const project = featuredProject;
  return (
    <article className="card featured-project">
      <div className="card-image">
        <img src={project.image} alt={`${project.title} preview`} loading="lazy" decoding="async" />
      </div>
      <div className="card-content">
        <span className="project-category">Featured · AGNES</span>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <ul className="featured-points">
          {project.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <div className="skill-pills compact">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="featured-action">
          <ProjectLink url={project.url} label="Visit the hub" />
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }) {
  const [countryIndex, setCountryIndex] = useState(0);
  const country = project.countries?.[countryIndex];
  const image = country?.image ?? project.image;
  const url = country?.url ?? project.url;
  const linkLabel = country ? country.linkLabel : project.linkLabel;

  return (
    <article className="card project-card">
      <div className="card-image">
        <img
          src={image}
          alt={`${project.title}${country ? ` for ${country.name}` : ''} preview`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="card-content">
        <span className="project-category">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.countries && (
          <div className="country-switch" role="group" aria-label="Choose a country platform">
            {project.countries.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={index === countryIndex ? 'active' : ''}
                aria-pressed={index === countryIndex}
                onClick={() => setCountryIndex(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
        <div className="skill-pills compact">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="card-action">
        <span>{project.details}</span>
        <ProjectLink url={url} label={linkLabel} />
      </div>
    </article>
  );
}

function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const visibleProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle>Projects</SectionTitle>
        <p className="section-lead">
          Climate decision tools, AI assistants, and national monitoring platforms built for African negotiators,
          parliamentarians, and policymakers.
        </p>
        <FeaturedProject />
        <div className="filter-row" aria-label="Filter projects">
          {filters.map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              type="button"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {visibleProjects.map((project) => (
            <ProjectCard project={project} key={project.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" className="section">
      <div className="container">
        <SectionTitle>Publications</SectionTitle>
        <p className="section-lead">
          Policy commentary on climate accountability, AI governance, and the design of digital systems that
          public institutions can trust.
        </p>
        <div className="publications-grid">
          {publications.map((item, index) => (
            <article className="publication-card" key={item.title}>
              <div className="publication-meta">
                <span className="publication-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="publication-type">Policy Commentary</span>
                <span className="publication-date">
                  {item.date} · {item.readTime}
                </span>
              </div>
              <h3>
                <a href={item.file} target="_blank" rel="noreferrer">{item.title}</a>
              </h3>
              <p className="publication-standfirst">{item.standfirst}</p>
              <blockquote className="publication-quote">{item.quote}</blockquote>
              <div className="skill-pills compact">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="publication-actions">
                <a className="publication-read" href={item.file} target="_blank" rel="noreferrer">
                  <span>Read commentary</span>
                  <span className="material-icons" aria-hidden="true">arrow_forward</span>
                </a>
                <a className="publication-download" href={item.file} download={item.downloadName}>
                  <span className="material-icons" aria-hidden="true">download</span>
                  <span>PDF</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="publication-note">Views expressed are personal and do not represent official AGNES positions.</p>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionTitle>Skills</SectionTitle>
        <p className="section-lead">
          A full-stack toolkit for building AI-assisted, data-driven platforms, grounded in the climate policy context
          they serve.
        </p>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className="card skill-card" key={group.title}>
              <div className="skill-card-head">
                <span className="skill-icon material-icons" aria-hidden="true">{group.icon}</span>
                <h3>{group.title}</h3>
              </div>
              <p>{group.description}</p>
              <ul className="skill-list">
                {group.skills.map(([label, logo]) => (
                  <li className="skill-chip" key={label}>
                    {logo ? (
                      <img src={skillLogos[logo]} alt="" width="18" height="18" loading="lazy" decoding="async" />
                    ) : (
                      <span className="skill-dot" aria-hidden="true" />
                    )}
                    {label}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionTitle>Education</SectionTitle>
        <div className="education-grid">
          {education.map((item) => (
            <article className="card education-card" key={item.school}>
              <div className="education-head">
                <span className="school-logo">
                  <img src={item.logo} alt={`${item.school} logo`} width="56" height="56" loading="lazy" decoding="async" />
                </span>
                <div>
                  <h3>
                    <a href={item.url} target="_blank" rel="noopener">{item.school}</a>
                  </h3>
                  <p className="education-program">{item.program}</p>
                  {item.period && <span className="education-period">{item.period}</span>}
                </div>
              </div>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        {certifications.length > 0 && (
          <div className="certifications">
            <h3 className="subsection-title">
              <span className="material-icons" aria-hidden="true">workspace_premium</span>
              Licenses &amp; Certifications
            </h3>
            <div className="certifications-grid">
              {certifications.map((item) => (
                <article className="certification-card" key={`${item.name}-${item.issuer}`}>
                  <span className="certification-badge">
                    {item.logo ? (
                      <img src={item.logo} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="material-icons" aria-hidden="true">verified</span>
                    )}
                  </span>
                  <div>
                    <h4>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener">{item.name}</a>
                      ) : (
                        item.name
                      )}
                    </h4>
                    <p>
                      {item.issuer}
                      {item.date && ` · ${item.date}`}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));

    // Bots fill the hidden field; quietly accept without sending.
    if (fields._honey) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(contactEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...fields,
          _subject: `Portfolio: ${fields.topic} from ${fields.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== 'true') throw new Error(result.message);
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-success" role="status">
        <span className="material-icons" aria-hidden="true">mark_email_read</span>
        <h3>Thank you, your message is on its way.</h3>
        <p>I read every message personally and will get back to you as soon as I can.</p>
        <button type="button" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} required />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email address</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-topic">What is this about?</label>
        <select id="contact-topic" name="topic" defaultValue={contactTopics[0]}>
          {contactTopics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          minLength={10}
          maxLength={5000}
          required
          placeholder="Tell me a little about your project, role, or idea."
        />
      </div>
      <label className="form-honeypot" aria-hidden="true">
        Leave this empty
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </label>
      {status === 'error' && (
        <p className="form-error" role="alert">
          Sorry, the message could not be sent. Please try again, or reach me on{' '}
          <a href={linkedInUrl} target="_blank" rel="noopener">LinkedIn</a>.
        </p>
      )}
      <div className="form-footer">
        <p className="form-privacy">
          <span className="material-icons" aria-hidden="true">lock</span>
          Your details are only used to reply to you.
        </p>
        <button className="form-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <span className="material-icons" aria-hidden="true">send</span>
        </button>
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle>Contact</SectionTitle>
        <div className="contact-layout">
          <aside className="contact-panel">
            <span className="availability">
              <span className="availability-dot" aria-hidden="true" />
              Open to new opportunities
            </span>
            <h3>Let&apos;s build something useful together.</h3>
            <p>
              I work with teams on software platforms, dashboards, climate tech products, AI tools, and workflow
              automation. Tell me what you are working on.
            </p>
            <ul className="contact-services">
              {contactServices.map(([icon, label]) => (
                <li key={label}>
                  <span className="material-icons" aria-hidden="true">{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
            <p className="contact-meta">
              <span className="material-icons" aria-hidden="true">location_on</span>
              Nairobi, Kenya · Available for remote work
            </p>
            <div className="contact-socials">
              <a href={linkedInUrl} target="_blank" rel="noopener">
                <LinkedInIcon />
                LinkedIn
              </a>
              <a href={gitHubUrl} target="_blank" rel="noopener">
                <GitHubIcon />
                GitHub
              </a>
              <a href={cv} target="_blank" rel="noopener">
                <span className="material-icons" aria-hidden="true">description</span>
                CV
              </a>
            </div>
          </aside>
          <div className="contact-form-card">
            <h3>Send a message</h3>
            <p>Fill in the form and I will get back to you by email.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <SideNav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Publications />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
