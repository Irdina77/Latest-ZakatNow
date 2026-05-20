import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { getTranslationSection } from "../translations/translations";
import PaymentCard from "../../../src/teams/components/PaymentCard";

export default function PaymentPage({
  payment,
  onPay,
  onBack,
}) {
  const { language } = useLanguage();

  const t = getTranslationSection(
    language,
    "paymentPage"
  );

  const containerVariants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="payment-page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}

      <motion.div
        className="payment-page-header"
        variants={itemVariants}
      >
        <h1 className="payment-title">
          Pay Your Zakat
        </h1>

        <p className="payment-subtitle">
          Complete your zakat payment
          with a secure, trusted and
          premium payment experience.
        </p>
      </motion.div>

      {/* PREMIUM STEPPER */}

      <motion.div
        className="zakat-stepper"
        variants={itemVariants}
      >
        <div className="zakat-step done">
          <span className="zakat-step-circle">
            ✓
          </span>
          <span>Calculator</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step done">
          <span className="zakat-step-circle">
            ✓
          </span>
          <span>Result</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step active">
          <span className="zakat-step-circle">
            3
          </span>
          <span>Payment</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step">
          <span className="zakat-step-circle">
            4
          </span>
          <span>Receipt</span>
        </div>
      </motion.div>

      {/* CARD */}

      <motion.div
        className="payment-page-shell"
        variants={itemVariants}
      >
        <PaymentCard
          payment={payment}
          onPay={onPay}
          onBack={onBack}
        />
      </motion.div>
    </motion.div>
  );
}