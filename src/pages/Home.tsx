import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import StarBackground from '@/components/home/StarBackground';
import profileImg from '../assets/img/Profile.png';
import ProjectsShowcase from '@/components/home/ProjectShowcase';
import skills from '../assets/link/logo';

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [pageScrollEnabled, setPageScrollEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // 🍔 burger state

  useEffect(() => {
    const first = document.getElementById('greetings');
    const second = document.getElementById('content');
    if (!first || !second) return;

    let isLocked = false;
    let touchStartY = 0;

    const lock = () => {
      isLocked = true;
      setTimeout(() => {
        isLocked = false;
      }, 900); // keep lock slightly longer than smooth scroll
    };

    const isTopOfFirst = () => Math.abs(first.getBoundingClientRect().top) < 2;
    const isTopOfSecond = () =>
      Math.abs(second.getBoundingClientRect().top) < 2;

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) return;
      if (Math.abs(e.deltaY) < 30) return;

      // DOWN from first → snap to second
      if (e.deltaY > 0 && isTopOfFirst()) {
        e.preventDefault();
        document.body.style.overflow = 'hidden';
        second.scrollIntoView({ behavior: 'smooth' });
        lock();
        setTimeout(() => (document.body.style.overflow = ''), 950);
      }

      // UP from second → snap to first
      if (e.deltaY < 0 && isTopOfSecond()) {
        e.preventDefault();
        document.body.style.overflow = 'hidden';
        first.scrollIntoView({ behavior: 'smooth' });
        lock();
        setTimeout(() => (document.body.style.overflow = ''), 950);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLocked) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      if (Math.abs(diff) < 60) return; // ignore small swipes

      // swipe UP from first → snap down
      if (diff > 0 && isTopOfFirst()) {
        document.body.style.overflow = 'hidden';
        second.scrollIntoView({ behavior: 'smooth' });
        lock();
        setTimeout(() => (document.body.style.overflow = ''), 950);
      }

      // swipe DOWN from second → snap back up
      if (diff < 0 && isTopOfSecond()) {
        document.body.style.overflow = 'hidden';
        first.scrollIntoView({ behavior: 'smooth' });
        lock();
        setTimeout(() => (document.body.style.overflow = ''), 950);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleNavClick = (index: number) => {
    setCurrent(index);
    setIsOpen(false); // close mobile menu on click
  };

  return (
    <main className='w-full'>
      {/* 🌌 Background */}
      <StarBackground />

      {/* 🧭 Header */}
      {showHeader && (
        <header className='fixed top-0 left-0 w-full bg-black/60 backdrop-blur-md text-white z-50 shadow-lg'>
          <div className='max-w-6xl mx-auto flex justify-between items-center px-6 py-4'>
            {/* Left nav (desktop) */}
            <nav className='hidden md:flex gap-6 text-lg font-medium'>
              {['Home', 'About', 'Projects', 'Contact'].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(idx)}
                  className='hover:text-purple-400 transition'
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right links (desktop) */}
            <div className='hidden md:flex items-center gap-4'>
              <a
                href='https://github.com/jaskin21'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:text-purple-400 transition'
              >
                GitHub
              </a>
              <a
                href='https://www.linkedin.com/in/renz-jaskin-agmata-03284a18a/'
                target='_blank'
                className='hover:text-purple-400 transition'
              >
                LinkedIn
              </a>
              <a
                href='/Renz-Jaskin-Agmata-CV.pdf'
                download='Renz-Jaskin-Agmata-CV.pdf'
                className='px-4 py-2 bg-purple-600 hover:bg-purple-800 rounded-lg shadow-md text-sm font-semibold transition'
              >
                Download CV
              </a>
            </div>

            {/* 🍔 Burger (mobile) */}
            <button
              className='md:hidden text-white'
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {isOpen && (
            <div className='md:hidden bg-black/90 backdrop-blur-md px-6 py-4 space-y-4 text-center'>
              {['Home', 'About', 'Projects', 'Contact'].map((label, idx) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(idx)}
                  className='block w-full hover:text-purple-400 transition'
                >
                  {label}
                </button>
              ))}

              <div className='flex justify-center gap-4 pt-4 border-t border-gray-700'>
                <a
                  href='https://github.com/jaskin21'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-purple-400 transition'
                >
                  GitHub
                </a>
                <a
                  href='https://www.linkedin.com/in/renz-jaskin-agmata-03284a18a/'
                  target='_blank'
                  className='hover:text-purple-400 transition'
                >
                  LinkedIn
                </a>
              </div>
              <a
                href='/Renz-Jaskin-Agmata-CV.pdf'
                download='Renz-Jaskin-Agmata-CV.pdf'
                className='block w-full px-4 py-2 mt-2 bg-purple-600 hover:bg-purple-800 rounded-lg shadow-md text-sm font-semibold transition'
              >
                Download CV
              </a>
            </div>
          )}
        </header>
      )}

      {/* 🏠 Home Section */}
      <section
        id='greetings'
        className='h-screen flex items-center justify-center relative z-10 bg-gradient-to-b from-black/70 to-purple-900/40'
      >
        <div className='text-center text-white max-w-3xl mx-auto'>
          <h1 className='text-6xl font-extrabold mb-6'>Hi, I’m Renz Jaskin</h1>
          <p className='text-2xl text-gray-300 mb-10'>
            Fullstack Developer | MERN + AWS Serverless
          </p>
          <button
            onClick={() => handleNavClick(2)}
            className='px-8 py-4 bg-purple-600 hover:bg-purple-800 rounded-xl shadow-lg text-lg font-semibold transition'
          >
            View My Work
          </button>
        </div>
      </section>

      <section
        id='content'
      >
        {/* 👨‍💻 About Section */}
        <div className='h-screen flex items-center justify-center text-white relative z-10 bg-gradient-to-b from-purple-900/50 to-indigo-800/50 px-6'>
          <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
            {/* Left */}
            <div className='text-center md:text-left'>
              <img
                src={profileImg}
                alt='Renz Jaskin Agmata'
                className='w-56 h-56 md:w-64 md:h-64 rounded-full mx-auto md:mx-0 mb-8 border-4 border-purple-500 shadow-lg'
              />
              <h2 className='text-5xl font-bold mb-6'>About Me</h2>
              <p className='text-xl text-gray-300 font-medium leading-relaxed md:leading-loose'>
                Full-Stack Developer with expertise in building responsive
                applications using Next.js, React, and Node.js. Proficient in
                RESTful API design, CI/CD automation, and front-end/back-end
                integration. Experienced in testing and dedicated to code
                quality with GitHub version control.
              </p>
            </div>

            {/* Right: Skills */}
            <div className='flex flex-col items-center gap-y-10 scale-125'>
              <div className='flex gap-x-10'>
                {skills.slice(0, 4).map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>
              <div className='flex gap-x-10'>
                {skills.slice(4, 8).map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>
              <div className='flex gap-x-10'>
                {skills.slice(8, 12).map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>
              <div className='flex gap-x-10'>
                {skills.slice(12, 16).map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>
              <div className='flex gap-x-10'>
                {skills.slice(16, 18).map((skill) => (
                  <SkillItem key={skill.name} {...skill} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 📂 Projects */}
        <ProjectsShowcase
          setPageScrollEnabled={setPageScrollEnabled}
          pageScrollEnabled={pageScrollEnabled}
        />

        {/* ✉️ Contact Section */}
        <div className='h-screen flex flex-col items-center justify-between text-white relative z-10 bg-gradient-to-b from-black/70 to-purple-900/40 px-6 py-10'>
          {/* Center content */}
          <div className='flex flex-col items-center justify-center flex-grow w-full max-w-5xl'>
            <h2 className='text-5xl font-bold mb-4'>Contact</h2>
            <div className='w-24 h-1 bg-purple-500 rounded-full mb-8'></div>

            <p className='text-xl text-gray-300 font-medium text-center leading-relaxed md:leading-loose mb-10'>
              Let’s connect! Fill out the form below or reach me through my
              contact details.
            </p>

            <div className='grid md:grid-cols-2 gap-12 w-full'>
              {/* 📩 Contact Form */}
              <form
                action='https://formsubmit.co/b690c0be2522da1b736c8247fd7ec67d'
                method='POST'
                target='_blank'
                className='flex flex-col gap-4 p-8 rounded-2xl shadow-xl bg-white/5  border border-purple-500/30'
              >
                <input
                  type='text'
                  name='name'
                  placeholder='Your Name'
                  required
                  className='p-3 rounded-md bg-gray-900/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition'
                />
                <input
                  type='email'
                  name='email'
                  placeholder='Your Email'
                  required
                  className='p-3 rounded-md bg-gray-900/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition'
                />
                <input
                  type='tel'
                  name='contact'
                  placeholder='Contact Number'
                  required
                  className='p-3 rounded-md bg-gray-900/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition'
                />
                <textarea
                  name='message'
                  placeholder='Your Message'
                  required
                  rows={5}
                  className='p-3 rounded-md bg-gray-900/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition'
                ></textarea>

                <input
                  type='submit'
                  value='Send Message 🚀'
                  className='cursor-pointer px-6 py-3 bg-purple-600 hover:bg-purple-800 rounded-md font-semibold transition shadow-md hover:shadow-purple-500/30'
                />
              </form>

              {/* 📞 Contact Information */}
              <div className='space-y-6 border border-purple-500/30 bg-white/5  p-8 rounded-2xl shadow-xl'>
                <h3 className='text-3xl font-bold mb-4'>Contact Information</h3>
                <div className='space-y-4 text-gray-300 text-lg'>
                  <p className='flex items-center gap-3'>
                    <span className='text-purple-400'>📱</span> +63-938-029-6142
                    (Smart)
                  </p>
                  <p className='flex items-center gap-3'>
                    <span className='text-purple-400'>💬</span> +63-938-029-6142
                    (Telegram)
                  </p>
                  <p className='flex items-center gap-3'>
                    <span className='text-purple-400'>📞</span> +63-938-029-6142
                    (Viber)
                  </p>
                  <p className='flex items-center gap-3'>
                    <span className='text-purple-400'>✉️</span>{' '}
                    jaskin.agmata@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className='w-full border-t border-purple-500/20 mt-12 pt-6 px-6'>
            <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-gray-400 text-sm'>
              {/* Left section */}
              <div className='flex flex-col md:flex-row items-center gap-6 text-center md:text-left'>
                <a
                  href='https://github.com/jaskin21'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-purple-400 transition'
                >
                  GitHub
                </a>
                <a
                  href='https://www.linkedin.com/in/renz-jaskin-agmata-03284a18a/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-purple-400 transition'
                >
                  LinkedIn
                </a>
                <a
                  href='/Renz-Jaskin-Agmata-CV.pdf'
                  target='_blank'
                  download
                  className='hover:text-purple-400 transition'
                >
                  Resume
                </a>
              </div>

              {/* Right section */}
              <div className='text-center md:text-right text-xs text-gray-500'>
                © {new Date().getFullYear()} Renz Jaskin Agmata. All rights
                reserved.
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

function SkillItem({ name, logo }: { name: string; logo: string }) {
  return (
    <div className='flex flex-col items-center text-center transition-transform duration-300 hover:scale-125'>
      <img
        src={logo}
        alt={name}
        className={`w-12 h-12 mb-2 transition-transform ${
          name === 'Express.js' || name === 'GitHub' ? 'filter invert' : ''
        }`}
      />
      <span className='text-sm font-medium'>{name}</span>
    </div>
  );
}
