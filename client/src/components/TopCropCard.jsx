import React from "react";
import { motion } from "framer-motion";

const TopCropCard = ({ crop }) => {
  if (!crop) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"
    >
      <div className="relative">
        <img
          src={crop.image}
          alt={crop.name}
          className="h-[320px] w-full object-cover sm:h-[400px]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
          <h5 className="text-2xl font-bold text-white drop-shadow">{crop.name}</h5>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {crop.description}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Based on the crop details you provided, <span className="font-semibold">{crop.name}</span> is the best crop to grow in your farm.
        </p>
      </div>
    </motion.div>
  );
};

export default TopCropCard;
