import { useEffect } from "react";

export default function ModalWindowLayout({ onCloseModal, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseModal();
        window.scrollTo(0, 0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCloseModal]);
  return (
    <section className="absolute top-0 left-0 w-full h-full p-4 bg-black/75 z-[9999]">
      <div className="w-full border-2 border-[var(--main-text-color)] bg-[var(--main-bg-color)] p-4">
        <button
          onClick={onCloseModal}
          className="absolute top-8 right-8 p-2 w-12 h-12 centered text-4xl bg-[var(--main-text-color)] text-[var(--main-bg-color)]"
        >
          {`×`}
        </button>
        {children}
      </div>
    </section>
  );
}