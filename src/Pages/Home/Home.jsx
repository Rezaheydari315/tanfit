import './Home.css'
import Header from '../../Components/Header/Header'
import { useEffect, useState, useRef } from 'react'
import { FaHourglassEnd } from "react-icons/fa";
import { FaDumbbell } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import Typewriter from 'typewriter-effect';
import { IoIosStar } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Switch from 'react-switch'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { useSite } from "../../apiContext/ApiContext";
import RangeSlider from "../../Components/RangeSlider/RangeSlider"
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoArrowForwardSharp } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";
import Footer from '../../Components/Footer/Footer'
import ReactSlider from "react-slider";
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2';
import TextError from "../../Components/Texts/Error/TextError"


export default function Home() {
    const [numberLearnHours, setNumberLearnHours] = useState(0)
    const [numberCourse, setNumberCourse] = useState(0)
    const [numberUsers, setNumberUsers] = useState(0)
    const [course, setCourse] = useState([])
    const [filtercourse, setFiltercourse] = useState([])
    const [filterCourseSugetion, setFilterCourseSugetion] = useState([])
    const [pageNumber, setPageNumber] = useState("")
    const [showCourseLoading, setShowCourseLoading] = useState(true)
    const [selectedOptions, setSelectedOptions] = useState([])
    const [free, setFree] = useState(false)
    const [record, setRecord] = useState(false)
    const [numberfree, setNumberfree] = useState("")
    const [numberrecord, setNumberrecord] = useState("")
    const [values, setValues] = useState([0, 1000000]);
    const { siteUrl } = useSite()
    const [showrange, setShowrange] = useState(false)
    const [classarrow, setClassarrow] = useState(false)
    const [showcategory, setShowcategory] = useState(false)
    const [classarrow2, setClassarrow2] = useState(false)
    const [activepage, setActivepage] = useState(1)
    const [search, setSearch] = useState("")
    const courseRef = useRef(null)
    const FooterRef = useRef(null)
    const navigate = useNavigate()
    const parems = useParams()
    const location = useLocation()
    const focusRef = useRef(null)
    const [allcategory, setAllcategory] = useState([])
    const [showTextError, setshowTextError] = useState(false)
    const [titleTextError, setTitleTextError] = useState("")
    const [valueTextError, setValueTextError] = useState("")


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




    // شمارش اعداد بخش معرفی 
    useEffect(function () {
        let i = 0
        let i2 = 0
        let i3 = 0
        const intervalLearnHour = setInterval(function () {
            if (i <= 500) {
                setNumberLearnHours(i); i++
            } else {
                clearInterval(intervalLearnHour)
            }
        }, 10);

        const intervalCourse = setInterval(function () {
            if (i2 <= 200) {
                setNumberCourse(i2);
                i2++
            } else {
                clearInterval(intervalCourse)
            }
        }, 10)

        const intervalUsers = setInterval(function () {
            if (i3 <= 100) {
                setNumberUsers(i3); i3++
            } else {
                clearInterval(intervalUsers)
            }
        }, 10)
        return () => {
            clearInterval(intervalLearnHour);
            clearInterval(intervalCourse);
            clearInterval(intervalUsers)
        }

    }, [])








    function handleChange1(nextChecked) {
        setFree(nextChecked)
    }
    function handleChange2(nextChecked) {
        setRecord(nextChecked)
    }







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
                setShowCourseLoading(false)
                setSearch("")
                //تعداد صفحات
                setPageNumber(resi.data.totalPages)
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




    //ساخت تعداد صفحات 

    const array = new Array(Number(pageNumber)).fill(0);






    //سرچ 
    function handleInputSearch(event) {
        setSearch(event.target.value)
    }

    function handleCLickSearchCourse() {

        setShowCourseLoading(true)
        setSearch("")

        const bodySearch = {
            "searchQuery": search,
            "page": activepage,
            "limit": 10
        }


        axios.post(`${siteUrl}/api/v1/client/search`, bodySearch, {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            }
        }).then((resSearch) => {

            if (resSearch.data.status === 200 && resSearch.status === 200) {
                setShowCourseLoading(false)
                setFiltercourse(resSearch.data.message)
                setPageNumber(resSearch.data.totalPages)
            }

            // setFiltercourse(resSearch.data.data)

        }).catch((err) => {
            if (err.response.data.message = "page not Found") {
                setShowCourseLoading(false)
                // Swal.fire({ title: "دوره ای طبق جستجو شما پیدا نشد.", text: "لطفا دوباره تلاش کنید.", icon: "error" })
                setshowTextError(true)
                setTitleTextError("اخطار")
                setValueTextError("دوره ای طبق جستجو شما پیدا نشد")
            }
        })
    }





    ///تابع چک باکس 
    function changeFormCheckBox(event) {
        setSelectedOptions((prev) => {
            if (event.target.checked) {
                return [...prev, event.target.value]
            } else {
                return prev.filter((item) => item !== event.target.value)
            }
        })
    }






    //فیلتر رو اعمال کن 
    useEffect(() => {
        if (free) {

            setNumberfree("1")
        } else {

            setNumberfree("0")
        }
    }, [free])


    useEffect(() => {
        if (record) {
            setNumberrecord("0")
        } else {
            setNumberrecord("1")
        }

    }, [record])




    function handleFilter() {

        setSearch("")
        setShowCourseLoading(true)

        const bodyFilterSearch = {
            "searchQuery": search,
            "filters": {
                "priceRange": {
                    "min": values[0],
                    "max": values[1]
                },
                ...(selectedOptions && { "category": selectedOptions }),
                "isFree": Number(numberfree),
                "completed": Number(numberrecord)
            },
            "page": 1,
            "limit": 10
        }

        const bodyFilter = {
            "filters": {
                "priceRange": {
                    "min": values[0],
                    "max": values[1]
                },
                ...(selectedOptions && { "category": selectedOptions })
                ,
                "isFree": Number(numberfree),
                "completed": Number(numberrecord)
            },
            "page": 1,
            "limit": 10
        }




        if (search.length > 0) {

            axios.post(`${siteUrl}/api/v1/client/search`, bodyFilterSearch, { headers: { 'Content-Type': 'application/json' } }).
                then((resSearchFilter) => {

                    setShowCourseLoading(false)
                    if (resSearchFilter.data) {
                    }

                }).catch((err) => { })
        } else {

            axios.post(`${siteUrl}/api/v1/client/search`, bodyFilter, { headers: { 'Content-Type': 'application/json' } }).
                then((resFilter) => {

                    if (resFilter.data.status === 200) {
                        setShowCourseLoading(false)
                        setFiltercourse(resFilter.data.message)
                    }
                }).catch((err) => {


                    if (err.response.data.message === "page not Found") {
                        setShowCourseLoading(false)
                        // Swal.fire({ title: "دوره ای مطابق فیلتر های شما پیدا نشد", icon: 'error' })
                        setshowTextError(true)
                        setTitleTextError("اخطار")
                        setValueTextError("دوره ای مطابق فیلتر های شما پیدا نشد")
                    }
                })
        }

    }







    function handleIconArrow1() {

        setShowrange(!showrange)
        setClassarrow(!classarrow)
    }

    function handleIconArrow2() {
        setShowcategory(!showcategory)
        setClassarrow2(!classarrow2)
    }



    //هندل کردن کلیک روی دکمه بعدی صفحه 
    function handlePageCurrent(id) {
        setFiltercourse([])
        setShowCourseLoading(true)
        setActivepage(id)
    }


    function handleClickNextPage() {
        setFiltercourse([])
        setShowCourseLoading(true)
        setActivepage((prev) => {
            if (prev === Number(pageNumber)) {
                return prev = 1
            }
            else {
                return Number(prev) + 1
            }
        })
    }


    ///هندل کردن کلیک روی دکمه قبلی صفحه 
    function handleClickBeforePage() {
        setFiltercourse([])
        setShowCourseLoading(true)
        setActivepage((prev) => {
            if (prev === 1) {
                return prev = Number(pageNumber)
            } else {
                return Number(prev) - 1
            }
        })
    }


    // گرفتن صفحه مورد نظر برای ارسال تابع به بک 
    useEffect(() => {
        setShowCourseLoading(true)
        const bodyGetPage = {
            "GetCourse": true,
            "page": activepage,
            "limit": 10
        }
        axios.post(`${siteUrl}/api/v1/client/search`, bodyGetPage, { headers: { 'Content-Type': 'application/json' } }).then((res) => {
            setFiltercourse(res.data.data)
            setShowCourseLoading(false)
        }).catch((err) => { })
    }, [activepage])



    ///هندل کردن اسکرول به بخش درباره ما 
    useEffect(() => {

        if (location.hash === "#information") {
            FooterRef.current.scrollIntoView({ behavior: "smooth" })
        }
        if (location.hash === "#Search") {
            courseRef.current.scrollIntoView({ behavior: 'smooth' });
            // courseRef.current.focus()
        }
        if (location.hash === "#Courses") {
            courseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [])


    function HandelScrolSecABOUT() {
        // navigate("/Home#parent_Home_information")
        if (FooterRef.current) {
            FooterRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }
    //هندل کردن اسکرول به بخش دوره ها
    function HandelScrolSecCourse() {
        if (courseRef.current) {
            courseRef.current.scrollIntoView({ behavior: 'smooth' });
            // courseRef.current.focus()
        }

    }

    ///هندل کردن سرچ در صفحه هوم 
    function handleClickSearchHome() {
        if (courseRef.current) {
            courseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }


    ///گرفتن دسته بندی ها
    useEffect(() => {
        axios.get(`${siteUrl}/api/v1/client/search/categorys`, {
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            }
        }).then((resGetCategory) => {

            if (resGetCategory.status === 200) {
                setAllcategory(resGetCategory.data.message)
            }
        }).catch((error) => {

        })
    }, [])


    return (
        <>
            <div className='parent_Home'>
                <Header page={"pageHome"} hanldelScrolAboutMe={HandelScrolSecABOUT} hanldelScrolCourses={HandelScrolSecCourse} handleClickSearch={handleClickSearchHome}></Header>
                {showTextError && <TextError title={titleTextError} text={valueTextError}></TextError>}


                <div className='Home'>
                    <div className='Home_introduction'>
                        <div className='Home_introduction_title'>
                            <Typewriter
                                options={{
                                    strings: ['Tan fit'],
                                    autoStart: true,
                                    loop: true,
                                    delay: 50, // تاخیر بین هر کاراکتر
                                    deleteSpeed: 30, // سرعت پاک کردن متن
                                    cursor: '',
                                }}
                            />
                        </div>

                        <p className='Home_introduction_desc'>بدنتو همین الان بساز</p>
                        <div className='Home_introduction_parent_information'>
                            <div className='Home_introduction_parent_learnHours'>
                                <FaHourglassEnd className='Home_introduction_learnHours_icon' />
                                <p className='Home_introduction_learnHours_number'>{numberLearnHours}</p>
                                <p className='Home_introduction_learnHours_title'>ساعت آموزشی</p>
                            </div>
                            <div className='Home_introduction_parent_Course'>
                                <FaDumbbell className='Home_introduction_Course_icon' />
                                <p className='Home_introduction_Course_number'>{numberCourse}</p>
                                <p className='Home_introduction_Course_title'>دوره ورزشی</p>
                            </div>
                            <div className='Home_introduction_parent_Users'>
                                <FiUsers className='Home_introduction_Users_icon' />
                                <p className='Home_introduction_Users_number'>{numberUsers}</p>
                                <p className='Home_introduction_Users_title'>ورزشکار</p>
                            </div>
                        </div>
                    </div>



                    <div className='parent_Home_information' ref={FooterRef} id="information">
                        <div className='Home_information'>
                            <div className='depend_Home_information1'></div>
                            <div className='depend_Home_information2'></div>
                            <div className='Home_information_right_top'>
                                <div className='Home_information_right_top_right'>
                                    <div className='information_header_parent_shape'>
                                        <span className='information_header_shape1'></span>
                                        <span className='information_header_shape2'></span>
                                        <span className='information_header_shape3'></span>
                                    </div>
                                    <h2 className='Home_information_right_top_right_title'>باشگاه تن فیت</h2>
                                </div>
                                <div className='Home_information_right_top_left'>
                                    <h2 className='Home_information_right_top_left_title'>Tan Fit</h2>
                                </div>
                            </div>

                            <div className='parent_Home_information_right_left'>
                                <div className='Home_information_right'>

                                    <div className='parent_Home_information_right_desc'>
                                        <p className='Home_information_right_desc'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.</p>
                                    </div>
                                    <div className='parent_Home_information_right_addres'>
                                        <p className='Home_information_right_addres'><span className='Home_information_right_addres_bold'>نشانی:</span>تهران -خیابان مصلی -کوچه ارغوان8،پلاک14</p>

                                    </div>
                                </div>
                                <div className='Home_information_left'>
                                    <Swiper
                                        spaceBetween={30}
                                        centeredSlides={true}
                                        autoplay={{
                                            delay: 2500,
                                            disableOnInteraction: false,
                                        }}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        navigation={true}
                                        modules={[Autoplay, Pagination, Navigation]}
                                        className="mySwiper"
                                        style={{
                                            height: window.innerWidth <= 600 ? "280px" : "400px"
                                        }}
                                    >
                                        <SwiperSlide><img src="/Image/Slider/1.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/3.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/4.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/6.jpeg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/7.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/8.jpeg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                        <SwiperSlide><img src="/Image/Slider/9.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /></SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>








                    <div className='Course_Suggestion'>
                        <div className='Course_Suggestion_header'>
                            <div className='Course_Suggestion_header_parent_shape'>
                                <span className='Course_Suggestion_header_shape1'></span>
                                <span className='Course_Suggestion_header_shape2'></span>
                                <span className='Course_Suggestion_header_shape3'></span>
                            </div>
                            <div className='Course_Suggestion_header_title'>دوره های پیشنهادی</div>
                        </div>
                        <div className='Course_Suggestion_items'>

                            {showCourseLoading && <div class="loader"></div>}

                            {filterCourseSugetion && filterCourseSugetion.map((ItemCourseSug, index) => {
                                return (
                                    <Link to={`/Course/${ItemCourseSug.courseID}`}>
                                        <div className='Course_Suggestion_item' key={index + 1}>
                                            <img src={`${siteUrl}${ItemCourseSug.media}`} className='Course_Suggestion_item_image' alt="" />
                                            <p className='Course_Suggestion_item_title'>{ItemCourseSug.courseName}</p>
                                            <p className='Course_Suggestion_item_desc'>{ItemCourseSug.introduse}</p>
                                            <div className='Course_Suggestion_item_parent_nameTeacher_star'>
                                                <div className='Course_Suggestion_item_parentTaecher'>
                                                    <span className='Course_Suggestion_item_Taecher'>مدرس:</span>
                                                    <span className='Course_Suggestion_item_NameTaecher'>{ItemCourseSug.instructor}</span>
                                                </div>

                                            </div>
                                            <div className='Course_Suggestion_item_parent_user_price'>
                                                <div className='Course_Suggestion_item_parent_user'>
                                                    <FiUsers className='Course_Suggestion_item_user_icon' />
                                                    <span className='Course_Suggestion_item_user_numb'>340</span>
                                                </div>
                                                <div className='Course_Suggestion_item_parent_price'>
                                                    <span className='Course_Suggestion_item_price_main'>{ItemCourseSug.price}</span>
                                                    <span className='Course_Suggestion_item_price_SpanMain'>تومان</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                )
                            })}







                        </div>
                    </div>


                    <div className='Course_List' ref={courseRef}>
                        <div className='Course_lsit_header'>
                            <div className='Course_list_header_parent_shape'>
                                <span className='Course_list_header_shape1'></span>
                                <span className='Course_list_header_shape2'></span>
                                <span className='Course_list_header_shape3'></span>
                            </div>
                            <div className='Course_list_header_title'>لیست دوره ها</div>
                        </div>
                        <div className='search_Course_List_content__top_mobile' >
                            <input type="text" placeholder='جستجو در بین دوره ها' ref={focusRef} className='search_Course_List_content__top_mobile_input' onChange={handleInputSearch} value={search} />
                            <CiSearch className='search_Course_List_content__top_mobile_icon' onClick={handleCLickSearchCourse} />
                        </div>
                        <div className='Course_List_content'>

                            <div className='Course_List_content_right'>
                                <div className='Course_List_content_right_top'>
                                    <div className='Course_List_content_right_top_parent_free'>
                                        <p className='Course_List_content_right_top_free_title'>دوره های رایگان</p>
                                        <Switch className='Course_List_content_right_top_free_input' boxShadow='0px 1px 5px rgba(0 ,0,0,0.6)' height={18} width={45} checked={free} onChange={handleChange1} onColor='#50D99E' offColor='#ccc' onHandleColor='#50D99E' offHandleColor='#fff' handleDiameter={20} uncheckedIcon={false} checkedIcon={false} />
                                    </div>
                                    <div className='Course_List_content_right_top_parent_incompelet'>
                                        <p className='Course_List_content_right_top_incompelet_title'>در حال ضبط</p>
                                        <Switch className='Course_List_content_right_top_free_input' boxShadow='0px 1px 5px rgba(0 ,0,0,0.6)' height={18} width={45} checked={record} onChange={handleChange2} onColor='#50D99E' offColor='#ccc' onHandleColor='#50D99E' offHandleColor='#fff' handleDiameter={20} uncheckedIcon={false} checkedIcon={false} />
                                    </div>

                                </div>
                                <div className='Course_List_content_right_top_parent_rangePrice  Course_List_content_right_top_parent_rangePrice_HideMobile'>
                                    <div className='parent_Course_List_top_header'>
                                        <h2 className='Course_List_content_right_top_rangePrice_title'>بازه قیمتی</h2>
                                    </div>

                                    <div className='price_range'>
                                        {/* <RangeSlider></RangeSlider> */}
                                        <div className="range-slider-container">
                                            <div className="parent_section_top_input_range">
                                                <div className="section_top_input_right">
                                                    <span className="section_top_input_right_span">تا</span>
                                                    <div className="section_top_input_range_shape1">
                                                        <span className="section_top_input_range_shape_numb_span"> تومان</span>
                                                        <span className="section_top_input_range_shape_numb">{values[1]}</span>
                                                        <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape1"></div>
                                                    </div>
                                                </div>
                                                <div className="section_top_input_left">
                                                    <span className="section_top_input_left_span">از</span>
                                                    <div className="section_top_input_range_shape1">
                                                        <span className="section_top_input_range_shape_numb_span"> تومان</span>
                                                        <span className="section_top_input_range_shape_numb">{values[0]}</span>
                                                        <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape2"></div>
                                                    </div>
                                                </div>
                                            </div>




                                            <ReactSlider
                                                className="custom-slider"
                                                thumbClassName="custom-thumb"
                                                trackClassName="custom-track"
                                                value={values}
                                                onChange={(newValues) => setValues(newValues)}
                                                min={0}
                                                max={900000}
                                                pearling // اجازه می‌دهد Sliderها به هم بچسبند
                                                minDistance={100} // حداقل فاصله بین دو Slider
                                                renderTrack={(props, state) => {
                                                    // حذف `key` از `props` (اگر وجود دارد)
                                                    const { key, ...restProps } = props;

                                                    return (
                                                        <div
                                                            key={key} // اگر `key` نیاز دارید، آن را مستقیماً اینجا قرار دهید
                                                            {...restProps} // بقیه `props` را منتقل کنید
                                                            className={state.index === 1 ? "custom-track-1" : "custom-track-0"}
                                                        />
                                                    );
                                                }}
                                            />


                                            <div className="parent_Lines">
                                                <span className="line_main_right"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_main_left"></span>
                                            </div>
                                            <div className="range-values">
                                                <span className='range_values_max'>گران ترین</span>  <span className='range_values_min'>ارزان ترین</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className='Course_List_content_right_top_parent_rangePrice Course_List_content_right_top_parent_rangePrice_mobile'>
                                    <div className='parent_Course_List_top_header parent_Course_List_top_header_mobile'>
                                        <h2 className="Course_List_content_right_top_rangePrice_title">بازه قیمتی</h2>
                                        <MdKeyboardArrowDown onClick={handleIconArrow1} className={`Course_List_content_right_top_rangePrice_arrow_icon  ${classarrow ? 'icon_active' : ''}`} />
                                    </div>
                                    {showrange && <div className='price_range price_range_mobile'>
                                        {/* <RangeSlider></RangeSlider> */}
                                        <div className="range-slider-container">
                                            <div className="parent_section_top_input_range">
                                                <div className="section_top_input_right">
                                                    <span className="section_top_input_right_span">تا</span>
                                                    <div className="section_top_input_range_shape1">
                                                        <span className="section_top_input_range_shape_numb_span"> تومان</span>
                                                        <span className="section_top_input_range_shape_numb">{values[1]}</span>
                                                        <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape1"></div>
                                                    </div>
                                                </div>
                                                <div className="section_top_input_left">
                                                    <span className="section_top_input_left_span">از</span>
                                                    <div className="section_top_input_range_shape1">
                                                        <span className="section_top_input_range_shape_numb_span"> تومان</span>
                                                        <span className="section_top_input_range_shape_numb">{values[0]}</span>
                                                        <div className="depend_section_top_input_range_shape depend_section_top_input_range_shape2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ReactSlider
                                                className="custom-slider"
                                                thumbClassName="custom-thumb"
                                                trackClassName="custom-track"
                                                value={values}
                                                onChange={(newValues) => setValues(newValues)}
                                                min={0}
                                                max={1000000}
                                                pearling // اجازه می‌دهد Sliderها به هم بچسبند
                                                minDistance={10} // حداقل فاصله بین دو Slider
                                                renderTrack={(props, state) => (
                                                    <div {...props} className={state.index === 1 ? "custom-track-1" : "custom-track-0"}
                                                    />
                                                )}
                                            />
                                            <div className="parent_Lines">
                                                <span className="line_main_right"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_max"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_min"></span>
                                                <span className="line_main_left"></span>
                                            </div>
                                            <div className="range-values">
                                                <span>گران ترین</span>  <span>ارزان ترین</span>
                                            </div>
                                        </div>
                                    </div>}

                                </div>


                                <div className='Course_List_content_right_buttom Course_List_content_right_buttom_HideMObile'>
                                    <h2 className='Course_List_content_right_buttom_title'>دسته بندی دوره ها </h2>
                                    <form action="" onChange={changeFormCheckBox} className='Course_List_content_right_buttom_form'>

                                        {allcategory && allcategory.map((ItemCategory, index) => {
                                            return (
                                                <div className='Course_List_content_right_buttom_parent_input' key={index + 1}>
                                                    <label key={ItemCategory.category} className='Course_List_content_right_buttom_input_lable'>{ItemCategory.category}</label>
                                                    <input type="checkbox" className='Course_List_content_right_buttom_input' value={ItemCategory.category} />
                                                </div>
                                            )
                                        })}



                                    </form>
                                </div>

                                <div className='Course_List_content_right_buttom  Course_List_content_right_buttom_mobile'>
                                    <div className='parent_Course_List_content_right_buttom'>
                                        <h2 className='Course_List_content_right_buttom_title '>دسته بندی دوره ها </h2>
                                        <MdKeyboardArrowDown onClick={handleIconArrow2} className={`Course_List_content_right_buttom_arrow_icon ${classarrow2 ? 'icon_active' : ''}`}></MdKeyboardArrowDown>
                                    </div>


                                    {showcategory && <form action="" onChange={changeFormCheckBox} className='Course_List_content_right_buttom_form'>

                                        {allcategory && allcategory.map((ItemCategory, index) => {
                                            return (
                                                <div className='Course_List_content_right_buttom_parent_input' key={index + 1}>
                                                    <label key={ItemCategory.category} className='Course_List_content_right_buttom_input_lable'>{ItemCategory.category}</label>
                                                    <input type="checkbox" className='Course_List_content_right_buttom_input' value={ItemCategory.category} />
                                                </div>
                                            )
                                        })}


                                    </form>}

                                </div>




                                <div className='Course_List_content_right_parent_btn'>
                                    <button className='Course_List_content_right_btn' onClick={handleFilter}>اعمال فیلتر</button>
                                </div>
                            </div>
                            <div className='Course_List_content_left'>



                                <div className='Course_List_content_left_top'>
                                    <input type="text" placeholder='جستجو در بین دوره ها' ref={focusRef} onChange={handleInputSearch} className='Course_List_content_left_top_input' value={search} />
                                    <CiSearch className='Course_List_content_left_top_icon' onClick={handleCLickSearchCourse} />
                                </div>
                                <div className='Course_List_content_left_courses'>

                                    {showCourseLoading && <div class="loader"></div>}

                                    {filtercourse && filtercourse.map((courseItem, index) => {
                                        return (
                                            <Link to={`/Course/${courseItem.courseID}`}>
                                                <div className='list_course_item' key={index + 1}>
                                                    {/* <img src="/Image/Course_suggestion/1.jpg" className='list_course_item_image' alt="" /> */}
                                                    <img src={`${siteUrl}${courseItem.media}`} className='list_course_item_image' alt="" />
                                                    <p className='list_course_item_title'>{courseItem.courseName}</p>
                                                    <p className='list_course_item_desc'>{courseItem.introduse}</p>
                                                    <div className='list_course_item_parent_nameTeacher_star'>
                                                        <div className='list_course_item_parentTaecher'>
                                                            <span className='list_course_item_Taecher'>مدرس:</span>
                                                            <span className='list_course_item_NameTaecher'>{courseItem.instructor}</span>
                                                        </div>

                                                    </div>
                                                    <div className='list_course_item_parent_user_price'>
                                                        <div className='list_course_item_parent_user'>
                                                            <FiUsers className='list_course_item_user_icon' />
                                                            <span className='list_course_item_user_numb'>340</span>
                                                        </div>
                                                        <div className='list_course_item_parent_price'>
                                                            <span className='list_course_item_price_main'>{courseItem.price}</span>
                                                            <span className='list_course_item_price_SpanMain'>تومان</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )

                                    })}



                                </div>



                                <div className='parent_main_pagination_itesm'>
                                    <div className='parent_pagination_items'>
                                        <IoArrowForwardSharp className='btn_next_page' onClick={handleClickBeforePage} />
                                        <div className='parent_btn_item'>

                                            {array && array.map((itemPages, index) => {
                                                return (
                                                    <div key={index + 1} className={`item_btn ${activepage === index + 1 ? "active_page" : ""}`} onClick={() => handlePageCurrent(index + 1)}>
                                                        <span className='item_btn_numb'>{index + 1}</span>
                                                    </div>
                                                )
                                            })}



                                        </div>
                                        <IoArrowBackOutline className='btn_before' onClick={handleClickNextPage} />
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>


                    <div className='parent_footer_inHOmePge' >
                        <Footer ></Footer>
                    </div>


                </div>
            </div>
        </>

    )
}
