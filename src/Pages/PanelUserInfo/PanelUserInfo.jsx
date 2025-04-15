import "./PanelUserInfo.css"
import Footer from "../../Components/Footer/Footer"
import Header from "../../Components/Header/Header"
import { BiBookmark } from "react-icons/bi";
import { PiShoppingCartThin } from "react-icons/pi";
import { FaRegComments } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { FaHourglassStart } from "react-icons/fa";
import { PiWarningCircleFill } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSite } from "../../apiContext/ApiContext"
import ModalLogout from "../../Components/ModalLogout/ModalLogout"
import TextSucces from "../../Components/Texts/Succes/TextSucces"


export default function PanelUserInfo() {

    const [closeItemsSideBar, setCloseItemsSideBar] = useState(false)
    const navigate = useNavigate()
    const [opneModalChangeImage, setOpneModalChangeImage] = useState(false)
    const [openModalChangeUsername, setOpenModalChangeUsername] = useState(false)
    const [openModalChangenames, setOpenModalChangenames] = useState(false)
    const [openModalChangeEmail, setOpenModalChangeEmail] = useState(false)
    const [openModalChangePassword, setOpenModalChangePassword] = useState(false)
    const [modalIncompletepurchase, setModalIncompletepurchase] = useState(false)
    const accesstoken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")
    const { siteUrl } = useSite()
    const [infouser, setInfouser] = useState("")
    const [fileImage, setFileImage] = useState("")
    const [namefileImage, setNamefileImage] = useState("")
    const [posterfileImage, setPosterfileImage] = useState("")
    const sectionSelectFile = useRef(null)
    const [valueOpdateaFirstName, setValueOpdateaFirstName] = useState("")
    const [valueOpdateaLastName, setValueOpdateaLastName] = useState("")
    const [valueEmailOpdate, setValueEmailOpdate] = useState("")
    const [valueUsernameOPdate, setValueUsernameOPdate] = useState("")
    const [valueOldPassword, setValueOldPassword] = useState("")
    const [valueNewPassword, setValueNewPassword] = useState("")
    const [iDBYU, setIDBYU] = useState("")
    const [priceAll, setPriceAll] = useState("")
    const SectionBuyIncom = useRef(null)
    const sectionOpenBuyIncom = useRef(null)
    const [linkEndBuy, setLinkEndBuy] = useState("")
    const [showModalLougout, setShowModalLougout] = useState(false)
    const [numberCourses, setNumberCourses] = useState("")
    const [numberComment, setNumberComment] = useState("")
    const [showTextSucces, setShowTextSucces] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [valueText, setValueText] = useState("")





    ////بستن پیام بعد از 3 ثانیه 
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





    //بستن و باز کردن سایدبار کنار
    function closeItemSideBar() {
        setCloseItemsSideBar(!closeItemsSideBar)
    }

    ///رفتن به صفحه دوره های پسندیه
    function naviTOFavi() {
        navigate("/PanelUserfavoriteCourse")
    }

    //رفتن به دوره های خریداری شده
    function naviTOBuy() {
        navigate("/PanelUserpurchasedCourse")
    }


    ///رفتن به صفحه کامنت ها
    function naviTOComment() {
        navigate("/PanelUserComment")
    }


    ///باز کردن مدال تغییر عکس
    function openModalImage() {
        setOpneModalChangeImage(true)
    }

    ///بستن مدال تغییر عکس
    function closeModalImage() {
        setOpneModalChangeImage(false)
    }

    //باز کردن مدال تغییر نام کاربری 
    function opneModalChangeuser() {
        setOpenModalChangeUsername(true)
    }

    ///بستن مدال تغییر نام کاربری
    function closeModaluser() {
        setOpenModalChangeUsername(false)
    }

    ///باز کردن مدال تغییر نام
    function opemModalName() {
        setOpenModalChangenames(true)
    }

    ///بستن مدال تغییر نام
    function closeModalname() {
        setOpenModalChangenames(false)
    }


    ///باز کردن مدال تغییر ایمیل
    function openModalEmail() {
        setOpenModalChangeEmail(true)
    }

    //بستن مدال تغییر ایمیل
    function closeModalEmail() {
        setOpenModalChangeEmail(false)
    }

    ///باز کردن مدال پسورد
    function openModalPassword() {
        setOpenModalChangePassword(true)
    }

    //بستن مدال پسورد
    function closeModalPassword() {
        setOpenModalChangePassword(false)
    }


    //باز کردن مدال تایید خرید
    function openModalIncomBuy() {
        setModalIncompletepurchase(true)
    }





    ///گرفتن اطلاعات هر کاربر
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/profile`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}`, "ngrok-skip-browser-warning": "true" }
        }).then((resGetInfoUser) => {

            if (resGetInfoUser.data.message === "User profile retrieved successfully") {
                setInfouser(resGetInfoUser.data.user)
            }
        })
            .catch((error) => {

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
                else if (error.response.status === 404) {
                    setInfouser("")
                }
            })
    }, [])






    //////////////////////////ابدیت کردن عکس پروفایل

    //سیو کردن اطلاعات فایل
    function saveFileImage(event) {
        setFileImage(event.target.files[0])
        setNamefileImage(event.target.value)
    }

    //انتخاب کردن فایل عکس 
    function opneSelectFiel() {
        if (sectionSelectFile.current) {
            sectionSelectFile.current.click();
        }
    }


    //پیش نمایش عکس
    useEffect(() => {
        if (fileImage) {
            const previewUrl = URL.createObjectURL(fileImage);
            setPosterfileImage(previewUrl);

            // تمیز کردن URL ایجاد شده هنگام unmount یا تغییر فایل
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [fileImage])


    /////حالا ارسال اطلاعات به بک
    function opdateImageProf() {
        const formData = new FormData()
        formData.append("profilePic", fileImage)
        axios.patch(`${siteUrl}/api/v1/user/profile/update`, formData, {
            headers: {
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resOpdateImage) => {

            if (resOpdateImage.data.message === "profile Updated Succesfuly") {
                setOpneModalChangeImage(false)
                // Swal.fire({ title: "عکس پروفایل شما با موفقیت عوض شد", icon: "success" })
                setTitleText("عملیات موفقیت آمیز")
                setValueText("عکس پروفایل شما با موفقیت عوض شد")
                setShowText(true)



                setFileImage("")
                setNamefileImage("")
                setPosterfileImage("")


                

                
            }
        }).catch((error) => {

            setFileImage("")
            setNamefileImage("")
            setPosterfileImage("")
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
            else if (error.response.status === 404) {
                navigate("/Login")
            }
        })
    }



    ////////////////////////ابدیت نام و نام خانوادگی

    ///اول سیو کردن نام 
    function saveFirstName(event) {
        setValueOpdateaFirstName(event.target.value)
    }

    //سیو کردن نام خانوادگی
    function saveLastName(event) {
        setValueOpdateaLastName(event.target.value)
    }

    ///ارسال نام و نام خانوادگی جدید به بک
    function OpdateName() {
        const bodyFirstAndLast = {
            "firstName": valueOpdateaFirstName,
            "lastName": valueOpdateaLastName
        }

        axios.patch(`${siteUrl}/api/v1/user/profile/update`, bodyFirstAndLast, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resOpdateNames) => {

            if (resOpdateNames.data.message === "profile Updated Succesfuly") {
                setOpenModalChangenames(false)
                // Swal.fire({ title: "نام ونام خانوادگی با موفقیت عوض شد", icon: "success" })
                setTitleText("عملیات موفقیت آمیز")
                setValueText("نام ونام خانوادگی با موفقیت عوض شد")
                setShowText(true)



                setValueOpdateaLastName("")
                setValueOpdateaFirstName("")

                
                setTimeout(() => {
                    window.location.reload()
                }, 2000); // زمان کافی برای رندر پیام
            }
        }).catch((error) => {

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
            else if (error.response.status === 404) {
                navigate("/Login")
            }
        })
    }





    /////////////////////////آبدیت ایمیل
    //سیو کردن مقدار ایمیل
    function saveValueEmail(event) {
        setValueEmailOpdate(event.target.value)
    }

    //ارسال ایمیل جدید به بک
    function OpdateEmail() {
        const bodyEmailNew = {
            "email": valueEmailOpdate
        }
        axios.patch(`${siteUrl}/api/v1/user/profile/update`, bodyEmailNew,
            {
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
            }).then((resOpdateEmail) => {
                if (resOpdateEmail.data.message === "profile Updated Succesfuly") {
                    setOpenModalChangeEmail(false)
                    // Swal.fire({ title: "ایمیل شما با موفقیت عوض شد.", icon: "success" })
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("ایمیل شما با موفقیت عوض شد")
                    setShowText(true)


                    setValueEmailOpdate("")

                    setTimeout(() => {
                        window.location.reload()
                    }, 2000); // زمان کافی برای رندر پیام

                }
            }).catch((error) => {
                setValueEmailOpdate("")

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
                else if (error.response.status === 404) {
                    navigate("/Login")
                }
            })
    }





    ////////////////آبدیت نام کاربری 

    /////اول سیو کردن مقدار نام کاربری جدید
    function saveValueUsername(event) {
        setValueUsernameOPdate(event.target.value)
    }



    ///ارسال اطلاعات نام کاربری جدید به بک
    function OpdateuserName() {
        const bodyUserNameNew = {
            "username": valueUsernameOPdate
        }
        axios.patch(`${siteUrl}/api/v1/user/profile/update`, bodyUserNameNew, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resOpdateUserName) => {

            if (resOpdateUserName.data.message === "profile Updated Succesfuly") {
                setOpenModalChangeUsername(false)
                // Swal.fire({ title: "نام کاربری شما با موفقیت عوض شد.", icon: "success" })
                setTitleText("عملیات موفقیت آمیز")
                setValueText("نام کاربری شما با موفقیت عوض شد.")
                setShowText(true)

                setValueUsernameOPdate("")


                setTimeout(() => {
                    navigate("/Login")
                }, 2000); // زمان کافی برای رندر پیام
                
                
            }
        }).catch((error) => {

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
            else if (error.response.status === 404) {
                navigate("/Login")
            }
            setValueUsernameOPdate("")
        })
    }









    //////////////////////ابدیت کردن پسورد
    ///سیو کردن مقدار قدیم پسورد
    function saveValuePassOld(event) {
        setValueOldPassword(event.target.value)
    }
    ///سیو کردن مقدار جدید پسورد
    function saveValuePassNew(event) {
        setValueNewPassword(event.target.value)
    }


    ///آبدیت پسورد
    function OpdatePassword() {
        const bodyPassOpdate = {
            "OldPassword": valueOldPassword,
            "NewPassword": valueNewPassword
        }

        axios.patch(`${siteUrl}/api/v1/user/profile/update/password`, bodyPassOpdate, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resOpdatePass) => {

            if (resOpdatePass.data.message === "password updated Successfully") {
                setOpenModalChangePassword(false)
                // Swal.fire({ title: "پسورد شما با موفقیت عوض شد.", icon: "success" })
                setTitleText("عملیات موفقیت آمیز")
                setValueText("پسورد شما با موفقیت عوض شد.")
                setShowText(true)


                setValueOldPassword("")
                setValueNewPassword("")

                setTimeout(() => {
                    navigate("/Login")
                }, 2000); // زمان کافی برای رندر پیام
                
                
            }
        }).catch((error) => {

            setValueOldPassword("")
            setValueNewPassword("")
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
            else if (error.response.status === 404) {
                navigate("/Login")
            }

        })
    }


    ///گرفتن خرید در صف 
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/orders/pending`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}`, "ngrok-skip-browser-warning": "true" }
        }).then((resGetOrderPending) => {

            if (resGetOrderPending.status === 200) {
                setIDBYU(resGetOrderPending.data.data[0].id)
                setPriceAll(resGetOrderPending.data.data[0].total_price)
            }
        }).catch((error) => {

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
            else if (error.response.status === 404) {
                setIDBYU("")
            }
        })
    }, [])


    ///کسنل کردن خرید در صف
    function cancleBuyIncom() {
        const bodyCancleOrder = {
            "orderID": iDBYU
        }
        axios.post(`${siteUrl}/api/v1/user/orders/cancel`, bodyCancleOrder, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resCancleOreder) => {

            if (resCancleOreder.data.message === "all order canceled") {
                setModalIncompletepurchase(false)
                // Swal.fire({ title: "خرید در صف با موفقیت حذف شد", icon: "success" })
                setTitleText("عملیات موفقیت آمیز")
                setValueText("خرید در صف با موفقیت حذف شد")
                setShowText(true)

                setIDBYU("")
            }
        }).catch((error) => {

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
        })
    }

    //کلیک روی صفحه و هندل های مختلف
    window.addEventListener('click', function (event) {
        if (SectionBuyIncom.current && !SectionBuyIncom.current.contains(event.target) && !sectionOpenBuyIncom.current.contains(event.target)) {
            setModalIncompletepurchase(false)
        }
    })


    ///تایید ادامه خرید در صف
    function BuyIncomplete() {
        //درخواست دوم برا تایید خرید

        const IDBYUEND = {
            "orderID": iDBYU
        }
        axios.post(`${siteUrl}/api/v1/user/payment/checkout-session`, IDBYUEND, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resBuyEnd2) => {

                if (resBuyEnd2.data.message === "Checkout session created successfully") {
                    setLinkEndBuy(resBuyEnd2.data.sessionUrl)
                    // const sessionUrl = response.data.sessionUrl
                    // window.location.href = sessionUrl;
                }
            }).catch((error) => {
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
            })

    }


    // هدایت به صفحه پرداخت نهایی
    if (linkEndBuy.length > 0) {
        window.location.href = linkEndBuy
    }




    ///باز کردن مدال خارج شدن
    function openModalLogout() {
        setShowModalLougout(true)
    }

    ///بستن مدال خارج شدن
    function CloseModalConfirm() {
        setShowModalLougout(false)
    }

    ///خارج شدن 
    function confirmDelete() {
        navigate("/Login")
        Cookies.set('access_token', "")
        Cookies.set('refresh_token', "")
    }



    ///گرفتن تعداد کامنت ها و تعداد دوره ها 
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/status`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}`, "ngrok-skip-browser-warning": "true" }
        }).then((resGetNumbers) => {

            if (resGetNumbers.status === 200) {
                setNumberCourses(resGetNumbers.data.data.course_nums)
                setNumberComment(resGetNumbers.data.data.comment_nums)
            }
        }).catch((error) => {
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
        })
    }, [])



    return (
        <>
            {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}


            {opneModalChangeImage &&
                <div className="modal_change_imag">
                    <div className="modal_change_imag_content">
                        <div className="modal_change_imag_section_top">
                            <div className="modal_change_imag_section_top_right">
                                <div className="modal_change_imag_header">
                                    <div className='modal_userpanel_header_parent_shape'>
                                        <span className='modal_userpanel_header_shape111'></span>
                                        <span className='modal_userpanel_header_shape2222'></span>
                                        <span className='modal_userpanel_header_shape3333'></span>
                                    </div>
                                    <div className="parent_userpanel_header_title">
                                        <h2 className="userpanel_header_title">تغییر عکس پروفایل</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="modal_change_imag_section_top_left">
                                <p className="modal_change_imag_section_top_left_title">آپلود عکس پروفایل</p>
                                <FiPlus className="modal_change_imag_section_top_left_icon" onClick={opneSelectFiel} />
                                <p className="modal_change_imag_section_top_left_name_File">{namefileImage ? namefileImage : "هیچ فایلی انتخاب نشده است."}</p>
                                <input type="file" style={{ display: "none" }} accept="image/*" ref={sectionSelectFile} onChange={saveFileImage} />
                                <div className="modal_change_imag_section_top_left_parent_img">
                                    <img src={posterfileImage} alt="" className="modal_change_imag_section_top_left_img" />
                                </div>
                            </div>
                        </div>

                        <div className="modal_change_imag_section_btns">
                            <button className="modal_change_imag_btn_logOut" onClick={closeModalImage}>خروج</button>
                            <button className="modal_change_imag_btn_confirm" onClick={opdateImageProf}>تایید</button>
                        </div>
                    </div>

                </div>
            }

            {openModalChangeUsername &&
                <div className="modal_change_username">
                    <div className="modal_change_username_content">
                        <div className="modal_change_usename_header">
                            <div className='modal_change_user_userpanel_header_parent_shape'>
                                <span className='modal_change_user_userpanel_header_shape111'></span>
                                <span className='modal_change_user_userpanel_header_shape2222'></span>
                                <span className='modal_change_user_userpanel_header_shape3333'></span>
                            </div>
                            <div className="modal_user_parent_userpanel_header_title">
                                <h2 className="modal_user_userpanel_header_title">تغییر نام کاربری</h2>
                            </div>
                        </div>
                        <div className="modal_change_usename_section_new_user">
                            <span className="modal_change_usename_section_new_user_span">نام کاربری جدید</span>
                            <input type="text" value={valueUsernameOPdate} onChange={saveValueUsername} placeholder="نام کاربری جدید را وارد کنید..." className="modal_change_usename_section_new_user_input" />
                        </div>
                        <div className="modal_change_usename_section_btns">
                            <button className="modal_change_usename_section_btn_cancle" onClick={closeModaluser}>لغو</button>
                            <button className="modal_change_usename_section_btn_confirm" onClick={OpdateuserName}>تایید</button>
                        </div>
                    </div>
                </div>
            }


            {openModalChangenames &&
                <div className="modal_change_name_username">
                    <div className="modal_change_name_username_content">
                        <div className="modal_change_name_header">
                            <div className='modal_change_name_userpanel_header_parent_shape'>
                                <span className='modal_change_name_userpanel_header_shape111'></span>
                                <span className='modal_change_name_userpanel_header_shape2222'></span>
                                <span className='modal_change_name_userpanel_header_shape3333'></span>
                            </div>
                            <div className="modal_name_parent_userpanel_header_title">
                                <h2 className="modal_name_userpanel_header_title">تغییر نام و نام خانوادگی</h2>
                            </div>
                        </div>
                        <div className="modal_change_name_section_new_user">
                            <span className="modal_change_name_section_new_user_span">نام جدید</span>
                            <input type="text" onChange={saveFirstName} value={valueOpdateaFirstName} placeholder="نام جدید را وارد کنید..." className="modal_change_name_section_new_user_input" />
                        </div>
                        <div className="modal_change_name_section_new_user">
                            <span className="modal_change_name_section_new_user_span">نام خانوادگی جدید</span>
                            <input type="text" onChange={saveLastName} value={valueOpdateaLastName} placeholder="نام خانوادگی جدید را وارد کنید..." className="modal_change_name_section_new_user_input" />
                        </div>
                        <div className="modal_change_name_section_btns">
                            <button className="modal_change_name_section_btn_cancle" onClick={closeModalname}>لغو</button>
                            <button className="modal_change_name_section_btn_confirm" onClick={OpdateName}>تایید</button>
                        </div>
                    </div>
                </div>
            }


            {openModalChangeEmail &&
                <div className="modal_change_email">
                    <div className="modal_change_email_content">
                        <div className="modal_change_email_header">
                            <div className='modal_change_email_userpanel_header_parent_shape'>
                                <span className='modal_change_email_userpanel_header_shape111'></span>
                                <span className='modal_change_email_userpanel_header_shape2222'></span>
                                <span className='modal_change_email_userpanel_header_shape3333'></span>
                            </div>
                            <div className="modal_email_parent_userpanel_header_title">
                                <h2 className="modal_email_userpanel_header_title">تغییر ایمیل</h2>
                            </div>
                        </div>
                        <div className="modal_change_email_section_new_user">
                            <span className="modal_change_email_section_new_user_span">ایمیل جدید</span>
                            <input type="email" onChange={saveValueEmail} value={valueEmailOpdate} placeholder="ایمیل جدید خود را وارد کنید..." className="modal_change_email_section_new_user_input" />
                        </div>
                        <div className="modal_change_email_section_btns">
                            <button className="modal_change_email_section_btn_cancle" onClick={closeModalEmail}>لغو</button>
                            <button className="modal_change_email_section_btn_confirm" onClick={OpdateEmail}>تایید</button>
                        </div>
                    </div>
                </div>
            }



            {openModalChangePassword &&
                <div className="modal_change_password">
                    <div className="modal_change_password_content">
                        <div className="modal_change_password_header">
                            <div className='modal_change_password_userpanel_header_parent_shape'>
                                <span className='modal_change_password_userpanel_header_shape111'></span>
                                <span className='modal_change_password_userpanel_header_shape2222'></span>
                                <span className='modal_change_password_userpanel_header_shape3333'></span>
                            </div>
                            <div className="modal_password_parent_userpanel_header_title">
                                <h2 className="modal_password_userpanel_header_title">تغییر پسورد</h2>
                            </div>
                        </div>
                        <div className="modal_change_password_section_old_user">
                            <span className="modal_change_password_section_old_user_span">پسورد قدیم</span>
                            <input value={valueOldPassword} onChange={saveValuePassOld} type="password" placeholder="پسورد قدیم خود را وارد کنید..." className="modal_change_password_section_old_user_input" />
                        </div>
                        <div className="modal_change_password_section_new_user">
                            <span className="modal_change_password_section_new_user_span">پسورد جدید</span>
                            <input value={valueNewPassword} onChange={saveValuePassNew} type="password" placeholder="پسورد جدید خود را وارد کنید..." className="modal_change_password_section_new_user_input" />
                        </div>
                        <div className="modal_change_password_section_btns">
                            <button className="modal_change_password_section_btn_cancle" onClick={closeModalPassword}>لغو</button>
                            <button className="modal_change_password_section_btn_confirm" onClick={OpdatePassword}>تایید</button>
                        </div>
                    </div>
                </div>
            }



            {modalIncompletepurchase &&
                <div className="modal_purchase_incomplete">
                    <div className="modal_purchase_incomplete_content" ref={SectionBuyIncom}>
                        <div className="modal_change_incom_buy_header">
                            <div className='modal_change_incom_buy_userpanel_header_parent_shape'>
                                <span className='modal_change_incom_buy_userpanel_header_shape111'></span>
                                <span className='modal_change_incom_buy_userpanel_header_shape2222'></span>
                                <span className='modal_change_incom_buy_userpanel_header_shape3333'></span>
                            </div>
                            <div className="modal_incom_buy_parent_userpanel_header_title">
                                <h2 className="modal_incom_buy_userpanel_header_title">خرید در صف</h2>
                            </div>
                        </div>
                        <div className="modal_change_incom_buy_content">
                            {iDBYU ?
                                <div className="modal_change_incom_buy_content_parent_item">
                                    <span className="modal_change_incom_buy_content_span">جمع کل سبد خرید شما:</span>
                                    <h2 className="modal_change_incom_buy_content_price">{priceAll} هزار تومان</h2>
                                </div>

                                : <h2 className="modal_change_incom_buy_content_spannn">چیزی یافت نشد!</h2>}
                        </div>
                        <div className="modal_change_incom_buy_section_btns">
                            <button className={`modal_change_incom_buy_section_btn_cancle ${iDBYU ? "" : "disableBtn"}`} onClick={cancleBuyIncom}>لغو خرید</button>
                            <button className={`modal_change_incom_buy_section_btn_confirm ${iDBYU ? "" : "disableBtn"}`} onClick={BuyIncomplete}>ادامه خرید</button>
                        </div>
                    </div>
                </div>
            }




            <div className="parent_userInfo">

                <Header></Header>
                {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}
                <div className="parent_section_left_right">
                    <div className="section_right4">
                        <div className="section_right4_top_userpanel">
                            <div className='userpanel_header_parent_shape'>
                                <span className='userpanel_header_shape1111'></span>
                                <span className='userpanel_header_shape2222'></span>
                                <span className='userpanel_header_shape3333'></span>
                            </div>
                            <div>
                                <h2 className="section_right4_title">اطلاعات کاربری</h2>
                            </div>
                        </div>
                        <div className="section_right4_middle_userpanel">
                            <div className="section_right4_middle_userpanel_sec_right">
                                <div className="parent_section_number_course">
                                    <span className="section_number_course">{numberCourses}</span>
                                    <span className="section_number_span">دوره</span>
                                </div>
                                <div className="parent_section_number_comment">
                                    <span className="section_number_comment">{numberComment}</span>
                                    <span className="section_number_span">کامنت</span>
                                </div>
                            </div>
                            <div className="section_right4_middle_userpanel_sec_left">
                                <div className="section_id_gmail">
                                    <span className="section_id">{infouser.UserID}</span>
                                    <span className="section_gmail">{infouser.username}</span>
                                </div>
                                <div className="parent_section_img_name">

                                    {infouser && <img src={`${siteUrl}${infouser.profilePicture}`} className="section_img" alt="" />}
                                    <span className="section_name">{infouser.firstName} {infouser.lastName}</span>
                                </div>
                            </div>
                        </div>


                        <div className="section_right4_buttom_userpanel">

                            <div className="parent_section_change_image" onClick={openModalImage}>
                                <span className="section_change_image">تغییر عکس پروفایل</span>
                                <IoIosArrowBack className="section_change_image_icon" />
                            </div>


                            <div className="parent_section_change_names" onClick={opemModalName}>
                                <span className="section_change_name">تغییر نام ونام خانوادگی</span>
                                <IoIosArrowBack className="section_change_name_icon" />
                            </div>


                            <div className="parent_section_change_email" onClick={openModalEmail}>
                                <span className="section_change_email">تغییر ایمیل</span>
                                <IoIosArrowBack className="section_change_email_icon" />
                            </div>


                            <div className="parent_section_change_username" onClick={opneModalChangeuser}>
                                <span className="section_change_username">تغییر نام کاربری</span>
                                <IoIosArrowBack className="section_change_username_icon" />
                            </div>


                            <div className="parent_section_change_password" onClick={openModalPassword}>
                                <span className="section_change_password">تغییر رمزعبور</span>
                                <IoIosArrowBack className="section_change_password_icon" />
                            </div>


                        </div>
                    </div>

                    <div className="section_left4">
                        <div className="depend_section_left4" onClick={closeItemSideBar}>
                            <IoIosArrowForward className={`depend_section_left4_icon ${closeItemsSideBar ? "rotate" : ""}`} />
                        </div>
                        <div className="section_left4_header_top">
                            <div className="section_left4_header_top_section_left4">
                            </div>

                            {!closeItemsSideBar && <div className="section_left4_header_top_section_right">
                                <span className="section_left4_header_top_section_right_span1">tanfit</span>
                                <span className="section_left4_header_top_section_right_span2">UserPanel</span>
                            </div>}


                        </div>

                        <div className="section_left4_favorite_course" onClick={naviTOFavi}>
                            <BiBookmark className="section_left4_favorite_course_icon" />

                            {!closeItemsSideBar && <span className="section_left4_favorite_course_span">دوره های پسندیده</span>}
                        </div>
                        <div className="section_left4_buy_course" onClick={naviTOBuy}>
                            <PiShoppingCartThin className="section_left4_buy_course_icon" />
                            {!closeItemsSideBar && <span className="section_left4_buy_course_span">دوره های خریداری شده</span>
                            }
                        </div>
                        <div className="section_left4_comment" onClick={naviTOComment}>
                            <FaRegComments className="section_left4_comment_icon" />
                            {!closeItemsSideBar && <span className="section_left4_comment_span">وضعیت کامنت ها</span>}
                        </div>
                        <div className="section_left4_information">
                            <FaRegUser className="section_left4_information_icon" />

                            {!closeItemsSideBar && <span className="section_left4_information_span">اطلاعات کاربری</span>}
                        </div>


                        <div className="section_left4_pending_buy" onClick={openModalIncomBuy} ref={sectionOpenBuyIncom}>
                            <FaClockRotateLeft className="section_left4_pending_buy_icon" />
                            {!closeItemsSideBar && <span className="section_left4_pending_buy_span">خرید در صف</span>}
                        </div>

                        <div className="section_left4_LogOut">
                            <FiLogOut className="section_left4_LogOut_icon" onClick={openModalLogout} />
                            {!closeItemsSideBar && <span className="section_left4_LogOut_span" onClick={openModalLogout}>خروج از حساب کاربری</span>}
                        </div>
                    </div>
                </div>

                <Footer></Footer>
            </div>


        </>

    )
}