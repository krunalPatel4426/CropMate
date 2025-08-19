import React from "react";
import { motion } from "framer-motion";

const RestCropCards = ({ crops }) => {
  const list = crops.slice(1, 5); // show 4 cards (2..5)
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {list.map((c) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-slate-900"
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={c.image}
              alt={c.name}
              className="h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{c.name}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{c.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RestCropCards;
