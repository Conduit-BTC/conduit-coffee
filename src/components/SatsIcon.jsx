import tippy from "tippy.js";

export default function SatsIcon({ size, color }) {
  let width = "w-[11px]";
  let height = "h-[11px]";
  if (size) {
    width = `w-[${size.toString()}px]`;
    height = `h-[${size.toString()}px]`;
  }

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
