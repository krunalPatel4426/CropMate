import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import PostTitles from "../components/PostTitles";
import CreatePost from "../components/CreatePost";
import url from "../url";
import { motion } from "framer-motion";

const SkeletonList = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
      </div>
    ))}
  </div>
);

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/Postfetch`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const container = useMemo(
    () => ({ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }),
    []
  );
  const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50 via-sky-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900">
            <CreatePost onRefresh={onRefresh} />
          </motion.div>

          <motion.div variants={item} className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900">
            {loading ? <SkeletonList /> : <PostTitles type="posts" posts={posts} />}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Post;
