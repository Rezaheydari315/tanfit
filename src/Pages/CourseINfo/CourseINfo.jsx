import { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header'
import './CourseINfo.css'
import { FaStar } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSite } from '../../apiContext/ApiContext'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
import { BiBookmark } from "react-icons/bi";
import { FaBookmark } from "react-icons/fa";
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextError from "../../Components/Texts/Error/TextError"


export default function CourseINfo() {

      
    const { id } = useParams()
    const { siteUrl } = useSite()
    const [onecourseINFO, setOnecourseINFO] = useState([])
    const [showVidieo, setShowVidieo] = useState(false)
    const [videos, setVideos] = useState([])
    const [showLodindPage, setShowLodindPage] = useState(false)
    const [comment, setComment] = useState([])
    const [textCommnet, setTextCommnet] = useState("")
    const accesstoken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")
    const navigate = useNavigate()
    const [savedCourse, setSavedCourse] = useState(false)

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





    ///گرفتن اطلاعات دوره مورد نظر
    useEffect(() => {
        const idCourse = {
            "courseID": id
        }

        axios.post(`${siteUrl}/api/v1/client/course`, idCourse, { headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" } }).then((resInfoCourse) => {
            //ذخیره داده ها 

            if (resInfoCourse.data.status === 200) {
                setOnecourseINFO(resInfoCourse.data.data)
            }
        }).catch((err) => {

            if (err.response.data.message === "Course not FOund") {
                //هدایت به صفحه خطای 404
                navigate("/Login")
            }
        })
    }, [])






    // /تابع اضافه کردن دوره به سبد خرید 
    function ClickHandleAddToCart() {
        const idAddCourse = {
            "courseID": id
        }
        console.log(idAddCourse)
        axios.post(`${siteUrl}/api/v1/user/carts/add`, idAddCourse, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resAddCourse) => {

                if (resAddCourse.data.message === "Course added to cart successfully") {
                    // Swal.fire({ title: "دوره با موفیقت به سبد خرید اضافه شد ", icon: 'success' })
                    setShowTextSucces(true)
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("دوره با موفیقت به سبد خرید اضافه شد ")
                }
            }).catch((error) => {

                if (error.response.data.message === "Course already added to cart") {
                    // Swal.fire({ title: "این دوره قبلا به سبد خرید اضافه شده است", icon: 'error' })
                    setshowTextError(true)
                    setTitleTextError("اخطار")
                    setValueTextError("این دوره قبلا به سبد خرید اضافه شده است")
                }
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



    ///نمایش ویدیو ها برای کاربرانی که دوره رو خریده اند
    useEffect(() => {
        const idCourseBuy = {
            "courseID": id
        }
        axios.post(`${siteUrl}/api/v1/client/courses/videos`, idCourseBuy, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resVidieo) => {

                if (resVidieo.data.data.PurchasedStatus) {
                    setVideos(resVidieo.data.data.ShowVideos)
                    setShowVidieo(true)
                }
                else if (resVidieo.data.data === 404) {
                    setVideos("")
                    setShowVidieo(true)
                }
                else {
                    setShowVidieo(false)
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




    // /گرفتن کامنت هر کاربر 
    useEffect(() => {
        const IDShowCooment = {
            "courseID": id
        }
        axios.post(`${siteUrl}/api/v1/client/comments`, IDShowCooment, { headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" } }).
            then((responseShowCooment) => {

                if (responseShowCooment.status === 200) {
                    setComment(responseShowCooment.data.data)
                }
            }).catch((err) => {

                if (err.status === 404) {
                    setComment("")
                }
            })
    }, [])



    ////افزودن کامنت توسط کاربر 
    function handleTextComment(event) {
        setTextCommnet(event.target.value)
    }

    function clickHandleAddCommet() {
        if (textCommnet.length <= 0) {
            // Swal.fire({ title: "متن کامنت شما خالی است", icon: 'error' })
            setshowTextError(true)
            setTitleTextError("اخطار")
            setValueTextError("متن کامنت شما خالی است")
        }
        else {
            console.log("کلیک روی دکمه ثبت ")
            const bodyCommnt = {
                "courseID": id,
                "Usercomment": textCommnet
            }
            setTextCommnet("")
            axios.post(`${siteUrl}/api/v1/user/comments/send`, bodyCommnt, {
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
            }).
                then((resAddComment) => {

                    if (resAddComment.status === 200) {
                        // Swal.fire({ title: "کامنت شما با موفقیت ثبت شدو در انتظار تایید است.", icon: "success" })
                        setShowTextSucces(true)
                        setTitleText("عملیات موفقیت آمیز")
                        setValueText("کامنت شما با موفقیت ثبت شدو در انتظار تایید است")

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


    //چک کردن دوره در لیست مورد علاقه ها
    useEffect(() => {
        const bodyCheckSaved = {
            "courseID": id
        }
        axios.post(`${siteUrl}/api/v1/user/favorite/check`, bodyCheckSaved, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resCheckSave) => {

            if (resCheckSave.data.saved) {
                setSavedCourse(true)
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

            if (!err.response.data.saved) {
                setSavedCourse(false)
            }
        })


    }, [])



    ///افزدون دروه به دوره های مورد علاقه
    function addToFavirote() {
        const bodyIdAddFavirote = {
            "courseID": id
        }
        axios.post(`${siteUrl}/api/v1/user/favorite/add`, bodyIdAddFavirote, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` }
        }).then((resAddFaviorte) => {

            if (resAddFaviorte.data.message === "course added to favorite courses") {
                // Swal.fire({ title: "دوره با موفقیت به دوره های پسندیده افزدوه شد.", icon: "success" })
                setShowTextSucces(true)
                setTitleText("عملیات موفقیت آمیز")
                setValueText("دوره با موفقیت به دوره های پسندیده افزدوه شد")

                setSavedCourse(true)
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



    ///پاک کردن از دوره های مورد علاقه 
    function removeToFavirote() {
        const bodyRemoveFavirote = {
            "courseID": id
        }
        axios.delete(`${siteUrl}/api/v1/user/favorite/remove`, { data: bodyRemoveFavirote, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resDeletefavirote) => {
                if (resDeletefavirote.data.message === "course removed from favorite courses") {
                    // Swal.fire({ title: "دوره با موفقیت از دوره های پسندیده حذف شد", icon: "success" })
                    setShowTextSucces(true)
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("دوره با موفقیت از دوره های پسندیده حذف شد")

                    setSavedCourse(false)
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


    return (
        <>
            <Header page={"pageCuurentCourseINFO"}></Header>

            {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

            {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}



            <div className='parent_Courseinfo'>

                {showLodindPage && <div className='lodeer'>
                    <div className="loader"></div>
                </div>}

                <div className='parent_Courseinfo_section_top'>
                    <div className='CourseINfo_top_right_top'>
                        <div className='Courseinfo_header_parent_shape'>
                            <span className='Courseinfo_header_shape1'></span>
                            <span className='Courseinfo_header_shape2'></span>
                            <span className='Courseinfo_header_shape3'></span>
                        </div>
                        <h2 className='CourseINfo_top_right_title'>{onecourseINFO.courseName}</h2>
                    </div>
                    <div className='CourseINfo_top'>

                        <div className='CourseINfo_top_right'>

                            <p className='CourseINfo_top_right_desc'>
                                {onecourseINFO.description}
                            </p>
                            <div className='CourseINfo_buttom'>
                                <div className='CourseINfo_buttom_right'>
                                    <div className='CourseINfo_buttom_right_parent_teacher'>
                                        <span className='CourseINfo_buttom_right_teacher_title'>مدرس:</span>
                                        <span className='CourseINfo_buttom_right_teacher_name'>{onecourseINFO.instructor}</span>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className='CourseINfo_left'>
                            <img src={`${siteUrl}${onecourseINFO.media}`} alt="" className='CourseINfo_left_image' />
                            <button className='CourseINfo_left_btn' onClick={ClickHandleAddToCart}>افزودن به سبد خرید</button>
                            <div className='CourseINfo_buttom_left'>
                                <div className='CourseINfo_buttom_left_parent_star'>
                                    {!savedCourse ?
                                        <BiBookmark className='CourseINfo_buttom_left_star_icon' onClick={addToFavirote} />
                                        : <FaBookmark className='CourseINfo_buttom_left_star_icon1' onClick={removeToFavirote} />
                                    }

                                </div>
                                <div className='CourseINfo_buttom_left_parent_users'>
                                    <span className='CourseINfo_buttom_left_users_numb'>124</span>
                                    <HiMiniUsers className='CourseINfo_buttom_left_users_icon' />
                                </div>
                                <div className='CourseINfo_buttom_left_parent_price'>
                                    <span className='CourseINfo_buttom_left_price_numb'>{onecourseINFO.price}</span>
                                    <span className='CourseINfo_buttom_left_price_span'>تومان</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='parent_Courseinfo_section_content'>
                    <div className='COurseinfo_section_content_top'>
                        <div className='courseinfoContent_header_parent_shape'>
                            <span className='courseinfoContent_header_shape1'></span>
                            <span className='courseinfoContent_header_shape2'></span>
                            <span className='courseinfoContent_header_shape3'></span>
                        </div>
                        <h2 className='COurseinfo_section_content_top_titel'>محتوای دوره</h2>
                    </div>
                    {!showVidieo && <span className='parent_Courseinfo_section_content_noFilm'>لطفا دوره را خریداری کنید.</span>}

                    {showVidieo && <div className='parent_Courseinfo_section_content_items'>

                        {showVidieo && videos && videos.map((videoItem, index) => {
                            return (
                                <div className='parent_Courseinfo_section_content_item' key={index + 1}>
                                    <video src={`${siteUrl}${videoItem.address}`} controls alt="" className='parent_Courseinfo_section_content_item_img' />
                                </div>
                            )
                        })}


                    </div>}
                    {!videos && <span className='parent_Courseinfo_section_content_noFilm'>ویدیویی برای این دوره ضبط نشده است.</span>}

                </div>


                <div className='parent_Courseinfo_section_comment'>
                    <div className='Courseinfo_section_comment_right_top'>
                        <div className='courseinfoContent_comment_parent_shape'>
                            <span className='courseinfoContent_comment_shape1'></span>
                            <span className='courseinfoContent_comment_shape2'></span>
                            <span className='courseinfoContent_comment_shape3'></span>
                        </div>
                        <h2 className='parent_Courseinfo_section_comment_right_title'>نظرات</h2>
                    </div>
                    <div className='parent_Courseinfo_section_comment_right_left'>
                        <div className='parent_Courseinfo_section_comment_right'>

                            {comment ? comment.map((ItemsComment, index) => {

                                return (
                                    <div className='Courseinfo_section_comment_right_item' key={index + 1}>
                                        <div className='Courseinfo_section_comment_right_item_header'>
                                            <div className='Courseinfo_section_comment_right_item_header_right'>
                                                <img src={`${siteUrl}${ItemsComment.user.profilePicture}`} className='Courseinfo_section_comment_right_item_header_image' alt="" />
                                            </div>
                                            <div className='Courseinfo_section_comment_right_item_header_left'>
                                                <p className='Courseinfo_section_comment_right_item_header_left_name'>{ItemsComment.user.firstName} {ItemsComment.user.lastName}</p>
                                                <p className='Courseinfo_section_comment_right_item_header_left_date'>{ItemsComment.created_at.slice(0, 10)}</p>
                                            </div>
                                        </div>
                                        <p className='Courseinfo_section_comment_right_item_CONTENT'>{ItemsComment.comment}</p>
                                    </div>
                                )
                            }) : <p className='Courseinfo_section_comment_right_item_span'>هیچ کامنتی برای این دوره وجود ندارد!</p>}






                        </div>
                        <div className='parent_Courseinfo_section_comment_left'>
                            <button className='parent_Courseinfo_section_comment_left_btn' onClick={clickHandleAddCommet}>ثبت نظر</button>
                            <textarea name="" value={textCommnet} className='parent_Courseinfo_section_comment_left_input' onChange={handleTextComment} placeholder='نظر خود را درباره دوره مورد نظر بنویسید' id=""></textarea>
                        </div>
                    </div>

                </div>
            </div>
        </>

    )
}