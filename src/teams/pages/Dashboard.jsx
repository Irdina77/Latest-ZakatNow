import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";

import "../Styles/Dashboard.css";
import zakatIcon from "../../teams/assets/zakat-icon.webp";

import Chatbot from "../components/Chatbot";
import SidebarDrawer from "../components/SidebarDrawer";

export default function Dashboard({
  currentNisab = {
    value: 42500,
    year: 2026,
  },
}) {
  const navigate = useNavigate();

  const {
    language,
    updateLanguage,
  } = useLanguage();

  const t =
    getTranslationSection(
      language,
      "homepage"
    );

  const [isDrawerOpen,
    setIsDrawerOpen] =
    useState(false);

  const [showLogoMenu,
    setShowLogoMenu] =
    useState(false);

  const [showAboutModal,
    setShowAboutModal] =
    useState(false);

  const [showAsnafModal,
    setShowAsnafModal] =
    useState(false);

  const [selectedAsnaf,
    setSelectedAsnaf] =
    useState("Fakir");

  const [userName,
    setUserName] =
    useState("Valued User");

  const [userEmail,
    setUserEmail] =
    useState("");

  const menuRef =
    useRef(null);

  // ======================
  // USER AUTH
  // ======================
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            const email =
              user.email || "";

            const displayName =
              user.displayName?.trim();

            const username =
              email.split("@")[0];

            setUserEmail(
              email
            );

            setUserName(
              displayName ||
              (username
                ? username.charAt(
                  0
                ).toUpperCase() +
                username.slice(
                  1
                )
                : "Valued User")
            );
          }
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // ======================
  // CLOSE MENU
  // ======================
  useEffect(() => {
    const handleClickOutside =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
            event.target
          )
        ) {
          setShowLogoMenu(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      <div className="dashboard-page">
        <header className="premium-navbar">

          <div className="navbar-container">

            {/* LEFT SIDE */}
            <div className="navbar-left">

              <button
                className="navbar-logo-button"
                onClick={() =>
                  navigate("/dashboard")
                }
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

            {/* MENU CENTER */}
            <nav className="premium-nav-menu">

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                HOME PAGE
              </button>

              <button
                onClick={() =>
                  navigate("/calculator")
                }
              >
                CALCULATE ZAKAT
              </button>

              <button
                onClick={() =>
                  navigate("/payment")
                }
              >
                PAY ZAKAT
              </button>

              <button
                onClick={() =>
                  navigate("/check-zakat")
                }
              >
                CHECK ZAKAT
              </button>

            </nav>

            {/* RIGHT MENU BUTTON */}
            <div
              className="navbar-menu-right"
              ref={menuRef}
            >
              <button
                className="sidebar-toggle"
                onClick={() =>
                  setShowLogoMenu(
                    !showLogoMenu
                  )
                }
              >
                ☰
              </button>

              {showLogoMenu && (
                <div className="logo-dropdown">

                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setShowLogoMenu(false);
                    }}
                  >
                    About Zakat
                  </button>

                  <button
                    onClick={() => {
                      setShowAsnafModal(true);
                      setShowLogoMenu(false);
                    }}
                  >
                    Asnaf Zakat
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowLogoMenu(false);
                    }}
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowLogoMenu(false);
                    }}
                  >
                    Setting
                  </button>

                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Log Out
                  </button>

                </div>
              )}
            </div>

          </div>

        </header>

        {/* HERO */}
        <section className="dashboard-hero">
          <div className="hero-card">

            <div className="hero-left">
              <p className="hero-greeting">
                ASSALAMUALAIKUM,
                WELCOME BACK
              </p>

              <h2 className="hero-username">
                {userName}
              </h2>

              <p className="hero-email">
                {userEmail}
              </p>

              <p className="hero-description">
                {
                  t.description
                }
              </p>

              <div className="hero-buttons">

                <button
                  className="hero-primary-btn"
                  onClick={() =>
                    navigate(
                      "/calculator"
                    )
                  }
                >
                  Open
                  Calculator
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={() =>
                    navigate(
                      "/payment"
                    )
                  }
                >
                  Pay
                  Zakat
                </button>

              </div>
            </div>

            <div className="hero-right">
              <div className="hero-illustration">

                <div className="illustration-main">
                  🕌
                </div>

                <div className="illustration-icons">
                  <span>
                    🧮
                  </span>
                  <span>
                    💰
                  </span>
                  <span>
                    💳
                  </span>
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
                💰
              </div>

              <div className="summary-content">
                <h3 className="summary-title">
                  Total
                  Nisab
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
                📈
              </div>

              <div className="summary-content">
                <h3 className="summary-title">
                  Zakat
                  Rate
                </h3>

                <p className="summary-value">
                  2.5%
                </p>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                ✅
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

      {/* ABOUT MODAL */}
      {
        showAboutModal && (
          <div className="modal-overlay">

            <div className="about-modal">

              <button
                className="close-btn"
                onClick={() =>
                  setShowAboutModal(false)
                }
              >
                ✕
              </button>

              <h2>
                About Zakat
              </h2>

              <div className="about-grid">

                <div className="about-box">
                  <h3>
                    What Is Zakat?
                  </h3>

                  <p>
                    Zakat is an obligatory
                    charity for Muslims
                    who meet the nisab
                    threshold. It purifies
                    wealth and helps
                    people in need.
                  </p>
                </div>

                <div className="about-box">
                  <h3>
                    What Is Business Zakat?
                  </h3>

                  <p>
                    Business zakat is
                    zakat imposed on
                    profits, savings,
                    and business assets
                    after reaching
                    nisab and haul.
                  </p>
                </div>

                <div className="about-box">
                  <h3>
                    Why We Pay Zakat?
                  </h3>

                  <p>
                    Zakat is paid to
                    fulfil Islamic
                    obligations,
                    purify wealth,
                    and support
                    asnaf groups.
                  </p>
                </div>

                <div className="about-box">
                  <h3>
                    Benefits of Zakat
                  </h3>

                  <p>
                    ✔ Purifies wealth
                    <br />
                    ✔ Helps the poor
                    <br />
                    ✔ Strengthens society
                    <br />
                    ✔ Gains blessings
                  </p>
                </div>

              </div>

            </div>

          </div>
        )
      }

      {/* ASNAF */}
      {
        showAsnafModal && (
          <div className="modal-overlay">

            <div className="about-modal">

              <button
                className="close-btn"
                onClick={() =>
                  setShowAsnafModal(false)
                }
              >
                ✕
              </button>

              <h2>
                Asnaf Zakat
              </h2>

              <div className="asnaf-container">

                {/* LEFT SIDE */}
                <div className="asnaf-sidebar">

                  <button
                    className={`asnaf-tab ${selectedAsnaf === "Fakir"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Fakir"
                      )
                    }
                  >
                    Fakir
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf === "Miskin"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Miskin"
                      )
                    }
                  >
                    Miskin
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf === "Amil"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Amil"
                      )
                    }
                  >
                    Amil
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf === "Muallaf"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Muallaf"
                      )
                    }
                  >
                    Muallaf
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf === "Riqab"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Riqab"
                      )
                    }
                  >
                    Riqab
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf ===
                      "Gharimin"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Gharimin"
                      )
                    }
                  >
                    Gharimin
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf ===
                      "Fisabilillah"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Fisabilillah"
                      )
                    }
                  >
                    Fisabilillah
                  </button>

                  <button
                    className={`asnaf-tab ${selectedAsnaf ===
                      "Ibn Sabil"
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(
                        "Ibn Sabil"
                      )
                    }
                  >
                    Ibn Sabil
                  </button>

                </div>

                {/* RIGHT SIDE */}
                <div className="asnaf-content">

                  <h2>
                    {selectedAsnaf}
                  </h2>

                  <p>
                    {selectedAsnaf ===
                      "Fakir" &&
                      "A poor Muslim who has no income or insufficient means to meet basic daily needs."}

                    {selectedAsnaf ===
                      "Miskin" &&
                      "A Muslim with limited income that is insufficient to support essential living expenses."}

                    {selectedAsnaf ===
                      "Amil" &&
                      "Individuals appointed to manage and distribute zakat funds."}

                    {selectedAsnaf ===
                      "Muallaf" &&
                      "New Muslims or individuals whose hearts are inclined towards Islam."}

                    {selectedAsnaf ===
                      "Riqab" &&
                      "People in bondage or slavery seeking freedom."}

                    {selectedAsnaf ===
                      "Gharimin" &&
                      "Muslims burdened with debt for basic necessities."}

                    {selectedAsnaf ===
                      "Fisabilillah" &&
                      "People striving in the cause of Allah for community benefit."}

                    {selectedAsnaf ===
                      "Ibn Sabil" &&
                      "Travelers stranded and needing temporary financial assistance."}
                  </p>

                </div>
              </div>
            </div>
          </div>
        )
      }

      <SidebarDrawer
        isOpen={
          isDrawerOpen
        }
        onClose={() =>
          setIsDrawerOpen(
            false
          )
        }
      />

      <Chatbot />
    </>
  );
}