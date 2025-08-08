// File: src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import url from "../url";
import { motion } from "framer-motion";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ email: "", name: "", password: "" });
  const { email, password, name } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue((p) => ({ ...p, [name]: value }));
  };

  const handleError = (err) => toast.error(err, { position: "top-right" });
  const handleSuccess = (msg) => toast.success(msg, { position: "top-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${url}/signup`, { ...inputValue }, { withCredentials: true });
      const { success, message, token } = data;
      if (token) Cookies.set("token", token);
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/Landing"), 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError("Signup failed. Please try again.");
    }
    setInputValue({ email: "", password: "", name: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen bg-[url('/LOGIN.png')] bg-cover">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm dark:bg-slate-900/50" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full p-4 max-w-md rounded-2xl border border-white/20 bg-white/70 p-6 sm:p-7 lg:p-8 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70"
        >
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-extrabold italic text-emerald-600 drop-shadow-sm">Crop Mate</h1>
            <h2 className="mt-3 text-lg font-semibold text-slate-800 dark:text-white">Signup Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email */}
            <div className="group">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="cursor-text">
                <div
                  className={[
                    "relative rounded-xl border bg-white px-3 py-2 transition-all",
                    "border-slate-200 shadow-sm",
                    "hover:-translate-y-px hover:shadow-lg hover:shadow-emerald-200/30 hover:border-emerald-300",
                    "focus-within:-translate-y-px focus-within:shadow-lg focus-within:shadow-emerald-300/40 focus-within:border-emerald-400",
                    "dark:bg-slate-900 dark:border-white/10",
                  ].join(" ")}
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={handleOnChange}
                    className="w-full rounded-md bg-transparent text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
                  />
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full",
                      email
                        ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-[pulse_1.2s_ease-in-out_infinite]"
                        : "bg-transparent",
                      "group-focus-within:bg-gradient-to-r group-focus-within:from-emerald-500 group-focus-within:via-teal-400 group-focus-within:to-emerald-500 group-focus-within:animate-[pulse_1.2s_ease-in-out_infinite]",
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="group">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
              <div className="cursor-text">
                <div
                  className={[
                    "relative rounded-xl border bg-white px-3 py-2 transition-all",
                    "border-slate-200 shadow-sm",
                    "hover:-translate-y-px hover:shadow-lg hover:shadow-emerald-200/30 hover:border-emerald-300",
                    "focus-within:-translate-y-px focus-within:shadow-lg focus-within:shadow-emerald-300/40 focus-within:border-emerald-400",
                    "dark:bg-slate-900 dark:border-white/10",
                  ].join(" ")}
                >
                  <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Enter your Name"
                    onChange={handleOnChange}
                    className="w-full rounded-md bg-transparent text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
                  />
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full",
                      name
                        ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-[pulse_1.2s_ease-in-out_infinite]"
                        : "bg-transparent",
                      "group-focus-within:bg-gradient-to-r group-focus-within:from-emerald-500 group-focus-within:via-teal-400 group-focus-within:to-emerald-500 group-focus-within:animate-[pulse_1.2s_ease-in-out_infinite]",
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="cursor-text">
                <div
                  className={[
                    "relative rounded-xl border bg-white px-3 py-2 transition-all",
                    "border-slate-200 shadow-sm",
                    "hover:-translate-y-px hover:shadow-lg hover:shadow-emerald-200/30 hover:border-emerald-300",
                    "focus-within:-translate-y-px focus-within:shadow-lg focus-within:shadow-emerald-300/40 focus-within:border-emerald-400",
                    "dark:bg-slate-900 dark:border-white/10",
                  ].join(" ")}
                >
                  <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={handleOnChange}
                    className="w-full rounded-md bg-transparent text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white"
                  />
                  <span
                    className={[
                      "pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full",
                      password
                        ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-[pulse_1.2s_ease-in-out_infinite]"
                        : "bg-transparent",
                      "group-focus-within:bg-gradient-to-r group-focus-within:from-emerald-500 group-focus-within:via-teal-400 group-focus-within:to-emerald-500 group-focus-within:animate-[pulse_1.2s_ease-in-out_infinite]",
                    ].join(" ")}
                  />
                </div>
              </div>
            </div>

            {/* Submit (compact width with Tailwind-only hover animation) */}
            <div className="flex">
              <button
                type="submit"
                className={[
                  "relative inline-flex mt-3 items-center justify-center overflow-hidden rounded-xl",
                  "px-4 py-2.5 text-sm font-semibold text-white",
                  "bg-gradient-to-tr from-emerald-600 to-teal-500",
                  "shadow-lg shadow-emerald-500/20 transition-all",
                  "hover:scale-[1.02] hover:shadow-emerald-500/40 active:scale-[0.98]",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
                  "mx-auto sm:mx-0",
                ].join(" ")}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out hover:translate-x-full hover:opacity-100" />
                Submit
              </button>
            </div>

            <p className="text-center mt-2 text-sm text-slate-600 dark:text-slate-300">
              Already have an account?
              <Link to="/login" className="ml-1 font-medium text-emerald-600 hover:underline">
                Login
              </Link>
            </p>
          </form>

          <Toaster />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;
