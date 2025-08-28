import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipPortalProps {
  visible: boolean;
  x: number;
  y: number;
  text: string;
}

const TooltipPortal: React.FC<TooltipPortalProps> = ({ visible, x, y, text }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById("tooltip-portal");
    if (!el) {
      el = document.createElement("div");
      el.id = "tooltip-portal";
      document.body.appendChild(el);
    }
    setContainer(el);
  }, []);

  if (!container) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            left: x,
            top: y,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>,
    container
  );
};

export default TooltipPortal;
