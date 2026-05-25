import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import "../Styles/BusinessSetup.css";
import zakatIcon from "../assets/zakat-icon.webp";

export default function BusinessSetup() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslationSection(language, "businessSetup");

  const states = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Selangor",
    "Terengganu",
    "Sabah",
    "Sarawak",
  ];

  const getPersistedState = () => {
    const savedState =
      localStorage.getItem("selectedState") ||
      localStorage.getItem("selectedZakatState");

    return states.includes(savedState) ? savedState : "Selangor";
  };

  const [formData, setFormData] = useState(() => ({
    businessName: "",
    businessType: localStorage.getItem("businessType") || "retail",
    registrationNumber: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: getPersistedState(),
    postalCode: "",
    annualRevenue: "",
    businessStartDate: "",
    zakatMethod: "profit-loss",
  }));

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const businessTypes = [
    { value: "retail", label: "Retail Store" },
    { value: "wholesale", label: "Wholesale" },
    { value: "service", label: "Service Business" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "trading", label: "Trading" },
    { value: "other", label: "Other" },
  ];

  const zakatMethods = [
    { value: "profit-loss", label: "Profit & Loss Method" },
    { value: "working-capital", label: "Working Capital Method" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "state") {
      localStorage.setItem("selectedState", value);
    }

    if (name === "businessType") {
      localStorage.setItem("businessType", value);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = t.businessNameRequired || "Business name is required";
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = t.ownerNameRequired || "Owner name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail || "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.phoneRequired || "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = t.addressRequired || "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = t.cityRequired || "City is required";
    }
    if (!formData.state || !states.includes(formData.state)) {
      newErrors.state = t.stateRequired || "Please select a valid state";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t.postalCodeRequired || "Postal code is required";
    }
    if (!formData.annualRevenue) {
      newErrors.annualRevenue = t.annualRevenueRequired || "Annual revenue is required";
    }
    if (!formData.businessStartDate) {
      newErrors.businessStartDate = t.businessStartDateRequired || "Business start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // =========================
    // NISAB BY STATE
    // =========================
    const nisabByState = {
      Johor: 50689.3,
      Kedah: 32871.27,
      Kelantan: 32871.27,
      Melaka: 32871.27,
      "Negeri Sembilan": 32871.27,
      Pahang: 32871.27,
      Penang: 32871.27,
      Perak: 32871.27,
      Selangor: 52172.15,
      Terengganu: 32871.27,
      Sabah: 32871.27,
      Sarawak: 32871.27,
    };

    // =========================
    // GET STATE NISAB
    // =========================
    const selectedNisab =
      nisabByState[formData.state] || 32871.27;

    // =========================
    // SAVE BUSINESS DATA
    // =========================
    localStorage.setItem(
      "businessSetup",
      JSON.stringify(formData)
    );

    // =========================
    // SAVE GLOBAL STATE
    // =========================
    localStorage.setItem(
      "selectedState",
      formData.state
    );

    localStorage.setItem(
      "businessType",
      formData.businessType
    );

    // =========================
    // SAVE GLOBAL NISAB
    // =========================
    localStorage.setItem(
      "selectedNisabValue",
      selectedNisab
    );

    // =========================
    // SUCCESS
    // =========================
    setSuccess(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);

  } catch (error) {
    console.error(
      "Error saving business setup:",
      error
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="business-setup-page">
      {/* HEADER */}
      <header className="setup-navbar">
        <div className="setup-navbar-container">
          <button
            className="setup-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>
          <h1 className="setup-title">
            <img src={zakatIcon} alt="logo" className="setup-logo" />
            Business Setup
          </h1>
          <div style={{ width: "80px" }}></div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="setup-main">
        <div className="setup-container">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-section">
              <h2 className="form-section-title">📋 Business Information</h2>

              <div className="form-group">
                <label htmlFor="businessName">Business Name *</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className={errors.businessName ? "input-error" : ""}
                />
                {errors.businessName && (
                  <span className="error-message">{errors.businessName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessType">Business Type *</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    {businessTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="registrationNumber">Registration Number</label>
                  <input
                    type="text"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g., SSM12345678"
                  />
                </div>
              </div>
            </div>

            {/* OWNER INFORMATION */}
            <div className="form-section">
              <h2 className="form-section-title">👤 Owner Information</h2>

              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Enter owner's full name"
                  className={errors.ownerName ? "input-error" : ""}
                />
                {errors.ownerName && (
                  <span className="error-message">{errors.ownerName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="owner@email.com"
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="60123456789"
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="form-section">
              <h2 className="form-section-title">📍 Business Address</h2>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  className={errors.address ? "input-error" : ""}
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={errors.city ? "input-error" : ""}
                  />
                  {errors.city && (
                    <span className="error-message">{errors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <span className="error-message">{errors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="80000"
                    className={errors.postalCode ? "input-error" : ""}
                  />
                  {errors.postalCode && (
                    <span className="error-message">{errors.postalCode}</span>
                  )}
                </div>
              </div>
            </div>

            {/* FINANCIAL INFORMATION */}
            <div className="form-section">
              <h2 className="form-section-title">💰 Financial Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="annualRevenue">Annual Revenue (RM) *</label>
                  <input
                    type="number"
                    id="annualRevenue"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    placeholder="0.00"
                    className={errors.annualRevenue ? "input-error" : ""}
                  />
                  {errors.annualRevenue && (
                    <span className="error-message">{errors.annualRevenue}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="businessStartDate">Business Start Date *</label>
                  <input
                    type="date"
                    id="businessStartDate"
                    name="businessStartDate"
                    value={formData.businessStartDate}
                    onChange={handleChange}
                    className={errors.businessStartDate ? "input-error" : ""}
                  />
                  {errors.businessStartDate && (
                    <span className="error-message">{errors.businessStartDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* ZAKAT METHOD */}
            <div className="form-section">
              <h2 className="form-section-title">📊 Zakat Calculation Method</h2>

              <div className="method-options">
                {zakatMethods.map((method) => (
                  <label key={method.value} className="method-option">
                    <input
                      type="radio"
                      name="zakatMethod"
                      value={method.value}
                      checked={formData.zakatMethod === method.value}
                      onChange={handleChange}
                    />
                    <span className="method-label">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Business Setup"}
              </button>
            </div>
          </form>

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="success-banner">
              ✅ Business setup saved successfully!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
