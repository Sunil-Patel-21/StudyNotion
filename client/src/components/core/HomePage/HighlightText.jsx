import React from "react";

function HighlightText({ text }) {
  return <span className="bg-gradient-to-b from-cyan-400 to-cyan-300 bg-clip-text text-transparent font-bold "> {text} </span>;
}

export default HighlightText;
