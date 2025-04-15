import "./PaneAdminComments.css"
import { FaFolderPlus } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"
import { FaCircle } from "react-icons/fa";
import { FaHourglassStart } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { useSite } from "../../apiContext/ApiContext"
import axios from "axios"
import Swal from "sweetalert2";
import ModalLogout from "../../Components/ModalLogout/ModalLogout"
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextWarn from "../../Components/Texts/Warn/TextWarn"
import TextError from "../../Components/Texts/Error/TextError"


export default function PaneAdminComments() {
    const { siteUrl } = useSite()
    const [opensearchRes, setOpensearchRes] = useState(false)
    const [itemResultSearch, setItemResultSearch] = useState("")
    const [showModalRej, setShowModalRej] = useState(false)
    const [showModalAddComment, setShowModalAddComment] = useState(false)
    const refreshToken = Cookies.get("refresh_token")
    const accesstoken = Cookies.get("access_token")
    const [showLoding, setShowLoding] = useState(true)
    const navigate = useNavigate()
    const [commentReject, setCommentReject] = useState("")
    const [commentPending, setCommentPending] = useState("")
    const [valueSesrchCommnent, setValueSesrchCommnent] = useState("")
    const [valueCommnetNameCoursePendingHandle, setValueCommnetNameCoursePendingHandle] = useState("")
    const [valueCommentPendingHandle, setValueCommentPendingHandle] = useState("")
    const [idCommentPendingHandle, setIdCommentPendingHandle] = useState("")
    const [valueRejectCommnet, setValueRejectCommnet] = useState("")
    const [admins, setAdmins] = useState("")
    const [valueSearchUsers, setValueSearchUsers] = useState("")
    const [infoForAddAdmin, setInfoForAddAdmin] = useState("")
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





    function closesearchResult() {
        setOpensearchRes(false)
    }


    function openModalRej() {
        setShowModalRej(true)
    }
    function closeModalRej() {
        setShowModalRej(false)
    }



    function openModalAddCommentd() {
        setShowModalAddComment(true)
    }

    function closeModalAddComment() {
        setShowModalAddComment(false)
    }



    ///گرفتن کامنت های رد شده
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/admin/comments/rejected`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resGetComment) => {

            if (resGetComment.data.status === 200) {
                setCommentReject(resGetComment.data.data)
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
                    setCommentReject("")
                }
            })
    }, [])




    ///گرفتن کامنت های در حال تایید
    useEffect(() => {

        axios.get(`${siteUrl}/api/v1/admin/comments`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resCommnetPending) => {

            if (resCommnetPending.data.status === 200) {
                setCommentPending(resCommnetPending.data.data.result)
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
                setCommentPending("")
            }
        })
    }, [])








    ///سرچ در بین کامنت های دوره 
    //اول سیو مقدار اینپوت سرچ
    function saveValueSearchComment(event) {
        setValueSesrchCommnent(event.target.value)
    }

    ///کلیک روی ایکون سرچ کامنت
    function handleSearchCommnet() {

        const bodySearchComment = {
            "comment": valueSesrchCommnent
        }

        axios.post(`${siteUrl}/api/v1/admin/comments/search`, bodySearchComment, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resSearchCommnet) => {

            if (resSearchCommnet.data.status === 200) {
                setOpensearchRes(true)
                setItemResultSearch(resSearchCommnet.data.data)
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
                    // Swal.fire({ title: "کامنتی مطابق سرچ شما پیدا نشد", icon: "error" })

                    setshowTextError(true);
                    setTitleTextError("ارور")
                    setValueTextError("کامنتی مطابق سرچ شما پیدا نشد")

                }
            })
    }


    ///هندل کردن اطلاعات کامنت در حال تایید برای رد یا تایید
    function setInfoCommnet(infoCommnetPending) {

        setValueCommnetNameCoursePendingHandle(infoCommnetPending.course.courseName)
        setValueCommentPendingHandle(infoCommnetPending.comment)
        setIdCommentPendingHandle(infoCommnetPending.id)
        setOpensearchRes(false)
    }



    ///تایید کامنت 
    function confirmComment() {
        const bodyConfirmCommnet = {
            "CommentID": idCommentPendingHandle,
            "CommentStatus": "approved"
        }
        axios.post(`${siteUrl}/api/v1/admin/comments/confirm`, bodyConfirmCommnet, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resConfirmComment) => {

            setValueCommnetNameCoursePendingHandle("")
            setValueCommentPendingHandle("")
            setIdCommentPendingHandle("")
            setValueSesrchCommnent("")
            if (resConfirmComment.data.status === 202 && resConfirmComment.data.message === "Comment has been approved successfully") {
                // Swal.fire({ title: "کامنت با موفقیت تایید شد", icon: "success" })

                setShowTextSucces(true);
                setTitleText("عملیات موفقیت آمیز")
                setValueText("کامنت با موفقیت تایید شد")

                setCommentPending((prev) => {
                    const filterCommnetPending = prev.filter((ItemCommentPending) => {
                        return ItemCommentPending.courseID !== idCommentPendingHandle
                    })

                    return filterCommnetPending
                })
            }



        }).catch((error) => {

            setValueCommnetNameCoursePendingHandle("")
            setValueCommentPendingHandle("")
            setIdCommentPendingHandle("")
            setValueSesrchCommnent("")
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







    ////رد کردن کامنت 
    //اول سیو کردن دلیل رد کامنت
    function saveValueRejectCommnet(event) {
        setValueRejectCommnet(event.target.value)
    }
    ////حال کلیک روی دکمه تایید

    function rejectCommnet() {
        const bodyrejectComment = {
            "CommentID": idCommentPendingHandle,
            "CommentStatus": "rejected",
            "reason": valueRejectCommnet
        }
        axios.post(`${siteUrl}/api/v1/admin/comments/confirm`, bodyrejectComment, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resRejectComment) => {

            if (resRejectComment.data.status === 200) {
                setShowModalRej(false)
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


    ///گرفتن ادمین ها
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/admin/profile/admin`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resGetAdmins) => {

            if (resGetAdmins.data.status === 200) {
                setAdmins(resGetAdmins.data.data)
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


    //افزودن ادمین
    //اول سیو کردن سرچ کاربران
    function saveValueSearchUsers(event) {
        setValueSearchUsers(event.target.value)
    }
    ///سرچ اطلاعات کاربر
    function findIDUSer() {
        const bodyFineuser = {
            "username": valueSearchUsers
        }

        axios.post(`${siteUrl}/api/v1/admin/profile/user/find`, bodyFineuser, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resFindUser) => {

            if (resFindUser.status === 200) {
                setInfoForAddAdmin(resFindUser.data.data)

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




    ///افزودن ادمین
    function AddAdmin() {
        const bodyAddAdmin = {
            "username": infoForAddAdmin.username
        }

        axios.post(`${siteUrl}/api/v1/admin/profile/admin/add`, bodyAddAdmin, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resAddAdmin) => {

            if (resAddAdmin.data.message === "admin added successfuly") {
                setInfoForAddAdmin("")
                setValueSearchUsers("")
                setShowModalAddComment(false)
                // Swal.fire({ title: "با موفقیت به لیست ادمین ها اضافه شد", icon: "success" })
                
                setShowTextSucces(true);
                setTitleText("عملیات موفقیت آمیز")
                setValueText("با موفقیت به لیست ادمین ها اضافه شد")
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




    ///گرفتن اطلاعات هر کاربر
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/profile`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
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
        <>
            <div className="parentAdminComments">

                {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

                {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}

                {showTextWarn && <TextWarn title={titleTextWarn} text={valueTextWarn}></TextWarn>}


                {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}

                {showLoding && <div className='lodeer2'>
                    <div className="loader2"></div>
                </div>}


                {showModalRej && <div className="modal_reject_comment">
                    <div className="modal_reject_comment_content">
                        <span className="modal_reject_comment_content_titel">رد کامنت</span>
                        <span className="modal_reject_comment_content_titel_input">علت رد شدن کامنت:</span>
                        <textarea name="" className="modal_reject_comment_content_input" onChange={saveValueRejectCommnet} id="" placeholder="علت رد شدن کامنت..."></textarea>
                        <div className="parent_modal_reject_comment_content_btns">
                            <button className="modal_reject_comment_content_btn_cancle" onClick={closeModalRej}>لغو</button>
                            <button className={`modal_reject_comment_content_btn_confirm ${valueRejectCommnet ? "" : "disableBtn"}`} onClick={rejectCommnet}>تایید</button>
                        </div>
                    </div>
                </div>}



                {showModalAddComment && <div className="modal_add_commment">
                    <div className="modal_add_commment_content">
                        <span className="modal_add_commment_content_title">افزودن ادمین</span>

                        <div className="modal_add_commment_content_parent_serach">
                            <input type="" placeholder="جستجو در بین کاربران..." value={valueSearchUsers} onChange={saveValueSearchUsers} className="modal_add_commment_content_serach_input" />
                            <IoSearchSharp className="modal_add_commment_content_serach_icon" onClick={findIDUSer} />
                        </div>


                        {!infoForAddAdmin ? <p className="modal_add_admin_span">هنوز کاربری انتخاب نشده.</p> : <div className="modal_add_commment_content_parent_info">
                            <div className="modal_add_commment_content_info_sec_left">
                                <img src={`${siteUrl}${infoForAddAdmin.profilePicture}`} className="modal_add_commment_content_info_sec_left_img" alt="" />
                                <span className="modal_add_commment_content_info_sec_left_span">{`${infoForAddAdmin.firstName} ${infoForAddAdmin.lastName}`}</span>
                            </div>
                            <div className="modal_add_commment_content_info_sec_right">
                                <span className="modal_add_commment_content_info_sec_right_id">{infoForAddAdmin.username}</span>
                                <span className="modal_add_commment_content_info_sec_right_eamil">{infoForAddAdmin.email}</span>
                            </div>
                        </div>}

                        {/* <div className="modal_add_commment_content_parent_info">
                            <div className="modal_add_commment_content_info_sec_left">
                                <img src="/Image/admin/1.jpg" className="modal_add_commment_content_info_sec_left_img" alt="" />
                                <span className="modal_add_commment_content_info_sec_left_span">محمد مهیاری</span>
                            </div>
                            <div className="modal_add_commment_content_info_sec_right">
                                <span className="modal_add_commment_content_info_sec_right_id">@Mmd467</span>
                                <span className="modal_add_commment_content_info_sec_right_eamil">marlincashter@gmail.com</span>
                            </div>
                        </div> */}

                        <div className="modal_add_commment_content_parent_btns">
                            <button className="modal_add_commment_content_btn_cancle" onClick={closeModalAddComment}>لغو</button>
                            <button className={`modal_add_commment_content_btn_confirm ${infoForAddAdmin ? "" : "disableBtn"}`} onClick={AddAdmin}>تایید</button>
                        </div>
                    </div>
                </div>}




                <div className="parentAdminComments_section_right_middle">

                    <div className="parentAdminComments_section_right">
                        <div className="parentAdminComments_section_right_content">


                            <div className="section_right_content_top">
                                <div className="section_right_content_top_content">
                                    <div className="section_right_content_top_header">
                                        <h2 className="section_right_content_top_header_title">کامنت های رد شده</h2>
                                        <div className="section_right_content_top_header_parent_cion">
                                            <PiWarningCircleFill className="section_right_content_top_header_cion" />

                                        </div>
                                    </div>
                                    <div className="section_right_content_top_parent_items">

                                        {commentReject ? commentReject.map((itemCommentReject, index) => {
                                            return (
                                                <div className="section_right_content_top_item" key={index + 1}>
                                                    <div className="section_right_content_top_item_sec_top">
                                                        <div className="parent_id_item_comment_reject">
                                                            <span className="section_right_content_top_item_sec_top_id">{itemCommentReject.userID}</span>
                                                        </div>
                                                        <p className="section_right_content_top_item_sec_top_content">{itemCommentReject.comment}</p>

                                                    </div>
                                                    <div className="section_right_content_top_item_sec_bot">
                                                        <div className="section_right_content_top_item_sec_bot_sec_left">
                                                            <div className="section_right_content_top_item_sec_bot_sec_left_left">
                                                                <FaCircle className="section_right_content_top_item_sec_bot_sec_left_left_icon" />
                                                            </div>
                                                            <div className="section_right_content_top_item_sec_bot_sec_left_right">
                                                                <span className="section_right_content_top_item_sec_bot_sec_left_right_span1">دوره:</span>
                                                                <span className="section_right_content_top_item_sec_bot_sec_left_right_span2">{itemCommentReject.courseName}</span>
                                                            </div>

                                                        </div>
                                                        <div className="section_right_content_top_item_sec_bot_sec_right">
                                                            <span className="section_right_content_top_item_sec_bot_sec_right_span1">به علت:</span>
                                                            <span className="section_right_content_top_item_sec_bot_sec_right_span2">{itemCommentReject.reason}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }) : <h2 className="section_right_content_top_parent_items_title_reject">! کامنتی وجود ندارد</h2>}



                                    </div>
                                </div>

                            </div>


                            <div className="section_right_content_butoom">
                                <div className="section_right_content_butoom_header">
                                    <h2 className="section_right_content_butoom_header_title">کامنت های در صف تایید</h2>
                                    <div className="section_right_content_butoom_header_parent_icon">
                                        <FaHourglassStart className="section_right_content_butoom_header_icon" />
                                    </div>
                                </div>


                                <div className="section_right_content_butoom_parent_items">
                                    {commentPending ? commentPending.map((ItemCommnetPending, index) => {
                                        return (
                                            <div className="section_right_content_butoom_item" key={index + 1} >
                                                <div className="section_right_content_butoom_item_sec_top">
                                                    <div className="parent_id_comment_waiting">
                                                        <span className="section_right_content_butoom_item_sec_top_id">{ItemCommnetPending.userID}</span>
                                                    </div>
                                                    <p className="section_right_content_butoom_item_sec_top_content">{ItemCommnetPending.comment}</p>
                                                </div>
                                                <div className="section_right_content_butoom_item_sec_bot">
                                                    <div className="section_right_content_butoom_item_sec_bot_sec_left">
                                                        <div className="section_right_content_butoom_item_sec_bot_sec_left_left">
                                                            <FaCircle className="section_right_content_butoom_item_sec_bot_sec_left_left_icon" />
                                                        </div>
                                                        <div className="section_right_content_butoom_item_sec_bot_sec_left_right">
                                                            <span className="section_right_content_butoom_item_sec_bot_sec_left_right_span1">دوره:</span>
                                                            <span className="section_right_content_butoom_item_sec_bot_sec_left_right_span2">{ItemCommnetPending.courseName}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }) : <h2 className="section_right_content_top_parent_items_title_reject">!کامنتی وجود ندارد</h2>}


                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="parentAdminComments_section_middle">
                        <div className="parentAdminComments_section_middle_content">
                            <div className="parentAdminComments_section_middle_content_top">
                                <div className="parentAdminComments_section_middle_content_top_header">
                                    <div className='admincomment_header_parent_shape'>
                                        <span className='admincomment_header_shape1'></span>
                                        <span className='admincomment_header_shape2'></span>
                                        <span className='admincomment_header_shape3'></span>
                                    </div>
                                    <span className="parentAdminComments_section_middle_content_top_title">مدیریت کامنت ها</span>
                                </div>

                                <div className="parentAdminComments_section_middle_content_top_main">
                                    <div className="section_middle_content_parent_search">
                                        <div className="section_middle_content_search_header">
                                            <input type="text" className="section_middle_content_search_header_input" value={valueSesrchCommnent} onChange={saveValueSearchComment} placeholder="جستجو در بین کامنت های در صف تایید..." />
                                            <IoSearchSharp className="section_middle_content_search_header_icon" onClick={handleSearchCommnet} />
                                        </div>

                                        {opensearchRes && <div className="depend_section_middle_content_parent_search">
                                            {itemResultSearch && itemResultSearch.map((itemsResultSearch, index) => {
                                                return (
                                                    <div key={index + 1} className="depend_section_middle_content_parent_search_item" onClick={() => { setInfoCommnet(itemsResultSearch) }}>
                                                        <span className="depend_section_middle_content_parent_search_item_content">{itemsResultSearch.comment}</span>
                                                        <div className="depend_section_middle_content_parent_search_item_parent_id">
                                                            <span className="depend_section_middle_content_parent_search_item_id_title">کاربر:</span>
                                                            <span className="depend_section_middle_content_parent_search_item_id">{itemsResultSearch.userID}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })}


                                        </div>}

                                    </div>


                                    <div className="section_middle_content_section_name">

                                        <div className="depend_section_middle_content_section_name_content">

                                        </div>

                                        <div className="section_middle_content_section_name_content">
                                            <input type="text" value={valueCommnetNameCoursePendingHandle ? valueCommnetNameCoursePendingHandle : "کامنتی انتخاب نشده است."} readOnly className="section_middle_content_section_name_input" />
                                            <FaCircle className={`section_middle_content_section_name_icon ${valueCommnetNameCoursePendingHandle ? "" : "nonCourseSelect"}`} />
                                        </div>

                                    </div>


                                    <div className="section_middle_content_section_valueComment">
                                        <textarea name="" id="" value={valueCommentPendingHandle} className="section_middle_content_section_valueComment_input" placeholder="متحوای کامنت..."></textarea>
                                    </div>
                                    <div className="section_middle_content_section_btns">
                                        <button className={`section_middle__btn_reject ${valueCommnetNameCoursePendingHandle ? "" : "disableBtn"}`} onClick={openModalRej}>رد</button>
                                        <button className={`section_middle__btn_accept ${valueCommnetNameCoursePendingHandle ? "" : "disableBtn"}`} onClick={confirmComment}>تایید</button>
                                    </div>
                                </div>


                            </div>
                            <div className="parentAdminComments_section_middle_content_buttom">

                                <div className="section_right_add_admin">
                                    <div className="section_right_top_add_admin">
                                        <div className='addAdmin_header_parent_shape'>
                                            <span className='addAdmin_header_shape1'></span>
                                            <span className='addAdmin_header_shape2'></span>
                                            <span className='addAdmin_header_shape3'></span>
                                        </div>
                                        <div>
                                            <h2 className="parentAdminComments_section_middle_content_buttom_title">لیست ادمین ها</h2>
                                        </div>
                                    </div>
                                    <div className="section_right_buttom_add_admin">
                                        <button className="section_right_buttom_add_admin_btn" onClick={openModalAddCommentd}>افزدون ادمین </button>
                                    </div>
                                </div>

                                <div className="section_left_add_admin">
                                    <div className="section_left_add_admin_content">

                                        {admins && admins.map((itemAdmin, index) => {
                                            return (
                                                <div className="section_left_add_admin_item" key={index + 1}>
                                                    <img className="section_left_add_admin_item_img" src="/Image/admin/1.jpg" alt="" />
                                                    <span className="section_left_add_admin_item_span">{itemAdmin.username}</span>
                                                </div>
                                            )
                                        })}

                                    </div>
                                </div>


                            </div>

                        </div>
                    </div>
                </div>




                {/* بخش تکراری هر صفحه ادمین */}
                <div className="paneladmin_section_left">
                    <div className="paneladmin_section_left_top">
                        <div className="paneladmin_section_left_top_item1">
                            <div className='paneladmin_section_left_top_item1_right'>
                                <span className="paneladmin_section_left_top_item1_span1">AdminPanel</span>
                                <span className="paneladmin_section_left_top_item1_span2">tanfit</span>
                            </div>
                            <div className="paneladmin_section_left_top_item1_parent_shape">
                                <img src="/Image/IconPanelAdmin/1.png" className='paneladmin_section_left_top_item1_shape' alt="" />
                            </div>
                        </div>


                        <Link to={"/PanelAdminAddCourse"} className="LinkOpload">
                            <div className="paneladmin_section_left_top_item22">
                                <span className="paneladmin_section_left_top_item22_span">افزدون دوره</span>
                                <FaFolderPlus className="paneladmin_section_left_top_item22_icon" />
                            </div>
                        </Link>


                        <Link className='LinkOpload' to={"/PaneAdminOploadVideos"}>
                            <div className="paneladmin_section_left_top_item66">
                                <span className="paneladmin_section_left_top_item66_span">ویرایش دوره</span>
                                <FaUpload className="paneladmin_section_left_top_item66_icon" />
                            </div>
                        </Link>

                        <div className="paneladmin_section_left_top_item33">
                            <span className="paneladmin_section_left_top_item33_span">مدیریت کاربران</span>
                            <FaUserTie className="paneladmin_section_left_top_item33_icon" />
                        </div>
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
                        <div className="paneladmin_section_left_bootum_SignOut" >
                            <span className="paneladmin_section_left_bootum_SignOut_span" onClick={openModalLogout}>خروج از حساب کاربری</span>
                            <PiSignOutBold className="paneladmin_section_left_bootum_SignOut_icon" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}