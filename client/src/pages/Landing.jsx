import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import axios from "axios";
import { useCookies } from "react-cookie";
import url from "../url";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies();
  const [username, setUsername] = useState("");
  const [iid, setIid] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        // optionally navigate("/login");
      }
      const tok = cookies.token;
      const { data } = await axios.post(`${url}`, { tok }, { withCredentials: true });
      const { status, user, id, language } = data;
      setUsername(user);
      setIid(id);
      window.config.id = id;
      window.config.name = user;
      Cookies.set("id", id);
      Cookies.set("language", language);
      Cookies.set("languageName", language);
      Cookies.set("username", user);
      if (!status) {
        removeCookie("token");
        if (window.config.resetId) window.config.resetId();
        if (window.config.resetName) window.config.resetName();
        Cookies.remove("id");
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const Start = () => {
    navigate("/update");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col-reverse items-center gap-10 px-4 py-10 sm:px-6 md:flex-row md:py-16 lg:px-8">
        <motion.div initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }} className="relative w-full md:w-1/2">
          <div className="rounded-3xl bg-[url('/blob.png')] bg-cover bg-center p-8 sm:p-12 md:p-14">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm sm:text-5xl md:text-6xl dark:text-white">
              {t("Title")}
            </h1>
            <h2 className="mt-3 text-xl font-semibold text-emerald-700 sm:text-2xl dark:text-emerald-400">
              {t("LSlogan")}
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
              {t("LDesc")}
            </p>
            <button
              onClick={Start}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.03] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 active:scale-[0.98]"
            >
              {t("LButton")}
            </button>
          </div>
        </motion.div>
        <motion.div initial={{ x: 16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }} className="relative w-full md:w-1/2">
          <img src="slider-dec.gif" alt="Crop" className="mx-auto w-[420px] max-w-full drop-shadow-xl sm:w-[520px]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Landing;
