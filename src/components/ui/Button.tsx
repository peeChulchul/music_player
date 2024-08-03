import React from "react";

interface IbuttonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
}

function Button({ children, onClick, type = "submit" }: IbuttonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={
        "text-white bg-blue-700 hover:bg-red-500 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"
      }
    >
      <p className={"text-center text-sm text-white"}>{children}</p>
    </button>
  );
}

export default Button;
