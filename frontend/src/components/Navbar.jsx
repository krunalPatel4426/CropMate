import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { LogOut, Sprout, MessagesSquare, Home as HomeIcon, Settings2, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavItem = ({ href, icon: Icon, label, active, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className={[
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
      active
        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        : "text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5",
    ].join(" ")}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </a>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const routes = useMemo(
    () => [
      { href: "/", label: t("NHome"), icon: HomeIcon },
      { href: "/update", label: t("NUpdate"), icon: Settings2 },
      { href: "/forum", label: t("NForum"), icon: MessagesSquare },
    ],
    [t]
  );

  const Logout = () => {
    removeCookie("token");
    removeCookie("language");
    if (window.config?.resetId) window.config.resetId();
    if (window.config?.resetName) window.config.resetName();
    Cookies.remove("id");
    Cookies.remove("token");
    Cookies.remove("language");
    Cookies.remove("username");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <motion.nav
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-4 py-2 shadow-lg shadow-emerald-500/5 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-slate-900/70"
        >
          <a href="/Landing" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-sm transition-transform group-hover:scale-105">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-950 dark:text-white">
              {t("Title")}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            {routes.map((r) => (
              <NavItem
                key={r.href}
                href={r.href}
                icon={r.icon}
                label={r.label}
                active={location.pathname === r.href}
              />
            ))}
          </div>

          {/* Desktop logout */}
          <button
            onClick={Logout}
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <LogOut className="h-4 w-4" />
            {t("NLogout")}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.nav>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/80 md:hidden"
            >
              <div className="flex flex-col gap-1">
                {routes.map((r) => (
                  <NavItem
                    key={r.href}
                    href={r.href}
                    icon={r.icon}
                    label={r.label}
                    active={location.pathname === r.href}
                    onClick={() => setOpen(false)}
                  />
                ))}
                <button
                  onClick={() => {
                    setOpen(false);
                    Logout();
                  }}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" />
                  {t("NLogout")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
