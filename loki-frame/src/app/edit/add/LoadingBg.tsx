import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import catLoad from "../../components/cat_load.json";
import { motion } from "framer-motion";
import { FC, forwardRef } from "react";

const LoadingBg = forwardRef<HTMLDivElement>(function Loading({}, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=" flex flex-col size-full justify-center items-center"
    >
      <span className="relative">
        <div className="loading loading-spinner loading-lg "></div>
        <DotLottieReact
          className="absolute w-[70vh] -left-[60vw] top-[0] aspect-video transition-opacity "
          data={catLoad}
          loop
          autoplay
        />
      </span>
    </motion.div>
  );
});

export default LoadingBg;