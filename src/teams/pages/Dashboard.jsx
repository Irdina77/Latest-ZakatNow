import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";

import "../Styles/Dashboard.css";
import zakatIcon from "../../teams/assets/zakat-icon.webp";

import Chatbot from "../components/Chatbot";
import SidebarDrawer from "../components/SidebarDrawer";
import { House, Calculator, Building2, BadgeDollarSign, UserRound, CreditCard, Landmark, BarChart3, CheckCircle2, HandCoins } from 'lucide-react';

export default function Dashboard({
  currentNisab = {
    value: 42500,
    year: 2026,
  },
}) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, "homepage");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAsnafModal, setShowAsnafModal] = useState(false);
  const [selectedAsnaf, setSelectedAsnaf] = useState("Fakir");
  const [userName, setUserName] = useState("Valued User");
  const [userEmail, setUserEmail] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || "";
        const displayName = user.displayName?.trim();
        const username = email.split("@")[0];

        setUserEmail(email);

        setUserName(
          displayName ||
            (username
              ? username.charAt(0).toUpperCase() + username.slice(1)
              : "Valued User")
        );
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="dashboard-page">
        <header className="premium-navbar">
          <div className="navbar-container">

            {/* LEFT LOGO */}
            <div className="navbar-left">
              <button
                className="navbar-logo-button"
                onClick={() => navigate("/dashboard")}
              >
                <img
                  src={zakatIcon}
                  alt="logo"
                  className="navbar-logo"
                />

                <div>
                  <span className="navbar-brand-name">
                    ZakatNow
                  </span>

                  <p className="navbar-subtitle">
                    Smart AI-Powered Zakat
                  </p>
                </div>
              </button>
            </div>

            {/* CENTER NAVIGATION */}
            <nav className="premium-nav-menu">
              <button
                onClick={() => navigate("/dashboard")}
              >
                HOME PAGE
              </button>

              <button
                onClick={() => navigate("/calculator")}
              >
                CALCULATE ZAKAT
              </button>

              <button
                onClick={() => navigate("/payment")}
              >
                PAY ZAKAT
              </button>

              <button
                onClick={() => navigate("/nisab")}
              >
                NISAB RATE
              </button>
            </nav>

            {/* RIGHT HAMBURGER */}
            <div
              className="navbar-menu-right user-navbar-right"
              ref={menuRef}
            >
              <button
                className="admin-hamburger user-hamburger"
                onClick={() =>
                  setShowLogoMenu(!showLogoMenu)
                }
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>

              {showLogoMenu && (
                <div className="user-menu-dropdown">

                  <button
                    className="user-menu-item active"
                    onClick={() => {
                      navigate("/dashboard");
                      setShowLogoMenu(false);
                    }}
                  >
                    <House size={18} strokeWidth={2} /> Home Page
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/calculator");
                      setShowLogoMenu(false);
                    }}
                  >
                    <Calculator size={18} strokeWidth={2} /> Calculate Zakat
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/business-setup");
                      setShowLogoMenu(false);
                    }}
                  >
                    <Building2 size={18} strokeWidth={2} /> Business Setup
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/nisab");
                      setShowLogoMenu(false);
                    }}
                  >
                    <BarChart3 size={18} strokeWidth={2} /> Nisab Rate
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowLogoMenu(false);
                    }}
                  >
                    <UserRound size={18} strokeWidth={2} /> Profile
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/payment");
                      setShowLogoMenu(false);
                    }}
                  >
                    <CreditCard size={18} strokeWidth={2} /> Pay Zakat
                  </button>

                  <hr className="user-menu-divider" />

                  <button
  className="user-menu-item logout"
  onClick={() => {
    // CLEAR LOGIN DATA
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("zakat-result");

    // CLOSE MENU
    setShowLogoMenu(false);

    // REDIRECT TO LOGIN
    window.location.href = "/login";
  }}
>
  Log Out
</button>

                </div>
              )}
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div className="hero-card">

            <div className="hero-left">
              <p className="hero-greeting">
                ASSALAMUALAIKUM, WELCOME BACK
              </p>

              <h2 className="hero-username">
                {userName}
              </h2>

              <p className="hero-email">
                {userEmail}
              </p>

              <p className="hero-description">
                {t.description}
              </p>

              <div className="hero-buttons">

                <button
                  className="hero-primary-btn"
                  onClick={() =>
                    navigate("/calculator")
                  }
                >
                  Open Calculator
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={() =>
                    navigate("/payment")
                  }
                >
                  Pay Zakat
                </button>

              </div>
            </div>

            <div className="hero-right">
              <div className="hero-illustration">

                <div className="illustration-main">
                  <Landmark size={64} />
                </div>

                <div className="illustration-icons">
                  <Calculator size={32} strokeWidth={2} />
                  <HandCoins size={32} strokeWidth={2} />
                  <CreditCard size={32} strokeWidth={2} />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SUMMARY */}
        <section className="dashboard-summary">
          <div className="summary-grid">

            <div className="summary-card">
              <div className="summary-icon">
                <BadgeDollarSign size={32} strokeWidth={2} />
              </div>

              <div className="summary-content">
                <h3 className="summary-title">
                  Total Nisab
                </h3>

                <p className="summary-value">
                  RM{" "}
                  {Number(
                    currentNisab.value
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <BarChart3 size={32} strokeWidth={2} />
              </div>

              <div className="summary-content">
                <h3 className="summary-title">
                  Zakat Rate
                </h3>

                <p className="summary-value">
                  2.5%
                </p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <CheckCircle2 size={32} strokeWidth={2} />
              </div>

              <div className="summary-content">
                <h3 className="summary-title">
                  Status
                </h3>

                <p className="summary-value">
                  Ready
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() =>
          setIsDrawerOpen(false)
        }
      />

      <Chatbot />
    </>
  );
}