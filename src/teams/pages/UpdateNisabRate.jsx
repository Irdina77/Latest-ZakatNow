import { useState, useEffect, useRef } from "react";
import NisabCard from "../components/NisabCard";
import UpdateForm from "../components/UpdateForm";
import ConfirmModal from "../components/ConfirmModel";
import "../Styles/UpdateNisabRate.css";
import { Bell, Settings, UserRound } from 'lucide-react';

export default function UpdateNisabRate({
  data,
  history = [],
  onUpdate,
  onDelete,
  onGoDashboard,
  onGoNisab,
  onGoManageData,
}) {
  const [previewData, setPreviewData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettingMenu, setShowSettingMenu] = useState(false);
  const settingMenuRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingMenuRef.current &&
        !settingMenuRef.current.contains(event.target)
      ) {
        setShowSettingMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const date = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handlePreview = (payload) => {
    setPreviewData(payload);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (!previewData) return;
    onUpdate(previewData);
    setShowModal(false);
    setPreviewData(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreviewData(null);
  };

  const handleDraft = () => {
    setShowModal(false);
    alert("Draft saved successfully.");
  };

  const handleLogout = () => {
    alert("Logout clicked");
    setShowSettingMenu(false);
  };

  return (
    <div className="nisab-page">
      <nav className="dashboard-topbar">
        <div className="dashboard-topbar-inner">
          <div className="dashboard-brand">
            <div className="brand-logo">✦</div>
            <span className="brand-text">ZAKAT NOW SYSTEM</span>
          </div>

          <div className="dashboard-menu">
            <button className="menu-link" onClick={onGoDashboard}>
              System Data
            </button>

            <button className="menu-link active" onClick={onGoNisab}>
              Nisab Management
            </button>
          </div>

          <div className="dashboard-right">
            <span className="top-icon"><Bell size={18} strokeWidth={2} /></span>

            <div
              className="setting-dropdown-wrapper"
              ref={settingMenuRef}
            >
              <span
                className="top-icon"
                onClick={() => setShowSettingMenu((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                <Settings size={18} strokeWidth={2} />
              </span>

              {showSettingMenu && (
                <div className="setting-dropdown-menu">
                  <button
                    className="setting-dropdown-item"
                    onClick={handleLogout}
                  >
                    🚪
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            <div className="admin-box">
              <div className="admin-avatar"><UserRound size={36} strokeWidth={2} /></div>
              <div>
                <div className="admin-name">Admin</div>
                <div className="admin-role">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="nisab-container">
        <div className="dashboard-meta-row">
          <span className="admin-badge">NISAB MANAGEMENT</span>

          <div className="meta-right">
            <span>{date}</span>
            <span>{time}</span>
          </div>
        </div>

        <header className="dashboard-header">
          <h1>NISAB MANAGEMENT</h1>
          <p className="nisab-subtitle">
            In every provision we are given, 2.5% is the right of others.
          </p>
        </header>

        <div className="nisab-grid">
          <NisabCard data={data} history={history} />
          <UpdateForm onPreview={handlePreview} />
        </div>

        <section className="nisab-card history-card">
          <div className="history-header">
            <h2>UPDATE HISTORY</h2>
          </div>

          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Effective Date</th>
                  <th>Gold Price (RM/g)</th>
                  <th>Nisab Value (RM)</th>
                  <th>Status</th>
                  <th>Updated By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className={item.active ? "aktif-row" : ""}>
                    <td>{item.id}</td>
                    <td>{item.effectiveDate}</td>
                    <td>RM {Number(item.goldPrice).toFixed(2)}</td>
                    <td>
                      RM{" "}
                      {Number(item.nisabValue).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={
                          item.status === "Active"
                            ? "badge-aktif"
                            : "badge-tamat"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.updatedBy}</td>
                    <td>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          if (window.confirm("Delete this history record?")) {
                            onDelete(item.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="nisab-footer">
          © {data?.year || "2026"} Zakat Organisation Portal
        </footer>
      </div>

      {showModal && previewData && (
        <ConfirmModal
          previewData={previewData}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onDraft={handleDraft}
        />
      )}
    </div>
  );
}