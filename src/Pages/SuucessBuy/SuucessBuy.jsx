import React, { useState } from 'react';
import './SuucessBuy.css'; // فایل استایل برای مودال
import { AiOutlineCheck } from "react-icons/ai";
import {Navigate, useNavigate} from 'react-router-dom';


 export default function SuucessBuy ()  {

    const navigate=useNavigate()
    
    function handleClose() {
        navigate("/Home")
    }

    return (
        <div>
            <div className="modal-overlay1">
                <div className="modal-content1">
                    <AiOutlineCheck className='modal-content_icon1' />
                    <h2>خرید با موفقیت انجام شد</h2>
                    <button className="close-modal-button1" onClick={handleClose}>
                        بازگشت به صفحه اصلی
                    </button>
                </div>
            </div>
        </div>
    );
};
