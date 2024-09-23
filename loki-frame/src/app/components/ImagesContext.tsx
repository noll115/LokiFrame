"use client";
import type { Config, Image } from "@prisma/client";
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
    clockOn: false,
    id: 0,
    lastUpdatedConfig: new Date(),
    lastUpdatedImages: new Date(),
  },
});

const INTERVAL_TIME = 30 * 1000;

const convertConfig = (nc: Config) => {
  nc.lastUpdatedConfig = new Date(nc.lastUpdatedConfig);
  nc.lastUpdatedImages = new Date(nc.lastUpdatedImages);
  return nc;
};
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
      let newConfig = await resp.json().then(convertConfig);
      if (newConfig.lastUpdatedConfig > config.lastUpdatedConfig) {
        setConfig(newConfig);
      }
      if (newConfig.lastUpdatedImages > config.lastUpdatedImages) {
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
