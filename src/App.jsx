import { useMemo, useState } from 'react';
import agnesLogo from '../assets/img/agnes-logo.png';
import copia from '../assets/img/copia.jpg';
import hng from '../assets/img/hng.jpg';
import passportNew from '../assets/img/passport-new.jpg';
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

const skills = [
  ['Frontend', ['React', 'Next.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Responsive UI']],
  ['Backend', ['Django', 'Flask', 'Node.js', 'Laravel', 'REST APIs', 'Authentication']],
  ['AI and Data', ['RAG systems', 'Prompt engineering', 'Dashboards', 'Evidence workflows', 'Automation']],
  ['Databases and Deployment', ['PostgreSQL', 'MySQL', 'MongoDB', 'GitHub', 'Vercel', 'Render', 'cPanel']],
];

const education = [
  {
    title: 'Software Engineering',
    subtitle: 'Holberton School',
    body:
      'Project-based software engineering training covering foundations, systems thinking, backend development, and collaborative delivery.',
  },
  {
    title: 'Computer Science and Applied Technology',
    subtitle: 'Maseno University',
    body:
      'Academic foundation in software development, information systems, technical problem solving, and digital products.',
  },
  {
    title: 'Continuous Learning',
    subtitle: 'AI, climate technology, and product engineering',
    body:
      'Ongoing work in applied AI, climate-policy tooling, data workflows, UX, and production deployment practices.',
  },
];

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
            <a className="icon-btn" href="https://www.linkedin.com/in/eric-nimba-4141592b1/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
            <a className="icon-btn" href="https://github.com/nimba005" target="_blank" rel="noreferrer" aria-label="GitHub">gh</a>
            <a className="icon-btn" href="mailto:nimbaoyugi@gmail.com" aria-label="Email">@</a>
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
        <div className="skills-grid">
          {skills.map(([group, items]) => (
            <article className="card skill-cluster" key={group}>
              <div className="card-content">
                <h3>{group}</h3>
                <div className="skill-pills">
                  {items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
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
            <article className="card" key={item.title}>
              <div className="card-content">
                <span className="card-title">{item.title}</span>
                <p className="role">{item.subtitle}</p>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle>Contact</SectionTitle>
        <p className="section-lead">
          I am open to work on software platforms, dashboards, climate tech products, AI tools, and workflow
          automation systems.
        </p>
        <div className="contact-grid">
          <article className="contact-card">
            <span className="contact-icon material-icons" aria-hidden="true">email</span>
            <div>
              <h3>Email</h3>
              <p><a className="hoverline" href="mailto:nimbaoyugi@gmail.com">nimbaoyugi@gmail.com</a></p>
            </div>
          </article>
          <article className="contact-card">
            <span className="contact-icon material-icons" aria-hidden="true">public</span>
            <div>
              <h3>Online</h3>
              <p><a className="hoverline" href="https://www.linkedin.com/in/eric-nimba-4141592b1/" target="_blank" rel="noreferrer">LinkedIn</a></p>
              <p><a className="hoverline" href="https://github.com/nimba005" target="_blank" rel="noreferrer">GitHub</a></p>
            </div>
          </article>
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
