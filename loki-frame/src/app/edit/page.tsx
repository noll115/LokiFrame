import { getImagesNames } from "@/utils/ImageUtil";
import { AddPhotoButton } from "./components/AddPhotoButton";
import ImageGrid from "./components/ImageGrid";
import { headers } from "next/headers";
import { FC } from "react";
import { Header } from "../components/Header";

export default async function EditPage() {
  const images = await getImagesNames();
  const userAgent = headers().get("user-agent") || "";
  const isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(userAgent);
  return (
    <div
      id="edit"
      className="flex flex-col size-full items-center transition duration-500 ease-in-out max-h-full"
    >
      <Header
        icon={<CatIcon className="h-14" />}
        title="Loki-Frame"
        titleClassName="font-bold"
        rightIcon={<AddPhotoButton />}
      />
      <ImageGrid serverImages={images} isMobile={isMobile} />
    </div>
  );
}

//?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
const CatIcon: FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M104.613 165C62.4895 136.517 97.2059 92.081 125 137.46"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M259 133.798C279.706 100.527 328.781 104.891 298.253 150"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M161.153 159C160.362 154.1 162.845 149.364 164 145"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M194 165C194.409 156.616 194.948 148.211 196 140"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M228 159C228 154.661 228 150.329 228 146"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M153 223C160.473 220.915 168.386 220.023 176 219"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M225 219C232.895 217.426 240.281 217.931 248 219"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M188 256.005C221.5 238.742 217.338 264.602 191.479 260.565"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M201 267C199.054 288.306 181.973 290.175 167 283.734"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M200.041 267C198.864 295.299 223.581 291.006 237 277.407"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M111 243C96.3264 238.228 80.8117 237.965 66 236"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M116 267C99.8675 270.808 83.7433 273.752 68 279"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M293 233C304.501 229.96 315.688 225.62 327 222"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M297 261C308.857 259.497 322.138 260.027 333 260.429"
      stroke="#000000"
      strokeOpacity="0.9"
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
