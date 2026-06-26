import { useState, useEffect, useRef } from 'react';
import './App.css';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  const date = new Date();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    setTimeout(() => setHeroVisible(true), 100);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { threshold: 0.3 });
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className='navbar'>
        <div className='navbar__inner'>
          <div className='navbar__logo'>
            <div className='navbar__logo-box'>
              <span className='navbar__logo-letters'>EM</span>
            </div>
            <span className='navbar__logo-name'>EventManager</span>
          </div>
          <div className='navbar__links'>
            <a href='#how-it-works' className='navbar__link'>How It Works</a>
            <a href='#roles' className='navbar__link'>Roles</a>
            <a href='#features' className='navbar__link'>Features</a>
            <a href='/login' className='navbar__link'>Sign In</a>
            <a href='/signup' className='navbar__cta'>GET STARTED</a>
          </div>
          <button className='navbar__hamburger' onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className='navbar__mobile-menu'>
            <a href='#how-it-works' className='navbar__mobile-link'>How It Works</a>
            <a href='#roles' className='navbar__mobile-link'>Roles</a>
            <a href='#features' className='navbar__mobile-link'>Features</a>
            <a href='/login' className='navbar__mobile-link'>Sign In</a>
            <a href='/signup' className='navbar__mobile-link'>Get Started</a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className='hero'>
        <div className='hero__grid-bg' />
        <div className='hero__glow' />
        <div className='hero__eyebrow'>
          <span className='hero__eyebrow-line' />
          <span className='hero__eyebrow-text'>JOIN TODAY</span>
          <span className='hero__eyebrow-line' />
        </div>
        <div className='hero__title-wrap'>
          <h1 className='hero__title-line'><span>Your University.</span></h1>
          <h1 className='hero__title-line'><span>Your Events.</span></h1>
        </div>
        <p className='hero__subtitle'>
          Join thousands of students already using the platform to stay connected, participate in events, and shape university culture.
        </p>
        <div className='hero__buttons'>
          <a href='/signup' className='btn-primary'>CREATE ACCOUNT →</a>
          <a href='/login' className='btn-secondary'>SIGN IN</a>
        </div>
        <div className='hero__scroll-indicator'>
          <span className='hero__scroll-label'>SCROLL</span>
          <div className='hero__scroll-track'><div className='hero__scroll-dot' /></div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className='stats-bar'>
        <div className='stats-bar__grid'>
          {[['5,000+','STUDENTS'],['200+','EVENTS/YEAR'],['50+','ORGANIZERS'],['98%','SATISFACTION']].map(([n,l]) => (
            <div className='stats-bar__item' key={l}>
              <div className='stats-bar__number'>{n}</div>
              <div className='stats-bar__label'>{l}</div>
              <div className='stats-bar__rule' />
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className='how-it-works' id='how-it-works'>
        <div className='how-it-works__inner'>
          <div className='how-it-works__header'>
            <p className='section-eyebrow'>HOW IT WORKS</p>
            <h2 className='section-heading'>Simple by design.</h2>
          </div>
          <div className='how-it-works__grid'>
            {[
              ['01','Create Account','Sign up as a student, organizer, or admin in under a minute.'],
              ['02','Explore Events','Browse upcoming events filtered by category, date, or department.'],
              ['03','Register & Attend','One-click registration with instant confirmation.'],
              ['04','Manage & Track','Organizers manage attendance; admins oversee everything.'],
            ].map(([num, title, desc]) => (
              <div className='step-card' key={num}>
                <div className='step-card__number'>{num}</div>
                <h3 className='step-card__title'>{title}</h3>
                <p className='step-card__desc'>{desc}</p>
                <div className='step-card__hover-line' />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className='roles' id='roles'>
        <div className='roles__inner'>
          <div className='roles__header'>
            <p className='section-eyebrow'>BUILT FOR EVERY ROLE</p>
            <h2 className='section-heading'>Pick your role.</h2>
          </div>
          <div className='roles__grid'>
            <div className='role-card role-card--default'>
              <div className='role-card__icon role-card__icon--default'>★</div>
              <h3 className='role-card__title role-card__title--default'>Student</h3>
              <ul className='role-card__features'>
                {['Browse all events','One-click register','Track your schedule','Get notifications'].map(f => (
                  <li className='role-card__feature role-card__feature--default' key={f}>
                    <span className='role-card__feature-arrow role-card__feature-arrow--default'>→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className='role-card role-card--featured'>
              <div className='role-card__badge'><span>MOST POPULAR</span></div>
              <div className='role-card__icon role-card__icon--featured'>★</div>
              <h3 className='role-card__title role-card__title--featured'>Organizer</h3>
              <ul className='role-card__features'>
                {['Create & publish events','Manage registrations','Export attendee list','Analytics dashboard'].map(f => (
                  <li className='role-card__feature role-card__feature--featured' key={f}>
                    <span className='role-card__feature-arrow role-card__feature-arrow--featured'>→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className='role-card role-card--default'>
              <div className='role-card__icon role-card__icon--default'>★</div>
              <h3 className='role-card__title role-card__title--default'>Admin</h3>
              <ul className='role-card__features'>
                {['Full system control','Manage all users','Approve events','View all reports'].map(f => (
                  <li className='role-card__feature role-card__feature--default' key={f}>
                    <span className='role-card__feature-arrow role-card__feature-arrow--default'>→</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className='cta-banner'>
        <div className='cta-banner__texture' />
        <div ref={ctaRef} className='cta-banner__inner'>
          <p className='cta-banner__eyebrow'>JOIN TODAY</p>
          <h2 className='cta-banner__heading'>Your University. Your Events.</h2>
          <p className='cta-banner__sub'>Join thousands of students already using the platform to stay connected, participate in events, and shape university culture.</p>
          <div className='cta-banner__buttons'>
            <a href='/signup' className='btn-dark'>CREATE ACCOUNT →</a>
            <a href='/login' className='btn-outline-dark'>SIGN IN</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='footer'>
        <div className='footer__inner'>
          <div className='footer__grid'>
            <div>
              <div className='footer__brand-logo'>
                <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
                <span className='navbar__logo-name'>EventManager</span>
              </div>
              <p className='footer__brand-desc'>The all-in-one platform for university event discovery and management.</p>
            </div>
            <div>
              <p className='footer__col-heading'>PLATFORM</p>
              <ul className='footer__link-list'>
                <li><a href='#' className='footer__link'>Browse Events</a></li>
                <li><a href='#' className='footer__link'>Create Event</a></li>
                <li><a href='#' className='footer__link'>Dashboard</a></li>
              </ul>
            </div>
            <div>
              <p className='footer__col-heading'>ROLES</p>
              <ul className='footer__link-list'>
                <li><a href='#' className='footer__link'>Student</a></li>
                <li><a href='#' className='footer__link'>Organizer</a></li>
                <li><a href='#' className='footer__link'>Admin</a></li>
              </ul>
            </div>
            <div>
              <p className='footer__col-heading'>ACCOUNT</p>
              <ul className='footer__link-list'>
                <li><a href='/signup' className='footer__link'>Sign Up</a></li>
                <li><a href='/login' className='footer__link'>Sign In</a></li>
              </ul>
            </div>
          </div>
          <div className='footer__bottom'>
            <p>© {date.getFullYear()} University Event Management System</p>
            <p>Built for students, by students.</p>
          </div>
        </div>
      </footer>
    </>
  );
}