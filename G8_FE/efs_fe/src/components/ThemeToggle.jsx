import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="btn btn-outline-secondary btn-sm"
      style={{borderRadius: '20px'}}
    >
      <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
      <span className="ms-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;