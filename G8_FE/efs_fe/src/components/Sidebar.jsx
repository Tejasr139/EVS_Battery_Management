import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSession();
  const { t } = useLanguage();

  const baseMenuItems = [
    { icon: '🏠', label: t('sidebar.home'), path: '/home' },
    { icon: '📊', label: t('sidebar.batteryData'), path: '/battery-data' },
    { icon: '📈', label: t('sidebar.analytics'), path: '/analytics' }
  ];

  const adminMenuItems = [
    { icon: '👥', label: t('sidebar.userManagement'), path: '/admin/users' },
    { icon: '⚙️', label: t('sidebar.systemSettings'), path: '/admin/settings' },
    { icon: '📋', label: t('sidebar.systemLogs'), path: '/admin/logs' }
  ];

  console.log('Sidebar - User:', user);
  console.log('Sidebar - User Role:', user?.role);
  
  const menuItems = user?.role === 'ADMIN' ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;
  
  console.log('Sidebar - Menu Items:', menuItems);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <section className="sidebar-logo">
          <span style={{fontSize: '1.5rem'}}>⚡</span>
          <span>EFS Manager</span>
        </section>
      </header>
      
      <nav className="sidebar-nav">
        <section className="nav-list">
          {menuItems.map((item, index) => (
            <article key={index} className="nav-item">
              <button 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                <span style={{fontSize: '1.2rem'}}>{item.icon}</span>
                <span>{item.label}</span>
                <section className="nav-indicator"></section>
              </button>
            </article>
          ))}
        </section>
      </nav>
      
      <footer className="sidebar-footer">
        <section className="language-switcher" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <LanguageSwitcher />
        </section>
        <section className="user-profile">
          <figure className="user-avatar">
            <span style={{fontSize: '1.2rem'}}>👤</span>
          </figure>
          <section className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role || 'USER'}</span>
          </section>
        </section>
      </footer>
    </aside>
  );
};

export default Sidebar;