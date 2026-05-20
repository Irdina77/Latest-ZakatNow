import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  getTranslationSection,
} from "../translations/translations";

import {
  Calculator,
  HandCoins,
  ReceiptText,
} from "lucide-react";

import SidebarDrawer from "../components/SidebarDrawer";

import "../Styles/HomePage.css";

import zakatIcon from "../../teams/assets/zakat-icon.webp";

export default function HomePage() {

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

  const [showNisabModal,
    setShowNisabModal] =
    useState(false);

  const [userName,
    setUserName] =
    useState("Valued User");

  const [goldPrice,
    setGoldPrice] =
    useState(425);

  const [nisabValue,
    setNisabValue] =
    useState(36125);

  const menuRef =
    useRef(null);

  // ======================
  // USER
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

            setUserName(
              displayName ||
              (
                username
                  ? username
                    .charAt(0)
                    .toUpperCase() +
                  username.slice(1)
                  : "Valued User"
              )
            );
          }
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // ======================
  // NISAB
  // ======================
  useEffect(() => {

    const savedNisab =
      JSON.parse(
        localStorage.getItem(
          "nisabData"
        ) || "{}"
      );

    const currentGold =
      savedNisab.goldPrice ||
      425;

    setGoldPrice(
      currentGold
    );

    setNisabValue(
      currentGold * 85
    );

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
      <div className="home-page">

        {/* ======================
            NAVBAR
        ====================== */}
        <header className="premium-navbar">

          <div
            className="navbar-container"
            ref={menuRef}
          >

            {/* LOGO LEFT */}
            <div className="navbar-left">

              <button className="navbar-logo-button">
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

            {/* MENU BUTTON RIGHT */}
            <div className="navbar-menu-right">

              <button
                className="sidebar-toggle"
                onClick={() =>
                  setShowLogoMenu(
                    !showLogoMenu
                  )
                }
              >
                ≡
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

        {/* ======================
            MAIN CONTENT
        ====================== */}
        <main className="home-main">

          {/* HERO VIDEO */}
          <section className="hero-video-section">

            <video
              autoPlay
              muted
              loop
              playsInline
              className="hero-video"
            >
              <source
                src="/videos/zakat-hero.mp4"
                type="video/mp4"
              />
            </video>

            <div className="hero-overlay">

              <div className="hero-content">

                <p className="hero-small-text">
                  ASSALAMUALAIKUM,
                  WELCOME BACK
                </p>

                <h1 className="hero-name">
                  {userName}
                </h1>

                <p className="hero-description">
                  Calculate your
                  business zakat
                  easily and
                  accurately with
                  our smart zakat
                  system.
                </p>

              </div>
            </div>
          </section>

          {/* FEATURE CARDS */}
          <section className="feature-grid">

            <div className="feature-card">

              <div className="feature-icon">
                <Calculator
                  size={34}
                  strokeWidth={2}
                />
              </div>

              <div className="feature-content">

                <h3>
                  Calculate
                  Zakat
                </h3>

                <p>
                  Calculate your
                  business zakat
                  quickly and
                  accurately.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/calculator"
                  )
                }
              >
              </button>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                <HandCoins
                  size={34}
                  strokeWidth={2}
                />
              </div>

              <div className="feature-content">

                <h3>
                  Pay Zakat
                </h3>

                <p>
                  Pay zakat
                  online securely
                  and
                  conveniently.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/payment"
                  )
                }
              >
              </button>

            </div>

            <div className="feature-card">

              <div className="feature-icon">
                <ReceiptText
                  size={34}
                  strokeWidth={2}
                />
              </div>

              <div className="feature-content">

                <h3>
                  Check Zakat
                </h3>

                <p>
                  Review your
                  zakat payment
                  history easily.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/check-zakat"
                  )
                }
              >
              </button>

            </div>

          </section>

          {/* NISAB */}
          {/* NISAB */}
          <section className="nisab-section">

            <div className="nisab-card">

              <div className="nisab-left">

                <div className="nisab-badge">
                  🪙
                </div>

                <div>

                  <h2>
                    CURRENT NISAB
                    RATE (2026)
                  </h2>

                  <p className="nisab-subtitle">
                    Nisab is the minimum
                    amount of wealth one
                    must possess before
                    being obligated to
                    pay zakat.
                  </p>

                  <button
                    className="nisab-btn"
                    onClick={() =>
                      setShowNisabModal(
                        true
                      )
                    }
                  >
                    Learn More About
                    Nisab
                  </button>

                </div>

              </div>

              <div className="nisab-grid">

                <div className="nisab-item">
                  <h4>
                    Gold Price
                  </h4>

                  <h3>
                    RM {goldPrice}/g
                  </h3>
                </div>

                <div className="nisab-item">
                  <h4>
                    Nisab Threshold
                  </h4>

                  <h3>
                    RM{" "}
                    {nisabValue.toLocaleString()}
                  </h3>
                </div>

                <div className="nisab-item">
                  <h4>
                    Zakat Rate
                  </h4>

                  <h3>
                    2.5%
                  </h3>
                </div>

                <div className="nisab-item">
                  <h4>
                    Updated
                  </h4>

                  <h3>
                    Today
                  </h3>
                </div>

              </div>

            </div>

          </section>
        </main>
      </div>

      {/* ======================
    ABOUT MODAL
====================== */}
      {showAboutModal && (
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
                  What Is Business
                  Zakat?
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
      )}

      {/* ======================
          ASNAF MODAL
      ====================== */}
      {showAsnafModal && (

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

              {/* LEFT MENU */}
              <div className="asnaf-sidebar">

                {[
                  "Fakir",
                  "Miskin",
                  "Amil",
                  "Muallaf",
                  "Riqab",
                  "Gharimin",
                  "Fisabilillah",
                  "Ibn Sabil",
                ].map((item) => (

                  <button
                    key={item}
                    className={`asnaf-tab ${selectedAsnaf === item
                      ? "active"
                      : ""
                      }`}
                    onClick={() =>
                      setSelectedAsnaf(item)
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>

              {/* RIGHT CONTENT */}
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
                    "People seeking freedom from bondage or oppression."}

                  {selectedAsnaf ===
                    "Gharimin" &&
                    "Muslims burdened by debt for essential and lawful needs."}

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
      )}

      {/* ======================
    NISAB MODAL
====================== */}
      {showNisabModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowNisabModal(
              false
            )
          }
        >

          <div
            className="nisab-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-btn"
              onClick={() =>
                setShowNisabModal(
                  false
                )
              }
            >
              ✕
            </button>

            <h2>
              What is Nisab?
            </h2>

            <p>
              Nisab is the minimum
              amount of wealth a
              Muslim must own
              before being
              obligated to pay
              zakat.
            </p>

            <div
              className="
        nisab-info-grid"
            >

              <div>
                <span>
                  Gold Price
                </span>

                <strong>
                  RM {goldPrice}/g
                </strong>
              </div>

              <div>
                <span>
                  Nisab
                  Threshold
                </span>

                <strong>
                  RM{" "}
                  {nisabValue.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>
                  Zakat Rate
                </span>

                <strong>
                  2.5%
                </strong>
              </div>

            </div>

            <div
              className="
        formula-box"
            >
              <h4>
                Business
                Zakat Formula
              </h4>

              <p>
                Total Business
                Asset −
                Liabilities
              </p>

              <strong>
                If amount ≥
                Nisab →
                2.5% zakat
              </strong>

            </div>

          </div>

        </div>
      )}

      {/* SIDEBAR */}
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
    </>
  );
}