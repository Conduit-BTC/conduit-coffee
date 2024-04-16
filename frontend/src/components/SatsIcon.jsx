import { useEffect, useState } from "react";

export default function SatsIcon({
  color,
  width = "w-[14px]",
  height = "w-[14px]",
}) {
  return (
    <div className={`inline-block ${width} ${height}`}>
      {/* <div className={`inline-block w-[10px] h-[10px]`}> */}
      <img
        src={
          color == "orange"
            ? `icons/Satoshi-symbol-orange.png`
            : `icons/Satoshi-symbol-black.png`
        }
        alt="Satoshis currency icon"
        className="object-cover top-0 left-0 w-full h-full"
      ></img>
    </div>
  );
}
