import React, { useState } from 'react';
import './Modal.css'; // فایل استایل برای مودال

function ConfirmationModal ({onClose,onConfirm}) {
 

  return (
    <div className="modal-overlay2">
      <div className="modal-content2">
        <h2>آیا از حذف مطمئن هستید؟</h2>
        <div className="modal-actions2">
          <button onClick={onConfirm} className="confirm-button2">
            بله
          </button>
          <button onClick={onClose} className="cancel-button2">
            خیر
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;