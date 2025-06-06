import { useCartContext } from "../../context/CartContext";
import { useUiContext } from "../../context/UiContext";

export default function CheckoutButton({ text, onHandleClick = () => {} }) {
  const { totalCartQty } = useCartContext();
  const { openCheckoutModal } = useUiContext();
  return (
    <button
      onClick={() => {
        onHandleClick();
        openCheckoutModal();
      }}
      className={`p-4 text-[var(--main-text-color)] hover:font-bold w-full h-full bg-orange-600 hover:bg-orange-700 neon-blue-border ${
        totalCartQty == 0 ? " opacity-50" : "opacity-100"
      }`}
      disabled={totalCartQty == 0}
    >
      {text || ""}
    </button>
  );
}
