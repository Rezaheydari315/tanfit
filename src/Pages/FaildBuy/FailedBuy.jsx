import "./Failed.css"
import React, { useState } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { Navigate, useNavigate } from 'react-router-dom';

export default function FailedBuy() {

    const navigate = useNavigate()
    function handleClose() {
        navigate("/Home")
    }


    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <IoMdCloseCircle className='modal-content_icon' />
                    <h2>خرید شما موفقیت آمیز نبود و آیتم ها به سبد خرید برگردانده شد.</h2>
                    <button className="close-modal-button" onClick={handleClose}>
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            </div>
        </>
    )
}