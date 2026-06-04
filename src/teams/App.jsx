import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ZakatCalculator from "./pages/ZakatCalculator";
import Profile from "./pages/Profile";
import NisabPage from "./pages/NisabPage";
import BusinessSetup from "./pages/BusinessSetup";
import ResultPage from "./pages/ResultPage";
import PaymentPage from "./pages/PaymentPage";
import CheckZakatHistory from "./pages/CheckZakatHistory";
import TransferPage from "./pages/TransferPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateNisabRate from "./pages/UpdateNisabRate";

import "./App.css";
import "./Styles/ZakatCalculator.css";

export default function App() {
  const navigate = useNavigate();

  const defaultResult = {
    zakatAmount: 0,
    nisabStatus: "Not calculated",
    method: "-",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [result, setResult] = useState(defaultResult);

  const [payment, setPayment] = useState({
    paymentId: "PAY-2026-001",
    amount: 0,
    gateway: "FPX / Online Banking",
    status: "Pending",
  });

  const [transfer, setTransfer] = useState({
    transferId: "TRF-2026-001",
    bankName: "Maybank",
    zakatOrganization: "Kelantan Zakat Organization",
    status: "Pending",
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("userRole");

    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserRole(storedRole === "admin" ? "admin" : "user");
    }
  }, []);

  useEffect(() => {
    const savedResult = localStorage.getItem("zakat-result");

    if (savedResult) {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);

      setPayment((prev) => ({
        ...prev,
        amount: parsedResult.zakatAmount || 0,
      }));
    }
  }, []);

  const handleLoginSuccess = (role = "user") => {
    setIsLoggedIn(true);
    setUserRole(role);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleRegisterSuccess = () => {
    navigate("/login");
  };

  const handlePaymentSuccess = async (paymentData = {}) => {
    const transactionId =
      paymentData.transactionId ||
      paymentData.paymentId ||
      payment.paymentId ||
      `PAY-${Date.now().toString().slice(-10)}`;

    const amountValue = Number(
      paymentData.amount ||
        paymentData.zakatAmount ||
        payment.amount ||
        0
    );

    const paymentMethod =
      paymentData.paymentMethod ||
      paymentData.gateway ||
      payment.gateway ||
      "FPX Online Banking";

    const bankName =
      paymentData.bankName ||
      payment?.bankName ||
      paymentMethod ||
      "FPX Online Banking";

    const zakatType =
      result?.method || paymentData.zakatType || payment.zakatType || "Business Zakat";

    const user = auth.currentUser;
    const record = {
      userId: user?.uid || null,
      email: user?.email || "",
      paymentId: transactionId,
      transactionId,
      amount: amountValue,
      paymentMethod,
      gateway: paymentMethod,
      bankName,
      status: paymentData.status || "Success",
      zakatType,
      paymentDate: serverTimestamp(),
      createdAt: serverTimestamp(),
      receiptUrl: paymentData.receiptUrl || null,
    };

    try {
      if (user) {
        await addDoc(collection(db, "payments"), record);
      } else {
        console.warn("Payment completed without authenticated user. Record not saved.");
      }
    } catch (saveError) {
      console.error("Error saving payment record:", saveError);
    }

    setPayment((prev) => ({
      ...prev,
      ...paymentData,
      paymentId: transactionId,
      transactionId,
      amount: amountValue,
      status: paymentData.status || "Success",
      gateway: paymentMethod,
      paymentMethod,
    }));

    setTransfer((prev) => ({
      ...prev,
      status: paymentData.status || "Success",
      amount: amountValue,
      bankName,
      transferId: transactionId,
      zakatType,
    }));

    navigate("/transfer");
  };

  const handleCalculatorComplete = (calculatorResult) => {
    const newResult = {
      zakatAmount: Number(calculatorResult.zakat) || 0,
      nisabStatus:
        calculatorResult.total >= calculatorResult.nisab
          ? "Eligible"
          : "Not Eligible",
      method:
        calculatorResult.businessMethod === "UntungRugi"
          ? "Profit & Loss"
          : "Working Capital",
    };

    setResult(newResult);

    setPayment((prev) => ({
      ...prev,
      amount: Number(calculatorResult.zakat) || 0,
    }));

    localStorage.setItem("zakat-result", JSON.stringify(newResult));
    navigate("/payment");
  };

  return (
    <LanguageProvider>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />

        <Route
          path="/register"
          element={<Register onRegisterSuccess={handleRegisterSuccess} />}
        />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              userRole === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/home"
          element={
            isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/calculator"
          element={
            isLoggedIn ? (
              <ZakatCalculator onComplete={handleCalculatorComplete} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/calculate-zakat"
          element={
            isLoggedIn ? (
              <ZakatCalculator onComplete={handleCalculatorComplete} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/nisab"
          element={
            isLoggedIn ? <NisabPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/nisab-rate"
          element={
            isLoggedIn ? <NisabPage /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/business-setup"
          element={
            isLoggedIn ? <BusinessSetup /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/payment"
          element={
            isLoggedIn ? (
              <PaymentPage
                payment={payment}
                onPay={handlePaymentSuccess}
                onBack={() => navigate("/dashboard")}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/check-zakat"
          element={
            isLoggedIn ? (
              <CheckZakatHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/payment-history"
          element={
            isLoggedIn ? (
              <CheckZakatHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pay-zakat"
          element={
            isLoggedIn ? (
              <PaymentPage
                payment={payment}
                onPay={handlePaymentSuccess}
                onBack={() => navigate("/dashboard")}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/transfer"
          element={
            isLoggedIn ? (
              <TransferPage transfer={transfer} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/result"
          element={
            isLoggedIn ? (
              <ResultPage
                result={result}
                onSave={() => {
                  localStorage.setItem(
                    "zakat-result",
                    JSON.stringify(result)
                  );
                  alert("Calculation saved successfully!");
                }}
                onReset={() => {
                  localStorage.removeItem("zakat-result");
                  setResult(defaultResult);
                  setPayment({
                    paymentId: "PAY-2026-001",
                    amount: 0,
                    gateway: "FPX / Online Banking",
                    status: "Pending",
                  });
                  setTransfer({
                    transferId: "TRF-2026-001",
                    bankName: "Maybank",
                    zakatOrganization: "Kelantan Zakat Organization",
                    status: "Pending",
                  });
                  alert("Calculation reset.");
                }}
                onProceedToPayment={() => {
                  if (!result || Number(result.zakatAmount) <= 0) {
                    alert("Please calculate zakat first.");
                    return;
                  }
                  navigate("/payment");
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn && userRole === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/admin/nisab"
          element={
            isLoggedIn && userRole === "admin" ? (
              <UpdateNisabRate />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/update-nisab"
          element={
            isLoggedIn && userRole === "admin" ? (
              <UpdateNisabRate />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}