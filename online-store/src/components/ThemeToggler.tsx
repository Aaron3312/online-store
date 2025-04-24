import { useTheme } from './ThemeProvider';

export const ThemeToggler = () => {
  // Get theme and setTheme from ThemeProvider context
  const { theme, setTheme } = useTheme();

  // Toggle between themes
  const toggleTheme = (selectedTheme: 'default' | 'dark' | 'custom') => {
    setTheme(selectedTheme);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {/* Show appropriate toggle buttons based on current theme */}
      {theme === 'default' && (
        <>
          <button
            className="dark-mode-toggle"
            onClick={() => toggleTheme('dark')}
            aria-label="Enable Dark Mode"
          >
            🌙 Dark
          </button>
          <button
            className="custom-theme-toggle"
            onClick={() => toggleTheme('custom')}
            aria-label="Enable Custom Theme"
          >
            🎨 Custom
          </button>
        </>
      )}

      {theme === 'dark' && (
        <>
          <button
            className="dark-mode-toggle"
            onClick={() => toggleTheme('default')}
            aria-label="Enable Light Mode"
          >
            ☀️ Light
          </button>
          <button
            className="custom-theme-toggle"
            onClick={() => toggleTheme('custom')}
            aria-label="Enable Custom Theme"
          >
            🎨 Custom
          </button>
        </>
      )}

      {theme === 'custom' && (
        <>
          <button
            className="dark-mode-toggle"
            onClick={() => toggleTheme('dark')}
            aria-label="Enable Dark Mode"
          >
            🌙 Dark
          </button>
          <button
            className="custom-theme-toggle"
            onClick={() => toggleTheme('default')}
            aria-label="Enable Default Theme"
          >
            ☀️ Default
          </button>
        </>
      )}
    </div>
  );
};