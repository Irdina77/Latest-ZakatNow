import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import "../Styles/Login.css";
import zakatIcon from "../assets/zakat-icon.webp";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, "login");

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [message, setMessage] =
    useState("");
  const [isLoading, setIsLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage(
        `⚠️ ${t.allFieldsRequired}`
      );
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Clean input
      const cleanEmail =
        email.trim().toLowerCase();

      const cleanPassword =
        password.trim();

      console.log(
        "Trying login:",
        cleanEmail
      );

      // Firebase login
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          cleanEmail,
          cleanPassword
        );

      console.log(
        "Login success:",
        userCredential.user
      );

      // Save login session
      localStorage.setItem(
        "userEmail",
        userCredential.user.email
      );

      // Check role
      const role =
        userCredential.user.email ===
        "admin@gmail.com"
          ? "admin"
          : "user";

      setMessage(
        `✅ ${t.loginSuccessful}`
      );

      onLoginSuccess(role);

      setTimeout(() => {
        navigate(
          role === "admin"
            ? "/admin/dashboard"
            : "/dashboard"
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Firebase sign-in error:",
        error
      );

      console.log(
        "Firebase sign-in error code:",
        error.code
      );

      switch (error.code) {
        case "auth/invalid-email":
          setMessage(
            `❌ ${t.invalidEmail}`
          );
          break;

        case "auth/user-not-found":
          setMessage(
            `❌ User not found`
          );
          break;

        case "auth/wrong-password":
          setMessage(
            `❌ Wrong password`
          );
          break;

        case "auth/invalid-credential":
          setMessage(
            `❌ Invalid email or password`
          );
          break;

        case "auth/too-many-requests":
          setMessage(
            `❌ Too many attempts. Try again later`
          );
          break;

        default:
          setMessage(
            `❌ ${t.invalidCredentials}`
          );
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-page-container">
      <div className="glass-card">
        <h1 className="title-with-icon">
          <img
            src={zakatIcon}
            alt="zakat icon"
            className="icon-small"
          />
          <span>ZakatNow</span>
        </h1>

        <p className="subtitle">
          {t.welcomeBack}
        </p>

        {message && (
          <p
            className={`message ${
              message.includes("✅")
                ? "success"
                : "error"
            }`}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleLogin}
        >
          <div className="floating-group">
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              disabled={isLoading}
              required
            />
            <label htmlFor="email">
              {t.email}
            </label>
          </div>

          <div className="floating-group">
            <input
              id="password"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              disabled={isLoading}
              required
            />
            <label htmlFor="password">
              {t.password}
            </label>
          </div>

          <button
            type="submit"
            className="btn-glass-gold"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing In..."
              : t.signIn}
          </button>
        </form>

        <div className="auth-link">
          {t.dontHaveAccount}{" "}
          <span
            onClick={() =>
              navigate(
                "/register"
              )
            }
          >
            {t.register}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;