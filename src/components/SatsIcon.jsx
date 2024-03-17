import { useEffect, useState } from "react";

export default function SatsIcon({ size, color }) {
  const [width, setWidth] = useState("w-[14px]");
  const [height, setHeight] = useState("h-[14px]");

  useEffect(() => {
    if (!size) return;
    setWidth(`w-[${size.toString()}px]`);
    setHeight(`h-[${size.toString()}px]`);
  }, [size]);

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
