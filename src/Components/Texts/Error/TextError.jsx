import "./TextError.css"
import {color} from 'framer-motion';
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function TextError({title,text}) {
  const showToast = () => {
    toast.error(
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>{title}</h4>
          <p style={{ margin: '0', fontSize: '14px' }}>{text}</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: 3000, // بسته شدن خودکار بعد از ۳ ثانیه
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        style: {
          color: '#EE334C', // رنگ متن سفید
          borderRadius: '8px', // گوشه‌های گرد
          padding: '15px', // فاصله داخلی
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // سایه
        },
        progressStyle: {
          background: '#EE334C', // رنگ نوار وضعیت
          height: '4px', // ارتفاع نوار وضعیت
          top: 0, // انتقال نوار وضعیت به بالا
          bottom: 'auto', // غیرفعال کردن موقعیت پیش‌فرض پایین
        },
      }
    );
  };

  useEffect(() => {
    showToast();
  }, []);

  return (
    <>
      <ToastContainer
        toastStyle={{
          marginTop: '50px', // فاصله از بالای صفحه
        }}
        progressStyle={{
          background: '#EE334C', // رنگ نوار وضعیت
          height: '4px', // ارتفاع نوار وضعیت
          top: 0, // انتقال نوار وضعیت به بالا
          bottom: 'auto', // غیرفعال کردن موقعیت پیش‌فرض پایین
        }}
      />
    </>
  );
}