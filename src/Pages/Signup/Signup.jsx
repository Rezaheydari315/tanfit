import { useState, useEffect } from 'react'
import './Signup.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import swal from 'sweetalert'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSite } from '../../apiContext/ApiContext'
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextError from "../../Components/Texts/Error/TextError"


export default function Signup() {

    //لینک ارسال اطلاعات به بک
    const { siteUrl } = useSite()
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
        if (location.pathname === '/Signup' || location.pathname === "/" || location.pathname === '/signup') {
            document.documentElement.style.background = '#D9D9D9';
            // برای بازگرداندن استایل قبلی هنگام خروج از کامپوننت
            return () => {
                document.documentElement.style.background = '#F3F4F6';

            };
        }
    }, [location.pathname]);








    //Register

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState("")
    const Navigate = useNavigate()


    //update state

    function chanefirstname(e) {
        setFirstname(e.target.value)
    }
    function chanelasttname(e) {
        setLastname(e.target.value)
    }
    function changeusername(e) {
        setUsername(e.target.value)
    }
    function changepassword(e) {
        setPassword(e.target.value)
    }
    function changeage(e) {
        setAge(e.target.value)
    }

    function changeemail(e) {
        setEmail(e.target.value)
    }


    //rejex
    const rejexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g
    const testEmail = rejexEmail.test(email)



    //register

    async function clickRegister(e) {
        e.preventDefault()

        let userinfo = await {
            first_name: firstname,
            last_name: lastname,
            age: Number(age),
            username: username,
            email: email,
            password: password
        }


        if (firstname.length <= 0 || lastname.length <= 0 || age.length <= 0 || username.length <= 0 || email.length <= 0 || password.length <= 0) {

            // Swal.fire({
            //     title: "لطفا همه بخش ها رو کامل کن",
            //     icon: "error"
            // })

            setshowTextError(true);
            setTitleTextError("اخطار")
            setValueTextError("لطفا همه بخش ها رو کامل کن")

        }
        else if (!testEmail) {
            // Swal.fire({
            //     title: "لطفا ایمیل رو درست وارد کنید",
            //     icon: "error"
            // })

            setshowTextError(true);
            setTitleTextError("اخطار")
            setValueTextError("لطفا ایمیل را درست وارد کنید")

        }
        else if (age <= 0) {

            // Swal.fire({
            //     title: "سن خود را درست وارد کنید ",
            //     icon: 'error'
            // })

            setshowTextError(true);
            setTitleTextError("اخطار")
            setValueTextError("سن خود را درست وارد کنید ")

        }

        //مرحله ها قبلی رد شد حالا بیاد اینجا 
        else if (firstname.length > 0 && lastname.length > 0 && age.length > 0 && username.length > 0 && email.length > 0 && password.length > 0) {
            async function sendInfoSignup() {
                try {
                    const send = await axios.post(`${siteUrl}/api/v1/auth/signup`, userinfo, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })


                    if (send.status === 201 && send.data.message === "User SignUp successful") {

                        setFirstname("")
                        setLastname("")
                        setUsername("")
                        setPassword("")
                        setAge("")
                        setEmail("")

                        setShowTextSucces(true);
                        setTitleText("عملیات موفقیت آمیز")
                        setValueText("ثبت نام شما با موفیقت انجام شد")



                        setTimeout(() => {
                            Cookies.set('access_token', "")
                            Cookies.set('refresh_token', "")
                            Navigate("/Login")
                        }, 2000); // زمان کافی برای رندر پیام

                    


                        
                    } else {
                        ''
                    }

                } catch (error) {
                    if (error.response.data.message === "Username already exists" && error.response.status === 409) {
                        // Swal.fire({ title: "نام کاربری وارد شده تکراری است.", icon: 'error', text: "لطفا نام کاربری دیگری را امتحان کنید." })
                        setshowTextError(true);
                        setTitleTextError("اخطار")
                        setValueTextError("نام کاربری وارد شده تکراری است")
                    // } else if (error.response.data.message === "Email already exists" && error.response.status === 409) {
                        Swal.fire({ title: "ایمیل وارد شده تکرای است", icon: "error", text: "لطفا ایمیل دیگری را امتحان کنید." })
                        setshowTextError(true);
                        setTitleTextError("اخطار")
                        setValueTextError("ایمیل وارد شده تکرای است")
                    } else {
                        ''
                    }


                }

            }


            sendInfoSignup()
        }


        else {
            ''
        }



    }



    return (
        <form action="">
            <div className='Signup'>
                {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

                {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}

                <div className='Signup_right'>

                </div>
                <div className='Signup_left'>
                    <p className='Signup_left_header'>ساخت حساب کاربری</p>
                    <div className='parent_Signup_left_name'>
                        <div className='Signup_left_firstName'>
                            <p className='Signup_left_firstName_title'>نام:</p>
                            <input type="text" onChange={chanefirstname} value={firstname} placeholder='نام' className='Signup_left_firstName_input' required />
                        </div>
                        <div className='Signup_left_lastName'>
                            <p className='Signup_left_lastName_title'>نام خانوادگی :</p>
                            <input type="text" onChange={chanelasttname} value={lastname} placeholder='نام خانوادگی' className='Signup_left_lastName_input' required />
                        </div>
                    </div>
                    <div className='parent_Signup_left_userNeme'>
                        <p className='Signup_left_userNeme_title'>نام کاربری:</p>
                        <input type="text" onChange={changeusername} value={username} placeholder='نام کاربری خود را وارد کنید' className='Signup_left_userNeme_input' required />
                    </div>
                    <div className='parent_Signup_left_email'>
                        <p className='Signup_left_email_title'>ایمیل</p>
                        <input type="email" onChange={changeemail} value={email} placeholder='ایمیل خود را وارد کیند ' className='Signup_left_email_input' required />
                    </div>
                    <div className='parent_Signup_left_password'>
                        <p className='Signup_left_password_title'>رمز عبور:</p>
                        <input type="password" onChange={changepassword} value={password} placeholder='رمز عبور' className='Signup_left_password_input' required />
                    </div>

                    <div className='parent_Signup_left_age'>
                        <p className='Signup_left_age_title'>سن:</p>
                        <input type="number" placeholder='سن' value={age} onChange={changeage} className='Signup_left_age_input' required />
                    </div>
                    <button className='Signup_left_btn' onClick={clickRegister}>ثبت نام</button>
                    <div className='Signup_left_footer'>
                        <span className='Signup_left_footer_title'>ورود به حساب کاربری :</span>
                        <Link to="/Login" className='Signup_left_footer_btnLogin' >ورود</Link>
                    </div>
                </div>
            </div>
        </form>

    )
}