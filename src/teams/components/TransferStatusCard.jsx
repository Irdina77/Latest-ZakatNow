import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function TransferStatusCard({
  transfer,
  onBack,
}) {

  const navigate = useNavigate();

  const currentDate =
    new Date().toLocaleString("en-MY", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      className="receipt-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* SUCCESS HEADER */}

      <div className="receipt-header">
        <div className="receipt-checkmark">
          ✓
        </div>

        <h2 className="receipt-title">
          Payment Successful!
        </h2>

        <p className="receipt-subtitle">
          Thank you, your zakat payment
          has been completed.
        </p>
      </div>

      {/* RECEIPT DETAILS */}

      <div className="receipt-body">
        <div className="receipt-row">
          <span>Name</span>
          <strong>
            {localStorage.getItem(
              "registeredFullName"
            ) ||
              transfer?.fullName ||
              transfer?.name ||
              "User"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Zakat Type</span>
          <strong>
            {transfer?.zakatType ||
              "Business Zakat"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Bank</span>
          <strong>
            {transfer?.bankName ||
              transfer?.selectedBank ||
              localStorage.getItem(
                "selectedBank"
              ) ||
              "No Bank Selected"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Amount Paid</span>
          <strong className="receipt-amount">
            RM{" "}
            {Number(
              transfer?.amount ||
              localStorage.getItem(
                "zakatAmount"
              ) ||
              0
            ).toLocaleString("en-MY", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Ref No.</span>
          <strong>
            {transfer?.transferId ||
              "TRF-2026-001"}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Date & Time</span>
          <strong>
            {currentDate}
          </strong>
        </div>
      </div>

      {/* RECEIPT NOTE */}

      <div className="receipt-note">
        This receipt is computer
        generated and no signature
        is required.
      </div>

      {/* BUTTONS */}

      <div className="receipt-button-group">
        <button
          className="btn btn-outline"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Go to Dashboard
        </button>

        <button
          className="btn btn-gold"
          onClick={() =>
            window.print()
          }
        >
          Download Receipt
        </button>
      </div>

    </motion.div>
  );
}