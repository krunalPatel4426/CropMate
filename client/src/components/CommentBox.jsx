import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const creatorname = Cookies.get("username");
const INITIAL_HEIGHT = 46;

const CommentBox = ({ onCommentSubmit, type, heading, postId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const { t } = useTranslation();

  const outerHeight = useRef(INITIAL_HEIGHT);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, [commentValue]);

  const onExpand = () => {
    if (!isExpanded && containerRef.current) {
      outerHeight.current = containerRef.current.scrollHeight;
      setIsExpanded(true);
    }
  };

  const onChange = (e) => setCommentValue(e.target.value);

  const onClose = () => {
    setCommentValue("");
    setIsExpanded(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      postId,
      content: commentValue,
      creatorname,
      creatorId: Cookies.get("id"),
      createdAt: new Date(),
    };

    const postData = {
      creatorname,
      creatorId: Cookies.get("id"),
      heading,
      content: commentValue,
    };

    if (type === "post") {
      onCommentSubmit(postData);
      setCommentValue("");
      setIsExpanded(false);
      return;
    }

    if (type === "comment") {
      if (onCommentSubmit) onCommentSubmit(commentData);
      setCommentValue("");
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={onSubmit} ref={containerRef} className="w-full">
      <div className="rounded-2xl border border-slate-200/60 bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-slate-900/80">
        <div className="mb-2 flex items-center gap-3 px-1">
          <img
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
            className="h-8 w-8 rounded-full"
            alt="avatar"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{creatorname}</span>
        </div>

        <label htmlFor="comment" className="sr-only">
          {t("CThoughts")}
        </label>

        <textarea
          ref={textRef}
          onClick={onExpand}
          onFocus={onExpand}
          onChange={onChange}
          value={commentValue}
          name="comment"
          id="comment"
          required
          placeholder={t("CThoughts")}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-[15px] text-slate-800 shadow-inner outline-none ring-emerald-500/20 transition-all placeholder:text-slate-400 focus:-translate-y-[1px] focus:border-emerald-400/60 focus:ring-2 dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
          style={{ minHeight: INITIAL_HEIGHT }}
        />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center justify-end gap-2"
            >
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
              >
                {t("CCancel")}
              </button>
              <button
                type="submit"
                disabled={commentValue.length < 1}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition enabled:hover:scale-[1.01] enabled:hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-60"
              >
                {t("CRespond")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default CommentBox;
