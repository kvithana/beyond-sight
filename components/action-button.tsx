import { differenceInMilliseconds } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";

export function ActionButton() {
  const [draggedAt, setDraggedAt] = useState<Date | null>(null);

  return (
    <div className="fixed bottom-32 left-0 right-0 mb-4 w-screen flex items-center justify-center h-64 z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-72 w-72 rounded-full border-2 border-opacity-20 border-white flex items-center justify-center"
      >
        <motion.button
          drag
          dragDirectionLock
          onDirectionLock={(direction) => {
            setDraggedAt(new Date());
            console.log("direction", direction);
          }}
          className="h-64 w-64 rounded-full border-2 border-white"
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 700, bounceDamping: 30 }}
          dragConstraints={{ bottom: 2, top: 2, left: 2, right: 2 }}
          whileTap={{ scale: 0.9 }}
          onTap={() => {
            if (
              draggedAt &&
              differenceInMilliseconds(new Date(), draggedAt) < 500
            )
              return;
            console.log("tapped");
          }}
        />
      </motion.div>
    </div>
  );
}
