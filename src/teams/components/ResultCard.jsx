import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HandCoins, BarChart3, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";

export default function ResultCard({ result }) {
  const { language } = useLanguage();
  const t = getTranslationSection(language, 'resultPage');
  const [displayAmount, setDisplayAmount] = useState(0);

  // Animated counter for zakat amount
  useEffect(() => {
    if (!result) return;

    const targetAmount = Number(result.zakatAmount);
    const duration = 1200; // milliseconds
    const steps = 60;
    const increment = targetAmount / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps) {
        setDisplayAmount(increment * currentStep);
        currentStep++;
      } else {
        setDisplayAmount(targetAmount);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [result]);

  // 🔥 AI LOGIC
  const getAIInsight = () => {
    if (!result) return "Enter your data to get AI insights.";

    const zakat = Number(result.zakatAmount);
    const total = Number(result.total || 0);
    const nisabStatus = result.nisabStatus;

    if (nisabStatus === "Below Nisab") {
      return "Your business has not reached nisab. Consider increasing your savings or revenue.";
    }

    if (total > 0 && zakat > 0 && total < 50000) {
      return "Your zakat is relatively low. You may optimize your financial planning.";
    }

    if (zakat > 1000) {
      return "Your financial position is strong. You are eligible for zakat payment.";
    }

    return "Your financial condition is stable.";
  };

  const getResultNote = () => {
    if (!result) return "Complete the calculator to see your summary.";
    if (result.nisabStatus === "Eligible") {
      return "Your business has reached the nisab threshold. You should proceed to payment if you wish to settle your zakat now.";
    }
    return "Your business has not reached nisab yet. Continue monitoring your balance and recalculate when your assets grow.";
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="card result-summary-card result-card-premium"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <motion.div
        className="summary-header"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h2 className="card-title result-card-title">{t.zakatSummary}</h2>
          <p className="summary-subtitle">{t.clearBreakdown}</p>
        </div>
        <motion.span
          className={`status-chip ${
            result.nisabStatus === "Eligible" ? "status-success" : "status-pending"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          {result.nisabStatus}
        </motion.span>
      </motion.div>

      <motion.div
        className="summary-grid result-grid-premium"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="summary-item result-item-premium" variants={itemVariants}>
          <div className="item-icon"><HandCoins size={32} strokeWidth={2} /></div>
          <span className="item-label">{t.zakatAmount}</span>
          <motion.span
            className="item-value amount-animated"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            RM {displayAmount.toFixed(2)}
          </motion.span>
        </motion.div>

        <motion.div className="summary-item result-item-premium" variants={itemVariants}>
          <div className="item-icon"><BarChart3 size={32} strokeWidth={2} /></div>
          <span className="item-label">{t.calculationMethod}</span>
          <span className="item-value">{result.method}</span>
        </motion.div>

        <motion.div className="summary-item result-item-premium" variants={itemVariants}>
          <div className="item-icon"><Check size={32} strokeWidth={2} /></div>
          <span className="item-label">{t.paymentStatus}</span>
          <span className="item-value">
            {result.nisabStatus === "Eligible" ? "Payable" : "Not due"}
          </span>
        </motion.div>

        <motion.div className="summary-item result-item-premium" variants={itemVariants}>
          <div className="item-icon"><ArrowRight size={32} strokeWidth={2} /></div>
          <span className="item-label">Recommended Action</span>
          <span className="item-value">
            {result.nisabStatus === "Eligible" ? "Proceed to pay" : "Recalculate later"}
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        className="insight-box result-insight-premium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ y: -2 }}
      >
        <p className="insight-title">🧠 Smart Insight</p>
        <p>{getAIInsight()}</p>
      </motion.div>

      <motion.div
        className="summary-note result-note-premium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {getResultNote()}
      </motion.div>
    </motion.div>
  );
}