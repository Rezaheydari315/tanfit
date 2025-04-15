import './Footer.css'
import { LuSend } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { AiOutlineCopyright } from "react-icons/ai";
import axios from "axios";
import { useSite } from "../../apiContext/ApiContext";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';

export default function Footer() {

    const { siteUrl } = useSite()
    const [course, setCourse] = useState([])
    const [filtercourse, setFiltercourse] = useState([])
    const [filterCourseSugetion, setFilterCourseSugetion] = useState([])
    const navigate = useNavigate()


    ///گرفتن کل داده ها
    useEffect(() => {
        const bodyGet = {
            "GetCourse": true,
            "page": 1,
            "limit": 10
        }
        
        axios.post(`${siteUrl}/api/v1/client/search`, bodyGet, {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            }
        }).then((resi) => {
            
            if (resi.data) {
                setCourse(resi.data.data)
                setFiltercourse(resi.data.data)
            }

        })
            .catch(err => {
                
            })
    }, [])

    
    //فیلتر کردن برا نمایش دوره های پیشنهادی
    useEffect(() => {
        const filt = filtercourse.slice(0, 3)
        setFilterCourseSugetion(filt)
    }, [filtercourse])



    ///هدایت به صفحه جزئیات دوره
    function pageCourseInfo(idCourse) {
        navigate(`/Course/${idCourse}`)
    }


    function GitReza() {
        window.location.href = "https://github.com/Rezaheydari315"
    }

    function GitMehadi() {
        window.location.href = "https://github.com/mahdisaghi1"
    }

    return (
        <>
            <div className='Parent_Footer'>
                <div className='Footer'>
                    <div className='parent_footer_right_left'>
                        <div className='Footer_right'>
                            <h2 className='Footer_right_title'>با <span className='Footer_right_title_bold'>تن فیت</span> بدنتو هیمن امروز بساز</h2>
                            <div className='Footer_right_parent_shape_span'>
                                <div className='footer_parent_shape'>
                                    <span className='footer_shape1'></span>
                                    <span className='footer_shape2'></span>
                                    <span className='footer_shape3'></span>
                                </div>
                                <span className='Footer_right_shape_span'>درباره تن فیت:</span>
                            </div>
                            <p className='Footer_right_description'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولو
                                ژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت ،</p>
                        </div>
                        <div className='Footer_left'>
                            <div className='Footer_left_sec_right'>
                                <h2 className='Footer_left_sec_right_title'>دوره های پیشنهادی</h2>
                                <ul className='Footer_left_sec_right_List'>

                                    {filterCourseSugetion && filterCourseSugetion.map((ItemCourses,index)=>{
                                          return(
                                            <li key={index+1} onClick={()=>{pageCourseInfo(ItemCourses.courseID)}} className='Footer_left_sec_right_List_item'>{ItemCourses.courseName}</li>
                                          )
                                    })}
                                    
                                    
                                </ul>
                            </div>
                            <div className='Footer_left_sec_left'>
                                <h2 className='Footer_left_sec_left_title'>ارتباط با ما</h2>
                                <ul className='Footer_left_sec_left_List'>
                                    <li className='Footer_left_sec_left_List_item'>
                                        <span className='Footer_left_sec_left_List_item_link'>Tanfit_course@</span>
                                        <LuSend className='Footer_left_sec_left_List_item_link_icon' />
                                    </li>
                                    <li className='Footer_left_sec_left_List_item'>
                                        <span className='Footer_left_sec_left_List_item_gmail'>Tanfit@gmail.com</span>
                                        <MdOutlineEmail className='Footer_left_sec_left_List_item_gmail_icon' />
                                    </li>
                                    <li className='Footer_left_sec_left_List_item'>
                                        <span className='Footer_left_sec_left_List_item_phone'>9547***0937</span>
                                        <MdOutlineLocalPhone className='Footer_left_sec_left_List_item_phone_icon' />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='parent_footer_bottom'>
                        <div className='parent_footer_bottom_desc'>
                            <span className='parent_footer_bottom_desc_span'>تمام حقوق معنوی و مادی این طراحی برای <FaGithub className='parent_footer_bottom_desc_icon' />
                                <span className='parent_footer_bottom_desc_link' onClick={GitReza}>Rezaheydari315</span>و
                                <FaGithub className='parent_footer_bottom_desc_icon' />
                                <span className='parent_footer_bottom_desc_link' onClick={GitMehadi}>Mahdisaghi1</span>
                                محفوظ است .                          </span>
                        </div>
                        <div className='parent_footer_bottom_copy'>
                            <span className='footer_bottom_copy_span'>Tanfit,2025.All right rights resrverd</span>
                            <AiOutlineCopyright className='footer_bottom_copy_icon' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}