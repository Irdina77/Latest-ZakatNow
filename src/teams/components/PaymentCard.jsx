import React, { useState } from "react";
import { motion } from "framer-motion";

import maybankLogo from "../assets/maybank.png";
import cimbLogo from "../assets/cimb.png";
import bankIslamLogo from "../assets/bankislam.png";
import rhbLogo from "../assets/rhb.png";
import publicBankLogo from "../assets/publicbank.png";
import hongleongLogo from "../assets/hongleong.png";
import bsnLogo from "../assets/bsn.png";
import fpxLogo from "../assets/fpx.jpg";
import jompayLogo from "../assets/jompay.png";
import duitnowLogo from "../assets/duitnow.jpg";

const gatewayOptions = ["FPX Online Banking", "JomPay", "DuitNow QR"];
const bankingTypes = ["Personal Banking", "Corporate Banking"];

const bankOptions = [
  {
    name: "Maybank2u",
    subtitle: "Maybank online banking",
    logo: maybankLogo,
    color: "#facc15",
    dark: "#111111",
    field: "Username",
  },
  {
    name: "CIMB Clicks",
    subtitle: "CIMB online banking",
    logo: cimbLogo,
    color: "#dc2626",
    dark: "#b91c1c",
    field: "User ID",
  },
  {
    name: "Bank Islam",
    subtitle: "Bank Islam online banking",
    logo: bankIslamLogo,
    color: "#be123c",
    dark: "#9f1239",
    field: "Username",
  },
  {
    name: "RHB Now",
    subtitle: "RHB online banking",
    logo: rhbLogo,
    color: "#005baa",
    dark: "#005baa",
    field: "User ID",
  },
  {
    name: "Public Bank",
    subtitle: "Public Bank online banking",
    logo: publicBankLogo,
    color: "#e11d48",
    dark: "#dc2626",
    field: "User ID",
  },
  {
    name: "Hong Leong Bank",
    subtitle: "Hong Leong online banking",
    logo: hongleongLogo,
    color: "#0f2f63",
    dark: "#061a3a",
    field: "Username",
  },
  {
    name: "BSN",
    subtitle: "BSN online banking",
    logo: bsnLogo,
    color: "#0891b2",
    dark: "#0e7490",
    field: "Username",
  },
];

export default function PaymentCard({ payment, onPay, onBack }) {
  const [step, setStep] = useState("gateway");
  const [selectedGateway, setSelectedGateway] = useState(gatewayOptions[0]);
  const [bankType, setBankType] = useState(bankingTypes[0]);
  const [selectedBank, setSelectedBank] = useState(bankOptions[0].name);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const amountNumber =
    Number(
      payment?.amount ||
      payment?.zakatAmount ||
      payment?.zakat ||
      payment?.totalZakat ||
      0
    ) || 0;

  const amountText = amountNumber.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const currentBank =
    bankOptions.find((bank) => bank.name === selectedBank) || bankOptions[0];

  const generateTransactionId = () => `FPX${Date.now().toString().slice(-10)}`;

  const handleConfirm = () => {
    setShowConfirm(false);

    if (
      selectedGateway ===
      "FPX Online Banking"
    ) {
      setStep("fpx");
    }

    else if (
      selectedGateway ===
      "JomPay"
    ) {
      setStep("jompay");
    }

    else {
      setStep("duitnow");
    }
  };

  const completePayment = (event) => {
    if (event) event.preventDefault();

    setIsProcessing(true);

    setTimeout(() => {
      if (onPay) {
        onPay({
          ...payment,
          gateway: selectedGateway,
          bankName:
            selectedGateway === "FPX Online Banking" ? selectedBank : "JomPay",
          transactionId: generateTransactionId(),
          amount: amountNumber,
          status: "Success",
        });
      }

      setIsProcessing(false);
      setStep("success");
    }, 900);
  };

  const renderStepIndicator = () => {
    const steps = ["Payment Method", "Pay", "Thank You"];
    const activeIndex = step === "success" ? 2 : step === "login" ? 1 : 0;

    return (
      <div className="fpx-step-indicator">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`fpx-step ${index <= activeIndex ? "active" : ""}`}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-label">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="card payment-card payment-card-premium"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {step === "gateway" && (
        <>
          <div className="payflow-header">
            <div>
              <h2>Choose Payment Method</h2>
              <p>Select your preferred zakat payment option.</p>
            </div>
            <span className="pay-status">{payment?.status || "Pending"}</span>
          </div>

          <div className="gateway-grid">

            {gatewayOptions.map(
              (gateway) => (

                <button
                  key={gateway}
                  type="button"
                  className={`gateway-option ${selectedGateway ===
                    gateway
                    ? "selected"
                    : ""
                    }`}
                  onClick={() =>
                    setSelectedGateway(
                      gateway
                    )
                  }
                >
                  {gateway ===
                    "FPX Online Banking" && (
                      <div className="recommended-tag">
                        <span className="recommended-icon">
                          ☆
                        </span>

                        Recommended
                      </div>
                    )}

                  <span className="gateway-check">
                    {selectedGateway ===
                      gateway
                      ? "✓"
                      : ""}
                  </span>

                  <div className="gateway-image">
                    <img
                      src={
                        gateway === "FPX Online Banking"
                          ? fpxLogo
                          : gateway === "JomPay"
                            ? jompayLogo
                            : duitnowLogo
                      }
                      alt={gateway}
                      className="gateway-logo"
                    />
                  </div>

                  <strong>
                    {selectedGateway ===
                      "FPX Online Banking"
                      ? selectedBank
                      : selectedGateway ===
                        "JomPay"
                        ? "JomPay"
                        : "DuitNow QR"}
                  </strong>

                  <small>
                    {gateway ===
                      "FPX Online Banking"
                      ? "Fast online banking"
                      : gateway ===
                        "JomPay"
                        ? "Biller code payment"
                        : "Secure QR payment"}
                  </small>

                </button>
              )
            )}

          </div>

          <div className="payment-summary-box">
            <div>
              <span>Payment Amount</span>
              <strong>RM {amountText}</strong>
            </div>

            <div>
              <span>Selected Gateway</span>
              <strong>{selectedGateway}</strong>
            </div>
          </div>

          <div className="payment-actions premium-payment-actions">

            <button
              className="btn premium-back-btn"
              type="button"
              onClick={onBack}
            >
              ← Back
            </button>

            <button
              className="btn premium-pay-btn"
              type="button"
              onClick={() => setShowConfirm(true)}
            >
              Pay Zakat
            </button>

          </div>
        </>
      )}

      {step === "fpx" && (
        <>
          <div className="fpx-card-header">
            <div>
              <h2>FPX Online Banking</h2>
              <p>Choose your banking type and bank for secure checkout.</p>
            </div>
            <span className="secure-fpx">🔒 Secure FPX</span>
          </div>

          {renderStepIndicator()}

          <div className="fpx-form-grid">
            <label className="input-group">
              <span>Banking Type</span>
              <select
                value={bankType}
                onChange={(event) => setBankType(event.target.value)}
              >
                {bankingTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="input-group">
              <span>Select Bank</span>
              <select
                value={selectedBank}
                onChange={(event) => setSelectedBank(event.target.value)}
              >
                {bankOptions.map((bank) => (
                  <option key={bank.name}>{bank.name}</option>
                ))}
              </select>
            </label>
          </div>

          <h3 className="popular-bank-title">Popular Banks</h3>

          <div className="bank-grid">
            {bankOptions.map((bank) => (
              <button
                key={bank.name}
                type="button"
                className={`bank-tile ${selectedBank === bank.name ? "selected" : ""
                  }`}
                onClick={() => setSelectedBank(bank.name)}
              >
                <img src={bank.logo} alt={bank.name} className="real-bank-logo" />

                <div className="bank-tile-text">
                  <strong className="bank-name">{bank.name}</strong>
                  <span className="bank-subtitle">{bank.subtitle}</span>
                </div>

                {selectedBank === bank.name && <span className="bank-tick">✓</span>}
              </button>
            ))}
          </div>

          <div className="payment-summary-box">
            <div>
              <span>Amount</span>
              <strong>RM {amountText}</strong>
            </div>

            <div>
              <span>Bank Type</span>
              <strong>{bankType}</strong>
            </div>
          </div>

          <div className="payment-actions premium-payment-actions">
            <button
              className="btn premium-back-btn"
              type="button"
              onClick={() => setStep("gateway")}
            >
              ← Back
            </button>

            <button
              className="btn premium-pay-btn"
              type="button"
              onClick={() => setStep("login")}
            >
              Continue to Login →
            </button>
          </div>
        </>
      )}

      {step === "login" && (
        <div className="bank-login-page">
          <div className="bank-topbar" style={{ background: currentBank.dark }}>
            <img
              src={currentBank.logo}
              alt={currentBank.name}
              className="bank-login-logo"
            />
            <span>🔒 Secure Connection</span>
          </div>

          <div className="bank-login-content">
            <form className="bank-login-form-real" onSubmit={completePayment}>
              <h3>Welcome to {currentBank.name}</h3>
              <p>Log in to your online banking account.</p>

              <label>{currentBank.field}</label>
              <input
                type="text"
                placeholder={`Enter your ${currentBank.field}`}
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                required
              />

              <button
                className="bank-login-btn-real"
                style={{
                  background: currentBank.color,
                  color: currentBank.name === "Maybank2u" ? "#111" : "#fff",
                }}
                type="submit"
                disabled={isProcessing}
              >
                🔒 {isProcessing ? "Processing..." : "Login & Pay"}
              </button>

              <button
                className="bank-link-btn"
                type="button"
                onClick={() => setStep("fpx")}
              >
                ← Back to Bank Selection
              </button>
            </form>

            <div className="bank-security-card">
              <div className="security-shield">🛡️</div>
              <h4>Security Reminder</h4>
              <p>Never share your password, PIN or TAC with anyone.</p>
              <p>
                {currentBank.name} will never ask for your personal information
                via email or SMS.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === "jompay" && (
        <>
          <div className="jompay-card-real">
            <div className="jompay-head">
              <strong>JomPAY</strong>
              <span>Reference Payment</span>
            </div>

            <div className="jompay-details">
              <div>
                <span>Biller Code</span>
                <strong>88911</strong>
              </div>

              <div>
                <span>Reference No.</span>
                <strong>REF-{Date.now().toString().slice(-6)}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>RM {amountText}</strong>
              </div>
            </div>

            <p>Use this biller code and reference number in your online banking app.</p>
          </div>

          <div className="payment-actions premium-payment-actions">
            <button
              className="btn premium-back-btn"
              type="button"
              onClick={() => setStep("gateway")}
            >
              ← Choose Another Method
            </button>

            <button
              className="btn premium-pay-btn"
              type="button"
              onClick={() => {
                alert(
                  "Please complete payment in your banking app using the Biller Code."
                );
                completePayment();
              }}
            >
              ✓ I Have Paid
            </button>
          </div>
        </>
      )}

      {step === "duitnow" && (
        <>
          <div className="jompay-card-real">

            <div className="duitnow-head">
              <strong>
                DuitNow QR
              </strong>

              <span>
                Scan & Pay
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                margin:
                  "30px 0",
              }}
            >
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZakatNow-RM${amountText}`} alt="DuitNow QR"
                style={{
                  width: "230px",
                  borderRadius:
                    "20px",
                  boxShadow:
                    "0 12px 30px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            <div className="payment-summary-box">
              <div>
                <span>
                  Amount
                </span>

                <strong>
                  RM {amountText}
                </strong>
              </div>

              <div>
                <span>
                  Payment Method
                </span>

                <strong>
                  DuitNow QR
                </strong>
              </div>
            </div>

            <div className="payment-actions premium-payment-actions">

              <button
                className="btn premium-back-btn"
                type="button"
                onClick={() =>
                  setStep(
                    "gateway"
                  )
                }
              >
                ← Back
              </button>

              <button
                className="btn premium-pay-btn"
                type="button"
                onClick={
                  completePayment
                }
              >
                ✓ I Have Paid
              </button>

            </div>
          </div>
        </>
      )}

      {step === "success" && (
        <div className="payment-success-real">
          <div className="success-circle">✓</div>
          <h2>Payment Successful</h2>
          <p>Your zakat payment has been completed.</p>

          <div className="success-receipt-real">
            <div>
              <span>Amount Paid</span>
              <strong>RM {amountText}</strong>
            </div>

            <div>
              <span>Method</span>
              <strong>{selectedGateway}</strong>
            </div>

            <div>
              <span>Bank</span>
              <strong>
                {selectedGateway === "FPX Online Banking"
                  ? selectedBank
                  : "JomPay"}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="success-text">SUCCESS</strong>
            </div>
          </div>

          <button className="btn premium-pay-btn" type="button" onClick={onBack}>
            Back to Dashboard
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <motion.div
            className="confirm-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="bismillah">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>

            <h3>Lafaz Niat</h3>

            <p>
              Inilah wang sebanyak <strong>RM {amountText}</strong> sebagai
              menunaikan zakat kerana Allah Taala.
            </p>

            <div className="modal-actions">
              <button className="btn premium-pay-btn" type="button" onClick={handleConfirm}>
                ✓ Ya, Teruskan
              </button>

              <button
                className="btn premium-back-btn"
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}