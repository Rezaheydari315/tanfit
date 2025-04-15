import './PanelAdmin.css'
import { Link, Outlet } from "react-router-dom"
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from "react"
import * as yup from 'yup'
import { motion } from 'framer-motion'
import Header from "../../Components/Header/Header"
import axios from "axios"
import { useSite } from "../../apiContext/ApiContext"
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { FaCircle } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { FaUpload } from "react-icons/fa";
import { AiFillCloseSquare } from "react-icons/ai";
import Swal from 'sweetalert2'
import SvgIcon from "../../Components/Logo/SvgIcon"
import ModalLogout from "../../Components/ModalLogout/ModalLogout"
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextWarn from "../../Components/Texts/Warn/TextWarn"
import TextError from "../../Components/Texts/Error/TextError"


export default function PanelAdminAddCourse() {




    const [showLoding, setShowLoding] = useState(true)
    const navigate = useNavigate()
    const { siteUrl } = useSite()
    const { checkAccess } = useSite()
    const [openCategory, setOpenCategory] = useState(false)
    const [openCondition, setOpenCondition] = useState(false)
    const refCategory = useRef(null)
    const refCondition = useRef(null)
    const [showModalCategory, setShowModalCategory] = useState(false)
    const [valueAddCategory, setValueAddCategory] = useState("")
    const refreshToken = Cookies.get("refresh_token")
    const accesstoken = Cookies.get("access_token")
    const [listCategory, setListCategory] = useState("")
    const [valueNameAddCourse, setValueNameAddCourse] = useState("")
    const [valueTeacherCourse, setValueTeacherCourse] = useState("")
    const [valuesummaryCourse, setValuesummaryCourse] = useState("")
    const [valueInformation, setValueInformation] = useState("")
    const [valuePrice, setValuePrice] = useState("")
    const [filePoster, setFilePoster] = useState("")
    const [valueNameFilePoster, setValueNameFilePoster] = useState("")
    const [posterPreview, setPosterPreview] = useState("")
    const [valueCategory, setValueCategory] = useState("")
    const [valueCondiotion, setValueCondiotion] = useState("")
    const sectionSelectFile = useRef(null)
    const [infouser, setInfouser] = useState("")
    const [showModalLougout, setShowModalLougout] = useState(false)

    const [showTextSucces, setShowTextSucces] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [valueText, setValueText] = useState("")

    const [showTextError, setshowTextError] = useState(false)
    const [titleTextError, setTitleTextError] = useState("")
    const [valueTextError, setValueTextError] = useState("")


    const [showTextWarn, setshowTextWarn] = useState(false)
    const [titleTextWarn, setTitleTextWarn] = useState("")
    const [valueTextWarn, setValueTextWarn] = useState("")




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


    ////بستن پیام هشدار بعد از 4 ثانیه 
    useEffect(() => {
        let timer1;
        if (showTextWarn) {
            timer1 = setTimeout(() => {
                setshowTextWarn(false);
                setTitleTextWarn("")
                setValueTextWarn("")
            }, 4000);
        }
        return () => clearTimeout(timer1);
    }, [showTextWarn]);



    ///اون یکی تو  ای پی ای کانتکس
    useEffect(() => {
        checkAccess()
    }, [])


    ///دسترسی کمتر از 720پیکسل بسته میشه
    async function redirectToLogin() {
        if (window.innerWidth < 720) {
            // await Swal.fire({ title: "برای استفاده از صفحات ادمین از دسکتاپ استفاده نمایید.", icon: "warning" })

            setshowTextWarn(true);
            setTitleTextWarn("هشدار")
            setValueTextWarn("برای استفاده از صفحات ادمین از دسکتاپ استفاده نمایید.")

            setTimeout(() => {
                window.location.href = "/login"
            }, 1000); // زمان کافی برای رندر پیام


        }
    }

    // بررسی عرض صفحه هنگام بارگذاری صفحه
    window.onload = redirectToLogin;

    // بررسی عرض صفحه هنگام تغییر اندازه پنجره
    window.onresize = redirectToLogin;






    //چک کردن اکسس و این داستانا


    useEffect(function () {
        async function checkacesAdmin() {
            try {
                const accesstokenn = Cookies.get("access_token")
                if (accesstokenn) {
                    const fechi = await axios.post(`${siteUrl}/api/v1/admin/access`, {}, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${accesstokenn}`
                        }
                    })
                    if (fechi.data.status === 200 && fechi.data.message === "Welcome to admin panel") {
                        setShowLoding(false)
                    }
                    else {
                        ''
                    }


                }
                else {
                    navigate("/Login")
                }


            }
            catch (error) {

                if (error.response.status === 403) {
                    navigate("/Login")
                }
                else if (error.response && error.response.status === 401) {

                    if (error.response.data.message === "Unauthorized:Refresh Token has expired") {

                        Cookies.remove("access_token");
                        Cookies.remove("refresh_token");
                        navigate("/Login")

                    } else if (error.response.data.message === "Unauthorized:ACCESS Token has expired") {

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

                                    await Cookies.set('access_token', resi5.data.accessToken)
                                    async function checkAccessSecond() {
                                        try {
                                            const accesstokennSecond = Cookies.get("access_token")

                                            if (accesstokennSecond) {
                                                const fechiSecond = await axios.post(`${siteUrl}/api/v1/admin/access`, {}, {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        "Authorization": `Bearer ${accesstokennSecond}`
                                                    }
                                                })

                                                if (fechiSecond.data.status === 200 && fechiSecond.data.message === "Welcome to admin panel") {
                                                    setShowLoding(false)
                                                }
                                                else {
                                                    ""
                                                }


                                            }
                                            else {
                                                navigate("/Login")
                                            }
                                        }
                                        catch (error) {

                                            if (error.response.status === 403) {
                                                navigate("/Login")
                                            } else { "" }
                                        }
                                    }
                                    checkAccessSecond()
                                }

                                catch (error) {

                                }
                            }

                            receivAccess()

                        }
                        else {
                            navigate("/Login")
                        }
                    }


                }
                else { '' }

            }
        }
        checkacesAdmin()
    }
        , [])







    function handleOpneCategorySelect() {
        setOpenCategory(true)
        setOpenCondition(false)
    }

    function handleCloseCategory(event) {
        setOpenCategory(false)

        setValueCategory(event.target.textContent)
    }

    function handleOpenCondition() {
        setOpenCondition(true)
        setOpenCategory(false)
    }

    function handleCloseCondition(event) {
        setOpenCondition(false)

        setValueCondiotion(event)
    }

    //
    window.addEventListener('click', function (event) {
        if (refCategory.current && !refCategory.current.contains(event.target)) {
            setOpenCategory(false)
        }
        if (refCondition.current && !refCondition.current.contains(event.target)) {
            setOpenCondition(false)
        }
    })

    ///باز کردن مدال کتگوری
    function openModalCategory() {
        setShowModalCategory(true)
    }

    function closeModalCategory() {
        setShowModalCategory(false)
    }


    ///گرفتن کتگوری از بک

    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/admin/category`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        })

            .then((resGetCategory) => {

                if (resGetCategory.data.status === 200) {
                    setListCategory(resGetCategory.data.data)
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



    //افزودن کتگوری

    //اول سیو کردن اسم کتگوری

    function SaveValueAddCategro(event) {

        ///کارای اسپیس خالی که اگر از فاصله استفاده کرد خودکار فاصله بزارم
        const vaalue = event.target.value
        const formattedValue = vaalue.replace(/\s/g, '-');
        setValueAddCategory(formattedValue)
    }


    function HandleAddCategory() {
        if (valueAddCategory.length <= 0) {
            // Swal.fire({ title: "نام کتگوری شما خالی است.", icon: "error" })

            setshowTextError(true);
            setTitleTextError("اخطار")
            setValueTextError("نام کتگوری شما خالی است.")
        } else {

            const valueAddCategoryy = {
                "category": valueAddCategory
            }
            axios.post(`${siteUrl}/api/v1/admin/category/add`, valueAddCategoryy, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accesstoken}`
                }
            }).then((resAddCategory) => {

                if (resAddCategory.data.message === "category added") {

                    setShowTextSucces(true);
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("کتگوری با موفیقت اضافه شد")


                    setTimeout(() => {
                        setValueAddCategory("")
                        setShowModalCategory(false)
                    }, 2000); // زمان کافی برای رندر پیام



                    // Swal.fire({ title: "کتگوری با موفیقت اضافه شد.", icon: "success" }).then(() => {
                    //     setValueAddCategory("")
                    //     setShowModalCategory(false)
                    // })

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
    }

    //حذف ایتم از کتگوری
    function rempveItemCategory(idRemove) {

        const idItemDelete = {
            "id": idRemove
        }
        axios.post(`${siteUrl}/api/v1/admin/category/remove`, idItemDelete, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        })
            .then((resRemoveItemCategory) => {

                ///به شرط اوکی شدن پاک شدن اینو فعال کن
                setListCategory((pre) => {
                    const filterNextDelete = pre.filter((itemha) => {
                        return itemha.id !== idRemove
                    })
                    return filterNextDelete
                })


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
            })
    }


    ///کارای افزدون دوره

    function openselectFile() {
        if (sectionSelectFile.current) {
            sectionSelectFile.current.click();
        }
    }

    //سیو کردن نام دوره
    function handleValueName(event) {
        setValueNameAddCourse(event.target.value)
    }

    ///سیو کردن نام مدرس
    function handleValueTeacher(event) {
        setValueTeacherCourse(event.target.value)
    }

    //سیو کردن خلاصه دوره
    function handleValueSuumary(event) {
        setValuesummaryCourse(event.target.value)
    }


    ///سیو کردن توضیحات کامل
    function handleValueInfo(event) {
        setValueInformation(event.target.value)
    }

    ///سیو کردن قیمت 
    function handleValuePrice(event) {
        setValuePrice(event.target.value)
    }


    ///سیو کردن نام فایل وخود فایل و پوستر نمایش
    function handleFilePosterSelect(event) {
        setValueNameFilePoster(event.target.value)
        setFilePoster(event.target.files[0])
        // setPosterPreview(URL.createObjectURL(filePoster))
    }


    useEffect(() => {
        if (filePoster) {
            const previewUrl = URL.createObjectURL(filePoster);
            setPosterPreview(previewUrl);

            // تمیز کردن URL ایجاد شده هنگام unmount یا تغییر فایل
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [filePoster]);



    ///کلیک روی افزودن به لیست دوره ها
    function sendInfoAddCourse() {

        const formData = new FormData()
        if (!valueNameAddCourse && !valueTeacherCourse && !valuesummaryCourse && !valueInformation && !filePoster && !valueCategory && !valueCondiotion && !valuePrice) {
            // Swal.fire({ title: "لطفا همه آیتم ها رو کامل کن", icon: "error" })

            setshowTextError(true);
            setTitleTextError("اخطار")
            setValueTextError("لطفا همه آیتم ها رو کامل کن")


        } else {

            formData.append("poster", filePoster)
            formData.append("courseName", valueNameAddCourse)
            formData.append("instructor", valueTeacherCourse)
            formData.append("introduse", valuesummaryCourse)
            formData.append("description", valueInformation)
            formData.append("price", valuePrice)
            formData.append("Completed", valueCondiotion)
            formData.append("categorys", valueCategory)




            axios.post(`${siteUrl}/api/v1/admin/course/add`, formData, {
                headers: {
                    "Authorization": `Bearer ${accesstoken}`
                }
            }).then((resAddCourse) => {





                if (resAddCourse.data.message === "course Added successful" && resAddCourse.data.status === 201) {
                    setValueNameAddCourse("")
                    setValueTeacherCourse("")
                    setValuesummaryCourse("")
                    setValueInformation("")
                    setValuePrice("")
                    setValueNameFilePoster("")
                    setFilePoster("")
                    setPosterPreview("")
                    setValueCategory("")
                    setValueCondiotion("")
                    
                    // Swal.fire({ title: "دوره شما با موفقیت اضافه شد", icon: "success" })


                    setShowTextSucces(true);
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("دوره شما با موفقیت اضافه شد")


                }
            }).catch((error) => {

                setValueNameAddCourse("")
                setValueTeacherCourse("")
                setValuesummaryCourse("")
                setValueInformation("")
                setValuePrice("")
                setValueNameFilePoster("")
                setFilePoster("")
                setValueCategory("")
                setValueCondiotion("")
                setPosterPreview("")

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
            })
    }, [])




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





    return (



        <div className="PanelAdmin">


            {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

            {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}

            {showTextWarn && <TextWarn title={titleTextWarn} text={valueTextWarn}></TextWarn>}

            {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}
            {showLoding && <div className='lodeer1'>
                <div className="loader1"></div>
            </div>}


            {showModalCategory && <div className='modal_category'>
                <div className='modal_category_content'>
                    <h2 className='modal_category_content_title'>افزدون کتگوری</h2>
                    <div className='section_name'>
                        <p className='title_section_name'>نام کتگوری:</p>
                        <input type="text" className='input_section_name' placeholder='نام کتگوری مورد نظر' onChange={SaveValueAddCategro} />
                    </div>
                    <div className='section_List'>


                        {listCategory && listCategory.map((ItemCategory, index) => {
                            return (
                                <div className='section_List_item' key={index + 1}>
                                    <AiFillCloseSquare className='section_List_item_icon' onClick={() => { rempveItemCategory(ItemCategory.id) }} />
                                    <span className='section_List_item_name'>{ItemCategory.category}</span>
                                </div>
                            )
                        })}


                        {/* <div className='section_List_item'>
                            <AiFillCloseSquare className='section_List_item_icon' />
                            <span className='section_List_item_name'>نام کتگوری اول</span>
                        </div>
                        <div className='section_List_item'>
                            <AiFillCloseSquare className='section_List_item_icon' />
                            <span className='section_List_item_name'>نام کتگوری اول</span>
                        </div>
                        <div className='section_List_item'>
                            <AiFillCloseSquare className='section_List_item_icon' />
                            <span className='section_List_item_name'>نام کتگوری اول</span>
                        </div> */}



                    </div>
                    <div className='section_btn'>
                        <button className='section_btn_cancle' onClick={closeModalCategory}>لغو</button>
                        <button className='section_btn_confirm' onClick={HandleAddCategory}>تایید</button>
                    </div>
                </div>
            </div>}




            <div className={`panelAdimn_parent_secions ${showModalCategory ? "order_section" : ""}`}>


                <div className="paneladmin_section_right">
                    <div className="paneladmin_section_right_parent_top">
                        <div className="paneladmin_section_right_parent_top_right">
                            <p className="paneladmin_section_right_parent_top_right_number">500</p>
                            <p className="paneladmin_section_right_parent_top_right_span">دوره آموزشی</p>
                        </div>
                        <span className='paneladmin_section_right_parent_top_right_shape'></span>
                        <div className="paneladmin_section_right_parent_top_left">
                            <p className="paneladmin_section_right_parent_top_left_number">469</p>
                            <p className="paneladmin_section_right_parent_top_left_span">ورزشکار</p>
                        </div>
                    </div>
                    <div className="paneladmin_section_right_parent_buutom">
                        <div className="paneladmin_section_right_parent_buutom_parent_header">
                            <span className="paneladmin_section_right_parent_buutom_parent_header_course">
                                نام دوره
                            </span>
                            <span className='paneladmin_section_right_parent_buutom_shape'></span>
                            <span className="paneladmin_section_right_parent_buutom_parent_header_teacher"
                            >نام مدرس
                            </span>
                        </div>


                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">استقامت بدنی</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">بدن سازی بالا تنه</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد مهران پور</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">برنامه ریزی روزانه</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">تمرینات قوز کمری</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">استقامت بدنی </span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">استقامت بدنی</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">استقامت بدنی</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>
                        <div className="paneladmin_section_right_parent_buutom_item">
                            <span className="paneladmin_section_right_parent_buutom_item_title">استقامت بدنی</span>
                            <span className="paneladmin_section_right_parent_buutom_item_teacher">احمد وکیلی</span>
                        </div>

                        <div className='paneladmin_section_right_parent_buutom_btn_category'>
                            <button className='paneladmin_section_right_buutom_btn_category' onClick={openModalCategory}>افزدون دسته بندی</button>
                        </div>

                    </div>
                </div>



                <div className="paneladmin_section_middle">
                    <h2 className="paneladmin_section_middle_title">افزودن دوره</h2>
                    <div className="paneladmin_section_middle_parent_right_left">
                        <div className="paneladmin_section_middle_parent_secRight">
                            <div className="paneladmin_section_middle_parent_secRight_parent_name_teach">
                                <div className="paneladmin_section_middle_parent_name">
                                    <p className="paneladmin_section_middle_name_span">نام:</p>
                                    <input type="text" value={valueNameAddCourse} className="paneladmin_section_middle_name_input" onChange={handleValueName} placeholder="نام دوره" />
                                </div>
                                <div className="paneladmin_section_middle_parent_teacher">
                                    <p className="paneladmin_section_middle_teacher_span">نام مدرس:</p>
                                    <input type="text" value={valueTeacherCourse} className="paneladmin_section_middle_teacher_input" onChange={handleValueTeacher} placeholder="نام مدرس را وارد کنید" />
                                </div>
                            </div>
                            <div className="paneladmin_section_middle_parent_secRight_parent_summary">
                                <p className="paneladmin_section_middle_parent_secRight_parent_desc_span">توضیحات خلاصه:</p>
                                <textarea value={valuesummaryCourse} className="paneladmin_section_middle_parent_secRight_parent_desc_input" onChange={handleValueSuumary} placeholder="چکیده توضیحات مربوط به دوره.."></textarea>
                            </div>
                            <div className="paneladmin_section_middle_parent_secRight_parent_desc">
                                <p className="paneladmin_section_middle_parent_secRight_desc_span">توضیحات:</p>
                                <textarea value={valueInformation} className="paneladmin_section_middle_parent_secRight_desc_input" onChange={handleValueInfo} placeholder="توضیحات کامل دوره.."></textarea>
                            </div>

                            <div className='paneladmin_section_middle_parent_secRight_parent_Price'>
                                <p className="paneladmin_section_middle_parent_secRight_Price_title">قیمت:</p>
                                <div className='paneladmin_section_middle_parent_secRight_Price_input_price_second'>
                                    <input value={valuePrice} type="number" placeholder='قیمت دوره به تومان...' onChange={handleValuePrice} className='paneladmin_section_middle_parent_secRight_Price_input' />
                                    <span className='paneladmin_section_middle_parent_secRight_Price_input_price_second_span'>تومان</span>
                                </div>
                            </div>


                        </div>
                        <div className="paneladmin_section_middle_parent_secLeft">
                            <div className="paneladmin_section_middle_secLeft_parent_top">
                                <p className="paneladmin_section_middle_secLeft_span" onClick={openselectFile}>آپلود پوستر</p>
                                <AiOutlinePlus className="paneladmin_section_middle_secLeft_icon" onClick={openselectFile} />
                                <p className="paneladmin_section_middle_secLeft_nameFile">
                                    {valueNameFilePoster ? valueNameFilePoster : "هنوز هیچ فایل انتخاب نشده است."}
                                </p>
                                <input type="file" style={{ display: "none" }} accept="image/*" onChange={handleFilePosterSelect} ref={sectionSelectFile} />
                                <div className='paneladmin_section_middle_secLeft_parent_image'>
                                    {/* <img src="/Image/Courseinfo/1.jpg" className="paneladmin_section_middle_secLeft_image" alt="" /> */}
                                    <img src={posterPreview} className="paneladmin_section_middle_secLeft_image" alt="" />
                                </div>

                            </div>
                            <div className="paneladmin_section_middle_secLeft_parent_category">
                                <p className="paneladmin_section_middle_secLeft_category">کتگوری:</p>
                                <div className="paneladmin_section_middle_secLeft_category_selection">
                                    <div className={`paneladmin_section_middle_secLeft_category_selection_parent_top ${showModalCategory ? "order_section" : ""}`}>
                                        <div className='paneladmin_section_middle_secLeft_category_selection_parent_top_section_search'>
                                            <input type="text" placeholder="کتگوری دوره..." value={valueCategory} onClick={handleOpneCategorySelect} ref={refCategory} className={`paneladmin_section_middle_secLeft_category_input ${showModalCategory ? "" : ""}`} />
                                            <IoIosArrowBack className={`"paneladmin_section_middle_secLeft_category_icon active_icon" ${openCategory ? "active_icon_category" : ""}`} />
                                        </div>
                                        {openCategory && <div className="section_middle_secLeft_category_selection_depend">
                                            <ul className="section_middle_secLeft_category_selection_depend_list">

                                                {listCategory && listCategory.map((ItemCategorySelect, index) => {
                                                    return (
                                                        <li className="section_middle_secLeft_category_selection_depend_item" key={index + 1}>
                                                            <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                            <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>{ItemCategorySelect.category}</span>
                                                        </li>
                                                    )

                                                })}

                                                {/* <li className="section_middle_secLeft_category_selection_depend_item" >
                                                    <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>نام کتگوری اول</span>
                                                </li>
                                                <li className="section_middle_secLeft_category_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>نام کتگوری دوم</span>
                                                </li>
                                                <li className="section_middle_secLeft_category_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>نام کتگوری سوم</span>
                                                </li>
                                                <li className="section_middle_secLeft_category_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>نام کتگوری چهارم</span>
                                                </li>
                                                <li className="section_middle_secLeft_category_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_category_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_category_selection_depend_item_span" onClick={() => handleCloseCategory(event)}>نام کتگوری پنجم</span>
                                                </li> */}

                                            </ul>
                                        </div>}

                                    </div>

                                </div>


                                <p className="paneladmin_section_middle_secLeft_condition">وضعیت:</p>
                                <div className="paneladmin_section_middle_secLeft_condition_selection">
                                    <div className={`paneladmin_section_middle_secLeft_condition_selection_parent_top ${showModalCategory ? "order_section" : ""}`}>
                                        <div className='paneladmin_section_middle_secLeft_condition_selection_parent_top_section_search'>
                                            <input type="text" placeholder="وضعیت دوره.." value={valueCondiotion === 1 ? "به اتمام رسیده" : "در حال پخش"} ref={refCondition} onClick={handleOpenCondition} className="paneladmin_section_middle_secLeft_condition_input" />
                                            <IoIosArrowBack className={`paneladmin_section_middle_secLeft_condition_icon ${openCondition ? "active_icon_category" : ""}`} />
                                        </div>
                                        {openCondition && <div className="section_middle_secLeft_condition_selection_depend" >
                                            <ul className="section_middle_secLeft_condition_selection_depend_list">
                                                <li className="section_middle_secLeft_condition_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_condition_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_condition_selection_depend_item_span" onClick={() => { handleCloseCondition(1) }}>به اتمام رسیده</span>
                                                </li>
                                                <li className="section_middle_secLeft_condition_selection_depend_item">
                                                    <FaCircle className="paneladmin_section_middle_secLeft_condition_selection_depend_icon" />
                                                    <span className="section_middle_secLeft_condition_selection_depend_item_span" onClick={() => { handleCloseCondition(0) }}>در حال پخش</span>
                                                </li>


                                            </ul>
                                        </div>}

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='paneladmin_section_middle_parent_btn'>
                        <button className="paneladmin_section_middle_btn" onClick={sendInfoAddCourse}>افزودن به لیست دوره ها</button>
                    </div>

                </div>



                <div className="paneladmin_section_left1">
                    <div className="paneladmin_section_left_top">
                        <div className="paneladmin_section_left_top_item1">
                            <div className='paneladmin_section_left_top_item1_right'>
                                <span className="paneladmin_section_left_top_item1_span1">AdminPanel</span>
                                <span className="paneladmin_section_left_top_item1_span2">tanfit</span>
                            </div>
                            <div className="paneladmin_section_left_top_item1_parent_shape">
                                <img src="/Image/IconPanelAdmin/1.png" className='paneladmin_section_left_top_item1_shape' alt="" />
                                {/* <SvgIcon className="paneladmin_section_left_top_item1_shape"></SvgIcon> */}
                            </div>
                        </div>
                        <div className="paneladmin_section_left_top_item2">
                            <span className="paneladmin_section_left_top_item2_span">افزدون دوره</span>
                            <FaFolderPlus className="paneladmin_section_left_top_item2_icon" />
                        </div>

                        <Link className='LinkOpload' to={"/PaneAdminOploadVideos"}>
                            <div className="paneladmin_section_left_top_item66">
                                <span className="paneladmin_section_left_top_item66_span">ویرایش دوره</span>
                                <FaUpload className="paneladmin_section_left_top_item66_icon" />
                            </div>
                        </Link>

                        <Link className='LinkOpload' to={"/PaneAdminComments"}>
                            <div className="paneladmin_section_left_top_item3">
                                <span className="paneladmin_section_left_top_item3_span">مدیریت کاربران</span>
                                <FaUserTie className="paneladmin_section_left_top_item3_icon" />
                            </div>
                        </Link>

                    </div>

                    {/* <div className="paneladmin_section_left_bootum">
                        <div className="paneladmin_section_left_bootum_parent_info">
                            <div className="paneladmin_section_left_bootum_parent_info_right">
                                <p className="paneladmin_section_left_bootum_parent_info_right_name">RezaHeydari</p>
                                <p className="paneladmin_section_left_bootum_parent_info_right_role">Owner</p>
                            </div>
                            <div className="paneladmin_section_left_bootum_parent_info_left">
                                <img src="/Image/Courseinfo/1.jpg" className="paneladmin_section_left_bootum_parent_info_left_image" alt="" />
                            </div>
                        </div>
                        <div className="paneladmin_section_left_bootum_SignOut">
                            <span className="paneladmin_section_left_bootum_SignOut_span">خروج از حساب کاربری</span>
                            <PiSignOutBold className="paneladmin_section_left_bootum_SignOut_icon" />
                        </div>
                    </div> */}
                    <div className="paneladmin_section_left_bootum">
                        <div className="paneladmin_section_left_bootum_parent_info">
                            <div className="paneladmin_section_left_bootum_parent_info_right">
                                <p className="paneladmin_section_left_bootum_parent_info_right_name">{infouser.username}</p>
                                <p className="paneladmin_section_left_bootum_parent_info_right_role">{infouser.role}</p>
                            </div>
                            <div className="paneladmin_section_left_bootum_parent_info_left">
                                <img src={`${siteUrl}${infouser.profilePicture}`} className="paneladmin_section_left_bootum_parent_info_left_image" alt="" />
                            </div>
                        </div>
                        <div className="paneladmin_section_left_bootum_SignOut">
                            <span className="paneladmin_section_left_bootum_SignOut_span" onClick={openModalLogout}>خروج از حساب کاربری</span>
                            <PiSignOutBold className="paneladmin_section_left_bootum_SignOut_icon" />
                        </div>
                    </div>

                </div>
            </div>

            <div className='margin_top'>2</div>


            {/* <Outlet></Outlet> */}

        </div>
    )
}
