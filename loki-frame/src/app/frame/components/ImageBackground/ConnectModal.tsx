"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import catLoad from "../cat_load.json";
interface Props {
  addr: string;
}
export const ConnectModal = ({ addr }: Props) => {
  return (
    <div className="size-full flex justify-center items-center">
      <div className="bg-primary text-primary-content modal-box flex flex-col text-3xl justify-center items-center">
        Connect to <b>{addr}</b>
        <DotLottieReact
          data={catLoad}
          loop
          autoplay
        />
      </div>
    </div>
  );
};
