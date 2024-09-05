import pingBorder from "../lib/pingBorder";
import { useUiContext } from "../context/UiContext";
import { useCartContext } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function ProductLineItem({
  // borderElement,
  product,
  pingColor,
  borderColor,
  accentColor,
  quantity,
  increaseFunction,
  decreaseFunction,
}) {
  const { openProductDetailsModal } = useUiContext();
  const { addItemToCart, removeItemFromCart } = useCartContext();
  const [ formattedDescription, setFormattedDescription ] = useState('');
  const { name, description } = product;

  useEffect(() => {
    const d = [...description.split('//').join('\n//')].slice(1);
    setFormattedDescription(d);
  }, [description, setFormattedDescription]);

  return (
    <section className="flex w-full group">
      <button
        aria-label={`Display product information about ${name}`}
        onClick={() => {
          openProductDetailsModal(product);
        }}
        className="flex flex-col p-4 border-2 group-hover:border-blue-500 w-full"
      >
        <h4 className={`font-[700] ${accentColor}`}>{name}</h4>
        <span className="whitespace-pre-line text-left mt-4">{formattedDescription}</span>
      </button>
      <div className="flex flex-col justify-center group-hover:bg-blue-500 p-2 gap-2 items-center bg-[var(--main-text-color)]">
      <p
          className={`border-2 rounded-sm p-1 px-3 flex items-center justify-center bg-black font-[700] ${borderColor}`}
          style={{ fontFamily: "Fira Code" }}
        >
          {quantity || 0}
        </p>
        <button
          onClick={() => {
            // pingBorder(borderElement.current, pingColor);
            addItemToCart(product);
          }}
          aria-label={`Add ${name} to cart`}
          className="p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-green-800 shadow-md shadow-black/50"
        >{`+`}</button>
          <button
            onClick={() => {
              removeItemFromCart(product);
            }}
            aria-label={`Remove ${name} from cart`}
            className={
              "p-1 w-8 h-8 lg:w-6 lg:h-6 flex items-center justify-center rounded-sm bg-red-800 shadow-md shadow-black/50" +
              (quantity === 0 ? " opacity-50" : "")
            }
            disabled={quantity === 0}
          >{`-`}</button>
      </div>
    </section>
  );
}
