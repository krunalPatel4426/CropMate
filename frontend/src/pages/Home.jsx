import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import NewCropCard from "../components/NewCropCard";
import TopCropCard from "../components/TopCropCard";
import RestCropCards from "../components/RestCropCards";
import "../util/config";
import getCropDetails from "../util/CropDetails";
import { useTranslation } from "react-i18next";
import url from "../url";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
    <div className="h-40 w-full animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
    <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies();
  const [username, setUsername] = useState("");
  const [iid, setIid] = useState("");
  const { t } = useTranslation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchCrops = async () => {
      if (window.config.id) {
        setLoading(true);
        try {
          const response = await axios.post(`${url}/Cropfetch`, { id: window.config.id });
          const { Crop1, Crop2, Crop3, Crop4, Crop5 } = response.data;
          const cropNames = [Crop1, Crop2, Crop3, Crop4, Crop5];
          const cropDetailsArray = cropNames.map((name) => getCropDetails(name));
          setCrops(cropDetailsArray);
        } catch (e) {
          console.error("Error fetching crops:", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCrops();
  }, [window.config.id]);

  const container = useMemo(
    () => ({
      hidden: { opacity: 0, y: 8 },
      show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.35 } },
    }),
    []
  );
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/* Improved spacing header section */}
          <motion.section
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-6 sm:mb-8 lg:mb-10"
          >
            <div className="rounded-3xl bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-sky-500/10 p-4 sm:p-6 lg:p-8 ring-1 ring-black/5 dark:ring-white/5">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                {t("NHome")}
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Personalized crop suggestions based on your conditions.
              </p>
            </div>
          </motion.section>

          <motion.section variants={container} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            <motion.div variants={item}>
              {loading ? (
                <SkeletonCard />
              ) : crops.length > 0 ? (
                <div className="group rounded-2xl border border-slate-200/60 bg-white p-3 sm:p-4 lg:p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
                  <NewCropCard crop={crops} crops={crops} />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300/80 bg-white/60 p-5 sm:p-6 lg:p-8 text-slate-600 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                  {t("NoData") || "No crop data yet. Fill conditions to get recommendations."}
                </div>
              )}
            </motion.div>

            {/* Future grid for top/rest */}
            {/* <motion.div variants={item} className="grid gap-6 md:grid-cols-3">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  {crops.length > 0 && <TopCropCard crop={crops} />}
                  {crops.length > 1 && <RestCropCards crops={crops.slice(1)} />}
                </>
              )}
            </motion.div> */}
          </motion.section>
        </div>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default Home;
