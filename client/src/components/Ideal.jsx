import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api";
import Cookies from "js-cookie";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const languageName = Cookies.get("languageName");

// Animated gradient loader (mobile-safe)
const GradientLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3 }}
      className="mt-4 w-full max-w-full overflow-hidden rounded-2xl border border-emerald-200/40 bg-gradient-to-tr from-emerald-50 via-teal-50 to-sky-50 p-4 shadow-sm dark:border-white/10 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900"
    >
      {/* Top shimmer title bar */}
      <div className="h-5 w-64 max-w-full animate-pulse rounded bg-white/60 dark:bg-white/10" />

      {/* Animated gradient progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/50 dark:bg-white/5">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-500"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </div>

      {/* Shimmering content placeholders */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-5/6 max-w-full animate-pulse rounded bg-white/60 dark:bg-white/10" />
        <div className="h-4 w-2/3 max-w-full animate-pulse rounded bg-white/60 dark:bg-white/10" />
        <div className="h-4 w-3/5 max-w-full animate-pulse rounded bg-white/60 dark:bg-white/10" />
      </div>

      {/* Animated caption with pulsing dots */}
      <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
        <svg className="h-4 w-4 animate-spin text-emerald-600" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="truncate sm:whitespace-normal">Analyzing soil vs ideal ranges</span>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
        >
          …
        </motion.span>
      </div>
    </motion.div>
  );
};

const GlowBanner = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="mt-3 w-full max-w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 p-3 text-sm text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300"
    >
      <div className="flex items-center gap-2">
        <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 011 1v1.055a7.002 7.002 0 015.945 5.945H20a1 1 0 110 2h-1.055a7.002 7.002 0 01-5.945 5.945V20a1 1 0 11-2 0v-1.055A7.002 7.002 0 015.055 12H4a1 1 0 110-2h1.055A7.002 7.002 0 0111 4.055V3a1 1 0 011-1z" />
        </svg>
        <span className="break-words text-ellipsis">{text}</span>
      </div>
    </motion.div>
  );
};

const Ideal = ({ cropName, soilConditions }) => {
  const [adjustmentSuggestion, setAdjustmentSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const { t } = useTranslation();

  const getSoilAdjustmentSuggestion = async () => {
    const instruction =
      languageName === "Default" || languageName === "English"
        ? ""
        : ` Give instructions in strict ${languageName} Language with no other words than the ${languageName} words.`;
    const url = "https://chatgpt-42.p.rapidapi.com/chatgpt";
    const headers = {
      "Content-Type": "application/json",
      "x-rapidapi-key": api,
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
    };

    const conditionsText = `Nitrogen: ${soilConditions[0]}, Phosphorus: ${soilConditions[1]}, Potassium: ${soilConditions[2]}, Temperature: ${soilConditions[3]}°C, Humidity: ${soilConditions[4]}%, pH: ${soilConditions[5]}, Rainfall: ${soilConditions[6]} mm`;

    const payload = {
      messages: [
        {
          role: "user",
          content: `Given the following soil conditions for ${cropName}: ${conditionsText}.
          Please compare these values to the ideal conditions for growing ${cropName} and suggest adjustments the farmer should make to optimize the soil based on their soil condition data and environment for this crop.${instruction}`,
        },
      ],
      web_access: false,
    };

    try {
      const response = await axios.post(url, payload, { headers });
      setAdjustmentSuggestion(response.data.result);
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to fetch soil adjustment suggestion.");
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestion = (suggestion) => {
    const parts = suggestion.split(/\n/).map((line, index) => {
      const lineParts = line.split(/(\*\*.*?\*\*|\*.*?\*)/).filter(Boolean);
      return (
        <p key={index} className="leading-relaxed break-words hyphens-auto">
          {lineParts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={idx}>{part.slice(2, -2)}</strong>;
            } else if (part.startsWith("*") && part.endsWith("*")) {
              return <em key={idx}>{part.slice(1, -1)}</em>;
            } else {
              return part;
            }
          })}
        </p>
      );
    });
    return parts;
  };

  const handleAskSuggestion = () => {
    setLoading(true);
    setError(null);
    setButtonVisible(false);
    getSoilAdjustmentSuggestion();
  };

  useEffect(() => {
    setAdjustmentSuggestion("");
    setButtonVisible(true);
    setError(null);
  }, [cropName, soilConditions]);

  return (
    <div className="grow_container w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:p-6 dark:border-white/10 dark:bg-slate-900">
      <h3 className="mb-3 break-words text-xl font-semibold text-slate-900 dark:text-white">
        {t("Ideal")}
        {t(cropName)}
      </h3>

      <AnimatePresence>
        {buttonVisible && (
          <motion.button
            onClick={handleAskSuggestion}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none transition-all hover:-translate-y-[1px] hover:shadow-md focus:ring-2 focus:ring-sky-500/40 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
          >
            <span className="truncate">{t("Ask")}</span>
            <img src="ai.svg" alt="AI icon" className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{t("Sugg")}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Animated loading state */}
      <AnimatePresence>{loading && <GradientLoader />}</AnimatePresence>

      {/* Informational glow banner */}
      {loading && <GlowBanner text="Synthesizing soil optimization tips…" />}

      {/* Error state */}
      <AnimatePresence>
        {error && !loading && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3 break-words text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {adjustmentSuggestion && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="prose prose-slate mt-4 max-w-none break-words hyphens-auto dark:prose-invert"
          >
            {formatSuggestion(adjustmentSuggestion)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Ideal;
