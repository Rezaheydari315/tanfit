import './TwoFactorAuthh.css'
import React, { useState } from 'react';
import OtpInput from 'react18-input-otp';
import { IoMdClose } from "react-icons/io";

const TwoFactorAuthh = ({onOtpChange ,clickbtn ,closeModal}) => {
    const [otp, setOtp] = useState('');

    const handleChange = (enteredOtp) => {
        setOtp(enteredOtp);
       onOtpChange(enteredOtp); // ارسال مقدار OTP به والد
    };
    console.log(otp)

    return (
        <div className='mainparent_input_otp'>
            
        </div>
    );
};

export default TwoFactorAuthh;