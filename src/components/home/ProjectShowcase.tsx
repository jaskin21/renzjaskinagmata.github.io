import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import skills from '../../assets/link/logo';

const projects = [
  {
    title: 'Ecommerce Store',
    platform: 'desktop',
    description:
      'E-commerce App to let users browse products, add/remove items from the cart, and view the total purchase amount, with a responsive UI and user-friendly UX built using React, Zustand, and Tailwind CSS.',
    image: '/images/ecommerce-app.png',
    video:
      'https://bboxvitovuruzshokbxr.supabase.co/storage/v1/object/sign/Portfolio/ecommerce.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNjNkZDBjOS0xNmY4LTQxY2ItYjBhMS00M2QyMzM3M2IxMTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQb3J0Zm9saW8vZWNvbW1lcmNlLm1wNCIsImlhdCI6MTc1OTI5NTY1MiwiZXhwIjoxODIyMzY3NjUyfQ.PZzYkdRK49pR-tJ_CHyhhR_0t2RNpDh0-oJfHMkxmME',
    previewUrl: 'https://jaskindev-ecommerce-app.netlify.app/',
    frontendUrl: 'https://github.com/jaskin21/ecommerce-app',
    fullstackUrl: '',
    techStack: [
      'Node.js',
      'React JS',
      'Zustand',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
    ], // this is required for logos at the bottom
  },
  {
    title: 'Budget Mobile App',
    platform: 'mobile',
    description:
      'Budget Record App built with React Native, Tailwind CSS, and Zustand, allowing users to add expenses, track income and expense history, view total balances, and visualize spending with a pie chart to see where most of the budget goes.',
    image: '/images/budget-app.png',
    video:
      'https://bboxvitovuruzshokbxr.supabase.co/storage/v1/object/sign/Portfolio/Budget-app.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNjNkZDBjOS0xNmY4LTQxY2ItYjBhMS00M2QyMzM3M2IxMTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQb3J0Zm9saW8vQnVkZ2V0LWFwcC5tcDQiLCJpYXQiOjE3NTkyOTY4NDUsImV4cCI6MTgyMjM2ODg0NX0.5t2TRwZeyLCU-irI12LGzhp678ZNj7t0zVERblrVhyY',
    previewUrl: '',
    frontendUrl: 'https://github.com/jaskin21/budget--mobile-app',
    fullstackUrl: '',
    techStack: [
      'React Native',
      'Zustand',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
    ], // this is required for logos at the bottom
  },
  {
    title: 'Todo App',
    platform: 'desktop',
    description:
      'Todo App to help users organize task by adding, edit, delete, and complete tasks, with the option to set urgency levels (low, medium, high, urgent) and custom priority levels (1–5). Tasks are automatically sorted by urgency and level, making it easy to focus on what’s most important. A built-in dark mode improves usability, and pagination.',
    image: '/images/todo-app.png',
    video:
      'https://bboxvitovuruzshokbxr.supabase.co/storage/v1/object/sign/Portfolio/todo-app.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xNjNkZDBjOS0xNmY4LTQxY2ItYjBhMS00M2QyMzM3M2IxMTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQb3J0Zm9saW8vdG9kby1hcHAubXA0IiwiaWF0IjoxNzU5Mjk2NzY4LCJleHAiOjE4MjIzNjg3Njh9.D91t3VH_9PWgsYqPUd95DszKQgHezYZ7yulv2KVqDoY',
    previewUrl: 'https://jaskindev-todoapp.netlify.app/',
    frontendUrl: 'https://github.com/jaskin21/todo-app-v2',
    fullstackUrl: '',
    techStack: [
      'Node.js',
      'Next.js',
      'Zustand',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
    ], // this is required for logos at the bottom
  },
  {
    title: 'Track Expense App',
    platform: 'desktop',
    description:
      'Track Expense App to help users manage their finances. It lets you add, edit, delete, and view expenses, with the option to filter by date range. A built-in pie chart shows the percentage breakdown of spending, making it easy to see where your money goes at a glance.',
    image: '/images/track-expenses.png',
    previewUrl: '',
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
    platform: 'desktop',
    description:
      'Geo Location App that helps users look up location details by entering an IP address. The app records every search in a history list, allowing users to quickly revisit past lookups. It also includes a bookmarking feature, so important searches can be saved and accessed anytime through a convenient side drawer.',
    image: '/images/ipAddressSearch.png',
    previewUrl: '',
    frontendUrl: 'https://github.com/jaskin21/geo-location-app',
    techStack: [
      'Node.js',
      'JavaScript',
      'TypeScript',
      'TailwindCSS',
      'React JS',
      'Express.js',
      'MongoDB',
    ],
  },
];

export default function ProjectsShowcase( {
  setPageScrollEnabled,
  pageScrollEnabled,
}: {
  setPageScrollEnabled: ( enabled: boolean ) => void;
  pageScrollEnabled: boolean;
} ) {
  const [index, setIndex] = useState( 0 );
  const showcaseRef = useRef<HTMLDivElement>( null );

  // --- wheel navigation ---
  useEffect( () => {
    if ( pageScrollEnabled ) return;

    let lastTime = 0;
    const throttleMs = 180;

    const handleWheel = ( e: WheelEvent ) => {
      const now = Date.now();
      if ( now - lastTime < throttleMs ) return;
      lastTime = now;

      if ( e.deltaY > 0 && index < projects.length - 1 ) {
        setIndex( ( i ) => Math.min( projects.length - 1, i + 1 ) );
      } else if ( e.deltaY < 0 && index > 0 ) {
        setIndex( ( i ) => Math.max( 0, i - 1 ) );
      }
    };

    window.addEventListener( 'wheel', handleWheel, { passive: true } );
    return () => window.removeEventListener( 'wheel', handleWheel );
  }, [pageScrollEnabled, index] );

  // --- calculate carousel position ---
  const getPosition = ( i: number, current: number ) => {
    const offset = i - current;

    if ( offset === 0 ) {
      // active (center) card — bigger
      return { x: 0, scale: 1.2, opacity: 1, zIndex: 40 };
    }
    if ( offset === -1 || offset === 1 ) {
      // left or right neighbor
      return { x: offset * 350, scale: 1, opacity: 0.6, zIndex: 20 };
    }
    // far items
    return { x: offset * 300, scale: 0.8, opacity: 0.2, zIndex: 10 };
  };

  return (
    <section className='h-screen flex flex-col items-center justify-center text-white relative bg-gradient-to-b from-indigo-800/50 to-black/60 px-6 overflow-hidden'>
      {/* Title - non-blocking */}
      <h1 className='text-5xl font-bold mb-4 text-center pointer-events-none z-10 relative'>
        Projects
      </h1>
      <div className='w-24 h-1 bg-purple-500 rounded-full  mb-20'></div>

      {/* Showcase */}
      <div
        ref={showcaseRef}
        onMouseEnter={() => setPageScrollEnabled( false )}
        onMouseLeave={() => setPageScrollEnabled( true )}
        className="relative w-full max-w-6xl h-[550px] flex items-center justify-center overflow-visible z-20"
      >
        {projects.map( ( project, i ) => {
          const pos = getPosition( i, index );
          const isActive = i === index;
          const isMobileProject = project.platform === "mobile";

          return (
            <motion.div
              key={i}
              animate={{
                ...pos,
                backgroundColor:
                  i === index
                    ? pageScrollEnabled
                      ? 'rgba(31,31,36,0.9)'   // dark solid when active
                      : 'rgba(31,31,36,0.95)'  // even darker when scroll is disabled
                    : 'rgba(255,255,255,0.05)', // inactive stays light/transparent
              }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className={`absolute border p-5 rounded-xl shadow-xl cursor-pointer bg-black ${isActive ? "border-gray-400/25" : "border-transparent"
                }`}
              style={{
                zIndex: pos.zIndex,
                width: 600,
                height: 550,
              }}
              onClick={() => setIndex( i )}
            >
              {/* Layout wrapper: side-by-side for mobile, stacked for desktop */}
              <div
                className={`flex ${isMobileProject ? "flex-row h-full" : "flex-col"
                  } gap-4`}
              >
                {/* Left (image/video) */}
                <div
                  className={`relative group ${isMobileProject ? "w-1/2 h-full" : "w-full h-[300px]"
                    }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg bg-black"
                  />

                  {project.video && isActive && (
                    <video
                      src={project.video}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onMouseEnter={( e ) => e.currentTarget.play()}
                      onMouseLeave={( e ) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  )}

                  {/* Overlay Links */}
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 rounded-lg opacity-0 transition-opacity duration-300 ${isActive ? "group-hover:opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                  >
                    {project.previewUrl && (
                      <a
                        href={project.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition"
                      >
                        🔗 Live Preview
                      </a>
                    )}

                    {project.frontendUrl && project.backendUrl ? (
                      <>
                        <a
                          href={project.frontendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition"
                        >
                          💻 Frontend Code
                        </a>

                        <a
                          href={project.backendUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition"
                        >
                          ⚙️ Backend Code
                        </a>
                      </>
                    ) : project.frontendUrl || project.backendUrl ? (
                      <a
                        href={project.frontendUrl || project.backendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white hover:text-black transition"
                      >
                        📂 View Code
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Right (details for mobile) or below (desktop) */}
                <div
                  className={`flex flex-col ${isMobileProject ? "w-1/2 h-full justify-between px-3" : "w-full"
                    }`}
                >
                  {/* Title */}
                  <h2
                    className={`text-gray-300 text-center mt-4 font-bold text-lg ${isActive ? "opacity-100" : "opacity-40"
                      }`}
                  >
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p
                    className={`text-gray-300 mt-2 mb-4 text-[13px] text-justify px-6 ${isActive
                        ? "opacity-100"
                        : "opacity-20 text-thin pointer-events-none"
                      }`}
                  >
                    {project.description}
                  </p>

                  {/* Logos */}
                  <div
                    className={`flex flex-wrap justify-center gap-4 mt-auto pb-5 ${isActive ? "opacity-100" : "opacity-20 pointer-events-none"
                      }`}
                  >
                    {project.techStack?.map( ( tech, idx ) => {
                      const skill = skills.find( ( s ) => s.name === tech );
                      if ( !skill ) return null;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-125"
                        >
                          <img
                            src={skill.logo}
                            alt={skill.name}
                            className={`w-7 h-7 object-contain ${skill.name === "Express.js" || skill.name === "GitHub"
                                ? "filter invert"
                                : ""
                              }`}
                            title={skill.name}
                          />
                          <span className="mt-1 text-[8px] font-medium">
                            {skill.name}
                          </span>
                        </div>
                      );
                    } )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        } )}
      </div>


      {/* Page indicator - non-blocking */}
      <div className='flex gap-2 mt-20 pointer-events-none relative z-10'>
        {projects.map( ( _, i ) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-purple-500' : 'bg-gray-500/50'
              }`}
          />
        ) )}
      </div>
    </section>
  );
}
