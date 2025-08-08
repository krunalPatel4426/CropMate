import { useState, useEffect, useMemo, useRef } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "../url";
import LanguageSelector from "../components/LanguageSelector";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { motion, AnimatePresence } from "framer-motion";

const id = Cookies.get("id");
const lang = Cookies.get("language");

// Simple focus animation styles (no conic/rainbow)
const SimpleFocusStyles = () => (
  <style>{`
    .sf-wrapper {
      position: relative;
      border-radius: 12px;
      cursor: text;
    }
    .sf-inner {
      position: relative;
      background: #ffffff;
      border: 1px solid rgba(100,116,139,0.25);
      border-radius: 10px;
      padding: 10px 12px;
      transition: box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease;
    }
    /* Hover: subtle lift + soft shadow */
    .sf-wrapper:hover .sf-inner {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(16,185,129,0.15), 0 3px 10px rgba(56,189,248,0.12);
      border-color: rgba(16,185,129,0.45);
    }

    /* Focus ring: simple animated gradient border bar that slides left-to-right */
    .sf-focusbar {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 6px;
      height: 2px;
      border-radius: 9999px;
      overflow: hidden;
      opacity: 0;
      transition: opacity 160ms ease;
      pointer-events: none;
    }
    .sf-focusbar > span {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, #22c55e, #06b6d4, #22c55e);
      background-size: 200% 100%;
      transform: translateX(-100%);
      animation: sf-slide 1.2s ease-in-out infinite;
    }
    @keyframes sf-slide {
      0%   { transform: translateX(-100%); }
      50%  { transform: translateX(0%); }
      100% { transform: translateX(100%); }
    }
    .sf-active .sf-focusbar {
      opacity: 1;
    }

    .sf-input {
      width: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: #0f172a;
      font-size: 14px;
      line-height: 1.4;
    }
    .sf-input::placeholder { color: #94a3b8; }

    @media (prefers-color-scheme: dark) {
      .sf-inner { background: #0b1220; border-color: rgba(255,255,255,0.12); }
      .sf-input { color: #e5e7eb; }
      .sf-input::placeholder { color: #94a3b8; }
      .sf-wrapper:hover .sf-inner {
        box-shadow: 0 8px 20px rgba(16,185,129,0.10), 0 3px 10px rgba(56,189,248,0.10);
      }
    }
  `}</style>
);

// Simple focus-animated input (clean, lightweight)
const SimpleFocusInput = ({ field, value, onChange, min, max, label, activeField, setActiveField }) => {
  const isActive = activeField === field;
  const inputRef = useRef(null);
  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="space-y-2">
      <label
        htmlFor={field}
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
        onClick={focusInput}
      >
        {label}
      </label>
      <div className={`sf-wrapper ${isActive ? "sf-active" : ""}`} onClick={focusInput}>
        <div className="sf-inner">
          <input
            ref={inputRef}
            id={field}
            name={field}
            type="number"
            placeholder={`Enter ${label}`}
            className="sf-input"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            required
            onFocus={() => setActiveField(field)}
            onBlur={() => setActiveField((prev) => (prev === field ? "" : prev))}
          />
          {/* Simple animated bar appears only while focused */}
          <div className="sf-focusbar"><span /></div>
        </div>
      </div>
    </div>
  );
};

const Update = () => {
  const [reloadPage, setReloadPage] = useState(false);
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(lang);
  const { t } = useTranslation();
  const [fetchedFormData, setFetchedFormData] = useState({});
  const [formData, setFormData] = useState({
    id: id,
    Nitrogen: "",
    Phosphorus: "",
    Potassium: "",
    Temperature: "",
    Humidity: "",
    pH: "",
    Rainfall: "",
  });
  const [translating, setTranslating] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [activeField, setActiveField] = useState("");

  useEffect(() => {
    if (!id && !reloadPage) {
      setReloadPage(true);
      window.location.reload();
    }
  }, [id, reloadPage]);

  useEffect(() => {
    const handleLanguageChange = () => {
      const newLanguage = Cookies.get("language") || "en";
      if (newLanguage !== selectedLanguage) {
        setTranslating(true);
        setSelectedLanguage(newLanguage);
        i18n.changeLanguage(newLanguage).finally(() => {
          setTimeout(() => setTranslating(false), 700);
        });
      }
    };
    const interval = setInterval(() => {
      const currentLanguage = Cookies.get("language");
      if (currentLanguage !== selectedLanguage) handleLanguageChange();
    }, 300);
    return () => clearInterval(interval);
  }, [selectedLanguage]);

  const fetchFormData = async () => {
    try {
      setLoadingData(true);
      const response = await axios.post(`${url}/datafetch`, { id });
      if (response.data.status) {
        setFetchedFormData(response.data);
      } else {
        toast.error("No data found for the provided ID.");
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
      toast.error("Error fetching form data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
    if (Object.keys(fetchedFormData).length > 0) {
      setFormData({
        id: id,
        Nitrogen: fetchedFormData.Nitrogen || "",
        Phosphorus: fetchedFormData.Phosphorus || "",
        Potassium: fetchedFormData.Potassium || "",
        Temperature: fetchedFormData.Temperature || "",
        Humidity: fetchedFormData.Humidity || "",
        pH: fetchedFormData.pH || "",
        Rainfall: fetchedFormData.Rainfall || "",
      });
    }
  }, [fetchedFormData]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${url}/datatoml`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const datatoapi = await fetch(`${url}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const detailsdata = await datatoapi.json();
      toast.success(detailsdata.message, {
        onClose: setTimeout(function () {
          navigate("/");
        }, 1500),
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const fields = useMemo(
    () => [
      { id: "Nitrogen", min: 0, max: 150, label: t("Nitrogen") },
      { id: "Phosphorus", min: 0, max: 150, label: t("Phosphorus") },
      { id: "Potassium", min: 0, max: 250, label: t("Potassium") },
      { id: "Temperature", min: 0, max: 50, label: t("Temperature") },
      { id: "Humidity", min: 10, max: 100, label: t("Humidity") },
      { id: "pH", min: 2, max: 10, label: t("pH") },
      { id: "Rainfall", min: 15, max: 300, label: t("Rainfall") },
    ],
    [t]
  );

  const Spinner = () => (
    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
      <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span>Loading…</span>
    </div>
  );

  const FieldSkeleton = () => (
    <div className="space-y-2">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      <SimpleFocusStyles />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-5 md:px-6 lg:px-8">
        {/* Translating banner */}
        <AnimatePresence>
          {translating && (
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              className="mb-5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-sky-500/15 p-3 text-sm text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-300"
            >
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-emerald-600" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span>Translating to your preferred language…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Form card */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-slate-200/60 bg-white p-5 sm:p-6 md:p-7 lg:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <h3 className="mb-6 text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                {t("URecomSystem")} <span role="img" aria-label="plant">🌱</span>
              </h3>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2">
                {loadingData
                  ? Array.from({ length: fields.length }).map((_, idx) => <FieldSkeleton key={idx} />)
                  : fields.map((f) => (
                      <SimpleFocusInput
                        key={f.id}
                        field={f.id}
                        value={formData[f.id]}
                        onChange={handleChange}
                        min={f.min}
                        max={f.max}
                        label={f.label}
                        activeField={activeField}
                        setActiveField={setActiveField}
                      />
                    ))}

                <div className="sm:col-span-2 pt-1.5">
                  <button
                    className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all focus:outline-none"
                    disabled={loadingData}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <span
                      aria-hidden
                      className="absolute -inset-4 rounded-xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40 bg-emerald-500/40"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[120%] group-hover:opacity-100"
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {loadingData ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <span>Loading…</span>
                        </span>
                      ) : (
                        t("UButton")
                      )}
                    </span>
                  </button>
                </div>
              </form>

              <div className="pt-4" />
              <Toaster />
            </motion.div>
          </div>

          {/* Language selector card */}
          <aside className="md:col-span-1">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-2xl border border-slate-200/60 bg-white p-4 sm:p-5 lg:p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
            >
              <LanguageSelector selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
            </motion.div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};

export default Update;
