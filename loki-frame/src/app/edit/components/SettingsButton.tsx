"use client";
import { useRef, useState } from "react";
import { MdClose, MdSettings } from "react-icons/md";
import { settingsAction } from "./settingsAction";
import { Config } from "@/drizzle/schema";

type Props = { initConfig: Config };
export const SettingsButton = ({ initConfig }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [timePerPic, setTimePerPic] = useState(initConfig.timePerPic);
  const [showClock, setShowClock] = useState(initConfig.showClock);
  const submitForm = () => {
    if (!formRef.current) return;
    settingsAction(new FormData(formRef.current));
  };

  return (
    <>
      <button
        onClick={() => modalRef.current?.showModal()}
        className="btn btn-ghost btn-square text-3xl"
      >
        <MdSettings />
      </button>
      <dialog
        ref={modalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box relative">
          <h3 className="font-bold text-xl pb-4">Settings</h3>
          <form
            ref={formRef}
            method="dialog"
          >
            <button className="btn btn-sm border-box btn-ghost absolute right-6 top-6">
              <MdClose />
            </button>
            <div className="form-control gap-4">
              <label className="cursor-pointer label">
                <span className="label-text">Show clock</span>
                <input
                  type="checkbox"
                  name="showClock"
                  defaultChecked={showClock}
                  onChange={({ target }) => setShowClock(Boolean(target.value))}
                  className="toggle toggle-primary"
                />
              </label>

              <label className="label">
                <span className="label-text">Time per picture</span>
                <input
                  type="range"
                  min="8000"
                  max="20000"
                  name="timePerPic"
                  value={timePerPic}
                  onChange={({ target }) => setTimePerPic(Number(target.value))}
                  step="1000"
                  className="range range-primary range-lg"
                />
              </label>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={submitForm}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
