import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import catLoad from "../../components/cat_load.json";
import { motion } from "framer-motion";
import { FC, forwardRef } from "react";

const LoadingBg = forwardRef(function Loading({ ref }: any) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col size-full justify-center items-center"
    >
      <span className="relative">
        <div className="loading loading-spinner loading-lg "></div>
        <DotLottieReact
          className="absolute w-[70vh] aspect-video -left-[50vw] transition-opacity "
          data={catLoad}
          loop
          autoplay
        />
      </span>
    </motion.div>
  );
});

export default LoadingBg;
