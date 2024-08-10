import classNames from "classnames";
import React from "react";

interface IbuttonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
  color?: string;
  hover?: string;
  border?: string;
  text?: string;
}

export function Button({
  children,
  onClick,
  type = "submit",
  color,
  hover,
}: IbuttonProps) {
  const buttonClasses = classNames(
    color,
    hover,
    "rounded-lg text-sm px-5 py-2 me-2 mb-2"
  );

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      <p className={"text-center text-sm font-semibold"}>{children}</p>
    </button>
  );
}

export function OutlineButton({
  children,
  onClick,
  type = "submit",
  color,
  hover,
  border,
  text,
}: IbuttonProps) {
  const buttonClasses = classNames(
    color,
    hover,
    border,
    text,
    "rounded-lg text-sm px-5 py-2 mb-2 border hover:opacity-80 "
  );

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      <p className={"text-center text-sm font-semibold"}>{children}</p>
    </button>
  );
}
