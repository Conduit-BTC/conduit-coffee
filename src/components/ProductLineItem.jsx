import pingBorder from "../lib/pingBorder";

export default function ProductLineItem({
  borderElement,
  name,
  number,
  type,
  pingColor,
  borderColor,
  accentColor,
  bagCount,
  increaseFunction,
  decreaseFunction,
}) {
  return (
    <div className="flex items-center px-4" ref={borderElement}>
      <p
        className={`border-2 rounded-sm p-1 px-3 mr-2 flex items-center justify-center font-[700] ${borderColor}`}
        style={{ fontFamily: "Fira Code" }}
      >
        {bagCount}
      </p>
      <h4 className="font-[700] px-2">
        <span className={accentColor}>{name}</span>
        <span className="text-h7">{` (${type})`}</span>
      </h4>
      <div className="flex mx-2 gap-2 items-center">
        <button
          onClick={() => {
            decreaseFunction();
          }}
          className={
            "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800" +
            (bagCount === 0 ? " opacity-50" : "")
          }
          disabled={bagCount === 0}
        >{`-`}</button>
        <button
          onClick={() => {
            pingBorder(borderElement.current, pingColor);
            increaseFunction();
          }}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800"
        >{`+`}</button>
      </div>
    </div>
  );
}
