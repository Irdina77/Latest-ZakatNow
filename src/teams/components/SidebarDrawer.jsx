import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getTranslationSection } from '../translations/translations';
import { UserRound, Circle, X, House, Calculator, Building2, BadgeDollarSign, HandCoins, BookOpen, Bookmark, LogOut } from 'lucide-react';
import './SidebarDrawer.css';

const SidebarDrawer = ({ isOpen, onClose, side = 'left' }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, 'sidebar');
  const tSettings = getTranslationSection(language, 'settingsModal');
  const tProfile = getTranslationSection(language, 'profileModal');
  const tNisab = getTranslationSection(language, 'nisabModal');
  const tLogout = getTranslationSection(language, 'logoutModal');

  // Modal states
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNisab, setShowNisab] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Settings states
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // User data
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Nisab data
  const [nisabData, setNisabData] = useState({
    goldPrice: 250,
    nisabValue: 6250,
    zakatRate: 2.5,
    state: 'Kelantan'
  });

  useEffect(() => {
    // Load user data
    const email = localStorage.getItem('userEmail') || '';
    setUserEmail(email);

    const role = localStorage.getItem('userRole') || 'user';
    setUserRole(role);

    // Get user name from registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find(u => u.email === email);
    if (user) {
      setUserName(user.username);
    }

    // Load settings
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    setDarkMode(savedSettings.darkMode || false);
    setNotifications(savedSettings.notifications !== false);
    // language selection removed per UI requirements

    // Load nisab data (if available from UpdateNisabRate)
    const savedNisab = JSON.parse(localStorage.getItem('nisabData') || '{}');
    if (savedNisab.goldPrice) {
      setNisabData(savedNisab);
    }
  }, [language]);

  const menuItems = [
    { id: 'home', label: t.homePage || 'Home Page', path: '/dashboard', icon: House },
    { id: 'calculator', label: t.calculateZakat || 'Calculate Zakat', path: '/calculator', icon: Calculator },
    { id: 'business-setup', label: t.businessSetup || 'Business Setup', path: '/business-setup', icon: Building2 },
    { id: 'nisab-rate', label: t.nisabRate || 'Nisab Rate', action: 'nisab', icon: BadgeDollarSign },
    { id: 'profile', label: t.profile || 'Profile', path: '/profile', icon: UserRound },
    { id: 'pay-zakat', label: t.payZakat || 'Pay Zakat', path: '/pay-zakat', icon: HandCoins },
    { id: 'about-zakat', label: t.aboutZakat || 'About Zakat', action: 'about', icon: BookOpen, dividerBefore: true },
    { id: 'zakat-guide', label: t.zakatGuide || 'Zakat Guide', action: 'guide', icon: Bookmark },
    { id: 'logout', label: t.logOut || 'Log Out', action: 'logout', icon: LogOut, dividerBefore: true },
  ];

  const handleMenuClick = (item) => {
    if (item.action === 'profile') {
      setShowProfile(true);
    } else if (item.action === 'settings') {
      setShowSettings(true);
    } else if (item.action === 'nisab') {
      setShowNisab(true);
    } else if (item.action === 'about') {
      onClose();
      setShowAboutModal(true);
    } else if (item.action === 'guide') {
      onClose();
      setShowGuideModal(true);
    } else if (item.action === 'logout') {
      setShowLogoutConfirm(true);
    } else if (item.path) {
      navigate(item.path);
      onClose();
    }
  };

  const handleSettingsSave = () => {
    const settings = { darkMode, notifications };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setShowSettings(false);
    // Apply dark mode if needed
    document.body.classList.toggle('dark-mode', darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
    onClose();
  };

  const drawerVariants = side === 'right' ? {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  } : {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  const modalVariants = {
    closed: { opacity: 0, scale: 0.8 },
    open: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="sidebar-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className={`sidebar-drawer ${side === 'right' ? 'right' : ''}`}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* User Profile Section */}
            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                <UserRound size={36} strokeWidth={2} />
              </div>
              <div className="sidebar-user-info">
                <h3 className="sidebar-welcome">{t.welcomeBack}</h3>
                <p className="sidebar-email">{userEmail || 'user@example.com'}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="sidebar-divider" />

            {/* Menu Items */}
            <nav className="sidebar-nav">
              {menuItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {item.dividerBefore && <div className="sidebar-menu-section-divider" />}
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                    className="sidebar-menu-item"
                    onClick={() => handleMenuClick(item)}
                  >
                    <item.icon size={18} strokeWidth={2} className="sidebar-menu-icon" />
                    <span className="sidebar-menu-label">{item.label}</span>
                  </motion.div>
                </React.Fragment>
              ))}
            </nav>

            {/* Islamic Pattern Accent */}
            <div className="sidebar-pattern">
              <div className="pattern-element"><Circle size={8} strokeWidth={1.5} /></div>
              <div className="pattern-element"><Circle size={8} strokeWidth={1.5} /></div>
              <div className="pattern-element"><Circle size={8} strokeWidth={1.5} /></div>
            </div>
          </motion.div>
        </>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              className="modal-content profile-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{tProfile.title}</h2>
                <button className="modal-close" onClick={() => setShowProfile(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <div className="profile-info">
                  <div className="profile-item">
                    <label>{tProfile.fullName}</label>
                    <span>{userName || tProfile.notAvailable}</span>
                  </div>
                  <div className="profile-item">
                    <label>{tProfile.email}</label>
                    <span>{userEmail}</span>
                  </div>
                  <div className="profile-item">
                    <label>{tProfile.userRole}</label>
                    <span>{userRole}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              className="modal-content settings-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{tSettings.title}</h2>
                <button className="modal-close" onClick={() => setShowSettings(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <div className="settings-group">
                  <div className="setting-item">
                    <label>{tSettings.darkMode}</label>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>{tSettings.notifications}</label>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  {/* language selection removed per UI requirements */}
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowSettings(false)}>{tSettings.cancel}</button>
                  <button className="btn-primary" onClick={handleSettingsSave}>{tSettings.save}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nisab Modal */}
      <AnimatePresence>
        {showNisab && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowNisab(false)}
          >
            <motion.div
              className="modal-content nisab-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{tNisab.title}</h2>
                <button className="modal-close" onClick={() => setShowNisab(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <div className="nisab-info">
                  <div className="nisab-item">
                    <label>{tNisab.currentGoldPrice}</label>
                    <span>RM {nisabData.goldPrice}</span>
                  </div>
                  <div className="nisab-item">
                    <label>{tNisab.nisabValue}</label>
                    <span>RM {nisabData.nisabValue}</span>
                  </div>
                  <div className="nisab-item">
                    <label>{tNisab.zakatRate}</label>
                    <span>{nisabData.zakatRate}%</span>
                  </div>
                  <div className="nisab-item">
                    <label>{tNisab.state}</label>
                    <span>{nisabData.state}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Zakat Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowAboutModal(false)}
          >
            <motion.div
              className="modal-content nisab-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>About Zakat</h2>
                <button className="modal-close" onClick={() => setShowAboutModal(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <div className="nisab-info">
                  <div className="nisab-item">
                    <label>What is Zakat?</label>
                    <span>Zakat is a compulsory charitable contribution for eligible Muslims who meet the nisab threshold.</span>
                  </div>
                  <div className="nisab-item">
                    <label>What is Business Zakat?</label>
                    <span>Business zakat is imposed on business assets and profits after reaching nisab and completing one haul.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zakat Guide Modal */}
      <AnimatePresence>
        {showGuideModal && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowGuideModal(false)}
          >
            <motion.div
              className="modal-content nisab-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Zakat Guide</h2>
                <button className="modal-close" onClick={() => setShowGuideModal(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <div className="nisab-info">
                  <div className="nisab-item">
                    <label>Who Must Pay Business Zakat?</label>
                    <span>Muslim business owners whose wealth reaches nisab and completes a lunar year.</span>
                  </div>
                  <div className="nisab-item">
                    <label>Business Zakat Rate</label>
                    <span>2.5% of eligible business wealth.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="modal-content confirm-modal"
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{tLogout.title}</h2>
                <button className="modal-close" onClick={() => setShowLogoutConfirm(false)}><X size={18} strokeWidth={2} /></button>
              </div>
              <div className="modal-body">
                <p>{tLogout.message}</p>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowLogoutConfirm(false)}>{tLogout.cancel}</button>
                  <button className="btn-danger" onClick={handleLogout}>{tLogout.logOut}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default SidebarDrawer;