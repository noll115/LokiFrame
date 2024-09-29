"use client";
import { Config, Image } from "@/drizzle/schema";
import { createContext, useEffect, useRef, useState } from "react";

type ImagesContextProviderProps = {
  children: React.ReactNode;
  initImages: Image[];
  initConfig: Config;
};

type ImagesContextType = {
  images: Image[];
  config: Config;
};

export const ImagesContext = createContext<ImagesContextType>({
  images: [],
  config: {
    timePerPic: 15000,
    showClock: false,
    id: 0,
    configUpdateTime: 0,
    imagesUpdateTime: 0,
  },
});

const INTERVAL_TIME = 10 * 1000;

export const ImagesContextProvider = ({
  initImages,
  initConfig,
  children,
}: ImagesContextProviderProps) => {
  const [images, setImages] = useState(initImages);
  const [config, setConfig] = useState(initConfig);
  let timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const checkConfig = async () => {
      let resp = await fetch("/api/ping?query=config");
      let newConfig = (await resp.json()) as Config;
      if (newConfig.configUpdateTime > config.configUpdateTime) {
        setConfig(newConfig);
      }
      if (newConfig.imagesUpdateTime > config.imagesUpdateTime) {
        setConfig(newConfig);
        let resp = await fetch("/api/ping?query=images");
        let images = (await resp.json()) as Image[];
        setImages(images);
      }
    };

    timerRef.current = setInterval(checkConfig, INTERVAL_TIME);
    return () => clearTimeout(timerRef.current);
  }, [config]);

  return (
    <ImagesContext.Provider value={{ images, config }}>
      {children}
    </ImagesContext.Provider>
  );
};
