import React from "react";

const Button = ({
    children,
    className,
    label,
}) => {
  return (
    <>
      <button className="mt-3 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
        {label}
      </button>
    </>
  );
};

export default Button;
