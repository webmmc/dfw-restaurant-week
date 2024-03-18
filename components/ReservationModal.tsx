type ModalProps = {
  closeModal: () => void;
  modalSrc: string;
  iframeClassNames: string | undefined;
};
const ReservationModal = ({
  closeModal,
  modalSrc,
  iframeClassNames = "",
}: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-stretch z-[1000] overflow-auto">
      <button
        className="absolute top-0 left-0 w-full h-full bg-transparent"
        onClick={closeModal}
      >{` `}</button>
      <div className="absolute top-1/2 -translate-y-2/4 embed-holder-styles bg-white rounded-lg p-0 w-full z-10">
        <button className="embed-close-modal" onClick={closeModal}>
          X
        </button>
        <iframe
          className={`w-full h-full preloader ${iframeClassNames}`}
          src={modalSrc}
          title="Reservation Modal"
        />
      </div>
    </div>
  );
};

export default ReservationModal;
