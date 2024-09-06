"use client";

import { useEffect, useRef, useState } from "react";
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
  let timeOutRef = useRef<NodeJS.Timeout>();

  let updateDate = () => {
    setTimeStr(timeFormat.format(Date.now()));
    setDateStr(dateFormat.format(Date.now()));
  };

  useEffect(() => {
    timeOutRef.current = setInterval(updateDate, refreshTime);
    return () => {
      if (timeOutRef.current) {
        clearInterval(timeOutRef.current);
      }
    };
  }, []);

  return (
    <span className="mix-blend-difference text-white absolute top-0 ">
      <div className="text-2xl">{dateStr}</div>
      <div className="text-6xl">{timeStr}</div>
    </span>
  );
};

export { Clock };
