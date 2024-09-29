"use client";
import { motion } from "framer-motion";

import { useContext, useEffect, useRef, useState } from "react";
import { ImagesContext } from "./ImagesContext";
let timeFormat = new Intl.DateTimeFormat("en", {
  timeStyle: "short",
});

let dateFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

let refreshTime = 15 * 1000;

const Clock = () => {
  let [timeStr, setTimeStr] = useState(timeFormat.format(Date.now()));
  let [dateStr, setDateStr] = useState(dateFormat.format(Date.now()));
  const { config, images } = useContext(ImagesContext);
  let timeOutRef = useRef<NodeJS.Timeout>();

  let updateDate = () => {
    setTimeStr(timeFormat.format(Date.now()));
    setDateStr(dateFormat.format(Date.now()));
  };

  useEffect(() => {
    if (!config.showClock) return;
    timeOutRef.current = setInterval(updateDate, refreshTime);
    return () => {
      if (timeOutRef.current) {
        clearInterval(timeOutRef.current);
      }
    };
  }, [config]);

  if (!config.showClock || images.length === 0) return null;

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=" text-white font-medium absolute top-5 left-5 p-4"
    >
      <div className="text-2xl relative drop-shadow">{dateStr}</div>
      <div className="text-6xl relative drop-shadow">{timeStr}</div>
    </motion.span>
  );
};

export { Clock };
