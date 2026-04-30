import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiActivity, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return "U";
    const name = user.full_name || user.email || "User";
    return name
      .split(/[\s_@.]+/)
      .filter(Boolean)
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          <FiActivity size={28} color="var(--primary)" />
          <span>Vitalis</span>
        </Link>
        <div style={styles.navLinks}>
          {user ? (
            <>
              {location.pathname !== '/dashboard' && (
                <Link to="/dashboard" style={styles.navLink}>
                  Dashboard
                </Link>
              )}
              <div className="profile-container" style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsOpen(prev => !prev)}
                  style={styles.profileBtn}
                >
                  <div style={styles.avatar}>
                    {getInitials()}
                  </div>
                  <span style={{ fontWeight: '600' }}>{user.full_name || user.name}</span>
                </button>

                {isOpen && (
                  <div className="dropdown glass-panel animate-fade-in" style={styles.dropdown}>
                    <div 
                      style={styles.dropdownItem} 
                      onClick={() => { navigate('/profile'); setIsOpen(false); }}
                    >
                      <FiUser /> View Profile
                    </div>
                    <div 
                      style={{ ...styles.dropdownItem, color: 'var(--danger)' }} 
                      onClick={handleLogout}
                    >
                      <FiLogOut /> Logout
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'rgba(11, 15, 25, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '1rem 0',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-main)',
    letterSpacing: '-0.5px'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    color: 'var(--text-muted)',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.95rem'
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.4rem 1rem 0.4rem 0.4rem',
    borderRadius: '100px',
    color: 'var(--text-main)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
    fontSize: '0.9rem'
  },
  dropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: '200px',
    padding: '0.5rem',
    zIndex: 1000,
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  },
  dropdownHeader: {
    padding: '0.8rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '0.5rem'
  },
  dropdownItem: {
    display: 'block',
    padding: '0.7rem 1rem',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    '&:hover': {
      background: 'rgba(255,255,255,0.05)'
    }
  }
};

export default Navbar;
