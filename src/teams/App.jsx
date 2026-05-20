import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ZakatCalculator from "./pages/ZakatCalculator";
import Profile from "./pages/Profile";
import NisabPage from "./pages/NisabPage";
import ResultPage from "./pages/ResultPage";
import PaymentPage from "./pages/PaymentPage";
import TransferPage from "./pages/TransferPage";
import Dashboard from "./pages/Dashboard";
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

  const [result, setResult] =
    useState(defaultResult);

  const [payment, setPayment] =
    useState({
      paymentId: "PAY-2026-001",
      amount: 0,
      gateway: "FPX / Online Banking",
      status: "Pending",
    });

  const [transfer, setTransfer] =
    useState({
      transferId: "TRF-2026-001",
      bankName: "Maybank",
      zakatOrganization:
        "Kelantan Zakat Organization",
      status: "Pending",
    });

  // ======================
  // CHECK LOGIN SESSION
  // ======================
  useEffect(() => {
    const loggedIn =
      localStorage.getItem("isLoggedIn");

    const storedRole =
      localStorage.getItem("userRole");

    if (loggedIn === "true") {
      setIsLoggedIn(true);
      setUserRole(
        storedRole === "admin"
          ? "admin"
          : "user"
      );
    }
  }, []);

  // ======================
  // LOAD SAVED RESULT
  // ======================
  useEffect(() => {
    const savedResult =
      localStorage.getItem(
        "zakat-result"
      );

    if (savedResult) {
      const parsedResult =
        JSON.parse(savedResult);

      setResult(parsedResult);

      setPayment((prev) => ({
        ...prev,
        amount:
          parsedResult.zakatAmount || 0,
      }));
    }
  }, []);

  // ======================
  // LOGIN SUCCESS
  // ======================
  const handleLoginSuccess = (
    role = "user"
  ) => {
    setIsLoggedIn(true);
    setUserRole(role);

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    localStorage.setItem(
      "userRole",
      role
    );

    // FIX LOGIN REDIRECT
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // ======================
  // REGISTER SUCCESS
  // ======================
  const handleRegisterSuccess =
    () => {
      navigate("/login");
    };

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "userEmail"
    );

    setIsLoggedIn(false);
    setUserRole("user");

    navigate("/login");
  };

  // ======================
  // SAVE RESULT
  // ======================
  const handleSave = () => {
    localStorage.setItem(
      "zakat-result",
      JSON.stringify(result)
    );

    alert(
      "Calculation saved successfully!"
    );
  };

  // ======================
  // RESET
  // ======================
  const handleReset = () => {
    localStorage.removeItem(
      "zakat-result"
    );

    setResult(defaultResult);

    setPayment({
      paymentId: "PAY-2026-001",
      amount: 0,
      gateway:
        "FPX / Online Banking",
      status: "Pending",
    });

    setTransfer({
      transferId: "TRF-2026-001",
      bankName: "Maybank",
      zakatOrganization:
        "Kelantan Zakat Organization",
      status: "Pending",
    });

    alert("Calculation reset.");
  };

  // ======================
  // PROCEED PAYMENT
  // ======================
  const handleProceedToPayment =
    () => {
      if (
        !result ||
        Number(result.zakatAmount) <=
        0
      ) {
        alert(
          "Please calculate zakat first."
        );
        return;
      }

      navigate("/payment");
    };

  // ======================
  // PAYMENT SUCCESS
  // ======================
  const handlePaymentSuccess =
    () => {
      setPayment((prev) => ({
        ...prev,
        status: "Success",
      }));

      setTransfer((prev) => ({
        ...prev,
        status: "Success",
      }));

      navigate("/transfer");
    };

  // ======================
  // CALCULATOR COMPLETE
  // ======================
  const handleCalculatorComplete =
    (calculatorResult) => {
      const newResult = {
        zakatAmount:
          Number(
            calculatorResult.zakat
          ) || 0,

        nisabStatus:
          calculatorResult.total >=
            calculatorResult.nisab
            ? "Eligible"
            : "Not Eligible",

        method:
          calculatorResult.businessMethod ===
            "UntungRugi"
            ? "Profit & Loss"
            : "Working Capital",
      };

      setResult(newResult);

      // auto update payment amount
      setPayment((prev) => ({
        ...prev,
        amount:
          Number(
            calculatorResult.zakat
          ) || 0,
      }));

      localStorage.setItem(
        "zakat-result",
        JSON.stringify(newResult)
      );

      // terus pergi payment
      navigate("/payment");
    };

  return (
    <LanguageProvider>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={
                handleLoginSuccess
              }
            />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <Register
              onRegisterSuccess={
                handleRegisterSuccess
              }
            />
          }
        />

        {/* ROOT */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              userRole === "admin" ? (
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <HomePage />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/calculator"
          element={
            isLoggedIn ? (
              <ZakatCalculator
                onComplete={
                  handleCalculatorComplete
                }
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? (
              <Profile />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/nisab"
          element={
            isLoggedIn ? (
              <NisabPage />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/payment"
          element={
            isLoggedIn ? (
              <PaymentPage
                payment={payment}
                onPay={
                  handlePaymentSuccess
                }
                onBack={() =>
                  navigate("/result")
                }
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/transfer"
          element={
            isLoggedIn ? (
              <TransferPage
                transfer={transfer}
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn &&
              userRole === "admin" ? (
              <Dashboard
                onLogout={
                  handleLogout
                }
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        <Route
          path="/admin/nisab"
          element={
            isLoggedIn &&
              userRole === "admin" ? (
              <UpdateNisabRate />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </LanguageProvider>
  );
}