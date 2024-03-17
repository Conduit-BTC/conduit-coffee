import { useUiContext } from "../context/UiContext";

export default function ModalWindowLayout({ children }) {
  const { isModalOpen, closeModal } = useUiContext();

  return (
    <section
      className={`${
        isModalOpen ? "absolute" : "hidden"
      } top-0 left-0 w-full h-full p-4 bg-black/75 z-[9999]`}
    >
      <div className="w-full min-h-[97.5vh] border-2 border-[var(--main-text-color)] bg-[var(--main-bg-color)] p-4">
        <button
          onClick={closeModal}
          className="absolute top-8 right-8 p-2 w-12 h-12 centered text-4xl bg-[var(--main-text-color)] text-[var(--main-bg-color)]"
        >
          {`×`}
        </button>
        {children}
      </div>
    </section>
  );
}
