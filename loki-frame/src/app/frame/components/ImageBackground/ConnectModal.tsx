"use client";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";
import catLoad from "../cat_load.json";
import { useEffect, useState } from "react";
interface Props {
  addr: string;
}
export const ConnectModal = ({ addr }: Props) => {
  const [lottieRef, setLottieRef] = useState<DotLottie | null>(null);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  useEffect(() => {
    if (lottieRef?.isReady) {
      setLottieLoaded(true);
    }
    const onLoad = () => setLottieLoaded(true);
    lottieRef?.addEventListener("load", onLoad);
    return () => {
      lottieRef?.removeEventListener("load", onLoad);
    };
  }, [lottieRef]);

  return (
    <div className="size-full flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: lottieLoaded ? 1 : 0 }}
        className="bg-primary text-primary-content modal-box flex flex-col text-3xl justify-center items-center"
      >
        Connect to <b>{addr}</b>
        <DotLottieReact
          data={catLoad}
          dotLottieRefCallback={setLottieRef}
          loop
          autoplay
        />
      </motion.div>
    </div>
  );
};
