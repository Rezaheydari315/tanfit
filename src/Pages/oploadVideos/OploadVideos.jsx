import "./OploadVideos.css"
import { FaFolderPlus } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom"
import { CiSearch } from "react-icons/ci";
import { FaCircle } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import { FaPhotoVideo } from "react-icons/fa";
import { IoIosPause } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { useSite } from "../../apiContext/ApiContext"
import axios from "axios"
import Swal from "sweetalert2";
import { IoPlay } from "react-icons/io5";
import ModalLogout from "../../Components/ModalLogout/ModalLogout"
import TextSucces from "../../Components/Texts/Succes/TextSucces"
import TextWarn from "../../Components/Texts/Warn/TextWarn"







export default function OploadVideos() {

    const { siteUrl } = useSite()
    const [showModalSelectFile, setShowModalSelectFile] = useState(false)
    const [showsearchCourse, setShowsearchCourse] = useState(false)
    const [showOptionCancle, setShowOptionCancle] = useState(false)
    const [valueCourseSelect, setValueCourseSelect] = useState("")
    const [showModalEditCourse, setShowModalEditCourse] = useState(false)
    const [showSectionCategory, setShowSectionCategory] = useState(false)
    const [valuenameCategory, setValuenameCategory] = useState("")
    const navigate = useNavigate()
    const menuOption = useRef(null)
    const sectionSearchModal = useRef(null)
    const sectionparentSelectCategory = useRef(null)
    const sectionSelectCategory = useRef(null)
    const refreshToken = Cookies.get("refresh_token")
    const accesstoken = Cookies.get("access_token")
    const [showLoding, setShowLoding] = useState(true)
    const [valueSearchCourse, setValueSearchCourse] = useState("")
    const [showResultSearch, setShowResultSearch] = useState(false)
    const [itemResultSearch, setItemResultSearch] = useState([])
    const [idSelectSeach, setIdSelectSeach] = useState("")
    const [courseNameEdit, setCourseNameEdit] = useState("")
    const [courseNameTeacherEdit, setCourseNameTeacherEdit] = useState("")
    const [coursesummaryEdit, setCoursesummaryEdit] = useState("")
    const [courseinfoEdit, setCourseinfoEdit] = useState("")
    const [courseCategoryEdit, setCourseCategoryEdit] = useState("")
    const [valueCourseNameEdit, setValueCourseNameEdit] = useState("")
    const [valueCourseNameTeacherEdit, setValueCourseNameTeacherEdit] = useState("")
    const [valueCourseSummaryEdit, setValueCourseSummaryEdit] = useState("")
    const [valueCourseInfoEdit, setValueCourseInfoEdit] = useState("")
    const secionSelectFilePoster = useRef(null)
    const [fileEditCourse, setFileEditCourse] = useState(null)
    const [namefileEditCourse, setNamefileEditCourse] = useState("")
    const [previewEditCourse, setPreviewEditCourse] = useState("")
    const SectionFileFilm = useRef(null)
    const [numberFile, setNumberFile] = useState("")
    const [fileFilm, setFileFilm] = useState("")
    const [nameFileFilm, setNameFileFilm] = useState("")
    const [oploadFile, setOploadFile] = useState("")
    const [listVidieo, setListVidieo] = useState([])
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [pausedUploads, setPausedUploads] = useState({});
    const activeUploads = useRef({});
    const [infouser, setInfouser] = useState("")
    const [showModalLougout, setShowModalLougout] = useState(false)
    const [listCategory, setListCategory] = useState("")


    const [showTextSucces, setShowTextSucces] = useState(false)
    const [titleText, setTitleText] = useState("")
    const [valueText, setValueText] = useState("")

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
            setshowTextWarn(true)
            setTitleTextWarn("هشدار")
            setValueTextWarn("برای استفاده از صفحات ادمین از دسکتاپ استفاده نمایید")


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
                                                     navigate("/Login")
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
                    } else if (error.response.data.message === "Authorization header is missing") {
                        Cookies.remove("access_token");
                        Cookies.remove("refresh_token");
                        navigate("/Login")
                    }
                }
                else { '' }

            }
        }
        checkacesAdmin()
    }
        , [])



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


    ///باز کردن مدال انتخاب فایل
    function opneModalSelectfile() {
        setShowModalSelectFile(true)
    }

    //بستن مدال انتخاب فایل
    function closeModalSelectfile() {
        setShowModalSelectFile(false)
    }


    //هدایت کردن به صفحه افزدون دوره
    function handleNavigatePage() {
        navigate("/PanelAdminAddCourse")
    }


    ///کلیک کردن روی صفحه و بستن ایتم ها اضافی
    window.addEventListener('click', function (event) {
        if (menuOption.current && !menuOption.current.contains(event.target)) {
            setSelectedVideoId(null)
        }

        if (sectionSelectCategory.current && !sectionSelectCategory.current.contains(event.target) && !sectionparentSelectCategory.current.contains(event.target)) {
            setShowSectionCategory(false)
        }

        if (sectionSearchModal.current && !sectionSearchModal.current.contains(event.target)) {
            setShowResultSearch(false)
        }

    })


    ///باز کردن مدال مربوط به ادیت دوره
    function openModalEditCourse() {
        setShowModalEditCourse(true)
    }

    function closeEditModal() {
        setShowModalEditCourse(false)
    }


    ////باز کردن انتخاب کتگوری
    function openSectionCategory() {
        setShowSectionCategory(!showSectionCategory)
    }


    ///انتخاب کردن کتگوری
    function valueNameCategory(event) {
        setShowSectionCategory(false)
        setValuenameCategory(event.target.textContent)
    }

    ///سیو کردن مقدار سرچ  بین دوره ها

    function saveValueSearchCourse(event) {
        setValueSearchCourse(event.target.value)
    }



    ///سرچ کردن در بین دوره ها
    function handleSearchCourse() {
        const bodysearchCourse = {
            "courseName": valueSearchCourse
        }

        axios.post(`${siteUrl}/api/v1/admin/course/find`, bodysearchCourse, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resSearchCourse) => {

            if (resSearchCourse.data.status === 200) {
                setShowResultSearch(true)
                setItemResultSearch(resSearchCourse.data.data)
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

    ///انتخاب ایتم سرچ شده
    function handleClickItemSearch(infoSearchSelect) {
        setIdSelectSeach(infoSearchSelect.courseID)
        setShowResultSearch(false)
        setValueCourseSelect(infoSearchSelect.courseName)
        setCourseNameEdit(infoSearchSelect.courseName)
        setCourseNameTeacherEdit(infoSearchSelect.instructor)
        setCoursesummaryEdit(infoSearchSelect.introduse)
        setCourseinfoEdit(infoSearchSelect.description)
        setCourseCategoryEdit(infoSearchSelect.category)
    }


    ///هشدار اول صفحه برا انتخاب دوره 
    useEffect(() => {
        if (!valueCourseSelect && showLoding) {
            // Swal.fire({ title: "برای ویرایش  دوره یا آپلود ویدیو حتما ابتدا دوره مورد نظر را انتخاب کنید", icon: "warning" })

            setshowTextWarn(true)
            setTitleTextWarn("هشدار")
            setValueTextWarn("برای ویرایش  دوره یا آپلود ویدیو حتما ابتدا دوره مورد نظر را انتخاب کنید")
        }
    }, [])




    //حالا ویرایش دوره

    //اول سیو کردن نام دوره
    function saveEditCourseName(event) {
        setValueCourseNameEdit(event.target.value)
    }

    //سیو کردن نام مدرس دوره
    function saveEditCourseNameTeacher(event) {
        setValueCourseNameTeacherEdit(event.target.value)
    }

    ///سیو کردن توضیحات خلاصه دوره
    function saveEditCourseSumary(event) {
        setValueCourseSummaryEdit(event.target.value)
    }

    ///سیو کردن توضیحات دوره
    function saveEditCourseInfo(event) {
        setValueCourseInfoEdit(event.target.value)
    }



    //فایل پوستر 
    function openselectFile() {
        if (secionSelectFilePoster.current) {
            secionSelectFilePoster.current.click();
        }
    }


    function handleFilePosterEdit(event) {
        setFileEditCourse(event.target.files[0])
        setNamefileEditCourse(event.target.value)
    }

    useEffect(() => {
        setFileEditCourse("")
    }, [])

    useEffect(() => {
        if (fileEditCourse) {
            const previewUrl = URL.createObjectURL(fileEditCourse);
            setPreviewEditCourse(previewUrl);
            // تمیز کردن URL ایجاد شده هنگام unmount یا تغییر فایل
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [fileEditCourse]);


    ////حالا کلیک روی تایید برا ابدیت
    function UpdateCourse() {

        const formData = new FormData()

        formData.append("courseID", idSelectSeach)
        formData.append("Completed", 1)

        ///ایتم های اختیاری
        if (valueCourseNameEdit.length > 0) {
            formData.append("courseName", valueCourseNameEdit)
        }
        if (valueCourseNameTeacherEdit.length > 0) {
            formData.append("instructor", valueCourseNameTeacherEdit)
        }
        if (valueCourseSummaryEdit.length > 0) {
            formData.append("introduse", valueCourseSummaryEdit)
        }
        if (valueCourseInfoEdit.length > 0) {
            formData.append("description", valueCourseInfoEdit)
        }
        if (valuenameCategory.length > 0) {
            formData.append("category", valuenameCategory)
        }
        if (fileEditCourse > 0) {
            formData.append("media", fileEditCourse)
        }

        axios.patch(`${siteUrl}/api/v1/admin/course/update`, formData, {
            headers: {
                "Authorization": `Bearer ${accesstoken}`
            }
        }).then((resUpdateCourse) => {

            if (resUpdateCourse.data.message === " course updated successfully") {
                setShowModalEditCourse(false)
                setValueCourseNameEdit("")
                setValueCourseNameTeacherEdit("")
                setValueCourseSummaryEdit("")
                setValueCourseInfoEdit("")
                setFileEditCourse("")
                setNamefileEditCourse("")
                setValueCourseSelect("")
                setValueSearchCourse("")
                // Swal.fire({ title: "دوره با موفقیت ویرایش شد", icon: "success" })

                setShowTextSucces(true)
                setTitleText("عملیات موفقیت آمیز")
                setValueText("دوره با موفقیت ویرایش شد")

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






    ///اپلود فیلم 
    ///سیو کردن شماره فایل فیلم
    function saveNumberFile(event) {
        setNumberFile(event.target.value)
    }

    //باز کردن انتخاب فیلم
    function openSelectFileFilm() {
        if (SectionFileFilm.current) {
            SectionFileFilm.current.click()
        }
    }

    //سیو کردن فایل فیلم
    function saveFileOploadFilm(event) {

        setFileFilm(event.target.files[0])
        setNameFileFilm(event.target.value)
    }


    //ارسال فایل فیلم


    // //هندل کردن نمایش آپشن لغو و کنسل
    const handleShowOptions = (videoId) => {
        setSelectedVideoId(selectedVideoId === videoId ? null : videoId);
    };





    // ///لغو آپلود فیلم 
    const handleCancelUpload = (videoId) => {
        setListVidieo(prev => {
            const updatedList = [...prev];
            const videoToCancel = updatedList.find(item => item.id === videoId);

            if (videoToCancel && videoToCancel.cancelToken) {
                videoToCancel.cancelToken.cancel('آپلود توسط کاربر لغو شد');
                return updatedList.filter(item => item.id !== videoId);
            }

            return updatedList;
        });
        setSelectedVideoId(null); // بستن منوی لغو پس از اجرا
    };

    function sendFileFilm() {
        setShowModalSelectFile(false);

        const cancelTokenSource = axios.CancelToken.source();
        const tempId = Date.now();

        const newVideoItem = {
            id: tempId,
            episodeNumber: numberFile,
            fileName: nameFileFilm,
            progress: 0,
            cancelToken: cancelTokenSource,
            status: 'uploading',
            file: fileFilm,
            uploadedBytes: 0
        };

        setListVidieo(prev => [...prev, newVideoItem]);

        const formDataFilm = new FormData();
        formDataFilm.append("courseID", idSelectSeach);
        formDataFilm.append("file", fileFilm);
        formDataFilm.append("chapter", numberFile);

        const config = {
            headers: {
                "Authorization": `Bearer ${accesstoken}`,
                "Content-Type": "multipart/form-data",
            },
            cancelToken: cancelTokenSource.token,
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setListVidieo(prev => prev.map(item =>
                    item.id === tempId ? {
                        ...item,
                        progress: percentCompleted,
                        uploadedBytes: progressEvent.loaded
                    } : item
                ));
            }
        };
        const request = axios.post(`${siteUrl}/api/v1/admin/course/upload`, formDataFilm, config);
        activeUploads.current[tempId] = { cancelToken: cancelTokenSource, request };

        request.then((resFileFilm) => {
            setListVidieo(prev => prev.map(item =>
                item.id === tempId ? { ...item, progress: 100, status: 'completed' } : item
            ));

            if (resFileFilm.data.message === "video Uploaded succefully") {
                // Swal.fire({ title: "ویدیو شما با موفقیت اضافه شد", icon: "success" });

                setShowTextSucces(true)
                setTitleText("عملیات موفقیت آمیز")
                setValueText("ویدیو شما با موفقیت آپلود شد")

                setNameFileFilm("");
            }
        }).catch((error) => {
            if (error.response.status === 403) {
                navigate("/Login")
            }
            if (error.response && error.response.status === 401) {

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

            if (axios.isCancel(error)) {
                if (error.message === 'Upload paused by user') {
                    setListVidieo(prev => prev.map(item =>
                        item.id === tempId ? { ...item, status: 'paused' } : item
                    ));
                } else {
                    setListVidieo(prev => prev.filter(item => item.id !== tempId));
                }
            } else {

                setListVidieo(prev => prev.map(item =>
                    item.id === tempId ? { ...item, status: 'error' } : item
                ));
            }
        }).finally(() => {
            delete activeUploads.current[tempId];
        });
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
            <div className="OploadSection">

                {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}

                {showTextWarn && <TextWarn title={titleTextWarn} text={valueTextWarn}></TextWarn>}


                {showModalLougout && <ModalLogout onClose={CloseModalConfirm} onConfirm={confirmDelete}></ModalLogout>}
                {showLoding && <div className='lodeer3'>
                    <div className="loader3"></div>
                </div>}


                {showModalSelectFile && <div className="modal_opload">
                    <div className="modal_opload_content">
                        <h2 className="modal_opload_header">انتخاب فایل ها</h2>

                        <div className="modal_opload_section_top_parent_titel">
                            <span className="modal_opload_section_top_titel">شماره قسمت:</span>
                        </div>

                        <div className="modal_opload_section_top">
                            <div className="modal_opload_section_top_parent_number_part">
                                <input type="number" placeholder="شماره قسمت فایل..." className="modal_opload_section_top_number_part_input" onChange={saveNumberFile} />
                            </div>
                            <div className="modal_opload_section_top_parent_files">
                                <input type="text" className="modal_opload_section_top_files_input" placeholder={nameFileFilm ? nameFileFilm : "فایلی انتخاب نشده"} />

                                <button className="modal_opload_section_top_files_btn" onClick={openSelectFileFilm}>انتخاب فایل</button>
                                <input type="file" style={{ display: "none" }} accept="video/*" onChange={saveFileOploadFilm} ref={SectionFileFilm} />
                            </div>
                        </div>

                        <div className="modal_opload_section_buutom">
                            <button className="modal_opload_section_buutom_btn_signout" onClick={closeModalSelectfile}>خروج</button>
                            <button className={`modal_opload_section_buutom_btn_confirm ${valueCourseSelect ? "" : "disableBtn"}`} onClick={sendFileFilm}>تایید</button>
                        </div>
                    </div>
                </div>}




                {showModalEditCourse && <div className="modal_edit_course">
                    <div className="modal_edit_course_content">

                        <div className="modal_edit_course_content_top">
                            <div className="modal_edit_course_content_top_sec_right">
                                <div className='modaledit_header_parent_shape'>
                                    <span className='modaledit_header_shape1'></span>
                                    <span className='modaledit_header_shape2'></span>
                                    <span className='modaledit_header_shape3'></span>
                                </div>
                                <span className="modal_edit_course_content_top_title">ویرایش اطلاعات</span>
                            </div>

                            <div className="modal_edit_course_content_top_sec_left">
                                <div className="modalEdit_content_section_name">
                                    <div className="depend_modalEdit_content_section_name_content">
                                    </div>
                                    <div className="modalEdit_content_section_name_content">
                                        <input type="text" value={valueCourseSelect ? valueCourseSelect : "دوره ای انتخاب نشده"} readOnly className="modalEdit_content_section_name_input" />
                                        <FaCircle className={`modalEdit_content_section_name_icon ${valueCourseSelect ? "" : "nonCourseSelect"}`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal_edit_course_content_main">
                            <div className="paneladmin_modalEdit_parent_right_left">
                                <div className="paneladmin_modalEdit_parent_secRight">
                                    <div className="paneladmin_modalEdit_parent_secRight_parent_name_teach">
                                        <div className="paneladmin_modalEdit_parent_name">
                                            <p className="paneladmin_modalEdit_name_span">نام:</p>
                                            <input type="text" onChange={saveEditCourseName} className="paneladmin_modalEdit_name_input" placeholder={courseNameEdit ? courseNameEdit : "نام دوره"} />
                                        </div>
                                        <div className="paneladmin_modalEdit_parent_teacher">
                                            <p className="paneladmin_modalEdit_teacher_span">نام مدرس:</p>
                                            <input type="text" onChange={saveEditCourseNameTeacher} className="paneladmin_modalEdit_teacher_input" placeholder={courseNameTeacherEdit ? courseNameTeacherEdit : "نام مدرس دوره"} />
                                        </div>
                                    </div>
                                    <div className="paneladmin_modalEdit_parent_secRight_parent_summary">
                                        <p className="paneladmin_modalEdit_parent_secRight_parent_desc_span">توضیحات خلاصه:</p>
                                        <textarea className="paneladmin_modalEdit_parent_secRight_parent_desc_input" onChange={saveEditCourseSumary} placeholder={coursesummaryEdit ? coursesummaryEdit : "چکیده خلاصه توضیحات"}></textarea>
                                    </div>
                                    <div className="paneladmin_modalEdit_parent_secRight_parent_desc">
                                        <p className="paneladmin_modalEdit_parent_secRight_desc_span">توضیحات</p>
                                        <textarea onChange={saveEditCourseInfo} className="paneladmin_modalEdit_parent_secRight_desc_input" placeholder={courseinfoEdit ? courseinfoEdit : "توضیحات"}></textarea>
                                    </div>
                                </div>
                                <div className="paneladmin_modalEdit_parent_secLeft">
                                    <div className="paneladmin_modalEdit_secLeft_parent_top">
                                        <p className="paneladmin_modalEdit_secLeft_span">آپلود پوستر</p>
                                        <AiOutlinePlus className="paneladmin_modalEdit_secLeft_icon" onClick={openselectFile} />
                                        <p className="paneladmin_modalEdit_secLeft_nameFile">{namefileEditCourse ? namefileEditCourse : "قایلی انتخاب نشده"}</p>
                                        <input type="file" style={{ display: "none" }} ref={secionSelectFilePoster} onChange={handleFilePosterEdit} accept="image/*" />
                                        <div className='paneladmin_modalEdit_secLeft_parent_image'>
                                            <img src={previewEditCourse} className="paneladmin_modalEdit_secLeft_image" alt="" />
                                        </div>

                                    </div>
                                    <div className="paneladmin_modalEdit_secLeft_parent_category">
                                        <p className="paneladmin_modalEdit_secLeft_category">کتگوری:</p>
                                        <div className="paneladmin_modalEdit_secLeft_category_selection">
                                            <div className="paneladmin_modalEdit_secLeft_category_selection_parent_top">
                                                <div className='paneladmin_modalEdit_secLeft_category_selection_parent_top_section_search' onClick={openSectionCategory} ref={sectionparentSelectCategory}>
                                                    <input type="text" placeholder={courseCategoryEdit ? courseCategoryEdit : "کتگوری دوره"} className="paneladmin_modalEdit_secLeft_category_input" value={valuenameCategory} />
                                                    <IoIosArrowBack className={`paneladmin_modalEdit_secLeft_category_icon active_icon ${showSectionCategory ? "active_icon_category" : ""}`} />
                                                </div>



                                                {showSectionCategory && <div className="modalEdit_secLeft_category_selection_depend" ref={sectionSelectCategory}>
                                                    <ul className="modalEdit_secLeft_category_selection_depend_list">
                                                        {listCategory && listCategory.map((itemCategory, index) => {
                                                            return (
                                                                <li className="modalEdit_secLeft_category_selection_depend_item" key={index + 1}>
                                                                    <FaCircle className="paneladmin_modalEdit_secLeft_category_selection_depend_icon" />
                                                                    <span className="modalEdit_secLeft_category_selection_depend_item_span" onClick={() => { valueNameCategory(itemCategory.category) }}>{itemCategory.category}</span>
                                                                </li>
                                                            )
                                                        })}

                                                        {/* <li className="modalEdit_secLeft_category_selection_depend_item">
                                                            <FaCircle className="paneladmin_modalEdit_secLeft_category_selection_depend_icon" />
                                                            <span className="modalEdit_secLeft_category_selection_depend_item_span" onClick={() => { valueNameCategory(event) }}>نام کتگوری دوم</span>
                                                        </li>
                                                        <li className="modalEdit_secLeft_category_selection_depend_item">
                                                            <FaCircle className="paneladmin_modalEdit_secLeft_category_selection_depend_icon" />
                                                            <span className="modalEdit_secLeft_category_selection_depend_item_span" onClick={() => { valueNameCategory(event) }}>نام کتگوری سوم</span>
                                                        </li>
                                                        <li className="modalEdit_secLeft_category_selection_depend_item">
                                                            <FaCircle className="paneladmin_modalEdit_secLeft_category_selection_depend_icon" />
                                                            <span className="modalEdit_secLeft_category_selection_depend_item_span" onClick={() => { valueNameCategory(event) }}>نام کتگوری چهارم</span>
                                                        </li>
                                                        <li className="modalEdit_secLeft_category_selection_depend_item">
                                                            <FaCircle className="paneladmin_modalEdit_secLeft_category_selection_depend_icon" />
                                                            <span className="modalEdit_secLeft_category_selection_depend_item_span" onClick={() => { valueNameCategory(event) }}>نام کتگوری پنجم</span>
                                                        </li> */}

                                                    </ul>
                                                </div>}
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>


                        <div className="modalEdit_course_content_buttom">

                            {/* <div className="modalEdit_section_top_parent_titel">
                                <span className="modalEdit_section_top_titel">شماره قسمت:</span>
                            </div>

                            <div className="modalEdit_section_top">
                                <div className="modalEdit_section_top_parent_number_part">
                                    <input type="number" placeholder="شماره قسمت فایل..." className="modalEdit_section_top_number_part_input" />
                                </div>
                                <div className="modalEdit_section_top_parent_files">
                                    <input type="text" className="modalEdit_section_top_files_input" placeholder="فایلی انتخاب نشده..." />
                                    <button className="modalEdit_section_top_files_btn">انتخاب فایل</button>
                                </div>
                            </div> */}

                            <div className="modalEdit_section_buutom">
                                <button className="modalEdit_section_buutom_btn_signout" onClick={closeEditModal}>خروج</button>
                                <button className={`modalEdit_section_buutom_btn_confirm ${valueCourseSelect ? "" : "disableBtn"}`} onClick={UpdateCourse}>تایید</button>
                            </div>
                        </div>


                    </div>
                </div>}






                <div className="parent_OploadSection_right_left">
                    <div className="parent_OploadSecion_section_right">
                        <div className="parent_OploadSecion_section_right_content">
                            <div className="OploadSecion_section_right_content_search">
                                <div className={"OploadSecion_section_right_content_search_top"}>
                                    <div className="OploadSecion_section_right_content_search_top_parent_top">
                                        <input type="text" placeholder="جستجو در بین دوره ها..." className="OploadSecion_section_right_content_search_top_input" value={valueSearchCourse} onChange={saveValueSearchCourse} />
                                        <CiSearch className="OploadSecion_section_right_content_search_top_icon" onClick={handleSearchCourse} />
                                    </div>


                                    {showResultSearch && <div className="OploadSection_secLeft_category_selection_depend" ref={sectionSearchModal}>
                                        <ul className="OploadSection_secLeft_category_selection_depend_list">
                                            {itemResultSearch && itemResultSearch.map((itemSearchresult, index) => {
                                                return (
                                                    <li key={index + 1} className="OploadSection_secLeft_category_selection_depend_item" onClick={() => { handleClickItemSearch(itemSearchresult) }}>
                                                        <FaCircle className="paneladmin_OploadSection_secLeft_category_selection_depend_icon" />
                                                        <span className="OploadSection_secLeft_category_selection_depend_item_span">{itemSearchresult.courseName}</span>
                                                    </li>
                                                )
                                            })}


                                        </ul>
                                    </div>}



                                </div>

                                {showsearchCourse && <div className="depend_OploadSecion_section_right_content_search">
                                    <div className="depend_OploadSecion_section_right_content_search_ietm">
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secleft">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_titelTeacher">مدرس:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_teacher">احمد وکیلی</span>
                                        </div>
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secMiddle">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_titleCondi">وضعیت:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_condi">تکمیل شده</span>
                                        </div>

                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secRight">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_titleName">نام:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_name">برنامه ریزی روزانه</span>
                                        </div>
                                    </div>
                                    <div className="depend_OploadSecion_section_right_content_search_ietm">
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secleft">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_titelTeacher">مدرس:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_teacher">احمد وکیلی</span>
                                        </div>
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secMiddle">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_titleCondi">وضعیت:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_condi">تکمیل شده</span>
                                        </div>

                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secRight">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_titleName">نام:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_name">برنامه ریزی روزانه</span>
                                        </div>
                                    </div>
                                    <div className="depend_OploadSecion_section_right_content_search_ietm">
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secleft">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_titelTeacher">مدرس:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_teacher">احمد وکیلی</span>
                                        </div>
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secMiddle">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_titleCondi">وضعیت:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_condi">تکمیل شده</span>
                                        </div>

                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secRight">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_titleName">نام:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_name">برنامه ریزی روزانه</span>
                                        </div>
                                    </div>
                                    <div className="depend_OploadSecion_section_right_content_search_ietm">
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secleft">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_titelTeacher">مدرس:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_teacher">احمد وکیلی</span>
                                        </div>
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secMiddle">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_titleCondi">وضعیت:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_condi">تکمیل شده</span>
                                        </div>

                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secRight">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_titleName">نام:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_name">برنامه ریزی روزانه</span>
                                        </div>
                                    </div>
                                    <div className="depend_OploadSecion_section_right_content_search_ietm">
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secleft">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_titelTeacher">مدرس:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secleft_teacher">احمد وکیلی</span>
                                        </div>
                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secMiddle">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_titleCondi">وضعیت:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secMiddle_condi">تکمیل شده</span>
                                        </div>

                                        <div className="depend_OploadSecion_section_right_content_search_ietm_secRight">
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_titleName">نام:</span>
                                            <span className="depend_OploadSecion_section_right_content_search_ietm_secRight_name">برنامه ریزی روزانه</span>
                                        </div>
                                    </div>
                                </div>}

                            </div>

                            <div className="OploadSecion_section_right_content_parent_name_btn">

                                <div className="OploadSecion_section_right_content_parent_nameCourse_effect"></div>

                                <div className="OploadSecion_section_right_content_parent_nameCourse">
                                    <input type="text" className="OploadSecion_section_right_content_nameCourse_input" value={valueCourseSelect ? valueCourseSelect : "دوره ای انتخاب نشده"} readOnly />
                                    <FaCircle className={`OploadSecion_section_right_content_nameCourse_input_icon ${valueCourseSelect ? "" : "nonCourseSelect"}`} />
                                </div>
                                <div className="OploadSecion_section_right_content_parent_btn">
                                    <button className="OploadSecion_section_right_content_btn_edit" onClick={openModalEditCourse}>ویرایش اطلاعات دوره ها</button>
                                    <button className="OploadSecion_section_right_content_btn" onClick={opneModalSelectfile}>انتخاب فایل ها</button>
                                </div>
                            </div>

                            <div className="OploadSecion_section_right_content_parent_opload">





                                {listVidieo && listVidieo.map((video, index) => {
                                    return (
                                        <div key={index + 1} className="OploadSecion_section_right_content_parent_opload_item">
                                            <div className="parent_icon_pause_percent">
                                                <span className="Number_percent">{video.progress ? video.progress : "0"}%</span>

                                            </div>
                                            {video.progress < 100 && selectedVideoId === video.id && (
                                                <div className="depend_menu_option" onClick={() => handleCancelUpload(video.id)}>
                                                    <AiOutlineStop className="depend_menu_option_stop"
                                                    />
                                                    <span className="depend_menu_option_cancel">لغو</span>
                                                </div>
                                            )}

                                            {video.progress < 100 && (
                                                <div className="OploadSecion_section_right_content_parent_opload_item_secRight_top_parent_menu">
                                                    <p
                                                        className="menu_optiom" ref={menuOption}
                                                        onClick={() => handleShowOptions(video.id)}
                                                    >...</p>
                                                </div>
                                            )}

                                            <div className="OploadSecion_section_right_content_parent_opload_item_secLeft">
                                                <FaPhotoVideo className="icon_video" />
                                            </div>
                                            <div className="OploadSecion_section_right_content_parent_opload_item_secRight">

                                                <div className="OploadSecion_section_right_content_parent_opload_item_secRight_top">
                                                    <div className="parent_name_file">
                                                        <span className="name_file">{video.fileName ? video.fileName : "هنوز فایلی انتخاب نشده"}</span>
                                                    </div>
                                                    <div className="OploadSecion_section_right_content_parent_opload_item_secRight_top_parent_Part">
                                                        <span className="title_part_video">قسمت:</span>
                                                        <span className="part_video">{video.episodeNumber}</span>
                                                    </div>
                                                </div>
                                                <div className="OploadSecion_section_right_content_parent_opload_item_secRight_bootum">
                                                    {/* //اینجا آپلود رو نشون باید بدم */}
                                                    <div className="parent_status_bar">
                                                        <progress value={video.progress} max="100" className="status_bar"></progress>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}

                            </div>
                        </div>

                    </div>

                    <div className="parent_OploadSecion_section_left">
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
                            <div className="paneladmin_section_left_top_item22">
                                <span className="paneladmin_section_left_top_item22_span" onClick={handleNavigatePage}>افزدون دوره</span>
                                <FaFolderPlus className="paneladmin_section_left_top_item22_icon" />
                            </div>

                            <Link className='LinkOpload' to={"/PaneAdminOploadVideos"}>
                                <div className="paneladmin_section_left_top_item6">
                                    <span className="paneladmin_section_left_top_item6_span">ویرایش دوره</span>
                                    <FaUpload className="paneladmin_section_left_top_item6_icon" />
                                </div>
                            </Link>

                            <Link className='LinkOpload' to={"/PaneAdminComments"}>
                                <div className="paneladmin_section_left_top_item3">
                                    <span className="paneladmin_section_left_top_item3_span">مدیریت کاربران</span>
                                    <FaUserTie className="paneladmin_section_left_top_item3_icon" />
                                </div>
                            </Link>
                        </div>

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
            </div>
        </>
    )
}