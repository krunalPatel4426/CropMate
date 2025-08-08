import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import Translator from "../util/Translator";
import Grow from "../components/Grow";
import Ideal from "../components/Ideal";
import toast, { Toaster } from "react-hot-toast";
import url from "../url";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Sparkles } from "lucide-react";

const language = Cookies.get("language");
const id = Cookies.get("id");

// Skeleton while fetching user soil data
const Skeleton = () => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="h-6 w-40 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
      <div className="mt-3 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-slate-200/60 dark:bg-slate-700/40" />
        ))}
      </div>
    </div>
    <div className="col-span-2 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="h-64 w-full animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
      <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
    </div>
  </div>
);

// Animated gradient dot for left list
const GradientDot = ({ active }) => (
  <span
    className={[
      "h-2.5 w-2.5 rounded-full transition-all",
      active ? "scale-125 bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" : "bg-slate-300 group-hover:bg-emerald-300",
    ].join(" ")}
  />
);

// Right-side fancy button variants
const FancyButton = ({ onClick, color = "emerald", children }) => {
  const ring = color === "emerald" ? "focus:ring-emerald-500/40" : "focus:ring-sky-500/40";
  const border = color === "emerald" ? "from-emerald-400/50 to-emerald-600/50" : "from-sky-400/50 to-sky-600/50";
  const glow = color === "emerald" ? "shadow-emerald-500/30" : "shadow-sky-500/30";
  const fillFrom = color === "emerald" ? "from-emerald-50" : "from-sky-50";
  const fillTo = color === "emerald" ? "to-teal-50" : "to-emerald-50";
  const text = color === "emerald" ? "text-emerald-800 dark:text-emerald-300" : "text-slate-800 dark:text-slate-100";

  return (
    <button
      onClick={onClick}
      className={[
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm outline-none transition-all",
        "hover:-translate-y-[1px] hover:shadow-md active:translate-y-[0px]",
        "ring-1",
        ring,
        text,
        "dark:ring-white/10",
      ].join(" ")}
    >
      {/* Outer animated border shimmer */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 rounded-full",
          "bg-[conic-gradient(from_var(--angle),theme(colors.white/0)_10%,theme(colors.emerald.300/40),theme(colors.white/0)_60%)]",
          "animate-[spin_2.5s_linear_infinite]",
          "opacity-40",
        ].join(" ")}
        style={{ "--angle": "0deg" }}
      />
      {/* Soft inner gradient fill */}
      <span
        aria-hidden
        className={[
          "absolute inset-[1px] rounded-full bg-gradient-to-tr",
          fillFrom,
          fillTo,
          "dark:from-slate-800 dark:to-slate-800",
        ].join(" ")}
      />
      {/* Gloss highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/40 blur-md dark:bg-white/5"
      />
      {/* Glow on hover */}
      <span aria-hidden className={["absolute -inset-3 rounded-full opacity-0 blur-xl transition-opacity hover:opacity-40", glow].join(" ")} />
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const NewCropCard = ({ crops }) => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState(crops?.[0]?.name || "");
  const [translatedTexts, setTranslatedTexts] = useState([]);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [showGrow, setShowGrow] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);
  const [cropForGrow, setCropForGrow] = useState(null);
  const [cropForIdeal, setCropForIdeal] = useState(null);
  const [fetchedFormData, setFetchedFormData] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const textsToTranslate = useMemo(() => crops.flatMap((crop) => [crop.description]), [crops]);

  const handleTranslations = (translations) => {
    setTranslatedTexts(translations);
    setHasTranslated(true);
  };

  const handleChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  const handleGrowClick = () => {
    setCropForGrow(selectedCrop);
    setShowGrow(true);
  };

  const handleIdealClick = () => {
    setCropForIdeal(selectedCrop);
    setShowIdeal(true);
  };

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

  // Find selected crop object
  const current = crops.find((c) => c.name === selectedCrop) || crops[0];

  return (
    <div className="w-full">
      <Toaster />
      <div className="rounded-3xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
        {loadingData ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Left vertical list */}
            <div className="rounded-2xl bg-gradient-to-b from-emerald-50/60 to-sky-50/40 p-4 ring-1 ring-black/5 dark:from-white/5 dark:to-white/5 dark:ring-white/10">
              <h6 className="mb-3 pl-1 text-base font-semibold text-slate-900 dark:text-white">{t("HTop5")}</h6>
              <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                {crops.map((c, index) => {
                  const active = selectedCrop === c.name;
                  return (
                    <label
                      key={c.name}
                      htmlFor={`radio_${c.name}`}
                      className={[
                        "group relative flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm transition-all",
                        active
                          ? "border-emerald-300 bg-emerald-50/70 text-emerald-700 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-slate-200 bg-white hover:-translate-y-[1px] hover:bg-gradient-to-r hover:from-emerald-50 hover:to-sky-50 dark:border-white/10 dark:bg-slate-900 dark:hover:bg-slate-800",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/70 transition group-hover:ring-emerald-200 dark:bg-slate-800 dark:ring-white/10">
                          <img src={`${index + 1}.svg`} alt="" className="h-4 w-4 opacity-80" />
                          <span
                            className="absolute inset-0 -z-10 opacity-0 blur-sm transition-opacity group-hover:opacity-40"
                            style={{ background: "radial-gradient(circle at 30% 20%, rgba(16,185,129,0.15), transparent 60%)" }}
                          />
                        </div>
                        <GradientDot active={active} />
                        <span className="font-medium">{t(c.name)}</span>
                      </div>
                      <input
                        type="radio"
                        id={`radio_${c.name}`}
                        name="basic_carousel"
                        value={c.name}
                        checked={active}
                        hidden
                        onChange={handleChange}
                        className="h-4 w-4 accent-emerald-600"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Right detail card */}
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current?.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {/* Image */}
                    <div className="sm:col-span-1">
                      <div
                        className="mx-auto aspect-square w-full max-w-[260px] rounded-2xl bg-cover bg-center shadow-inner ring-1 ring-black/5 dark:ring-white/10"
                        style={{ backgroundImage: `url(${current?.image})` }}
                        aria-label={current?.name}
                      />
                    </div>

                    {/* Content + buttons */}
                    <div className="sm:col-span-2">
                      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {t(current?.name)}
                        </h1>

                        {/* Right-side CTA buttons with advanced styling and responsive wrap */}
                        <div className="flex flex-wrap items-center gap-2">
                          <FancyButton onClick={handleGrowClick} color="emerald">
                            <Sprout className="h-4 w-4" />
                            <span>{t("HowGrow")}? </span>
                          </FancyButton>

                          <FancyButton onClick={handleIdealClick} color="sky">
                            <Sparkles className="h-4 w-4" />
                            <span>{t("IButton")}</span>
                          </FancyButton>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {hasTranslated
                          ? translatedTexts[crops.findIndex((c) => c.name === current?.name)]
                          : current?.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Translator + AI sections */}
      {!hasTranslated && (
        <div className="mt-3">
          <Translator textsToTranslate={textsToTranslate} targetLang={language} onTranslated={handleTranslations} />
        </div>
      )}

      <div className="mt-6 space-y-4">
        <AnimatePresence>
          {showGrow && (
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>
              <Grow cropName={cropForGrow} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showIdeal && (
            <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}>
              <Ideal cropName={cropForIdeal} soilConditions={fetchedFormData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewCropCard;
