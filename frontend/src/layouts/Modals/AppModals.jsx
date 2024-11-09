// AppModals.jsx
import ModalWindowLayout from "./ModalWindowLayout";
import CheckoutLayout from "./CheckoutLayout";
import ProductDetailsLayout from "./ProductDetailsLayout";
import RelayPoolEditorLayout from "./RelayPoolEditorLayout";
import { useUiContext } from "../../context/UiContext";

export default function AppModals() {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    isProductDetailsModalOpen,
    closeProductDetailsModal,
    isRelayEditorOpen,
    closeRelayEditor,
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
      {isRelayEditorOpen && (
        <ModalWindowLayout onCloseModal={closeRelayEditor}>
          <RelayPoolEditorLayout />
        </ModalWindowLayout>
      )}
    </>
  );
}
