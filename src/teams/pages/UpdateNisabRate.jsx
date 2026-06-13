import logo from "../assets/zakat-icon.webp";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NisabCard from "../components/NisabCard";
import UpdateForm from "../components/UpdateForm";
import ConfirmModal from "../components/ConfirmModel";
import "../Styles/UpdateNisabRate.css";

export default function UpdateNisabRate({
  data = {},
  history = [],
  onUpdate = () => { },
  onDelete = () => { },
}) {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
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

  return (
    <div className="nisab-page">
      <nav className="update-nisab-topbar">
        <div className="update-nisab-topbar-inner">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <span className="back-icon">←</span>
            Back
          </button>

          <div className="dashboard-brand">
            <img
              src={logo}
              alt="ZakatNow"
              className="navbar-logo"
            />

            <div>
              <div className="admin-brand-name">
                ZakatNow
              </div>

              <div className="admin-subtitle">
                Admin Panel
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