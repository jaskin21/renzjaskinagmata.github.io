import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import skills from '../../assets/link/logo';

const projects = [
  {
    title: 'Todo App',
    description:
      'Todo App to help users organize task by adding, edit, delete, and complete tasks, with the option to set urgency levels (low, medium, high, urgent) and custom priority levels (1–5). Tasks are automatically sorted by urgency and level, making it easy to focus on what’s most important. A built-in dark mode improves usability, and pagination.',
    image: '/images/todo-app.png',
    video:
      'https://bboxvitovuruzshokbxr.supabase.co/storage/v1/object/sign/Portfolio/Screen%20Recording%202025-09-25%20134516.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNjNkZDBjOS0xNmY4LTQxY2ItYjBhMS00M2QyMzM3M2IxMTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQb3J0Zm9saW8vU2NyZWVuIFJlY29yZGluZyAyMDI1LTA5LTI1IDEzNDUxNi5tcDQiLCJpYXQiOjE3NTg3NzkyNDksImV4cCI6MTc5MDMxNTI0OX0.LCV0luXKc9xFp5FMPOJVmxeIkRcdDAjg9uCQJWlr018',
    previewUrl: 'https://jaskindev-todoapp.netlify.app/',
    frontendUrl: 'https://github.com/jaskin21/todo-app-v2',
    fullstackUrl: '',
    techStack: [
      'Node.js',
      'Next.js',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
    ], // this is required for logos at the bottom
  },
  {
    title: 'Track Expense App',
    description:
      'Track Expense App to help users manage their finances. It lets you add, edit, delete, and view expenses, with the option to filter by date range. A built-in pie chart shows the percentage breakdown of spending, making it easy to see where your money goes at a glance.',
    image: '/images/track-expenses.png',
    previewUrl: '#',
    frontendUrl: 'https://github.com/jaskin21/daily-expenses-FE',
    backendUrl: 'https://github.com/jaskin21/daily-expenses-BE',
    fullstackUrl: '',
    techStack: [
      'Node.js',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
      'React JS',
      'Express.js',
      'DynamoDB',
    ], // this is required for logos at the bottom
  },
  {
    title: 'Geo Location App',
    description:
      'Geo Location App that helps users look up location details by entering an IP address. The app records every search in a history list, allowing users to quickly revisit past lookups. It also includes a bookmarking feature, so important searches can be saved and accessed anytime through a convenient side drawer.',
    image: '/images/ipAddressSearch.png',
    previewUrl: '#',
    frontendUrl: 'https://github.com/jaskin21/geo-location-app',
    techStack: [
      'Node.js',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
      'React JS',
      'Express.js',
      'MongoDB',
    ], // this is required for logos at the bottom
  },
  // {
  //   title: 'Project 3',
  //   description: 'Short description of project 3.',
  //   image: '/images/Project3.png',
  //   previewUrl: '#',
  //   backendUrl: '#',
  // },
  // {
  //   title: 'Project 3',
  //   description: 'Short description of project 3.',
  //   image: '/images/Project3.png',
  //   previewUrl: '#',
  //   backendUrl: '#',
  // },
  // {
  //   title: 'Project 3',
  //   description: 'Short description of project 3.',
  //   image: '/images/Project3.png',
  //   previewUrl: '#',
  //   backendUrl: '#',
  // },
];

export default function ProjectsShowcase({
  setPageScrollEnabled,
  pageScrollEnabled,
}: {
  setPageScrollEnabled: (enabled: boolean) => void;
  pageScrollEnabled: boolean;
}) {
  const [index, setIndex] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // --- wheel navigation ---
  useEffect(() => {
    if (pageScrollEnabled) return;

    let lastTime = 0;
    const throttleMs = 180;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      if (e.deltaY > 0 && index < projects.length - 1) {
        setIndex((i) => Math.min(projects.length - 1, i + 1));
      } else if (e.deltaY < 0 && index > 0) {
        setIndex((i) => Math.max(0, i - 1));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [pageScrollEnabled, index]);

  // --- calculate carousel position ---
  const getPosition = (i: number, current: number) => {
    const offset = i - current;

    if (offset === 0) {
      // active (center) card — bigger
      return { x: 0, scale: 1.2, opacity: 1, zIndex: 40 };
    }
    if (offset === -1 || offset === 1) {
      // left or right neighbor
      return { x: offset * 350, scale: 1, opacity: 0.6, zIndex: 20 };
    }
    // far items
    return { x: offset * 300, scale: 0.8, opacity: 0.2, zIndex: 10 };
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center text-white relative bg-gradient-to-b from-indigo-800/50 to-black/60 px-6 overflow-hidden'>
      {/* Title - non-blocking */}
      <h1 className='text-5xl font-bold mb-4 text-center pointer-events-none z-10 relative'>
        Projects
      </h1>
      <div className='w-24 h-1 bg-purple-500 rounded-full  mb-20'></div>

      {/* Showcase */}
      <div
        ref={showcaseRef}
        onMouseEnter={() => setPageScrollEnabled(false)}
        onMouseLeave={() => setPageScrollEnabled(true)}
        className='relative w-full max-w-6xl h-[550px] flex items-center justify-center overflow-visible z-20'
      >
        {projects.map((project, i) => {
          const pos = getPosition(i, index);
          return (
            <motion.div
              key={i}
              animate={{
                ...pos,
                backgroundColor:
                  i === index
                    ? pageScrollEnabled
                      ? 'rgba(139,92,246,0.15)'
                      : 'rgba(139,92,246, 0.25)'
                    : 'rgba(255,255,255,0.05)',
              }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className={`absolute border p-5 rounded-xl shadow-xl flex flex-col cursor-pointer ${
                i === index ? 'border-gray-400/25' : 'border-transparent'
              }`}
              style={{
                zIndex: pos.zIndex,
                width: 600,
                height: 550,
              }}
              onClick={() => setIndex(i)}
            >
              {/* Image Wrapper with group hover */}
              <div className='relative w-full h-[300px] group'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='w-full h-full object-cover rounded-lg bg-black'
                />

                {project.video && i === index && (
                  <video
                    src={project.video}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className='absolute inset-0 w-full h-full object-cover rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0; // reset when leaving
                    }}
                  />
                )}

                {/* Overlay Links */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 rounded-lg opacity-0 transition-opacity duration-300 ${
                    i === index
                      ? 'group-hover:opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {project.previewUrl && (
                    <a
                      href={project.previewUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition'
                    >
                      🔗 Live Preview
                    </a>
                  )}

                  {project.frontendUrl && project.backendUrl ? (
                    <>
                      <a
                        href={project.frontendUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition'
                      >
                        💻 Frontend Code
                      </a>

                      <a
                        href={project.backendUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition'
                      >
                        ⚙️ Backend Code
                      </a>
                    </>
                  ) : project.frontendUrl || project.backendUrl ? (
                    <a
                      href={project.frontendUrl || project.backendUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition'
                    >
                      📂 View Code
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Title */}
              <h2
                className={`text-gray-300 text-center mt-4 font-bold text-lg ${
                  i === index ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {project.title}
              </h2>

              {/* Description */}
              <p
                className={`text-gray-300 mt-2 mb-4 text-[13px] text-justify px-6 ${
                  i === index ? 'opacity-100' : 'opacity-20'
                }`}
              >
                {project.description}
              </p>

              {/* Logos - Bottom */}
              <div
                className={`flex flex-wrap justify-center gap-4 mt-auto pb-5 ${
                  i === index ? 'opacity-100' : 'opacity-20 pointer-events-none'
                }`}
              >
                {project.techStack?.map((tech, idx) => {
                  const skill = skills.find((s) => s.name === tech); // match by name
                  if (!skill) return null; // skip if not found

                  return (
                    <div className='flex flex-col items-center text-center transition-transform duration-300 hover:scale-125'>
                      <img
                        key={idx}
                        src={skill.logo}
                        alt={skill.name}
                        className={`w-7 h-7 object-contain ${
                          skill.name === 'Express.js' || skill.name === 'GitHub'
                            ? 'filter invert'
                            : ''
                        }`}
                        title={skill.name}
                      />
                      <span className='mt-1 text-[8px] font-medium'>
                        {skill.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Page indicator - non-blocking */}
      <div className='flex gap-2 mt-20 pointer-events-none relative z-10'>
        {projects.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? 'bg-purple-500' : 'bg-gray-500/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
