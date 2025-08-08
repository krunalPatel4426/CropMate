import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import url from "../url";
import { motion } from "framer-motion";

const EditDetails = ({ type, post, onClose }) => {
  const [heading, setHeading] = useState(post ? post.heading : "");
  const [comment, setComment] = useState(post ? post.content : "");
  const textareaRef = useRef(null);

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "post" || type === "posts") {
        try {
          const response = await axios.put(`${url}/UpdatePost`, {
            postId: post._id,
            heading,
            content: comment,
          });
          if (response.data.post) {
            toast.success(response.data.message, {
              onClose: setTimeout(function () {
                window.location.reload(1);
              }, 1500),
            });
          } else {
            toast.error(response.data.message, {
              onClose: setTimeout(function () {
                window.location.reload(1);
              }, 1500),
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Update failed. Please try again.");
        }
      } else if (type === "comment") {
        try {
          const response = await axios.put(`${url}/UpdateComment`, {
            postId: post._id,
            content: comment,
          });
          if (String(response.status) === "200") {
            toast.success("Comment updated!", {
              onClose: setTimeout(function () {
                window.location.reload(1);
              }, 1500),
            });
          } else {
            toast.error("Internal server error");
            setTimeout(() => {
              onClose();
            }, 2000);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  return (
    <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(type === "post" || type === "posts") && (
          <div>
            <label htmlFor="heading" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              placeholder="Enter heading"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none ring-emerald-500/20 transition-all placeholder:text-slate-400 focus:-translate-y-[1px] focus:border-emerald-400/60 focus:ring-2 focus:shadow-md dark:border-white/10 dark:bg-slate-900 dark:text-white"
            />
          </div>
        )}

        <div>
          <label htmlFor="comment" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Comment
          </label>
          <textarea
            ref={textareaRef}
            id="comment"
            placeholder="Enter comment"
            value={comment}
            onChange={handleCommentChange}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm outline-none ring-emerald-500/20 transition-all placeholder:text-slate-400 focus:-translate-y-[1px] focus:border-emerald-400/60 focus:ring-2 focus:shadow-md dark:border-white/10 dark:bg-slate-900 dark:text-white"
            style={{ overflow: "hidden" }}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-hover color-1 mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-[0.99]"
          >
            Update
          </button>
        </div>
      </form>
      <Toaster />
    </motion.div>
  );
};

export default EditDetails;
