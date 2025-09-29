import React from "react";
import { Link } from "react-router-dom";

function CTAButton({ children, active, linkTo }) {
  return (
    <Link to={linkTo}>
      <div
        className={`text-center text-[16px] px-6 py-3 rounded-md font-bold
        ${active ? "bg-[#FFD700] text-black " : "bg-[#161D29] text-white"}
        hover:scale-95 transition-all duration-200
        `}
      >
        {children}
      </div>
    </Link>
  );
}

export default CTAButton;
