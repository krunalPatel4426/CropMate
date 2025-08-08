import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import url from "../url";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  const userId = Cookies.get("id");
  const { t } = useTranslation();

  const languages = [
    { code: "deff", name: "Default", full: "Default" },
    { code: "en", name: "English", full: "English" },
    { code: "hi", name: "हिंदी (Hindi)", full: "Hindi" },
    { code: "ml", name: "മലയാളം (Malayalam)", full: "Malayalam" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", full: "Gujarati" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", full: "Punjabi" },
    { code: "bn", name: "বাংলা (Bengali)", full: "Bengali" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", full: "Kannada" },
    { code: "mr", name: "मराठी (Marathi)", full: "Marathi" },
    { code: "or", name: "ଓଡିଆ (Oriya)", full: "Oriya" },
    { code: "ta", name: "தமிழ் (Tamil)", full: "Tamil" },
    { code: "te", name: "తెలుగు (Telugu)", full: "Telugu" },
    { code: "ur", name: "اردو (Urdu)", full: "Urdu" },
  ];

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    const selectedLang = languages.find((lang) => lang.code === newLanguage)?.full || "English";
    if (window.confirm(`${t("AlterS")}${selectedLang}?`)) {
      try {
        const response = await axios.post(`${url}/updateLanguage`, { userId, language: newLanguage });
        if (response.data.success) {
          setSelectedLanguage(newLanguage);
          Cookies.set("language", newLanguage);
          Cookies.set("languageName", selectedLang);
          window.location.reload();
        } else {
          alert("Failed to update language. Please try again.");
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      <h6 className="mb-4 flex items-center justify-center gap-2 text-center text-lg font-semibold text-slate-800 dark:text-white">
        {t("Langelect")}
        <Languages className="h-5 w-5 text-emerald-500" />
      </h6>

      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none ring-emerald-500/20 transition focus:border-emerald-400/60 focus:ring-2 dark:border-white/10 dark:bg-slate-900 dark:text-white"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
