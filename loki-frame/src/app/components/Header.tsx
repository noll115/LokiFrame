import { FC } from "react";

interface Props {
  icon: React.ReactNode,
  title: string,
  titleClassName?: string,
  rightIcon?: React.ReactNode
}
export const Header: FC<Props> = ({ icon, title, titleClassName, rightIcon }) => {
  return <div className="w-full relative flex justify-between items-center mb-5 text-4xl min-h-14">
    <span className="flex gap-1 items-center">
      {icon}
      <h1 className={titleClassName}>{title}</h1>
    </span>
    {rightIcon}
  </div>
}