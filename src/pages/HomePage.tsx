import { useEffect, useState } from 'react';
import StarBackground from '../components/home/StarBackground';
import profileImg from '../assets/img/Profile.png';
import ProjectsShowcase from '@/components/home/ProjectShowcase';

import skills from '../assets/link/logo';

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [pageScrollEnabled, setPageScrollEnabled] = useState(true);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section');
    let touchStartY = 0;
    let wheelDelta = 0;

    const lockScroll = () => {
      setIsLocked(true);
      wheelDelta = 0; // reset accumulated delta
      setTimeout(() => setIsLocked(false), 700);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!pageScrollEnabled || isLocked) return;

      wheelDelta += e.deltaY;

      // ✅ Use a larger threshold to filter out touchpad jitter
      if (wheelDelta > 100 && current < sections.length - 1) {
        setCurrent((prev) => prev + 1);
        lockScroll();
      } else if (wheelDelta < -100 && current > 0) {
        setCurrent((prev) => prev - 1);
        lockScroll();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!pageScrollEnabled || isLocked) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffY) < 50) return;

      if (diffY > 0 && current < sections.length - 1) {
        setCurrent((prev) => prev + 1);
        lockScroll();
      } else if (diffY < 0 && current > 0) {
        setCurrent((prev) => prev - 1);
        lockScroll();
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
  }, [current, isLocked, pageScrollEnabled]);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section');
    sections[current]?.scrollIntoView({ behavior: 'smooth' });

    // Show header after leaving the first section
    setShowHeader(current > 0);
  }, [current]);

  const handleNavClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className='h-screen w-full overflow-hidden relative'>
      {/* 🌌 Background */}
      <StarBackground />

      {showHeader && (
        <header className='fixed top-0 left-0 w-full bg-black/60 backdrop-blur-md text-white z-50 shadow-lg'>
          <div className='max-w-6xl mx-auto flex justify-between items-center px-6 py-4'>
            {/* Left side nav */}
            <nav className='flex gap-6 text-lg font-medium'>
              <button
                onClick={() => handleNavClick(0)}
                className='hover:text-purple-400 transition'
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick(1)}
                className='hover:text-purple-400 transition'
              >
                About
              </button>
              <button
                onClick={() => handleNavClick(2)}
                className='hover:text-purple-400 transition'
              >
                Projects
              </button>
              <button
                onClick={() => handleNavClick(3)}
                className='hover:text-purple-400 transition'
              >
                Contact
              </button>
            </nav>

            {/* Right side social links + resume */}
            <div className='flex items-center gap-4'>
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
          </div>
        </header>
      )}

      {/* 🏠 Home Section */}
      <section className='h-screen flex items-center justify-center relative z-10 bg-gradient-to-b from-black/70 to-purple-900/40'>
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

      {/* 👨‍💻 About Section */}
      <section className='h-screen flex items-center justify-center text-white relative z-10 bg-gradient-to-b from-purple-900/50 to-indigo-800/40 px-6'>
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
              integration. Experienced in testing and dedicated to code quality
              with GitHub version control.
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
      </section>

      {/* 📂 Projects */}
      <ProjectsShowcase
        setPageScrollEnabled={setPageScrollEnabled}
        pageScrollEnabled={pageScrollEnabled}
      />

      {/* ✉️ Contact */}
      <section className='h-screen flex flex-col items-center justify-between text-white relative z-10 bg-gradient-to-b from-black/70 to-purple-900/40 px-6 py-10'>
        <div className='flex flex-col items-center justify-center flex-grow w-full max-w-5xl'>
          <h2 className='text-5xl font-bold mb-4'>Contact</h2>
          <div className='w-24 h-1 bg-purple-500 rounded-full mb-8'></div>
          <p className='text-xl text-gray-300 font-medium text-center leading-relaxed md:leading-loose mb-10'>
            Let’s connect! Fill out the form below or reach me through my
            contact details.
          </p>

          <div className='grid md:grid-cols-2 gap-12 w-full'>
            {/* 📩 Form */}
            <form
              action='https://formsubmit.co/b690c0be2522da1b736c8247fd7ec67d'
              method='POST'
              target='_blank'
              className='flex flex-col gap-4 p-8 rounded-2xl shadow-xl bg-white/5 border border-purple-500/30'
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

            {/* 📞 Info */}
            <div className='space-y-6 border border-purple-500/30 bg-white/5 p-8 rounded-2xl shadow-xl'>
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
            <div className='flex gap-6 md:text-left'>
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
            <div className='text-center md:text-right text-xs text-gray-500'>
              © {new Date().getFullYear()} Renz Jaskin Agmata. All rights
              reserved.
            </div>
          </div>
        </footer>
      </section>
    </div>
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