import { useEffect, useRef, useState } from 'react';
import './Header.css'
import { TfiMenuAlt } from "react-icons/tfi";
import { MdOutlinePhone } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { SlBasket } from "react-icons/sl";
import { IoMdMenu } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { FaD, FaGun, FaRegCircleUser } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import Switch from 'react-switch'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { IoBasketOutline } from "react-icons/io5";
import Cookies from 'js-cookie'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSite } from "../../apiContext/ApiContext"


export default function Header({ page, hanldelScrolAboutMe, hanldelScrolCourses, handleClickSearch }) {

    const [showmodalProf, setShowmodalProf] = useState(false)
    const [checked, setChecked] = useState(false)
    const [showmenuSidbar, setShowmenuSidbar] = useState(false)
    const menuRef = useRef(null)
    const profRef = useRef(null)
    const [pageCuurenthome, setPageCuurenthome] = useState(false)
    const [pageCuurentCart, setPageCuurentCart] = useState(false)
    const [pageCuurentCourseINFO, setPageCuurentCourseINFO] = useState(false)
    const [showsidbar, setShowsidbar] = useState(false)
    const [handlevalueThem, setHandlevalueThem] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [infouser, setInfouser] = useState("")
    const { siteUrl } = useSite()

    let accesstoken = Cookies.get("access_token")
    let refreshToken = Cookies.get("refresh_token")
    
    


    function handleGotoPageSignup() {
        navigate("/Signup")
    }

    function handleGotoPageLogin() {
        navigate("/Login")
    }

    //هندل کردن صفحه موجود برای تنظین هدر 
    useEffect(() => {
        if (page === "pageHome") {
            setPageCuurenthome(true)

        }
        else {
            setPageCuurenthome(false)

        }
        if (page === "pageCart") {
            setPageCuurentCart(true)

        }
        else {
            setPageCuurentCart(false)

        }
        if (page === "pageCuurentCourseINFO") {
            setPageCuurentCourseINFO(true)

        } else {
            setPageCuurentCourseINFO(false)

        }
    }, [page])




    // handleShowSidbar
  
    function showSidbar() {
        setShowsidbar(true)
    }
    function closeSidbar() {
        setShowsidbar(false)
    }



    //Logout
    function Logout() {
        console.log("خارج شدن")
    }


    function showModalProff() {
        setShowmodalProf(!showmodalProf)
    }

    function closeModalProfile() {
        setShowmodalProf(false)
    }

    function landelShowmenu() {
        setShowmenuSidbar(!showmenuSidbar)
    }

    function handleChangeInput() {
        setChecked(!checked)
    }
    function handleChange(nextChecked) {
        setChecked(nextChecked)
    }


    //

    function handleGotoAboutMe() {
        navigate("/Home#information")
    }

    function handleSendAboutMe() {
        // page==="pageHome" ? hanldelScrolAboutMe :console.log("صفحه اصلی نیست")
        if (page === "pageHome") {
            hanldelScrolAboutMe()
        } else {
            handleGotoAboutMe()
        }
        setShowmenuSidbar(false)
    }

    //
    function handleClickSeachOtherPage() {
        navigate("/Home#Search")
    }

    function hanldelScrolCoursesOtherPage() {
        setShowmenuSidbar(false)
        navigate("/Home#Courses")
    }

    function handleClickSecAbout() {
        setShowmenuSidbar(false)
        if (page === "pageHome") {
            hanldelScrolCourses()
        } else {
            hanldelScrolCoursesOtherPage()
        }
    }





    // کلیک کردن روی ویندو و بستن سایدبار
    window.addEventListener('click', function (event) {

        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowmenuSidbar(false)
        } else { '' }

        //اگر لازم بود با کلیک روی صفحه این منو پروفایل هم بسته بشه اینو اضافه کن 
        if (profRef.current && !profRef.current.contains(event.target)) {
            setShowmodalProf(false)
        }
    })


    function handlePagesignup() {
        navigate("/Signup")
    }

    function handlePageLogin() {
        navigate("/Login")
    }



    ///گرفتن اطلاعات هر کاربر
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/user/profile`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}`,"ngrok-skip-browser-warning": "true" }
        }).then((resGetInfoUser) => {
            
            if (resGetInfoUser.data.message==="User profile retrieved successfully"){
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
                    setInfouser("")
                }
            })
    }, [])


    ///رفتن به صفحه پروفایل 
    function pageProfole() {
        navigate("/PanelUserInfo")
    }


    return (
        <>
            <div className='parent_header'>
                <div className='section_header_effect'></div>
                <div className='Container'>
                    <div className='header'>
                        <div className='parent_menu' ref={menuRef}>
                            <IoMdMenu className='menu_icon' onClick={landelShowmenu} />
                            {showmenuSidbar && <div className='menu_depend'>
                                {accesstoken ?
                                    <div className='menu_depend_sectionTop_profile' onClick={pageProfole}>
                                        <div className='menu_depend_sectionTop_profile_right'>
                                            <img src="/Image/header_profile/profile.png" className='menu_depend_sectionTop_profile_right_img' alt="" />
                                        </div>
                                        <div className='menu_depend_sectionTop_profile_left'>
                                            <p className='menu_depend_sectionTop_profile_left_name'>{infouser.firstName}{infouser.lastName}</p>
                                            <p className='menu_depend_sectionTop_profile_left_role'>{`${infouser.role==="User"?"کاربر":"ادمین"}`}</p>
                                        </div>
                                    </div>
                                    : <div className='menu_depend_parentBtn_sign_login'>
                                        <button className='menu_depend_Btnsign' onClick={handleGotoPageSignup}>ثبت نام</button>
                                        <button className='menu_depend_BtnLogin' onClick={handleGotoPageLogin}>ورود</button>
                                    </div>
                                }

                                <Link to="/Home" className='Link_cart'>
                                    <div className={`menu_depend_Section_home ${page === "pageHome" ? "menu_depend_page_Current" : ""}`}>
                                        <IoHomeOutline className='menu_depend_Section_home_icon'></IoHomeOutline>
                                        <span className='menu_depend_Section_home_title'>خانه</span>
                                    </div>
                                </Link>


                                <Link to='/ShopingCart' className='Link_cart'>
                                    <div className={`menu_depend_Section_basket ${page === "pageCart" ? "menu_depend_page_Current" : ""}`}>
                                        <SlBasket className='menu_depend_Section_basket_icon'></SlBasket>
                                        <span className='menu_depend_Section_basket_title'>سبد خرید</span>
                                    </div>
                                </Link>

                                <div className='menu_depend_Section_aboutme' onClick={handleSendAboutMe}>
                                    <MdOutlinePhone className='menu_depend_Section_aboutme_icon'></MdOutlinePhone>
                                    <span className='menu_depend_Section_aboutme_title'>درباره ما</span>
                                </div>

                                <div className='menu_depend_section_Course' onClick={handleClickSecAbout}>
                                    <TfiMenuAlt className='menu_depend_Section_Course_icon'></TfiMenuAlt>
                                    <span className='menu_depend_Section_Course_title'> دوره ها</span>
                                </div>



                            </div>}

                        </div>
                        <div className='header_parent_btn_course_aboutme'>

                            {accesstoken ?
                                <div className='profile' ref={profRef}>
                                    <img src="/Image/header_profile/profile.png" className='profile_image_main' onClick={showModalProff} alt="" />
                                    {showmodalProf && <div className='profile_depend'>
                                        <div className='profile_depend_sectionTop'>
                                            <div className='profile_depend_sectionTop_rigth'>
                                                <div className='profile_depend_sectionTop_rigth_SectionIamge'>
                                                    <img src="/Image/header_profile/profile.png" className='profile_depend_sectionTop_rigth_Iamge' alt="" />
                                                </div>
                                                <div className='profile_depend_sectionTop_rigth_title'>
                                                    <p className='profile_depend_sectionTop_rigth_name'>{infouser.firstName} {infouser.lastName}</p>
                                                    <p className='profile_depend_sectionTop_rigth_role'>{`${infouser.role==="User"?"کاربر":"ادمین"}`}</p>
                                                </div>
                                            </div>
                                            <div className='profile_depend_sectionTop_left' onClick={closeModalProfile}>
                                                <IoMdCloseCircle className='profile_depend_sectionTop_left_icon' />
                                            </div>
                                        </div>
                                        <Link to='/PanelUserInfo' className='Link_cart'>
                                            <div className='profile_depend_section_profile'>
                                                <FaRegCircleUser className='profile_depend_section_profile_icon' />
                                                <span className='profile_depend_section_profile_title'>پروفایل</span>
                                            </div>
                                        </Link>


                                        <Link to='/PanelUserpurchasedCourse' className='Link_cart'>
                                            <div className="profile_depend_section_basket">
                                                <IoBasketOutline className='profile_depend_section_basket_icon'></IoBasketOutline>
                                                <span className='profile_depend_section_basket_title'>دوره های خریداری شده</span>
                                            </div>
                                        </Link>

                                    </div>}
                                </div>

                                : <div className='header_parent_btn_login_signup'>
                                    <span className='header_btn_signup' onClick={handlePagesignup}>ثبت نام </span>

                                    <span className='header_btn_login' onClick={handlePageLogin}>ورود</span>
                                </div>}



                            <Link to="/Home" className='Link_cart'>
                                <div className={`header_parent_home ${page === "pageHome" ? "backGroundPageCuurent" : ""}`}>
                                    <span className='header_home_title'>خانه</span>
                                    <IoHomeOutline className='header_home_icon' />
                                </div>
                            </Link>




                            <div className='header_parent_course' onClick={handleClickSecAbout}>
                                <span className='header_course_title'>دوره ها</span>
                                <TfiMenuAlt className='header_course_icon' />
                            </div>


                            <div className='header_parent_aboutWe' onClick={handleSendAboutMe}>
                                <span className='header_aboutWe_title'>درباره ما</span>
                                <MdOutlinePhone className='header_aboutWe_icon' />
                            </div>
                        </div>

                        <div className='header_parent_search' onClick={page === "pageHome" ? handleClickSearch : handleClickSeachOtherPage}>
                            <input type="text" className='header_search_input' placeholder='جستجو در بین دوره ها' />
                            <IoSearch className='header_search_icon' />
                        </div>


                        <div className='header_parent_them_shopCart'>
                            <Link to="/ShopingCart" className='Link_cart'>
                                <div className={`header_parent_shopCart ${page === "pageCart" ? "backGroundPageCuurent" : ""}`}>
                                    <span className='header_shopCart_title'>سبد خرید</span>
                                    <SlBasket className='header_shopCart_icon' />
                                </div>
                            </Link>
                        </div>

                        <div className='header_section_green'></div>
                    </div>
                </div>
            </div>
        </>
    )
}