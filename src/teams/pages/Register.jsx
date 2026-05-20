import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import "../Styles/Register.css";
import zakatIcon from "../assets/zakat-icon.webp";

function Register({ onRegisterSuccess, onBackToLogin }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, 'register');
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Check if all fields are filled
    if (!username.trim()) {
      setMessage(`⚠️ ${t.enterFullName}`);
      return false;
    }

    if (!email.trim()) {
      setMessage(`⚠️ ${t.enterEmail}`);
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage(`❌ ${t.validEmail}`);
      return false;
    }

    if (!password) {
      setMessage(`⚠️ ${t.enterPassword}`);
      return false;
    }

    if (password.length < 6) {
      setMessage(`❌ ${t.passwordMinLength}`);
      return false;
    }

    return true;
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail =
  email.trim().toLowerCase();

const cleanPassword =
  password.trim();

await createUserWithEmailAndPassword(
  auth,
  cleanEmail,
  cleanPassword
);

// SAVE USER DATA
localStorage.setItem(
  "registeredFullName",
  username
);

localStorage.setItem(
  "registeredEmail",
  cleanEmail
);

console.log(
  "Registered user:",
  cleanEmail
);
      
      setIsLoading(false);
      setMessage("✅ Account created successfully! Redirecting to login...");

      // Clear form fields
      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        onRegisterSuccess();
        navigate('/login');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      
      // Handle Firebase errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setMessage("⚠️ An account with this email already exists");
          break;
        case 'auth/weak-password':
          setMessage("❌ Password is too weak. Please choose a stronger password");
          break;
        case 'auth/invalid-email':
          setMessage("❌ Invalid email address");
          break;
        default:
          setMessage("❌ Registration failed. Please try again");
          break;
      }
    }
  };

  return (
    <div className="glass-page-container">
      <div className="glass-card">

        <h1 className="title-with-icon">
          <img src={zakatIcon} alt="zakat icon" className="icon-small" />
          <span>ZakatNow</span>
        </h1>

        <p className="subtitle">Join our community. Create your account</p>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleCreateAccount}>
          <div className="floating-group">
            <input 
              id="user" 
              name="fullName"
              type="text" 
              placeholder=" " 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="name"
              disabled={isLoading}
              required 
            />
            <label htmlFor="user">{t.fullName}</label>
          </div>

          <div className="floating-group">
            <input 
              id="email" 
              name="email"
              type="email" 
              placeholder=" " 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoComplete="email"
              disabled={isLoading}
              required 
            />
            <label htmlFor="email">{t.email}</label>
          </div>

          <div className="floating-group">
            <input 
              id="pass" 
              type="password" 
              placeholder=" " 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={isLoading}
              required 
            />
            <label htmlFor="pass">{t.password}</label>
          </div>

          <button 
            type="submit" 
            className="btn-glass-gold" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : t.createAccount}
          </button>
        </form>

        <div className="auth-link">
          {t.alreadyHaveAccount} <span onClick={() => navigate('/login')}>Sign in here</span>
        </div>
      </div>
    </div>
  );
}

export default Register;