import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, DollarSign, Target, TrendingUp } from 'lucide-react';
import SidebarDrawer from '../components/SidebarDrawer';
import '../Styles/NisabPage.css';
import zakatIcon from '../../teams/assets/zakat-icon.webp';

const stateOptions = [
  'Selangor',
  'Kelantan',
  'Johor',
  'Kedah',
  'Penang',
  'Terengganu',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Sabah',
  'Sarawak',
  'Perak',
  'Perlis',
  'Kuala Lumpur',
  'Putrajaya',
];

// Dynamic Nisab Data by State (goldPrice per gram)
const nisabDataByState = {
  'Selangor': { goldPrice: 494.67, nisab: 42047 },
  'Kelantan': { goldPrice: 487.50, nisab: 41437.50 },
  'Johor': { goldPrice: 492.20, nisab: 41837 },
  'Kedah': { goldPrice: 490.15, nisab: 41662.75 },
  'Penang': { goldPrice: 495.30, nisab: 42100.50 },
  'Terengganu': { goldPrice: 489.80, nisab: 41633 },
  'Pahang': { goldPrice: 493.50, nisab: 41947.50 },
  'Negeri Sembilan': { goldPrice: 491.40, nisab: 41769 },
  'Melaka': { goldPrice: 494.20, nisab: 42006.99 },
  'Sabah': { goldPrice: 488.60, nisab: 41531 },
  'Sarawak': { goldPrice: 496.10, nisab: 42168.50 },
  'Perak': { goldPrice: 492.90, nisab: 41896.50 },
  'Perlis': { goldPrice: 489.50, nisab: 41607.50 },
  'Kuala Lumpur': { goldPrice: 495.00, nisab: 42075 },
  'Putrajaya': { goldPrice: 495.00, nisab: 42075 },
};

const zakatRate = 2.5;

export default function NisabPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('Selangor');
  const navigate = useNavigate();

  useEffect(() => {
    // Load from localStorage if user previously selected state
    const savedState = localStorage.getItem('selectedState') || 'Selangor';
    setSelectedState(savedState);
  }, []);

  // Get current state data
  const currentStateData = nisabDataByState[selectedState] || nisabDataByState['Selangor'];
  const goldPrice = currentStateData.goldPrice;
  const nisabAmount = goldPrice * 85;
  const year = new Date().getFullYear();

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    localStorage.setItem('selectedState', newState);
  };

  return (
    <>
      <div className="nisab-container">
        {/* Header with Logo Branding - Matches Calculator Page */}
        <header className="nisab-topbar">
          <div className="nisab-brand">
            <button
              className="navbar-logo-button"
              onClick={() => navigate('/dashboard')}
            >
              <img
                src={zakatIcon}
                alt="logo"
                className="navbar-logo"
              />
              <div>
                <span className="navbar-brand-name">ZakatNow</span>
                <p className="navbar-subtitle">Smart AI-Powered Zakat</p>
              </div>
            </button>
          </div>

          <div className="nisab-topbar-actions">
            <button
              className="nisab-menu-button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <span className="hamburger-line top"></span>
              <span className="hamburger-line bottom"></span>
            </button>
          </div>
        </header>

        <main className="nisab-main">
          {/* Page Header Card */}
          <section className="nisab-header-card">
            <div className="nisab-header-icon">
              <CalendarDays size={32} />
            </div>
            <div className="nisab-header-content">
              <h2 className="nisab-page-title">Nisab Tahunan Zakat</h2>
              <p className="nisab-page-subtitle">
                View yearly nisab values based on your selected state and current gold price.
              </p>
            </div>
          </section>

          {/* State Selection Card */}
          <section className="nisab-card">
            <h3 className="nisab-card-title">Pilih Negeri / Select State</h3>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="nisab-select"
            >
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </section>

          {/* Dynamic Nisab Summary Cards Grid */}
          <section className="nisab-summary-grid">
            {/* Card 1: Current Gold Price */}
            <div className="nisab-summary-card">
              <div className="nisab-summary-icon"><DollarSign size={28} /></div>
              <div className="nisab-summary-content">
                <h4 className="nisab-summary-label">Current Gold Price</h4>
                <div className="nisab-summary-value">
                  RM {goldPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="nisab-summary-note">per gram</p>
              </div>
            </div>

            {/* Card 2: Nisab (85 grams) */}
            <div className="nisab-summary-card highlight">
              <div className="nisab-summary-icon"><Target size={28} /></div>
              <div className="nisab-summary-content">
                <h4 className="nisab-summary-label">Nisab (85 grams)</h4>
                <div className="nisab-summary-value">
                  RM {nisabAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="nisab-summary-note">minimum threshold</p>
              </div>
            </div>

            {/* Card 3: Zakat Rate */}
            <div className="nisab-summary-card">
              <div className="nisab-summary-icon"><TrendingUp size={28} /></div>
              <div className="nisab-summary-content">
                <h4 className="nisab-summary-label">Zakat Rate</h4>
                <div className="nisab-summary-value">{zakatRate}%</div>
                <p className="nisab-summary-note">according to syariah</p>
              </div>
            </div>

            {/* Card 4: Year */}
            <div className="nisab-summary-card">
              <div className="nisab-summary-icon"><CalendarDays size={28} /></div>
              <div className="nisab-summary-content">
                <h4 className="nisab-summary-label">Year</h4>
                <div className="nisab-summary-value">{year}</div>
                <p className="nisab-summary-note">current year</p>
              </div>
            </div>
          </section>

          {/* Information Card */}
          <section className="nisab-info-card">
            <h3 className="nisab-info-title">💡 What is Nisab?</h3>
            <p className="nisab-info-text">
              Nisab refers to the minimum amount of wealth required before zakat becomes obligatory. 
              Business zakat is payable when your total assets exceed the nisab threshold for the full lunar year. 
              The nisab amount is calculated based on the price of gold (85 grams) in your state and is updated annually 
              to reflect changes in market prices.
            </p>
            <div className="nisab-info-details">
              <div className="nisab-info-detail-item">
                <strong>📌 Current State:</strong> {selectedState}
              </div>
              <div className="nisab-info-detail-item">
                <strong>💵 Nisab Amount:</strong> RM {nisabAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="nisab-info-detail-item">
                <strong>⏰ Update Frequency:</strong> Annually (or when gold price changes significantly)
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="nisab-actions">
            <button
              className="btn premium-back-btn"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </button>
            <button
              className="btn premium-pay-btn"
              onClick={() => navigate('/calculator')}
            >
              Go to Calculator →
            </button>
          </section>
        </main>
      </div>
      <SidebarDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
