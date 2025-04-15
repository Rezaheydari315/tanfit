import "./PanelUserComment.css"
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
import axios from "axios";
import { useSite } from '../../apiContext/ApiContext';
import Cookies from 'js-cookie'
import ModalLogout from "../../Components/ModalLogout/ModalLogout"


export default function PanelUserComment() {
    const [closeItemsSideBar, setCloseItemsSideBar] = useState(false)
    const navigate = useNavigate()
    const [modalIncompletepurchase, setModalIncompletepurchase] = useState(false)
    const { siteUrl } = useSite()
    const refreshToken = Cookies.get("refresh_token")
    const accesstoken = Cookies.get("access_token")
    const [commentReject, setCommentReject] = useState("")
    const [allComment, setAllComment] = useState("")
    const [commentpending, setCommentpending] = useState("")
    const [showModalLougout, setShowModalLougout] = useState(false)

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
    //هدایت به صفحه اطلاعات
    function naviTOInfo() {
        navigate("/PanelUserInfo")
    }

    //باز کردن مدال تایید خرید
    function openModalIncomBuy() {
        setModalIncompletepurchase(true)
    }
    //بستن مدال تایید خرید
    function closeModalIncomBuy() {
        setModalIncompletepurchase(false)
    }




    ///گرفتن کامنت های رد شده
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/comments/rejected`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accesstoken}`
            }
        })
            .then((resGetCommentReject) => {
                if (resGetCommentReject.status === 200) {
                    setCommentReject(resGetCommentReject.data.data)
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
                                    if(resi5.status===200){
                                         Cookies.set('access_token', resi5.data.accessToken)
                                    }else{
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



    ///گرفتن کل کامنتا
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/comments`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resGetAllComment) => {
            
            setAllComment(resGetAllComment.data.data)
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
                                if(resi5.status===200){
                                     Cookies.set('access_token', resi5.data.accessToken)
                                }else{
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
                setAllComment("")
            }
        })
    }, [])



    ////گرفتن کامنت های در صف تایید
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/comments/pending`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resGetPendingComment) => {
           
            if (resGetPendingComment.status === 200) {
                setCommentpending(resGetPendingComment.data.data)
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
                                if(resi5.status===200){
                                     Cookies.set('access_token', resi5.data.accessToken)
                                }else{
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
                setCommentpending("")
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

            {modalIncompletepurchase &&
                <div className="modal_purchase_incomplete">
                    <div className="modal_purchase_incomplete_content">
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
                        <div className="modal_change_incom_buy_section_btns">
                            <button className="modal_change_incom_buy_section_btn_cancle" onClick={closeModalIncomBuy}>لغو خرید</button>
                            <button className="modal_change_incom_buy_section_btn_confirm">ادامه خرید</button>
                        </div>
                    </div>
                </div>
            }
            <div className="panel_user">
                <Header></Header>
                {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}
                <div className="parent_section_left_right_panel_user">

                    <div className="section_right3">
                        <div className="section_right3_top_userpanel">
                            <div className='userpanel_header_parent_shape'>
                                <span className='userpanel_header_shape111'></span>
                                <span className='userpanel_header_shape222'></span>
                                <span className='userpanel_header_shape333'></span>
                            </div>
                            <div>
                                <h2 className="section_right3_title">وضعیت کامنت ها</h2>
                            </div>
                        </div>
                        <div className="section_right3_buttom_userpanel">
                            <div className="section_right3_buttom_userpanel_right">
                                <div className="section_right3_buttom_userpanel_right_header">
                                    <span className="section_right3_buttom_userpanel_right_header_span">کامنت های شما</span>
                                    <div className="section_right3_buttom_userpanel_right_header_parent_icon">
                                        <FaComments className="section_right3_buttom_userpanel_right_header_icon" />
                                    </div>
                                </div>
                                <div className="section_right3_buttom_userpanel_right_parent_items">
                                    {allComment ? allComment.map((ItemAllComment, index) => {
                                        return (
                                            <div className="section_right3_buttom_userpanel_right_parent_item" key={index + 1}>

                                                <span className="section_right3_buttom_userpanel_right_item_content">{ItemAllComment.content}</span>


                                                <div className="section_right3_buttom_userpanel_right_item_parent_nameCourse">
                                                    <div className="section_right3_buttom_userpanel_right_item_nameCourse_spans">
                                                        <span className="section_right3_buttom_userpanel_right_item_nameCourse_span1">دوره:</span>
                                                        <span className="section_right3_buttom_userpanel_right_item_nameCourse_span2">{ItemAllComment.course.courseName}</span>
                                                    </div>
                                                    <FaCircle className="section_right3_buttom_userpanel_right_item_nameCourse_icon" />
                                                </div>
                                            </div>
                                        )
                                    }) : <p className="section_right3_userpanel_left_buttom_parent_items_span">هیچ کامنتی وجود ندارد!</p>}





                                   



                                </div>
                            </div>
                            <div className="section_right3_userpanel_left">
                                <div className="section_right3_userpanel_left_top">
                                    <div className="section_right3_userpanel_left_top_header">
                                        <span className="section_right3_userpanel_left_top_header_titel">کامنت های در صف تایید</span>
                                        <div className="section_right3_userpanel_left_top_header_parent_icon">
                                            <FaHourglassStart className="section_right3_userpanel_left_top_header_icon" />
                                        </div>
                                    </div>
                                    <div className="section_right3_userpanel_left_top_parent_items">
                                        {commentpending ? commentpending.map((ItemCommentsPending, index) => {
                                            return (
                                                <div className="section_right3_userpanel_left_top_item" key={index + 1}>
                                                    <div className="section_right3_userpanel_left_top_item_header">
                                                        <span className="section_right3_userpanel_left_top_item_header_span">{ItemCommentsPending.comment}</span>
                                                        <FaCircle className="section_right3_userpanel_left_top_item_header_icon"></FaCircle>
                                                    </div>
                                                    <div className="section_right3_userpanel_left_top_item_nameCourse">
                                                        <div className="section_right3_userpanel_left_top_item_spans">
                                                            <span className="section_right3_userpanel_left_top_item_nameCourse_span1">دوره:</span>
                                                            <span className="section_right3_userpanel_left_top_item_nameCourse_span2">{ItemCommentsPending.course.courseName}</span>
                                                        </div>
                                                        <FaCircle className="section_right3_userpanel_left_top_item_nameCourse_icon" />
                                                    </div>
                                                </div>
                                            )

                                        }) : <p className="section_right3_userpanel_left_buttom_parent_items_span">هیچ کامنتی وجود ندارد!</p>}



                                         




                                    </div>
                                </div>

                                <div className="section_right3_userpanel_left_buttom">
                                    <div className="section_right3_userpanel_left_buttom_header">
                                        <span className="section_right3_userpanel_left_buttom_header_title">کامنت های رد شده</span>
                                        <div className="section_right3_userpanel_left_buttom_header_parent_icon">
                                            <PiWarningCircleFill className="section_right3_userpanel_left_buttom_header_icon" />
                                        </div>
                                    </div>
                                    <div className="section_right3_userpanel_left_buttom_parent_items">
                                        {commentReject ? commentReject.map((itemComRej, index) => {
                                            return (
                                                <div className="section_right3_userpanel_left_buttom_parent_item" key={index + 1}>
                                                    <span className="section_right3_userpanel_left_buttom_parent_item_title">{itemComRej.comment}</span>
                                                    <div className="section_right3_userpanel_left_buttom_parent_item_section_buttom">
                                                        <div className="section_right3_userpanel_left_buttom_parent_item_section_buttom_season">
                                                            <span className="section_right3_userpanel_left_buttom_parent_item_section_buttom_season_span1">به علت:</span>
                                                            <span className="section_right3_userpanel_left_buttom_parent_item_section_buttom_season_span2">{itemComRej.reason}</span>
                                                        </div>
                                                        <div className="section_right3_userpanel_left_buttom_parent_item_section_buttom_nameCOurse">
                                                            <div className="section_right3_userpanel_left_buttom_parent_item_section_buttom_nameCOurse_spans">
                                                                <span className="section_right3_userpanel_left_buttom_parent_item_section_buttom_nameCOurse_span1">دوره:</span>
                                                                <span className="section_right3_userpanel_left_buttom_parent_item_section_buttom_nameCOurse_span2">{itemComRej.courseName}</span>
                                                            </div>
                                                            <FaCircle className="section_right3_userpanel_left_buttom_parent_item_section_buttom_icon" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }) : <p className="section_right3_userpanel_left_buttom_parent_items_span">هیچ کامنتی یافت نشد!</p>}










                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="section_left3">
                        <div className="depend_section_left3" onClick={closeItemSideBar}>
                            <IoIosArrowForward className={`depend_section_left3_icon ${closeItemsSideBar ? "rotate" : ""}`} />
                        </div>
                        <div className="section_left3_header_top">
                            <div className="section_left3_header_top_section_left3">
                            </div>

                            {!closeItemsSideBar && <div className="section_left3_header_top_section_right">
                                <span className="section_left3_header_top_section_right_span1">tanfit</span>
                                <span className="section_left3_header_top_section_right_span2">UserPanel</span>
                            </div>}


                        </div>

                        <div className="section_left3_favorite_course" onClick={naviTOFavi}>
                            <BiBookmark className="section_left3_favorite_course_icon" />

                            {!closeItemsSideBar && <span className="section_left3_favorite_course_span">دوره های پسندیده</span>}
                        </div>
                        <div className="section_left3_buy_course" onClick={naviTOBuy}>
                            <PiShoppingCartThin className="section_left3_buy_course_icon" />
                            {!closeItemsSideBar && <span className="section_left3_buy_course_span">دوره های خریداری شده</span>
                            }
                        </div>
                        <div className="section_left3_comment">
                            <FaRegComments className="section_left3_comment_icon" />

                            {!closeItemsSideBar && <span className="section_left3_comment_span">وضعیت کامنت ها</span>}
                        </div>

                        <div className="section_left3_information" onClick={naviTOInfo}>
                            <FaRegUser className="section_left3_information_icon" />

                            {!closeItemsSideBar && <span className="section_left3_information_span">اطلاعات کاربری</span>}
                        </div>

                        {/* 
                        <div className="section_left3_pending_buy" onClick={openModalIncomBuy}>
                            <FaClockRotateLeft className="section_left3_pending_buy_icon" />

                            {!closeItemsSideBar && <span className="section_left3_pending_buy_span">خرید در صف</span>}
                        </div> */}

                        <div className="section_left3_LogOut">
                            <FiLogOut className="section_left3_LogOut_icon" onClick={openModalLogout} />
                            {!closeItemsSideBar && <span className="section_left3_LogOut_span" onClick={openModalLogout}>خروج از حساب کاربری</span>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>



    )
}