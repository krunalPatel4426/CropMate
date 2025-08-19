import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import CommentBox from "../components/CommentBox";
import url from "../url";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const creatorname = Cookies.get("username");
const creatorId = Cookies.get("id");

const CreatePost = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {}, []);

  const [formData, setFormData] = useState({
    creatorname,
    creatorId,
    heading: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (postData) => {
    try {
      const datatoapi = await fetch(`${url}/Post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const detailsdata = await datatoapi.json();

      toast.success(detailsdata.message, {
        onClose: setTimeout(function () {
          window.location.reload(1);
        }, 1500),
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create post. Please try again later.");
    }
  };

  return (
    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-left">
      <div className="mb-3">
        <label htmlFor="heading" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {t("Fheading")}
        </label>
        <input
          type="text"
          id="heading"
          name="heading"
          value={formData.heading}
          placeholder={t("Fheading")}
          onChange={handleChange}
          autoComplete="off"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none ring-emerald-500/20 transition-all placeholder:text-slate-400 focus:-translate-y-[1px] focus:border-emerald-400/60 focus:ring-2 focus:shadow-md dark:border-white/10 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <CommentBox postId="postId" heading={formData.heading} type="post" onCommentSubmit={handleSubmit} />
      <Toaster />
    </motion.div>
  );
};

export default CreatePost;
