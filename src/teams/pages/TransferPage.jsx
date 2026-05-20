import React from "react";
import { motion } from "framer-motion";
import TransferStatusCard from "../../../src/teams/components/TransferStatusCard";

export default function TransferPage({
  transfer,
  onBack,
}) {

  // GET USER DATA

  const savedFullName =
    localStorage.getItem(
      "registeredFullName"
    );

  const zakatAmount =
    localStorage.getItem(
      "zakatAmount"
    );

  const selectedBank =
    localStorage.getItem(
      "selectedBank"
    );

  // MERGE TRANSFER DATA

  const transferData = {
    ...transfer,

    fullName:
      transfer?.fullName ||
      savedFullName,

    amount:
      transfer?.amount ||
      zakatAmount,

    bankName:
      transfer?.bankName ||
      selectedBank,
  };

  return (
    <motion.div
      className="transfer-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* PAYMENT STEP */}

      <div className="zakat-stepper">
        <div className="zakat-step done">
          <div className="zakat-step-circle">
            ✓
          </div>
          <span>Calculator</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step done">
          <div className="zakat-step-circle">
            ✓
          </div>
          <span>Result</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step done">
          <div className="zakat-step-circle">
            ✓
          </div>
          <span>Payment</span>
        </div>

        <div className="zakat-step-line"></div>

        <div className="zakat-step active">
          <div className="zakat-step-circle">
            4
          </div>
          <span>Receipt</span>
        </div>
      </div>

      {/* RECEIPT */}

      <TransferStatusCard
        transfer={transferData}
        onBack={onBack}
      />
    </motion.div>
  );
}