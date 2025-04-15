import "./ModalLogout.css"


export default function ModalLogout({onClose,onConfirm}) {
    return (
        <div className="modal-overlay11">
          <div className="modal-content11">
            <h2>آیا از خروج مطمئن هستید؟</h2>
            <div className="modal-actions11">
              <button onClick={onConfirm} className="confirm-button11">
                بله
              </button>
              <button onClick={onClose} className="cancel-button11">
                خیر
              </button>
            </div>
          </div>
        </div>
      );
}