import "./PanelUserfavoriteCourse.css"
import Footer from "../../Components/Footer/Footer"
import Header from "../../Components/Header/Header"
import { HiOutlineUsers } from "react-icons/hi2";
import { BiBookmark } from "react-icons/bi";
import { PiShoppingCartThin } from "react-icons/pi";
import { FaRegComments } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSite } from '../../apiContext/ApiContext';
import Cookies from 'js-cookie'
import ModalLogout from "../../Components/ModalLogout/ModalLogout"



export default function PanelUserfavoriteCourse() {
    const [closeItemsSideBar, setCloseItemsSideBar] = useState(false)
    const navigate = useNavigate()
    const [modalIncompletepurchase, setModalIncompletepurchase] = useState(false)
    const { siteUrl } = useSite()
    const refreshToken = Cookies.get("refresh_token")
    const accesstoken = Cookies.get("access_token")
    const [coursesFavorite, setCoursesFavorite] = useState("")
    const [showModalLougout, setShowModalLougout] = useState(false)



    //بستن و باز کردن سایدبار کنار
    function closeItemSideBar() {
        setCloseItemsSideBar(!closeItemsSideBar)
    }

    //هدایت به صفحه دوره های خریداری شده
    function naviTOBUYCourse() {
        navigate("/PanelUserpurchasedCourse")
    }

    //رفتن به صفحه وضعیت کامنت ها
    function naviTOCommnet() {
        navigate("/PanelUserComment")
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


    ///گرفتن دوره های مورد علاقه
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/favorite`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accesstoken}`,
                "ngrok-skip-browser-warning": "true"
            }
        }).then((resCourseFavorite) => {
            
            if (resCourseFavorite.status === 200) {
                setCoursesFavorite(resCourseFavorite.data.data)
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
                setCoursesFavorite("")
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

            <div className="parent_userPanel1">
                <Header></Header>
                {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}

                <div className="parent_sectionleftRight_userPanel1">
                    <div className="section_right1">
                        <div className="section_right1_top_userpanel">
                            <div className='userpanel_header_parent_shape'>
                                <span className='userpanel_header_shape11'></span>
                                <span className='userpanel_header_shape22'></span>
                                <span className='userpanel_header_shape33'></span>
                            </div>
                            <div>
                                <h2 className="section_right1_title">دوره های پسندیده</h2>
                            </div>
                        </div>
                        <div className="userpanel_section_right1_parent_items">


                            {coursesFavorite ? coursesFavorite.map((ItemCourses,index) => {

                                return (
                                    <Link to={`/Course/${ItemCourses.courseID}`}>
                                        <div className="userpanel_section_right1_item" key={index+1}>
                                            <div className="parent_section_right1_item_img">
                                                <img src={`${siteUrl}${ItemCourses.media}`} className="section_right1_item_img" alt="" />
                                            </div>
                                            <div className="section_right1_item_section_buttom">
                                                <span className="section_right1_item_section_buttom_title">{ItemCourses.courseName}</span>
                                                <span className="section_right1_item_section_buttom_desc">{ItemCourses.description}</span>
                                                <div className="section_right1_item_section_buttom_parent_nameTeachr">
                                                    <span className="section_right1_item_section_buttom_span">مدرس:</span>
                                                    <span className="section_right1_item_section_buttom_name_teacher">{ItemCourses.instructor}</span>
                                                </div>
                                                <div className="section_right1_item_section_buttom_parent_price_users">
                                                    <div className="section_right1_item_section_buttom_parent_users">
                                                        <HiOutlineUsers className="section_right1_item_section_buttom_users_icon" />
                                                        <span className="section_right1_item_section_buttom_users_number">94</span>
                                                    </div>
                                                    <div className="section_right1_item_section_buttom_parent_price">
                                                        <span className="section_right1_item_section_buttom_price_number">{ItemCourses.price}</span>
                                                        <span className="section_right1_item_section_buttom_price_span">تومان</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : <p className="userpanel_section_right_parent_items_span">هیچ دوره ای یافت نشد!</p>}

                        </div>
                    </div>








                    <div className="section_left1">
                        <div className="depend_section_left1" onClick={closeItemSideBar}>
                            <IoIosArrowForward className={`depend_section_left1_icon ${closeItemsSideBar ? "rotate" : ""}`} />
                        </div>
                        <div className="section_left1_header_top">
                            <div className="section_left1_header_top_section_left1">
                            </div>

                            {!closeItemsSideBar && <div className="section_left1_header_top_section_right">
                                <span className="section_left1_header_top_section_right_span1">tanfit</span>
                                <span className="section_left1_header_top_section_right_span2">UserPanel</span>
                            </div>}


                        </div>

                        <div className="section_left1_favorite_course">
                            <BiBookmark className="section_left1_favorite_course_icon" />

                            {!closeItemsSideBar && <span className="section_left1_favorite_course_span">دوره های پسندیده</span>}
                        </div>
                        <div className="section_left1_buy_course" onClick={naviTOBUYCourse}>
                            <PiShoppingCartThin className="section_left1_buy_course_icon" />
                            {!closeItemsSideBar && <span className="section_left1_buy_course_span">دوره های خریداری شده</span>
                            }
                        </div>
                        <div className="section_left1_comment" onClick={naviTOCommnet}>
                            <FaRegComments className="section_left1_comment_icon" />

                            {!closeItemsSideBar && <span className="section_left1_comment_span">وضعیت کامنت ها</span>}
                        </div>

                        <div className="section_left1_information" onClick={naviTOInfo}>
                            <FaRegUser className="section_left1_information_icon" />

                            {!closeItemsSideBar && <span className="section_left1_information_span">اطلاعات کاربری</span>}
                        </div>


                        {/* <div className="section_left1_pending_buy" onClick={openModalIncomBuy}>
                            <FaClockRotateLeft className="section_left1_pending_buy_icon" />
                            {!closeItemsSideBar && <span className="section_left1_pending_buy_span">خرید در صف</span>}
                        </div> */}
                        <div className="section_left1_LogOut">
                            <FiLogOut className="section_left1_LogOut_icon" onClick={openModalLogout} />

                            {!closeItemsSideBar && <span className="section_left1_LogOut_span" onClick={openModalLogout}>خروج از حساب کاربری</span>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}