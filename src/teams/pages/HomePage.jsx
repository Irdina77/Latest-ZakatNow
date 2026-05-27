import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Calculator, HandCoins, ReceiptText } from "lucide-react";
import { getUserState, setUserState } from "../utils/userStateStorage";

import SidebarDrawer from "../components/SidebarDrawer";
import "../Styles/HomePage.css";
import zakatIcon from "../../teams/assets/zakat-icon.webp";

const nisabStates2026 = [
  { state: "Johor", value: 50689.3 },
  { state: "Kedah", value: 32871.27 },
  { state: "Kelantan", value: 32871.27 },
  { state: "Melaka", value: 32871.27 },
  { state: "Negeri Sembilan", value: 32871.27 },
  { state: "Pahang", value: 32871.27 },
  { state: "Pulau Pinang", value: 32871.27 },
  { state: "Perak", value: 32871.27 },
  { state: "Perlis", value: 32871.27 },
  { state: "Sabah", value: 32871.27 },
  { state: "Sarawak", value: 32871.27 },
  { state: "Selangor", value: 52172.15 },
  { state: "Terengganu", value: 32871.27 },
  { state: "Wilayah Persekutuan", value: 32871.27 },
];

export default function HomePage() {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showAsnafModal, setShowAsnafModal] = useState(false);
  const [selectedAsnaf, setSelectedAsnaf] = useState("Fakir");
  const [showNisabModal, setShowNisabModal] = useState(false);
  const [selectedState, setSelectedState] = useState(() => getUserState());
  const [userName, setUserName] = useState("Valued User");

  const menuRef = useRef(null);

  const selectedNisab =
    nisabStates2026.find((item) => item.state === selectedState) ||
    nisabStates2026[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || "";
        const displayName = user.displayName?.trim();
        const username = email.split("@")[0];

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
    setUserState(selectedState);
    localStorage.setItem("selectedNisabValue", selectedNisab.value);
  }, [selectedState, selectedNisab.value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogoMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("zakat-result");
    setShowLogoMenu(false);
    window.location.href = "/login";
  };

  return (
    <>
      <div className="home-page">
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
              <button onClick={() => navigate("/dashboard")}>HOME PAGE</button>
              <button onClick={() => navigate("/calculator")}>
                CALCULATE ZAKAT
              </button>
              <button onClick={() => navigate("/payment")}>PAY ZAKAT</button>
              <button onClick={() => navigate("/nisab")}>NISAB RATE</button>
            </nav>

            <div className="navbar-menu-right user-navbar-right">
              <button
                className="admin-hamburger user-hamburger"
                onClick={() => setShowLogoMenu(!showLogoMenu)}
              >
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
                    Home Page
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/calculator");
                      setShowLogoMenu(false);
                    }}
                  >
                    Calculate Zakat
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/business-setup");
                      setShowLogoMenu(false);
                    }}
                  >
                    Business Setup
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/nisab");
                      setShowLogoMenu(false);
                    }}
                  >
                    Nisab Rate
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowLogoMenu(false);
                    }}
                  >
                    Profile
                  </button>

                  <button
                    className="user-menu-item"
                    onClick={() => {
                      navigate("/payment");
                      setShowLogoMenu(false);
                    }}
                  >
                    Pay Zakat
                  </button>

                  <hr className="user-menu-divider" />

                  <button className="user-menu-item logout" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="home-main">
          <section className="hero-video-section">
            <video autoPlay muted loop playsInline className="hero-video">
              <source src="/videos/zakat-hero.mp4" type="video/mp4" />
            </video>

            <div className="hero-overlay">
              <div className="hero-content">
                <p className="hero-small-text">ASSALAMUALAIKUM, WELCOME BACK</p>
                <h1 className="hero-name">{userName}</h1>
                <p className="hero-description">
                  Calculate your business zakat easily and accurately with our
                  smart zakat system.
                </p>
              </div>
            </div>
          </section>

          <section className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Calculator size={34} strokeWidth={2} />
              </div>

              <div className="feature-content">
                <h3>Calculate Zakat</h3>
                <p>Calculate your business zakat quickly and accurately.</p>
              </div>

              <button onClick={() => navigate("/calculator")}></button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <HandCoins size={34} strokeWidth={2} />
              </div>

              <div className="feature-content">
                <h3>Pay Zakat</h3>
                <p>Pay zakat online securely and conveniently.</p>
              </div>

              <button onClick={() => navigate("/payment")}></button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ReceiptText size={34} strokeWidth={2} />
              </div>

              <div className="feature-content">
                <h3>Check Zakat</h3>
                <p>Review your zakat payment history easily.</p>
              </div>

              <button onClick={() => navigate("/check-zakat")}></button>
            </div>
          </section>

          <section className="nisab-section">
  <div className="nisab-card nisab-malaysia-card">
    <div className="nisab-left">
      <div className="nisab-badge">🏢</div>

      <div>
        <h2>NISAB ZAKAT PERNIAGAAN 2026</h2>

        <p className="nisab-subtitle">
          Select your state to apply the correct business zakat nisab rate.
        </p>

        <div className="nisab-select-wrapper">
          <label>Select State</label>

          <select
            className="nisab-state-select"
            value={selectedState}
            onChange={(e) => {
              const newState = e.target.value;
              setSelectedState(newState);
              setUserState(newState);
            }}
          >
            {nisabStates2026.map((item) => (
              <option key={item.state} value={item.state}>
                {item.state}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    <div className="nisab-selected-box">
      <h4>Selected State</h4>
      <h3>{selectedNisab.state}</h3>

      <h4>Business Nisab 2026</h4>
      <h2>RM {selectedNisab.value.toLocaleString()}</h2>

      <p>This nisab rate will be saved for zakat business calculation.</p>
    </div>
  </div>
</section>
        </main>
      </div>

      {showAboutModal && (
        <div className="modal-overlay">
          <div className="about-modal">
            <button
              className="close-btn"
              onClick={() => setShowAboutModal(false)}
            >
              ✕
            </button>

            <h2>About Zakat</h2>

            <div className="about-grid">
              <div className="about-box">
                <h3>What Is Zakat?</h3>
                <p>
                  Zakat is an obligatory charity for Muslims who meet the nisab
                  threshold. It purifies wealth and helps people in need.
                </p>
              </div>

              <div className="about-box">
                <h3>What Is Business Zakat?</h3>
                <p>
                  Business zakat is zakat imposed on profits, savings, and
                  business assets after reaching nisab and haul.
                </p>
              </div>

              <div className="about-box">
                <h3>Why We Pay Zakat?</h3>
                <p>
                  Zakat is paid to fulfil Islamic obligations, purify wealth, and
                  support asnaf groups.
                </p>
              </div>

              <div className="about-box">
                <h3>Benefits of Zakat</h3>
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

      {showAsnafModal && (
        <div className="modal-overlay">
          <div className="about-modal">
            <button
              className="close-btn"
              onClick={() => setShowAsnafModal(false)}
            >
              ✕
            </button>

            <h2>Asnaf Zakat</h2>

            <div className="asnaf-container">
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
                    className={`asnaf-tab ${
                      selectedAsnaf === item ? "active" : ""
                    }`}
                    onClick={() => setSelectedAsnaf(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="asnaf-content">
                <h2>{selectedAsnaf}</h2>

                <p>
                  {selectedAsnaf === "Fakir" &&
                    "A poor Muslim who has no income or insufficient means to meet basic daily needs."}
                  {selectedAsnaf === "Miskin" &&
                    "A Muslim with limited income that is insufficient to support essential living expenses."}
                  {selectedAsnaf === "Amil" &&
                    "Individuals appointed to manage and distribute zakat funds."}
                  {selectedAsnaf === "Muallaf" &&
                    "New Muslims or individuals whose hearts are inclined towards Islam."}
                  {selectedAsnaf === "Riqab" &&
                    "People seeking freedom from bondage or oppression."}
                  {selectedAsnaf === "Gharimin" &&
                    "Muslims burdened by debt for essential and lawful needs."}
                  {selectedAsnaf === "Fisabilillah" &&
                    "People striving in the cause of Allah for community benefit."}
                  {selectedAsnaf === "Ibn Sabil" &&
                    "Travelers stranded and needing temporary financial assistance."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNisabModal && (
        <div className="modal-overlay" onClick={() => setShowNisabModal(false)}>
          <div className="nisab-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setShowNisabModal(false)}
            >
              ✕
            </button>

            <h2>What is Nisab?</h2>

            <p>
              Nisab is the minimum amount of wealth a Muslim must own before
              being obligated to pay zakat.
            </p>

            <div className="nisab-info-grid">
              <div>
                <span>Selected State</span>
                <strong>{selectedNisab.state}</strong>
              </div>

              <div>
                <span>Nisab 2026</span>
                <strong>RM {selectedNisab.value.toLocaleString()}</strong>
              </div>

              <div>
                <span>Zakat Rate</span>
                <strong>2.5%</strong>
              </div>
            </div>

            <div className="formula-box">
              <h4>Business Zakat Formula</h4>
              <p>Total Business Asset − Liabilities</p>
              <strong>If amount ≥ Nisab → 2.5% zakat</strong>
            </div>
          </div>
        </div>
      )}

      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}