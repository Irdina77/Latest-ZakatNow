import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, HandCoins, BriefcaseBusiness, X, House, Calculator, BadgeDollarSign, User, Bookmark, LogOut, Users, Building2 } from "lucide-react";
import "../Styles/HomePage.css";
import zakatIcon from "../../teams/assets/zakat-icon.webp";

export default function Navbar({ current = "home", rightOpenDrawer }) {
  const navigate = useNavigate();
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("zakat-result");
    setShowLogoMenu(false);
    window.location.href = "/login";
  };

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <>
      <header className="premium-navbar">
      <div className="navbar-container" ref={menuRef}>
        <div className="navbar-left">
          <button
            className="navbar-logo-button"
            onClick={() => navigate("/dashboard")}
          >
            <img src={zakatIcon} alt="logo" className="navbar-logo" />

            <div>
              <span className="navbar-brand-name">ZakatNow</span>
              <p className="navbar-subtitle">Smart AI-Powered Zakat</p>
            </div>
          </button>
        </div>

        <nav className="premium-nav-menu">
          <button
            className={current === "home" ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            HOME PAGE
          </button>

          <button
            className={current === "calculator" ? "active" : ""}
            onClick={() => navigate("/calculator")}
          >
            CALCULATE ZAKAT
          </button>

          <button
            className={current === "payment" ? "active" : ""}
            onClick={() => navigate("/payment")}
          >
            PAY ZAKAT
          </button>

          <button
            className={current === "nisab" ? "active" : ""}
            onClick={() => navigate("/nisab")}
          >
            NISAB RATE
          </button>
        </nav>

        <div className="navbar-menu-right user-navbar-right">
          <button
            className="admin-hamburger user-hamburger"
            onClick={() => (rightOpenDrawer ? rightOpenDrawer() : setShowLogoMenu(!showLogoMenu))}
            aria-label={rightOpenDrawer ? "Open sidebar" : "Open menu"}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {!rightOpenDrawer && showLogoMenu && (
            <div className="user-menu-dropdown">
              <button
                className="user-menu-item"
                onClick={() => {
                  setShowAboutModal(true);
                  setShowLogoMenu(false);
                }}
              >
                <BookOpen size={18} strokeWidth={2} style={{ marginRight: 10 }} /> About Zakat
              </button>
              <button
                className="user-menu-item"
                onClick={() => {
                  setShowGuideModal(true);
                  setShowLogoMenu(false);
                }}
              >
                <Bookmark size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Zakat Guide
              </button>
              <button
                className={`user-menu-item ${current === "home" ? "active" : ""}`}
                onClick={() => {
                  navigate("/dashboard");
                  setShowLogoMenu(false);
                }}
              >
                <House size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Home Page
              </button>

              <button
                className={`user-menu-item ${current === "calculator" ? "active" : ""}`}
                onClick={() => {
                  navigate("/calculator");
                  setShowLogoMenu(false);
                }}
              >
                <Calculator size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Calculate Zakat
              </button>

              <button
                className={`user-menu-item ${current === "business-setup" ? "active" : ""}`}
                onClick={() => {
                  navigate("/business-setup");
                  setShowLogoMenu(false);
                }}
              >
                <Building2 size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Business Setup
              </button>

              <button
                className={`user-menu-item ${current === "nisab" ? "active" : ""}`}
                onClick={() => {
                  navigate("/nisab");
                  setShowLogoMenu(false);
                }}
              >
                <BadgeDollarSign size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Nisab Rate
              </button>

              <button
                className={`user-menu-item ${current === "profile" ? "active" : ""}`}
                onClick={() => {
                  navigate("/profile");
                  setShowLogoMenu(false);
                }}
              >
                <User size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Profile
              </button>

              <button
                className={`user-menu-item ${current === "payment" ? "active" : ""}`}
                onClick={() => {
                  navigate("/payment");
                  setShowLogoMenu(false);
                }}
              >
                <HandCoins size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Pay Zakat
              </button>

              <hr className="user-menu-divider" />

              <button className="user-menu-item logout" onClick={handleLogout}>
                <LogOut size={18} strokeWidth={2} style={{ marginRight: 10 }} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
      {showAboutModal && (
      <div className="premium-modal-overlay" onClick={() => setShowAboutModal(false)}>
        <div className="premium-about-modal" onClick={(e) => e.stopPropagation()}>
          <button className="premium-close" onClick={() => setShowAboutModal(false)} aria-label="Close">
            <X size={18} />
          </button>

          <div className="premium-about-head">
            <div className="premium-about-icon"><BookOpen size={28} strokeWidth={2} /></div>
            <h2>About Zakat</h2>
          </div>

          <div className="premium-about-body">
            <section className="about-section">
              <h3><HandCoins size={18} style={{ marginRight: 8 }} /> What is Zakat?</h3>
              <p>
                Zakat is a compulsory charitable contribution for eligible Muslims who meet the nisab threshold. It is one of the Five Pillars of Islam and serves to purify wealth while helping those in need.
              </p>
            </section>

            <section className="about-section">
              <h3><BriefcaseBusiness size={18} style={{ marginRight: 8 }} /> What is Business Zakat?</h3>
              <p>
                Business Zakat (Zakat Perniagaan) is zakat imposed on business assets, profits, and savings that have reached the nisab threshold and completed one lunar year (haul). The standard zakat rate is 2.5% of eligible business wealth.
              </p>
            </section>
          </div>
        </div>
      </div>
      )}
      {showGuideModal && (
        <div className="premium-modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="premium-about-modal" onClick={(e) => e.stopPropagation()}>
            <button className="premium-close" onClick={() => setShowGuideModal(false)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="premium-about-head">
              <div className="premium-about-icon"><BookOpen size={28} strokeWidth={2} /></div>
              <h2>Zakat Guide</h2>
            </div>

            <div className="premium-about-body">
              <section className="about-section">
                <h3><HandCoins size={18} style={{ marginRight: 8 }} /> Who Must Pay Business Zakat?</h3>
                <ul>
                  <li>Muslim business owner</li>
                  <li>Business reaches nisab threshold</li>
                  <li>Business completed one haul (1 lunar year)</li>
                </ul>
              </section>

              <section className="about-section">
                <h3><BadgeDollarSign size={18} style={{ marginRight: 8 }} /> Nisab Requirement</h3>
                <p>Nisab is the minimum amount of wealth a Muslim must possess before zakat becomes obligatory.</p>

                <h3 style={{ marginTop: 12 }}><BriefcaseBusiness size={18} style={{ marginRight: 8 }} /> Business Zakat Rate</h3>
                <p>2.5%</p>

                <h3 style={{ marginTop: 12 }}><Users size={18} style={{ marginRight: 8 }} /> Eligible Asnaf Recipients</h3>
                <ul>
                  <li>Fakir</li>
                  <li>Miskin</li>
                  <li>Amil</li>
                  <li>Muallaf</li>
                  <li>Riqab</li>
                  <li>Gharimin</li>
                  <li>Fisabilillah</li>
                  <li>Ibn Sabil</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
