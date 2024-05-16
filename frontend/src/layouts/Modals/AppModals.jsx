import ModalWindowLayout from "./ModalWindowLayout";
import CheckoutLayout from "./CheckoutLayout";
import ProductDetailsLayout from "./ProductDetailsLayout";
import { useUiContext } from "../../context/UiContext";

export default function AppModals() {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    isProductDetailsModalOpen,
    closeProductDetailsModal,
  } = useUiContext();

  return (
    <>
      {isCheckoutModalOpen && (
        <ModalWindowLayout onCloseModal={closeCheckoutModal}>
          <CheckoutLayout />
        </ModalWindowLayout>
      )}
      {isProductDetailsModalOpen && (
        <ModalWindowLayout onCloseModal={closeProductDetailsModal}>
          <ProductDetailsLayout />
        </ModalWindowLayout>
      )}
    </>
  );
}
