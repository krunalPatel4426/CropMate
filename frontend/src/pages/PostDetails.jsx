import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import CommentBox from "../components/CommentBox";
import PostTitles from "../components/PostTitles";
import url from "../url";
import { motion } from "framer-motion";

const Spinner = () => (
  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
    <svg className="h-5 w-5 animate-spin text-emerald-600" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <span>Loading...</span>
  </div>
);

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoadingPost(true);
        const response = await axios.get(`${url}/PostId?postId=${postId}`);
        const data = response.data;
        if (response.status) setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await axios.get(`${url}/Commentfetch?postId=${postId}`);
        const data = response.data;
        if (response.status) setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmission = async (commentData) => {
    try {
      const response = await axios.post(`${url}/Comment`, commentData, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      console.log("Comment submitted:", data);
      toast.success("Replied!", {
        position: "top-right",
        autoClose: 1200,
        onClose: setTimeout(function () {
          window.location.reload(1);
        }, 1500),
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const container = useMemo(
    () => ({ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }),
    []
  );
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  if (loadingPost) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-10 text-slate-600 dark:text-slate-300">Post not found.</div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900">
            <PostTitles type="post" posts={[post]} />
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900">
            <CommentBox postId={postId} type="comment" onCommentSubmit={handleCommentSubmission} />
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900">
            {loadingComments ? <Spinner /> : <PostTitles type="comment" posts={comments} />}
          </motion.div>
        </motion.div>
        <ToastContainer />
      </div>
    </motion.div>
  );
};

export default PostDetails;
