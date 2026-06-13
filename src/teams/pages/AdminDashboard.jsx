import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import "../Styles/AdminDashboard.css";
import {
  BarChart3,
  Pencil,
  CreditCard,
  UserRound,
  BadgeDollarSign,
  ShieldCheck,
  Users,
  Receipt
} from "lucide-react";
import zakatIcon from "../assets/zakat-icon.webp";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, "admin");

  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const menuRef = useRef(null);

  // Sample admin data
  const [nisabRate, setNisabRate] = useState({
    value: 42500,
    lastUpdated: "May 22, 2026",
    currency: "MYR",
  });

  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalZakatCollected: 2500000,
    totalTransactions: 3840,
    activeAdmins: 5,
  });

  // Load current nisab from localStorage
  useEffect(() => {
    const savedNisab = JSON.parse(localStorage.getItem("nisabData") || "null");
    if (savedNisab && savedNisab.goldPrice && savedNisab.nisabValue) {
      setNisabRate({
        value: Number(savedNisab.nisabValue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        lastUpdated: savedNisab.lastUpdated || "May 22, 2026",
        currency: savedNisab.currency || "MYR",
      });
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleUpdateNisab = () => {
    navigate("/update-nisab");
  };

  return (
    <div className="admin-dashboard-page">
      {/* NAVBAR */}
      <header className="admin-navbar">
        <div className="admin-navbar-container">
          {/* Logo */}
          <div className="admin-navbar-left">
            <button
              className="admin-logo-button"
              onClick={() => navigate("/admin/dashboard")}
            >
              <img
                src={zakatIcon}
                alt="logo"
                className="admin-navbar-logo"
              />
              <div>
                <span className="admin-brand-name">ZakatNow</span>
                <p className="admin-subtitle">Admin Panel</p>
              </div>
            </button>
          </div>

          {/* Hamburger Menu */}
          <div className="admin-navbar-right" ref={menuRef}>
            <button
              className="admin-hamburger"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {showMenu && (
              <div className="admin-menu-dropdown">
                <button
                  className={`admin-menu-item ${activeTab === "overview" ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveTab("overview");
                    setShowMenu(false);
                  }}
                >
                  Overview
                </button>

                <button
                  className={`admin-menu-item ${activeTab === "nisab" ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveTab("nisab");
                    setShowMenu(false);
                  }}
                >
                  Nisab Rate
                </button>

                <button
                  className={`admin-menu-item ${activeTab === "users" ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveTab("users");
                    setShowMenu(false);
                  }}
                >
                  Users
                </button>

                <button
                  className={`admin-menu-item ${activeTab === "transactions" ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveTab("transactions");
                    setShowMenu(false);
                  }}
                >
                  Transactions
                </button>

                <hr className="admin-menu-divider" />

                <button
                  className="admin-menu-item logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="admin-main-content">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <section className="admin-section">
            <h1 className="admin-page-title"><BarChart3 size={18} strokeWidth={2} /> Admin Dashboard</h1>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon"><UserRound size={32} strokeWidth={2} /></div>
                <div className="stat-content">
                  <p className="stat-label">Total Users</p>
                  <h3 className="stat-value">{stats.totalUsers}</h3>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon"><BadgeDollarSign size={32} strokeWidth={2} /></div>
                <div className="stat-content">
                  <p className="stat-label">Zakat Collected</p>
                  <h3 className="stat-value">RM {stats.totalZakatCollected.toLocaleString()}</h3>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon"><CreditCard size={32} strokeWidth={2} /></div>
                <div className="stat-content">
                  <p className="stat-label">Transactions</p>
                  <h3 className="stat-value">{stats.totalTransactions}</h3>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">
                  <ShieldCheck size={32} strokeWidth={2} />
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active Admins</p>
                  <h3 className="stat-value">{stats.activeAdmins}</h3>
                </div>
              </div>
            </div>

            <div className="admin-quick-actions">
              <button
                className="admin-action-btn primary"
                onClick={() => setActiveTab("nisab")}
              >
                <Pencil size={18} strokeWidth={2} /> Update Nisab Rate →
              </button>
            </div>
          </section>
        )}

        {/* NISAB RATE TAB */}
        {activeTab === "nisab" && (
          <section className="admin-section">
            <h2 className="admin-section-title"><BarChart3 size={18} strokeWidth={2} /> Nisab Rate Management</h2>

            <div className="nisab-info-box">
              <div className="nisab-info-row">
                <span className="label">Current Nisab Value:</span>
                <span className="value">{nisabRate.value} {nisabRate.currency}</span>
              </div>
              <div className="nisab-info-row">
                <span className="label">Last Updated:</span>
                <span className="value">{nisabRate.lastUpdated}</span>
              </div>
              <div className="nisab-info-row">
                <span className="label">Currency:</span>
                <span className="value">{nisabRate.currency}</span>
              </div>
            </div>

            <div className="nisab-actions">
              <button
                className="admin-action-btn primary"
                onClick={handleUpdateNisab}
              >
                <Pencil size={18} strokeWidth={2} /> Update Nisab Rate
              </button>
            </div>
          </section>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <section className="admin-section">
            <h2 className="admin-section-title">
              <Users size={28} strokeWidth={2} />
              User Management
            </h2>

            <div className="users-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#U001</td>
                    <td>user@example.com</td>
                    <td><span className="status-badge active">Active</span></td>
                    <td>2026-05-15</td>
                    <td><button className="table-action-btn">View</button></td>
                  </tr>
                  <tr>
                    <td>#U002</td>
                    <td>another@example.com</td>
                    <td><span className="status-badge active">Active</span></td>
                    <td>2026-05-10</td>
                    <td><button className="table-action-btn">View</button></td>
                  </tr>
                  <tr>
                    <td>#U003</td>
                    <td>inactive@example.com</td>
                    <td><span className="status-badge inactive">Inactive</span></td>
                    <td>2026-04-20</td>
                    <td><button className="table-action-btn">View</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === "transactions" && (
          <section className="admin-section">
            <h2 className="admin-section-title">
              <Receipt size={28} strokeWidth={2} />
              Transaction History
            </h2>

            <div className="transactions-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#TXN001</td>
                    <td>user@example.com</td>
                    <td>RM 5,000</td>
                    <td>2026-05-22</td>
                    <td><span className="status-badge success">Completed</span></td>
                  </tr>
                  <tr>
                    <td>#TXN002</td>
                    <td>another@example.com</td>
                    <td>RM 3,500</td>
                    <td>2026-05-21</td>
                    <td><span className="status-badge success">Completed</span></td>
                  </tr>
                  <tr>
                    <td>#TXN003</td>
                    <td>test@example.com</td>
                    <td>RM 2,000</td>
                    <td>2026-05-20</td>
                    <td><span className="status-badge pending">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
