'use client';

import React, { useState } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    if (openSection === index) {
      setOpenSection(null);
    } else {
      setOpenSection(index);
    }
  };

  const policies = [
    {
      title: "1. Data We Collect",
      content: "We collect health-related data including blood pressure, blood sugar, vitals history, AI risk scores, and doctor-patient QR sharing metadata necessary to operate the platform."
    },
    {
      title: "2. How We Use Your Data",
      content: "Your data is used strictly for generating AI risk assessments (using our Random Forest model) and enabling authorized doctor review. It is not used for any purpose beyond the platform."
    },
    {
      title: "3. Data Storage & Security",
      content: "Your data is stored securely using Supabase PostgreSQL with Row Level Security. We employ JWT authentication with token blacklisting. No data is sold or shared with third parties."
    },
    {
      title: "4. AI Model Limitations",
      content: "AI risk scores are decision-support tools only and do not constitute a clinical diagnosis. The model has a false negative rate of ~10.8%. Doctor review is strictly required for any flagged cases."
    },
    {
      title: "5. Your Rights",
      content: "You have the right to access, correct, or request the deletion of your personal and health data. You also maintain the right to withdraw your consent at any time."
    },
    {
      title: "6. Doctor Access",
      content: "Only RMDC-verified doctors can access the platform. Furthermore, doctor access is scoped per-patient and strictly requires explicit QR consent from the patient. There is no open database access."
    },
    {
      title: "7. Data Retention",
      content: "Data collected during the research testing phase of this project is retained for 3 months following the researcher's graduation, then securely destroyed, in line with ALU's ethics approval. For registered users, vitals and account data are retained for as long as the account remains active. Users may request deletion of their data at any time by contacting us."
    },
    {
      title: "8. Contact",
      content: "For any questions regarding your data or this policy, please contact: i.pedro@alustudent.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Learn how NephroSasa Rwanda protects your personal and medical information.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl shadow-primary/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {policies.map((policy, index) => {
              const isOpen = openSection === index;
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                      {policy.title}
                    </h3>
                    <div className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {policy.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/en" className="text-primary hover:text-primary-dark font-medium transition-colors">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
