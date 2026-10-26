import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('golanka_theme') === 'light';
  });

  // Synchronize theme with document element and mobile browser theme-color meta tag
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('golanka_theme', 'light');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#f8fafc');
      }
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('golanka_theme', 'dark');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#020617');
      }
    }
  }, [isLightMode]);

  // High-performance theme toggle with radial circular transition
  const toggleTheme = (e) => {
    const nextMode = !isLightMode;

    // Calculate origin coordinates for radial wave
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    const x = e?.clientX ?? (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const y = e?.clientY ?? (rect ? rect.top + rect.height / 2 : 40);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Glowing Radial Ripple expanding outwards across the screen
    try {
      const ripple = document.createElement('div');
      ripple.className = 'theme-radial-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.setProperty('--ripple-radius', `${endRadius * 2.2}px`);
      ripple.style.background = nextMode
        ? 'radial-gradient(circle, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.92) 50%, rgba(226, 232, 240, 0.7) 100%)'
        : 'radial-gradient(circle, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(15, 23, 42, 0.7) 100%)';
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    } catch {
      // Fallback
    }

    // Native View Transitions API with circular clip path
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = document.startViewTransition(() => {
        setIsLightMode(nextMode);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      setIsLightMode(nextMode);
    }
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, setIsLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
