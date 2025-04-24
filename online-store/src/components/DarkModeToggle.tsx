import { useState, useEffect } from 'react';

interface DarkModeToggleProps {
  onThemeChange?: (theme: string) => void;
}

export const DarkModeToggle = ({ onThemeChange }: DarkModeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'default' : 'dark';
    
    // Update the document attribute
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update state
    setIsDarkMode(!isDarkMode);
    
    // Notify parent component if callback is provided
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Enable Light Mode' : 'Enable Dark Mode'}
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};