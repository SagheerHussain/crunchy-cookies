import React from "react";
import { Link } from "react-router-dom";

const Button = ({
    children,
    className,
    label,
    href,
}) => {
  return (
    <>
    {
      href ? (
        <Link to={href}>
          <button className="mt-3 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {label}
          </button>
        </Link>
      ) : (
        <button className="mt-3 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {label}
        </button>
      )
    }
    </>
  );
};

export default Button;
