import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import EditDetails from "../components/EditDetails";
import { Modal } from "react-bootstrap";
import { useState, useEffect, useMemo } from "react";
import url from "../url";
import { detectLanguage, translateText } from "../util/TranslatePost";
import { motion } from "framer-motion";

const targetLanguage = Cookies.get("language");
const id = Cookies.get("id");

const CardSkeleton = () => (
  <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200/60 dark:bg-slate-700/40" />
      <div className="h-4 w-32 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
    </div>
    <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
    <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-200/60 dark:bg-slate-700/40" />
  </div>
);

const PostTitles = ({ posts, type }) => {
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [translatedPosts, setTranslatedPosts] = useState([]);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    let distance = formatDistanceToNow(new Date(dateString), { addSuffix: true });
    distance = distance.replace("about ", "");
    return distance;
  };

  const sortedFormatted = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    let sorted = [];
    if (type === "posts") {
      sorted = posts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === "comment") {
      sorted = posts.slice().sort((a, b) => new Date(b.commentSeq) - new Date(a.commentSeq));
    } else {
      sorted = posts;
    }
    return sorted.map((post) => ({ ...post, formattedDate: formatDate(post.createdAt) }));
  }, [posts, type]);

  useEffect(() => {
    const translatePosts = async () => {
      if (!sortedFormatted || sortedFormatted.length === 0 || !targetLanguage || hasTranslated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const translated = await Promise.all(
        sortedFormatted.map(async (post) => {
          const retryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
          let attempts = 0;
          while (attempts < 3) {
            try {
              const detectedLanguageData = await detectLanguage([post.content]);
              const detectedLanguage = detectedLanguageData.data.detections[0][0].language;

              if (detectedLanguage !== targetLanguage) {
                if (type === "comment") {
                  const translatedContent = await translateText(
                    [post.content, post.creatorname, post.formattedDate],
                    targetLanguage,
                    detectedLanguage
                  );
                  return {
                    ...post,
                    content: translatedContent[0],
                    creatorname: translatedContent[1],
                    formattedDate: translatedContent[2],
                  };
                } else {
                  const translatedContent = await translateText(
                    [post.content, post.heading, post.creatorname, post.formattedDate],
                    targetLanguage,
                    detectedLanguage
                  );
                  return {
                    ...post,
                    content: translatedContent[0],
                    heading: translatedContent[1],
                    creatorname: translatedContent[2],
                    formattedDate: translatedContent[3],
                  };
                }
              }
              return post;
            } catch (error) {
              if (error.response && error.response.status === 429) {
                attempts++;
                await retryDelay(2000 * attempts);
              } else {
                console.error("Error in translation:", error);
                break;
              }
            }
          }
          return post;
        })
      );
      setTranslatedPosts(translated);
      setHasTranslated(true);
      setLoading(false);
    };
    translatePosts();
  }, [sortedFormatted, targetLanguage, hasTranslated, type]);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditDetails(true);
  };

  const handleClose = () => {
    setShowEditDetails(false);
  };

  const handleDelete = async (postId) => {
    try {
      if (type === "comment") {
        await axios.delete(`${url}/DeleteComment?commentId=${postId}`);
        toast.success("Comment deleted successfully!", {
          onClose: setTimeout(function () {
            window.location.reload(1);
          }, 1500),
        });
      } else {
        await axios.delete(`${url}/DeletePostAndComments?postId=${postId}`);
        toast.success("Post and associated comments deleted successfully!", {
          onClose: setTimeout(function () {
            window.location.reload(1);
          }, 1500),
        });
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  if (!posts) {
    return <CardSkeleton />;
  }

  const disabledStyle =
    type === "posts"
      ? {}
      : {
          color: "currentColor",
          cursor: "not-allowed",
          pointerEvents: "none",
          textDecoration: "none",
        };

  return (
    <div className="space-y-4">
      {(loading ? Array.from({ length: 3 }) : translatedPosts).map((post, idx) =>
        loading ? (
          <CardSkeleton key={idx} />
        ) : (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
          >
            <a
              href={`/forum/${post._id}`}
              className="block no-underline"
              style={disabledStyle}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
                  className="h-10 w-10 rounded-full"
                  alt="avatar"
                />
                <div className="flex w-full items-baseline justify-between gap-2">
                  <h6 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {post.creatorname}
                  </h6>
                  <small className="text-xs text-slate-500 dark:text-slate-400">
                    • {post.formattedDate}
                  </small>
                </div>
              </div>
              {post.heading && (
                <h5 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {post.heading}
                </h5>
              )}
              <p className="mt-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                {post.content}
              </p>
            </a>

            {post.creatorId === id && (
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            )}
          </motion.div>
        )
      )}

      <Modal show={showEditDetails} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditDetails post={selectedPost} type={type} onClose={handleClose} />
        </Modal.Body>
      </Modal>
      <Toaster />
    </div>
  );
};

export default PostTitles;
