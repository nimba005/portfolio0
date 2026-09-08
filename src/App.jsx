import { useMemo, useState } from 'react';
import agnesLogo from '../assets/img/agnes-logo.png';
import agnesNegotiationAssistant from '../assets/img/agnes-negotiation-assistant.png';
import climateVerdict from '../assets/img/climate-verdict.png';
import cmat from '../assets/img/cmat.png';
import copia from '../assets/img/copia.jpg';
import futuristicWallpaper from '../assets/img/futuristic-wallpaper.jpg';
import hng from '../assets/img/hng.jpg';
import merl from '../assets/img/merl.png';
import ndcScorecard from '../assets/img/ndc-scorecard.png';
import passportNew from '../assets/img/passport-new.jpg';
import cv from '../assets/resume/Nimba_CV.pdf';

const navItems = [
  ['About', '#about', 'person'],
  ['Experience', '#experience', 'business_center'],
  ['Projects', '#projects', 'web'],
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
    company: 'African Group of Negotiators Experts Support',
    role: 'Full-Stack Software Engineer and ICT Assistant',
    period: 'Aug 2025 - Present',
    points: [
      'Developing climate-focused platforms for policy tracking, readiness assessments, evidence management, and AI-supported knowledge access.',
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

const filters = ['All', 'Climate Tech', 'AI', 'Systems'];

const projects = [
  {
    title: 'NDC Capacity Scorecard',
    category: 'Climate Tech',
    image: ndcScorecard,
    summary:
      'Assessment and intelligence platform for tracking NDC development and implementation readiness.',
    details:
      'Built around scorecards, dashboards, evidence workflows, AI summaries, and reporting outputs for capacity analysis.',
    tags: ['Django', 'Next.js', 'AI', 'PostgreSQL'],
    url: '#contact',
  },
  {
    title: 'CMAT Platforms',
    category: 'Climate Tech',
    image: cmat,
    summary:
      'Climate monitoring and analytics tools for tracking actions, emissions, policy data, and reporting.',
    details:
      'Supports multi-country climate data workflows and stakeholder-ready dashboards.',
    tags: ['Flask', 'Dashboards', 'Climate data'],
    url: 'https://cmat-kenya.onrender.com',
  },
  {
    title: 'MERL System',
    category: 'Systems',
    image: merl,
    summary:
      'Monitoring, Evaluation, Reporting and Learning platform for climate project management.',
    details:
      'Helps teams organize indicators, outputs, outcomes, reports, and learning loops.',
    tags: ['MERL', 'Reporting', 'UX'],
    url: 'https://merlkenya.org/',
  },
  {
    title: 'Africa Climate Negotiation Assistant',
    category: 'AI',
    image: agnesNegotiationAssistant,
    summary:
      'AI support tool for climate negotiation context, references, and structured knowledge access.',
    details:
      'Helps users retrieve relevant Africa-first climate negotiation information more quickly.',
    tags: ['AI', 'RAG', 'Climate policy'],
    url: 'https://llm.agnesafrica.org/',
  },
  {
    title: 'Climate Verdict',
    category: 'AI',
    image: climateVerdict,
    summary:
      'AI tool for reviewing climate laws, policies, and documents for research and interpretation.',
    details:
      'Turns complex policy material into usable summaries and evidence-led insight.',
    tags: ['AI', 'Policy', 'Research'],
    url: 'https://climate-verdict.azurewebsites.net/',
  },
  {
    title: 'Portfolio Revamp',
    category: 'Systems',
    image: futuristicWallpaper,
    summary:
      'A React-powered portfolio built to present my work with a clean, professional user experience.',
    details:
      'Keeps the original visual identity while making future UI improvements easier to maintain.',
    tags: ['React', 'Vite', 'UI/UX'],
    url: '#top',
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
          <p className="hero-eyebrow">Full-Stack Software Engineer | AI & Automation | Climate Tech</p>
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
          I am a software engineer focused on building products that are beautiful enough to trust, simple enough to
          use, and strong enough to support real work.
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
                <img src={item.logo} alt={`${item.company} logo`} />
                <div>
                  <span className="card-title">{item.company}</span>
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
          Selected systems across climate technology, AI, analytics, reporting, and product delivery.
        </p>
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
            <article className="card project-card" key={project.title}>
              <div className="card-image">
                <img src={project.image} alt={`${project.title} preview`} />
              </div>
              <div className="card-content">
                <span className="project-category">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className="skill-pills compact">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="card-action">
                <span>{project.details}</span>
                <a className="project-link" href={project.url} target={project.url.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
                  <span>Open Project</span>
                  <span className="material-icons" aria-hidden="true">arrow_forward</span>
                </a>
              </div>
            </article>
          ))}
        </div>
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
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
