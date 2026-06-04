import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import { Save, RefreshCw, CreditCard } from 'lucide-react';

export default function ActionButtons({ onSave, onReset, onProceed }) {
  const { language } = useLanguage();
  const t = getTranslationSection(language, 'resultPage');
  const [loadingStates, setLoadingStates] = useState({
    save: false,
    reset: false,
    proceed: false,
  });

  const handleButtonClick = (action, callback) => {
    const key = action;
    setLoadingStates((prev) => ({ ...prev, [key]: true }));

    // Simulate async operation
    setTimeout(() => {
      callback();
      setLoadingStates((prev) => ({ ...prev, [key]: false }));
    }, 600);
  };

  return (
    <div className="button-group action-buttons">
      <button
        className={`btn btn-gold ${loadingStates.save ? "btn-loading" : ""}`}
        onClick={() => handleButtonClick("save", onSave)}
        disabled={Object.values(loadingStates).some((state) => state)}
      >
        <Save size={18} strokeWidth={2} />
        <span className="btn-text">{t.saveResult}</span>
        {loadingStates.save && <span className="btn-spinner"></span>}
      </button>

      <button
        className={`btn btn-outline ${loadingStates.reset ? "btn-loading" : ""}`}
        onClick={() => handleButtonClick("reset", onReset)}
        disabled={Object.values(loadingStates).some((state) => state)}
      >
        <RefreshCw size={18} strokeWidth={2} />
        <span className="btn-text">{t.reset}</span>
        {loadingStates.reset && <span className="btn-spinner"></span>}
      </button>

      <button
        className={`btn btn-dark btn-gradient ${
          loadingStates.proceed ? "btn-loading" : ""
        }`}
        onClick={() => handleButtonClick("proceed", onProceed)}
        disabled={Object.values(loadingStates).some((state) => state)}
      >
        <CreditCard size={18} strokeWidth={2} />
        <span className="btn-text">{t.proceedToPayment}</span>
        {loadingStates.proceed && <span className="btn-spinner"></span>}
      </button>
    </div>
  );
}
