import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import { getUserState, setUserState } from "../utils/userStateStorage";
import "../Styles/HomePage.css";
import "../Styles/ZakatCalculator.css";
import SidebarDrawer from "../components/SidebarDrawer";
import {
  Calculator,
  BadgeDollarSign,
  CheckCircle2,
  Info,
  BarChart3,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

const DEFAULT_STATE = "Selangor";
const VALID_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Wilayah Persekutuan",
];

function ZakatCalculator({ onComplete }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, 'calculator');
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedState, setSelectedState] = useState(() => {
    const savedState = getUserState();
    return VALID_STATES.includes(savedState) ? savedState : DEFAULT_STATE;
  });
  const [businessMethod, setBusinessMethod] = useState("UntungRugi");
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("registeredFullName") || "User"
  );
  const [businessRevenue, setBusinessRevenue] = useState("");
  const [businessExpenses, setBusinessExpenses] = useState("");
  const [currentAssets, setCurrentAssets] = useState("");
  const [currentLiabilities, setCurrentLiabilities] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setUserState(selectedState);
  }, [selectedState]);

  const yearRates = {
    2024: {
      Johor: 25995.67,
      Kedah: 24563.45,
      Kelantan: 23831.0,
      Melaka: 24198.4,
      "Negeri Sembilan": 22669.53,
      Pahang: 25995.67,
      Penang: 24200.0,
      Perak: 25889.34,
      Perlis: 25995.67,
      Sabah: 23500.0,
      Sarawak: 25496.96,
      Selangor: 27696.0,
      Terengganu: 23728.31,
      "Wilayah Persekutuan": 24198.0,
    },
    2025: {
      Johor: 42175.0,
      Kedah: 38619.0,
      Kelantan: 29376.0,
      Melaka: 29741.0,
      "Negeri Sembilan": 29741.0,
      Pahang: 29741.0,
      Penang: 31000.0,
      Perak: 32133.89,
      Perlis: 38871.0,
      Sabah: 29000.0,
      Sarawak: 38398.0,
      Selangor: 35449.0,
      Terengganu: 39860.4,
      "Wilayah Persekutuan": 29740.0,
    },
    2026: {
      Johor: 53618.0,
      Kedah: 32871.27,
      Kelantan: 37401.0,
      Melaka: 40092.42,
      "Negeri Sembilan": 33880.0,
      Pahang: 40092.42,
      Penang: 33890.0,
      Perak: 53618.0,
      Perlis: 38871.0,
      Sabah: 36979.0,
      Sarawak: 38398.0,
      Selangor: 42047.0,
      Terengganu: 39860.4,
      "Wilayah Persekutuan": 33996.0,
    },
  };

  const effectiveState = yearRates[selectedYear][selectedState]
    ? selectedState
    : DEFAULT_STATE;
  const nisab = yearRates[selectedYear][effectiveState];
  const businessProfit = Number(businessRevenue) - Number(businessExpenses);
  const workingCapital = Number(currentAssets) - Number(currentLiabilities);

  let total = 0;
  let zakat = 0;

  if (businessMethod === "UntungRugi") {
    total = businessProfit;
    zakat = total >= nisab ? Number((total * 0.025).toFixed(2)) : 0;
  } else {
    total = workingCapital;
    zakat = total >= nisab ? Number((total * 0.025).toFixed(2)) : 0;
  }

  const saveData = () => {
    if (!hasCalculated) {
      alert("Please click Calculate Zakat first.");
      return;
    }

    const history = JSON.parse(localStorage.getItem("zakatHistory")) || [];

    history.push({
      year: selectedYear,
      state: selectedState,
      businessMethod,
      businessRevenue,
      businessExpenses,
      currentAssets,
      currentLiabilities,
      total,
      zakat,
      nisab,
      date: new Date().toLocaleString(),
    });

    history.push({
      year: selectedYear,
      state: selectedState,
      businessMethod,
      businessRevenue,
      businessExpenses,
      currentAssets,
      currentLiabilities,
      total,
      zakat,
      nisab,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
    });

    localStorage.setItem("zakatHistory", JSON.stringify(history));
    alert("Data saved successfully.");
  };

  const getStoredHistory = () => {
    return JSON.parse(localStorage.getItem("zakatHistory") || "[]");
  };

  const getFinancialInsight = () => {
    if (!hasCalculated) {
      return "Calculate your zakat to receive smart financial insights tailored to your business.";
    }

    const history = getStoredHistory();
    const messages = [];
    const currentTotal = Number(total);
    const currentZakat = Number(zakat);

    if (businessMethod === "UntungRugi") {
      const revenue = Number(businessRevenue);
      const expense = Number(businessExpenses);
      const ratio = revenue > 0 ? expense / revenue : 0;

      if (revenue === 0) {
        messages.push("Revenue data is missing, so expense analysis is not available.");
      } else if (ratio >= 0.75) {
        messages.push("Your expenses are relatively high compared to your income. Consider reviewing costs to boost profit.");
      } else if (ratio >= 0.5) {
        messages.push("Your expenses are moderate but still significant. Improving margins can help your zakat position.");
      } else {
        messages.push("Your revenue is strong relative to expenses. This is a healthy profit trend.");
      }
    } else {
      const assets = Number(currentAssets);
      const liabilities = Number(currentLiabilities);
      const ratio = assets > 0 ? liabilities / assets : 0;

      if (assets === 0) {
        messages.push("Working capital data is incomplete, so current ratio insights are limited.");
      } else if (ratio >= 1) {
        messages.push("Your current liabilities exceed assets. Strengthen your working capital before the next cycle.");
      } else if (ratio >= 0.7) {
        messages.push("Your working capital is tight. Aim to increase liquid assets to stay secure.");
      } else {
        messages.push("Your working capital position looks healthy for the selected period.");
      }
    }

    if (currentTotal > 0 && currentZakat === 0) {
      messages.push("You have not reached nisab yet, so no zakat is payable at this moment.");
    }

    if (history.length > 0) {
      const latest = [...history].sort((a, b) => b.timestamp - a.timestamp)[0];
      const previousZakat = Number(latest.zakat || 0);
      const previousTotal = Number(latest.total || 0);

      if (previousZakat > 0) {
        const change = ((currentZakat - previousZakat) / previousZakat) * 100;
        const rounded = Math.abs(change).toFixed(0);

        if (change > 5) {
          messages.push(`Your zakat amount increased by ${rounded}% compared to your last saved calculation.`);
        } else if (change < -5) {
          messages.push(`Your zakat amount decreased by ${rounded}% compared to your last saved calculation.`);
        } else {
          messages.push("Your zakat amount is stable compared to your last saved calculation.");
        }
      } else if (previousTotal > 0 && currentTotal > 0) {
        const change = ((currentTotal - previousTotal) / previousTotal) * 100;
        const rounded = Math.abs(change).toFixed(0);

        if (change > 5) {
          messages.push(`Your profit / working capital increased by ${rounded}% compared to your last saved calculation.`);
        } else if (change < -5) {
          messages.push(`Your profit / working capital decreased by ${rounded}% compared to your last saved calculation.`);
        }
      }
    }

    return messages.join(" ");
  };

  const handleCalculate = () => {
    if (businessMethod === "UntungRugi") {
      if (businessRevenue === "" || businessExpenses === "") {
        alert("Please enter total revenue and total expenses first.");
        return;
      }
    } else {
      if (currentAssets === "" || currentLiabilities === "") {
        alert("Please enter current assets and current liabilities first.");
        return;
      }
    }

    setHasCalculated(true);
    setTimeout(() => setShowSummary(true), 100); // Small delay for animation
  };

  const handleProceedToResult = () => {
    if (!hasCalculated) {
      alert("Please click Calculate Zakat first.");
      return;
    }

    if (zakat === 0) {
      alert("You are not eligible for zakat payment.");
      return;
    }

    // SAVE DATA UNTUK RECEIPT
    localStorage.setItem(
      "zakatAmount",
      zakat
    );

    localStorage.setItem(
      "zakatType",
      businessMethod === "UntungRugi"
        ? "Business Zakat"
        : "Working Capital Zakat"
    );

    // hantar data ke payment
    if (onComplete) {
      onComplete({
        zakat,
        amount: zakat,
        total,
        nisab,
        businessMethod,
        selectedYear,
        selectedState,
      });
    }

    // pergi payment
    navigate("/payment");
  };

  const formatCurrency = (value) =>
    Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <div className="zakat-container">
        <div className="zakat-app-shell">

          <Navbar current="calculator" rightOpenDrawer={() => setIsDrawerOpen(true)} showLeftToggle={false} />

          <div className="zakat-stepper">
            <div className={`zakat-step ${!hasCalculated ? "active" : "done"}`}>
              <span className="zakat-step-circle">1</span>
              <span>Calculator</span>
            </div>
            <div className="zakat-step-line"></div>

            <div className={`zakat-step ${hasCalculated ? "active" : ""}`}>
              <span className="zakat-step-circle">2</span>
              <span>Result</span>
            </div>
            <div className="zakat-step-line"></div>

            <div className="zakat-step">
              <span className="zakat-step-circle">3</span>
              <span>Payment</span>
            </div>
            <div className="zakat-step-line"></div>

            <div className="zakat-step">
              <span className="zakat-step-circle">4</span>
              <span>Receipt</span>
            </div>
          </div>

          <div className={`zakat-grid ${showSummary ? 'zakat-grid-calculated' : ''}`}>
            <section className="zakat-card">
              <div className="zakat-section-head">
                <div className="zakat-section-icon"><Calculator size={28} strokeWidth={2} /></div>
                <div>
                  <h3 className="zakat-card-title">{t.enterFinancialData}</h3>
                  <p className="zakat-card-subtitle">
                    Enter your business information to calculate zakat.
                  </p>
                </div>
              </div>

              <div className="zakat-field-group">
                <h3 className="zakat-field-group-title">Location & Method</h3>
                <div className="zakat-two-col">
                  <div className="zakat-field-block">
                    <label className="zakat-label">{t.year}</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setHasCalculated(false);
                        setShowSummary(false);
                      }}
                      className="zakat-select"
                    >
                      {Object.keys(yearRates).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="zakat-field-block">
                    <label className="zakat-label">{t.state}</label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedState(newState);
                        setHasCalculated(false);
                        setShowSummary(false);
                      }}
                      className="zakat-select"
                    >
                      {Object.keys(yearRates[selectedYear]).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="zakat-field-block">
                  <label className="zakat-label">{t.calculationMethod}</label>
                  <select
                    value={businessMethod}
                    onChange={(e) => {
                      setBusinessMethod(e.target.value);
                      setHasCalculated(false);
                      setShowSummary(false);
                    }}
                    className="zakat-select"
                  >
                    <option value="UntungRugi">Profit & Loss</option>
                    <option value="ModalKerja">Working Capital</option>
                  </select>
                </div>
              </div>

              <div className="zakat-field-group">
                <h3 className="zakat-field-group-title">Financial Data</h3>
                {businessMethod === "UntungRugi" ? (
                  <>
                    <div className="zakat-field-block">
                      <label className="zakat-label">{t.totalRevenue}</label>
                      <input
                        type="number"
                        placeholder="Enter total revenue"
                        value={businessRevenue}
                        onChange={(e) => {
                          setBusinessRevenue(e.target.value);
                          setHasCalculated(false);
                          setShowSummary(false);
                        }}
                        className="zakat-input"
                      />
                    </div>

                    <div className="zakat-field-block">
                      <label className="zakat-label">{t.totalExpenses}</label>
                      <input
                        type="number"
                        placeholder="Enter total expenses"
                        value={businessExpenses}
                        onChange={(e) => {
                          setBusinessExpenses(e.target.value);
                          setHasCalculated(false);
                          setShowSummary(false);
                        }}
                        className="zakat-input"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="zakat-field-block">
                      <label className="zakat-label">{t.currentAssets}</label>
                      <input
                        type="number"
                        placeholder="Enter current assets"
                        value={currentAssets}
                        onChange={(e) => {
                          setCurrentAssets(e.target.value);
                          setHasCalculated(false);
                          setShowSummary(false);
                        }}
                        className="zakat-input"
                      />
                    </div>

                    <div className="zakat-field-block">
                      <label className="zakat-label">{t.currentLiabilities}</label>
                      <input
                        type="number"
                        placeholder="Enter current liabilities"
                        value={currentLiabilities}
                        onChange={(e) => {
                          setCurrentLiabilities(e.target.value);
                          setHasCalculated(false);
                          setShowSummary(false);
                        }}
                        className="zakat-input"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                className="zakat-button premium-pay-btn"
                type="button"
                onClick={handleCalculate}
              >
                {t.calculateZakat}
              </button>

              <div className="zakat-note-box">
                <Info size={16} strokeWidth={2} style={{verticalAlign: 'middle', marginRight: 8}} /> Please fill in the required values first, then click Calculate Zakat.
              </div>
            </section>

            {showSummary ? (
              <section className="zakat-card zakat-result-card zakat-summary-animated">
                <div className="zakat-section-head">
                    <div className="zakat-section-icon"><BadgeDollarSign size={28} strokeWidth={2} /></div>
                  <div>
                    <h3 className="zakat-card-title">Zakat Summary</h3>
                    <p className="zakat-card-subtitle">
                      Summary of your zakat calculation.
                    </p>
                  </div>
                </div>

                <div className="zakat-summary-top">
                  <div className="zakat-summary-mini">
                    <span className="zakat-summary-mini-label">State</span>
                    <strong>{selectedState}</strong>
                  </div>

                  <div className="zakat-summary-mini">
                    <span className="zakat-summary-mini-label">Nisab Year</span>
                    <strong>{selectedYear}</strong>
                  </div>

                  <div className="zakat-summary-mini">
                    <span className="zakat-summary-mini-label">Nisab</span>
                    <strong>RM {formatCurrency(nisab)}</strong>
                  </div>
                </div>

                <div className="zakat-total-status-box">
                  <div className="zakat-total-box">
                    <div className="zakat-total-label">Total Zakat Payable</div>
                    <div className="zakat-total-amount">
                      {hasCalculated ? `RM ${zakat.toFixed(2)}` : "RM --"}
                    </div>
                  </div>

                  <div
                    className={`zakat-status-badge ${hasCalculated
                        ? total >= nisab
                          ? "success"
                          : "danger"
                        : ""
                      }`}
                  >
                    {hasCalculated ? (
                      total >= nisab ? (
                        <><CheckCircle2 size={18} strokeWidth={2} style={{verticalAlign:'middle', marginRight:8}}/> Zakat Required</>
                      ) : (
                        <><XCircle size={18} strokeWidth={2} style={{verticalAlign:'middle', marginRight:8}}/> Not Required</>
                      )
                    ) : (
                      "Calculating..."
                    )}
                  </div>
                </div>

                <div className="zakat-progress-card">
                  <div className="zakat-progress-head">
                    <span>Progress to Nisab</span>
                    <strong>
                      {hasCalculated
                        ? `${Math.min((total / nisab) * 100, 100).toFixed(2)}%`
                        : "0.00%"}
                    </strong>
                  </div>

                  <div className="zakat-progress">
                    <div
                      className="zakat-progress-bar"
                      style={{
                        width: `${hasCalculated ? Math.min((total / nisab) * 100, 100) : 0
                          }%`,
                      }}
                    />
                  </div>

                  <div className="zakat-progress-text">
                    RM {hasCalculated ? formatCurrency(total) : "0.00"} / RM{" "}
                    {formatCurrency(nisab)}
                  </div>
                </div>

                <div className="zakat-advice-card">
                  <div className="zakat-advice-title">AI Financial Insight</div>
                  <p>{getFinancialInsight()}</p>
                </div>

                <div className="zakat-action-row">
                  <button
                    onClick={saveData}
                    className="zakat-button zakat-button-secondary"
                    type="button"
                  >
                    Save Calculation
                  </button>

                  <button
                    onClick={handleProceedToResult}
                    className="zakat-button zakat-button-gold"
                    type="button"
                    disabled={!hasCalculated || zakat === 0}
                    style={{
                      cursor:
                        hasCalculated && zakat > 0 ? "pointer" : "not-allowed",
                      opacity: hasCalculated && zakat > 0 ? 1 : 0.6,
                    }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </section>
            ) : (
              <section className="zakat-card zakat-placeholder-card">
                <div className="zakat-placeholder-content">
                    <div className="zakat-placeholder-icon"><BarChart3 size={36} strokeWidth={2} /></div>
                    <h3 className="zakat-placeholder-title">Ready to Calculate</h3>
                    <p className="zakat-placeholder-text">
                      Complete your financial information to generate your zakat summary.
                    </p>
                  </div>
              </section>
            )}
          </div>

          <div className="zakat-info-strip">
            <div className="zakat-info-card">
              <div className="zakat-info-icon"><Info size={20} strokeWidth={2} /></div>
              <div>
                <h4>
                  Nisab Information {selectedYear} ({selectedState})
                </h4>
                <p>
                  The current nisab calculation is based on the current gold
                  value.
                </p>
              </div>
            </div>

            <div className="zakat-info-stat">
              <span>Current Gold Price</span>
              <strong>RM 494.67 / gram</strong>
            </div>

            <div className="zakat-info-stat">
              <span>Nisab (85 grams)</span>
              <strong>RM {formatCurrency(nisab)}</strong>
            </div>

            <div className="zakat-info-stat">
              <span>Zakat Rate</span>
              <strong>2.5%</strong>
            </div>
          </div>
        </div>
      </div>

      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

export default ZakatCalculator;
