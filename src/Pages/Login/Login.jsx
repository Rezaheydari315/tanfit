import { Link, Navigate } from 'react-router-dom'
import './Login.css'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import TwoFactorAuthh from '../../Components/TwoFactorAuthh/TwoFactorAuthh'
import { useSite } from '../../apiContext/ApiContext';
import { IoMdClose } from "react-icons/io";
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextError from "../../Components/Texts/Error/TextError"





export default function Login() {


    //لینک بیس ارسال اطلاعات به بک 
    const { siteUrl } = useSite()
    const [showModal, setShowModal] = useState(false)
    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const location = useLocation();

    const [showTextSucces, setShowTextSucces] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [valueText, setValueText] = useState("")

    const [showTextError, setshowTextError] = useState(false)
    const [titleTextError, setTitleTextError] = useState("")
    const [valueTextError, setValueTextError] = useState("")



    ////بستن پیام موفقیت بعد از 4 ثانیه 
    useEffect(() => {
        let timer;
        if (showTextSucces) {
            timer = setTimeout(() => {
                setShowTextSucces(false);
                setTitleText("")
                setValueText("")
            }, 4000);
        }
        return () => clearTimeout(timer);
    }, [showTextSucces]);



    ////بستن پیام ارور بعد از 4 ثانیه 
    useEffect(() => {
        let timer1;
        if (showTextError) {
            timer1 = setTimeout(() => {
                setshowTextError(false);
                setTitleTextError("")
                setValueTextError("")
            }, 4000);
        }
        return () => clearTimeout(timer1);
    }, [showTextError]);




    useEffect(() => {
        if (location.pathname === '/Login' || location.pathname === "/login") {

            document.documentElement.style.background = '#D9D9D9';
            // برای بازگرداندن استایل قبلی هنگام خروج از کامپوننت
            return () => {
                document.documentElement.style.background = '#F3F4F6';

            };
        }
    }, [location.pathname]);



    //login

    //update username
    function changeuseranme(event) {
        setUsername(event.target.value)

    }

    //updata password
    function changepassword(event) {
        setPassword(event.target.value)

    }



    async function clickLOGIN(event) {
        event.preventDefault()

        let validinfo = await {
            username: username,
            password: password
        }


        //خالی کردن اینپوت ها بعد کلیک
        setUsername("")
        setPassword("")

        async function LoginWeb() {
            try {
                const res = await axios.post(`${siteUrl}/api/v1/auth/login`, validinfo, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if (res.status === 200 && res.data.role === "User") {

                    Cookies.set('access_token', res.data.accessToken)
                    Cookies.set('refresh_token', res.data.refreshToken)

                    // Swal

                    setShowTextSucces(true)
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("خوش آمدید")


                    setTimeout(() => {
                        navigate("/Home");
                    }, 2000); // زمان کافی برای رندر پیام

                }
                else if (res.status === 200 && res.data.role === "admin") {
                    //کدای ورود به پنل ادمین 

                    setShowModal(true)
                    Cookies.set('access_token', res.data.accessToken)
                    Cookies.set('refresh_token', res.data.refreshToken)
                }
                else {
                    ''
                }

            }
            catch (error) {
                if (error.response.data.message === 'Password or username Is incorrect') {
                    // Swal.fire({ title: "رمز رو اشتباه وارد کردی", text: "لطفا دوباره امتحان کن", icon: "error" })

                    setshowTextError(true)
                    setTitleTextError("خطا")
                    setValueTextError("رمز رو اشتباه وارد کردی")

                } else if (error.response.data.message === 'User not Found') {
                    // Swal.fire({ title: "نام کاربری یافت نشد", text: "لطفا دوباره امتحان کن", icon: 'error' })
                    setshowTextError(true)
                    setTitleTextError("خطا")
                    setValueTextError("نام کاربری یافت نشد")
                }
            }
        }


        LoginWeb()

    }










    ///ابدیت کردن مقدار اینپوت دو مرحله ای 
    function handleChange(event) {
        setOtp(event.target.value)
    }








    function clickbtn(event) {
        event.preventDefault()

        async function enterAdmin() {
            try {
                const accesstoken = Cookies.get("access_token")

                const otpData = {
                    TwoFactorAuth: otp
                }


                const resi = await axios.post(`${siteUrl}/api/v1/admin/login`, otpData, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${accesstoken}` } })
                setOtp("")

                if (resi.data.status === 200, resi.data.message === "Admin panel accessed successfully") {



                    //    Swal
                    setShowTextSucces(true)
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("با موفیقت وارد پنل ادمین شدید")

                    setTimeout(() => {
                        navigate('/PanelAdminAddCourse')
                    }, 2000); // زمان کافی برای رندر پیام



                } else {
                    ''
                }
            }

            catch (error) {
                setOtp("")

                if (error.response.status === 403) {
                    navigate("/Login")
                }
                else if (error.response && error.response.status === 401) {

                    if (error.response.data.message === "Unauthorized:Refresh Token has expired") {

                        Cookies.remove("access_token");
                        Cookies.remove("refresh_token");
                        navigate("/Login")

                    }
                    if (error.response.data.message === "Unauthorized:ACCESS Token has expired") {
                        const refreshTokenn = Cookies.get("refresh_token")
                        const refiToken = { "Token": refreshTokenn }

                        if (refreshTokenn) {
                            async function receivAccess() {
                                try {
                                    const resi5 = await axios.post(`${siteUrl}/api/v1/auth/Token`, refiToken, {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })
                                    if (resi5.status === 200) {
                                        Cookies.set('access_token', resi5.data.accessToken)
                                    } else {
                                        navigate("/Login")
                                    }
                                }
                                catch (error) {
                                    navigate("/Login")
                                }
                            }

                            receivAccess()

                        }
                        else {
                            navigate("/Login")
                        }
                    }
                    if (error.response.data.message === "Authorization header is missing") {
                        navigate("/Login")
                    }
                }

            }
        }



        enterAdmin()
    }



    ///بستن مدال تایید رو مرحله ای
    function closeModal() {
        setShowModal(false)
    }









    return (

        <form action="">
            <div className='Login'>

                {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

                {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}

                {showModal && <div className='modal_twofactor'>
                    <div className='modal_twofactor_cotent'>
                        <div className='parent_input_otp'>
                            <IoMdClose className='iconClose' onClick={closeModal} />
                            <h1 className='input_otp_header'>تایید دو مرحله ای</h1>
                            <input type="password" className='input_value' placeholder='...رمز خود را وارد کنید' value={otp} onChange={handleChange} />
                            <button className='input_otp_btn' onClick={clickbtn}>تایید</button>
                        </div>
                    </div>
                </div>}



                <div className='Login_right'>
                </div>
                <div className='Login_left'>
                    <p className='Login_left_header'>ورود به حساب کاربری</p>

                    <div className='parent_Login_left_userNeme'>
                        <p className='Login_left_userNeme_title'>نام کاربری:</p>
                        <input type="text" placeholder='نام کاربری خود را وارد کنید' value={username} className='Login_left_userNeme_input' required onChange={changeuseranme} />
                    </div>
                    <div className='parent_Login_left_password'>
                        <p className='Login_left_password_title'>رمز عبور:</p>
                        <input type="password" placeholder='رمز عبور' value={password} className='Login_left_password_input' onChange={changepassword} required />
                    </div>
                    <button className='Login_left_btn' onClick={clickLOGIN}>ورود</button>
                    <div className='Login_left_footer'>
                        <span className='Login_left_footer_title'>ساخت حساب کاربری :</span>
                        <Link to="/Signup" className='Login_left_footer_btnLogin'>ثبت نام</Link>
                    </div>



                </div>
            </div>
        </form>

    )
}
