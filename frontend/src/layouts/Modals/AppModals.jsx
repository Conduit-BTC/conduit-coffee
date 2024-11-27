// AppModals.jsx
import ModalWindowLayout from "./ModalWindowLayout";
import CheckoutLayout from "./CheckoutLayout";
import ProductDetailsLayout from "./ProductDetailsLayout";
import RelayPoolEditorLayout from "./RelayPoolEditorLayout";
import NostrReceiptModalLayout from "./NostrReceiptModalLayout";
import EmailModalLayout from "./EmailModalLayout";
import { useUiContext } from "../../context/UiContext";

export default function AppModals() {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    isProductDetailsModalOpen,
    closeProductDetailsModal,
    isRelayEditorOpen,
    closeRelayEditor,
    isEmailModalOpen,
    closeEmailModal,
    isNostrModalOpen,
    closeNostrModal,
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
      {isEmailModalOpen && (
        <ModalWindowLayout onCloseModal={closeEmailModal}>
          <EmailModalLayout />
        </ModalWindowLayout>
      )}
      {isNostrModalOpen && (
        <ModalWindowLayout onCloseModal={closeNostrModal}>
          <NostrReceiptModalLayout />
        </ModalWindowLayout>
      )}
    </>
  );
}
