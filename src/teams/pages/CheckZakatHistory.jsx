import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import "../Styles/CheckZakatHistory.css";

const STATUS_CLASSES = {
  Success: "status-success",
  Pending: "status-pending",
  Failed: "status-failed",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = typeof value.toDate === "function" ? value.toDate() : value;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (value) => {
  const amount = Number(value) || 0;
  return amount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CheckZakatHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error("[CheckZakatHistory] ❌ No authenticated user found");
        setPayments([]);
        setError("Please sign in to view your payment history.");
        setLoading(false);
        return;
      }

      try {
        const userId = user.uid;
        console.log("[CheckZakatHistory] ✅ Current User UID:", userId);
        console.log("[CheckZakatHistory] Auth User Object:", {
          uid: user.uid,
          email: user.email,
          authenticated: !!user.uid,
        });

        // ========== TEST QUERY: Load ALL payments to verify Firestore connection ==========
        console.log("[CheckZakatHistory] 🔍 RUNNING TEST QUERY: Loading ALL documents from 'payments' collection...");
        try {
          const testSnapshot = await getDocs(collection(db, "payments"));
          console.log(`[CheckZakatHistory] ✅ TEST QUERY SUCCESS - Total documents in 'payments' collection: ${testSnapshot.docs.length}`);
          
          if (testSnapshot.docs.length > 0) {
            console.log("[CheckZakatHistory] 📄 Sample document structure:", testSnapshot.docs[0].data());
          } else {
            console.warn("[CheckZakatHistory] ⚠️ 'payments' collection exists but is EMPTY");
          }
        } catch (testError) {
          console.error("[CheckZakatHistory] ❌ TEST QUERY FAILED - Cannot access 'payments' collection:", {
            errorCode: testError.code,
            errorMessage: testError.message,
            possibleCauses: [
              "Collection name is wrong (check if it's 'paymentHistory' instead of 'payments')",
              "Firestore Security Rules deny read access",
              "Database connection failed",
            ],
          });
        }
        // ========== END TEST QUERY ==========

        // ========== ACTUAL QUERY: Load filtered payments for current user ==========
        console.log("[CheckZakatHistory] 🔄 RUNNING FILTERED QUERY: Loading payments for userId:", userId);
        
        const paymentsRef = collection(db, "payments");
        const paymentsQuery = query(
          paymentsRef,
          where("userId", "==", userId)
        );

        console.log("[CheckZakatHistory] 📊 Executing Firestore query with filters:");
        console.log("  - Collection: 'payments'");
        console.log("  - Filter: where('userId', '==', '" + userId + "')");
        console.log("  - Order: Sorting by createdAt in JavaScript (no Firestore index required)");

        const snapshot = await getDocs(paymentsQuery);
        console.log(`[CheckZakatHistory] ✅ Query returned ${snapshot.docs.length} documents for user ${userId}`);

        let records = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          console.log(`[CheckZakatHistory] 📋 Record #${index + 1}:`, {
            docId: doc.id,
            userId: data.userId,
            paymentId: data.paymentId,
            transactionId: data.transactionId,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            gateway: data.gateway,
            paymentDate: data.paymentDate,
            status: data.status,
            createdAt: data.createdAt,
            zakatType: data.zakatType,
            receiptUrl: data.receiptUrl ? "✓ Present" : "✗ Missing",
          });
          return {
            id: doc.id,
            ...data,
          };
        });

        // ========== SORT IN JAVASCRIPT: Sort by createdAt in descending order ==========
        records.sort((a, b) => {
          const dateA = new Date(
            a.createdAt?.toDate?.() || a.createdAt || 0
          ).getTime();
          const dateB = new Date(
            b.createdAt?.toDate?.() || b.createdAt || 0
          ).getTime();
          return dateB - dateA; // Descending order: newest first
        });
        console.log("[CheckZakatHistory] ✅ Records sorted by createdAt (descending) in JavaScript");

        console.log(`[CheckZakatHistory] ✅ FILTERED QUERY SUCCESS - Total records for current user: ${records.length}`);
        
        if (records.length === 0) {
          console.warn("[CheckZakatHistory] ⚠️ No payment records found for user. Possible reasons:", [
            "1. This user has no payments yet",
            "2. Payments were saved with different userId format (check if uid vs userId mismatch)",
            "3. Check if payments collection contains 'uid' field instead of 'userId' field",
          ]);
        }

        setPayments(records);
      } catch (fetchError) {
        console.error("[CheckZakatHistory] ❌ FIRESTORE ERROR:", {
          errorCode: fetchError.code,
          errorMessage: fetchError.message,
          errorName: fetchError.name,
          fullError: fetchError,
          diagnosis: [
            `Code: ${fetchError.code}`,
            `Message: ${fetchError.message}`,
            "Possible causes:",
            "  - PERMISSION_DENIED: Check Firestore Security Rules",
            "  - INVALID_ARGUMENT: Check field names (userId vs uid)",
            "  - NOT_FOUND: Check collection name (payments vs paymentHistory)",
            "  - FAILED_PRECONDITION: Firestore indexes may be needed",
          ],
        });
        setError(
          `Firestore Error: ${fetchError.code} - ${fetchError.message}`
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const paymentTypes = useMemo(() => {
    const uniqueTypes = new Set(payments.map((item) => item.zakatType).filter(Boolean));
    return ["All", ...Array.from(uniqueTypes).sort()];
  }, [payments]);

  const paymentStatuses = useMemo(() => {
    const uniqueStatuses = new Set(
      payments.map((item) => item.status).filter(Boolean)
    );
    return ["All", ...Array.from(uniqueStatuses).sort()];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const transactionId = (
        payment.paymentId ||
        payment.transactionId ||
        payment.id ||
        ""
      ).toString().toLowerCase();
      
      const matchesSearch = transactionId.includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "All" || payment.zakatType === selectedType;
      const matchesStatus =
        selectedStatus === "All" || payment.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [payments, searchTerm, selectedType, selectedStatus]);

  const totalPayments = payments.length;
  const totalAmountPaid = payments.reduce(
    (sum, payment) => sum + (Number(payment.amount) || 0),
    0
  );

  const latestPaymentDate = payments.length
    ? formatDate(payments[0].paymentDate)
    : "-";

  const handleViewReceipt = (payment) => {
    console.log("[CheckZakatHistory] 👁️ Opening receipt modal for payment:", {
      paymentId: payment.paymentId,
      transactionId: payment.transactionId,
    });
    setSelectedPayment(payment);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    console.log("[CheckZakatHistory] Closing receipt modal");
    setShowReceiptModal(false);
    setSelectedPayment(null);
  };

  const downloadReceipt = (payment) => {
    try {
      console.log("[CheckZakatHistory] 📥 Preparing receipt for print/download:", {
        paymentId: payment.paymentId,
        transactionId: payment.transactionId,
        amount: payment.amount,
      });

      // Open receipt modal
      setSelectedPayment(payment);
      setShowReceiptModal(true);

      // Set a small delay to ensure modal is rendered, then open print dialog
      setTimeout(() => {
        console.log("[CheckZakatHistory] Opening print dialog");
        window.print();
      }, 100);
    } catch (error) {
      console.error("[CheckZakatHistory] ❌ Error preparing receipt for download:", {
        errorMessage: error.message,
        paymentId: payment.paymentId,
      });
      alert("Failed to prepare receipt. Please try again.");
    }
  };

  return (
    <div className="history-page">
      <div className="history-page-shell">
        <div className="history-topbar">
          <div>
            <p className="history-eyebrow">Zakat Payment History</p>
            <h1 className="history-title">View all your completed zakat transactions.</h1>
          </div>
          <button
            className="history-back-button btn-gold-primary"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        <div className="history-summary-grid">
          <article className="history-summary-card">
            <p>Total Payments</p>
            <h2>{totalPayments}</h2>
          </article>
          <article className="history-summary-card">
            <p>Total Amount Paid (RM)</p>
            <h2>RM {formatAmount(totalAmountPaid)}</h2>
          </article>
          <article className="history-summary-card">
            <p>Latest Payment Date</p>
            <h2>{latestPaymentDate}</h2>
          </article>
        </div>

        <div className="history-toolbar">
          <label className="history-search-wrapper">
            <Search size={18} className="history-search-icon" />
            <input
              type="search"
              placeholder="Search by Transaction ID"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="history-filter-group">
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              {paymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="history-state-card history-loading-state">
            <Loader2 className="loading-icon" size={32} />
            <p>Loading your zakat history...</p>
          </div>
        ) : error ? (
          <div className="history-state-card history-error-state">
            <XCircle size={32} />
            <h2>Unable to load payments</h2>
            <p>{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="history-state-card history-empty-state">
            <div className="history-empty-illustration">
              <FileText size={48} />
            </div>
            <h2>No zakat payment records found.</h2>
            <p>Your completed zakat payments will appear here.</p>
          </div>
        ) : (
          <>
            <div className="history-table-wrap">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Payment Date</th>
                    <th>Zakat Type</th>
                    <th>Amount (RM)</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.paymentId || payment.transactionId || payment.id || "-"}</td>
                      <td>{formatDate(payment.paymentDate)}</td>
                      <td>{payment.zakatType || "-"}</td>
                      <td>RM {formatAmount(payment.amount)}</td>
                      <td>{payment.paymentMethod || payment.gateway || payment.bankName || "-"}</td>
                      <td>
                        <span
                          className={`history-status-badge ${
                            STATUS_CLASSES[payment.status] || "status-pending"
                          }`}
                        >
                          {payment.status || "Pending"}
                        </span>
                      </td>
                      <td>
                        <div className="history-action-group">
                          <button
                            className="history-action-button"
                            type="button"
                            onClick={() => handleViewReceipt(payment)}
                            title="View receipt details"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            className="history-action-button history-action-download"
                            type="button"
                            onClick={() => downloadReceipt(payment)}
                            title="Download receipt as PDF"
                          >
                            <Download size={16} />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-history-list">
              {filteredPayments.map((payment) => (
                <article key={payment.id} className="mobile-history-card">
                  <div className="mobile-card-header">
                    <span className="mobile-card-id">{payment.paymentId || payment.transactionId || payment.id}</span>
                    <span
                      className={`history-status-badge ${
                        STATUS_CLASSES[payment.status] || "status-pending"
                      }`}
                    >
                      {payment.status || "Pending"}
                    </span>
                  </div>
                  <div className="mobile-card-item">
                    <span>Payment Date</span>
                    <strong>{formatDate(payment.paymentDate)}</strong>
                  </div>
                  <div className="mobile-card-item">
                    <span>Zakat Type</span>
                    <strong>{payment.zakatType || "-"}</strong>
                  </div>
                  <div className="mobile-card-item">
                    <span>Amount</span>
                    <strong>RM {formatAmount(payment.amount)}</strong>
                  </div>
                  <div className="mobile-card-item">
                    <span>Method</span>
                    <strong>{payment.paymentMethod || payment.gateway || payment.bankName || "-"}</strong>
                  </div>
                  <div className="mobile-card-actions">
                    <button
                      className="history-action-button"
                      type="button"
                      onClick={() => handleViewReceipt(payment)}
                      title="View receipt details"
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="history-action-button history-action-download"
                      type="button"
                      onClick={() => downloadReceipt(payment)}
                      title="Download receipt as PDF"
                    >
                      <Download size={16} /> PDF
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedPayment && (
          <div className="history-receipt-modal-overlay" onClick={closeReceiptModal}>
            <div className="history-receipt-modal" onClick={(e) => e.stopPropagation()}>
              <div className="history-receipt-header">
                <h2>Payment Receipt</h2>
                <button
                  className="history-receipt-close"
                  onClick={closeReceiptModal}
                  type="button"
                  title="Close receipt"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="history-receipt-content">
                {/* Receipt Document */}
                <div className="history-receipt-document">
                  {/* Header */}
                  <div className="history-receipt-title">
                    <h1>ZakatNow</h1>
                    <p>Payment Receipt</p>
                  </div>

                  {/* Divider */}
                  <div className="history-receipt-divider"></div>

                  {/* Details Grid */}
                  <div className="history-receipt-details">
                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Transaction ID:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.paymentId ||
                          selectedPayment.transactionId ||
                          selectedPayment.id ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Payment ID:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.paymentId || selectedPayment.id || "N/A"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Payment Date:</span>
                      <span className="history-receipt-value">
                        {formatDate(selectedPayment.paymentDate)}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Payment Method:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.paymentMethod ||
                          selectedPayment.gateway ||
                          selectedPayment.bankName ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Gateway:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.gateway || "N/A"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Status:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.status || "Pending"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">Zakat Type:</span>
                      <span className="history-receipt-value">
                        {selectedPayment.zakatType || "N/A"}
                      </span>
                    </div>

                    <div className="history-receipt-row">
                      <span className="history-receipt-label">User Email:</span>
                      <span className="history-receipt-value">
                        {auth.currentUser?.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Amount Box */}
                  <div className="history-receipt-amount-box">
                    <span className="history-receipt-amount-label">Amount Paid:</span>
                    <span className="history-receipt-amount-value">
                      RM {formatAmount(selectedPayment.amount)}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="history-receipt-footer">
                    <p className="history-receipt-thank-you">
                      Thank you for your contribution to Zakat!
                    </p>
                    <p className="history-receipt-copyright">
                      ZakatNow © 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="history-receipt-actions">
                <button
                  className="history-receipt-button history-receipt-print"
                  onClick={() => window.print()}
                  type="button"
                >
                  <Download size={18} />
                  Print / Download PDF
                </button>
                <button
                  className="history-receipt-button history-receipt-close-btn"
                  onClick={closeReceiptModal}
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
