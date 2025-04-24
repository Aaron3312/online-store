import { useState, useEffect } from 'react';

interface CustomThemeToggleProps {
  onThemeChange?: (theme: string) => void;
}

export const CustomThemeToggle = ({ onThemeChange }: CustomThemeToggleProps) => {
  const [isCustomTheme, setIsCustomTheme] = useState(false);

  // Initialize based on localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'custom') {
      setIsCustomTheme(true);
    }
  }, []);

  const toggleCustomTheme = () => {
    const newTheme = isCustomTheme ? 'default' : 'custom';
    
    // Update the document attribute
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update state
    setIsCustomTheme(!isCustomTheme);
    
    // Notify parent component if callback is provided
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <button
      className="custom-theme-toggle"
      onClick={toggleCustomTheme}
      aria-label={isCustomTheme ? 'Enable Default Theme' : 'Enable Custom Theme'}
    >
      {isCustomTheme ? '☀️ Default' : '🎨 Custom'}
    </button>
  );
};