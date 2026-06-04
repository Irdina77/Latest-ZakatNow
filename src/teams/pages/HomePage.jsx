import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Calculator, HandCoins, ReceiptText, Building2, Check, BadgeDollarSign, MapPin, Calendar } from "lucide-react";
import { getUserState, setUserState } from "../utils/userStateStorage";

import SidebarDrawer from "../components/SidebarDrawer";
import Navbar from "../components/Navbar";
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
        <Navbar current="home" rightOpenDrawer={() => setIsDrawerOpen(true)} />

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

            <div
              className="feature-card clickable"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/check-zakat")}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  navigate("/check-zakat");
                }
              }}
            >
              <div className="feature-icon">
                <ReceiptText size={34} strokeWidth={2} />
              </div>

              <div className="feature-content">
                <h3>Check Zakat</h3>
                <p>Review your zakat payment history easily.</p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate("/check-zakat");
                }}
              ></button>
            </div>
          </section>

          <section className="nisab-section">
            <div className="nisab-card nisab-modern">
              <div className="nisab-main">
                <div className="nisab-info">
                  <div className="nisab-header">
                    <div className="nisab-icon">
                      <Building2 size={28} strokeWidth={2} />
                    </div>
                    <div>
                      <div className="nisab-eyebrow">
                        <BadgeDollarSign size={16} strokeWidth={2} />
                        BUSINESS NISAB
                      </div>
                      <h2 className="nisab-title">NISAB ZAKAT PERNIAGAAN 2026</h2>
                    </div>
                  </div>

                  <p className="nisab-subtitle">
                    Choose your state to apply the correct business nisab rate and calculate zakat accurately.
                  </p>

                  <div className="nisab-select-wrapper modern">
                    <label className="nisab-select-label">State</label>
                    <div className="nisab-select-field">
                      <MapPin size={16} strokeWidth={2} className="select-icon" />
                      <select
                        className="nisab-state-select modern-select"
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

                <div className="nisab-summary-card">
                  <div className="summary-top">
                    <div className="summary-icon">
                      <BadgeDollarSign size={18} strokeWidth={2} />
                    </div>
                    <div className="summary-tag">Premium summary</div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-item-title">Selected State</div>
                    <div className="summary-item-value">{selectedNisab.state}</div>
                  </div>

                  <div className="summary-item">
                    <div className="summary-item-title">Current Year</div>
                    <div className="summary-item-value">
                      <Calendar size={14} strokeWidth={2} /> 2026
                    </div>
                  </div>

                  <div className="summary-amount">
                    <div className="summary-amount-label">Business Nisab Value</div>
                    <div className="summary-amount-value">
                      <span className="rm-currency">RM</span>
                      <strong>{selectedNisab.value.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="summary-item compact">
                    <div className="summary-item-title">Zakat Rate</div>
                    <div className="summary-item-value">
                      <MapPin size={14} strokeWidth={2} /> 2.5%
                    </div>
                  </div>

                  <div className="selected-note">
                    Accurate nisab calculations help you stay compliant with every zakat payment.
                  </div>
                </div>
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
                <ul>
                  <li><Check size={16} strokeWidth={2} /> Purifies wealth</li>
                  <li><Check size={16} strokeWidth={2} /> Helps the poor</li>
                  <li><Check size={16} strokeWidth={2} /> Strengthens society</li>
                  <li><Check size={16} strokeWidth={2} /> Gains blessings</li>
                </ul>
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