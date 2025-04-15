import { useEffect, useState } from 'react';
import './ShopingCart.css'
import { RiDeleteBin6Line } from "react-icons/ri";
import Header from '../../Components/Header/Header'
import axios from 'axios';
import { useSite } from '../../apiContext/ApiContext'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ConfirmationModal from '../../Components/Modal/Modal';
import TextSucces from "../../Components/Texts/Succes/TextSucces"


export default function ShopingCart() {
    const [priceALL, setPriceALL] = useState("0")
    const { siteUrl } = useSite()
    const [itemsCart, setItemsCart] = useState([])
    const navigate = useNavigate()
    const accesstoken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")
    const [idBuyEnd, setIdBuyEnd] = useState("")
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false)
    const [idDeleteItem, setIdDeleteItem] = useState("")
    const [conditionscart, setConditionscart] = useState("")
    const [linkEndBuy,setLinkEndBuy]=useState("")
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



    function errorToken() {
        if (err.response.data.message === "Unauthorized:ACCESS Token has expired" && err.response.data.status === 401) {
            // setShowLodindPage(true)
            const refiToken = { Token: refreshToken }
            if (refreshToken) {
                axios.post(`${siteUrl}/api/v1/auth/Token`, refiToken, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((responseFErfer) => {
                    
                    if (responseFErfer.status === 200 && responseFErfer.data.message === "Access token generated successfully") {
                        // setShowLodindPage(false)
                        Cookies.set('access_token', responseFErfer.data.accessToken)
                    }
                }).catch((err) => {
                    navigate("/Login")
                })
            } else {
                navigate("/Login")
            }
        }
        if (err.response.data.message = "Token is invalid" && err.response.data.status === 403) {
            navigate("/Login")
        }
        if (err.response.data.error = "not found") {
            navigate("/Error404")
        }
    }


    //گرفتن کل ایتم های صفحه سبد 
    useEffect(() => {
        axios.post(`${siteUrl}/api/v1/user/carts`, {}, {
             headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resItesmCart) => {
                
                if (resItesmCart.data.status ===200) {
                    setItemsCart(resItesmCart.data.courses)
                  
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
                
            })
    }, [])




///فعال کردن دکمه تایید نهایی
 useEffect(()=>{
    if(itemsCart.length<=0){
        setConditionscart("")
    }else{
        setConditionscart("foll")
    }
 },[itemsCart])



    //جمع کل سبد خرید
    useEffect(() => {
        setPriceALL("")

        itemsCart.map((ITEMCART) => {
            setPriceALL((pre) => {
                return Number(pre) + Number(ITEMCART.price)
            })
        })
    }, [itemsCart])


    //هندل کردن حذف ایتم از سبد خرید
    function ClickHandleRemoveItem({ id }) {
        setShowModalConfirmDelete(true)
        setIdDeleteItem(id)
    }

    //کلیک دکمه خیر مودال
    function CloseModalConfirm() {
        setShowModalConfirmDelete(false)
    }

    ///کلیک دکمه بله مودال
    function confirmDelete() {
        const idRemoveItem = {
            "id": idDeleteItem
        }
        axios.delete(`${siteUrl}/api/v1/user/carts/remove`, { data: idRemoveItem, headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true", "Authorization": `Bearer ${accesstoken}` } }).
            then((resRemoveItem) => {
                
                if (resRemoveItem.data.message = "Course Deleted from cart successfully") {
                    //کارای حذف دستی ایتم رو هم انجام بده
                    // Swal.fire({ title: "دوره شما با موفیقت حذف شد", icon: 'success' })
                    setShowTextSucces(true);
                    setTitleText("عملیات موفقیت آمیز")
                    setValueText("دوره شما با موفیقت حذف شد")
                     
                    
                    setItemsCart((pre) =>{
                        const filterNextDelete = pre.filter((itemha) => {
                            return itemha.courseID !== idDeleteItem
                        })
                        return filterNextDelete
                    })

                   
                   //پیدا کردن اطلاعات ایتم حذفی
                    const findItemRemove=itemsCart.find((ItemFindRemove)=>{
                       return ItemFindRemove.courseID===idDeleteItem        
                    })
                      //کم کردن قیمت پس از حذف
                    setPriceALL((prev)=>{
                        return prev-(Number(findItemRemove.price))
                    })

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

            })

        setShowModalConfirmDelete(false)
    }



    





  




    // هندل کردن فرایند ادامه خرید
    function hanldeClickBuy() {
       
        axios.post(`${siteUrl}/api/v1/user/carts/buy`, {}, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
            then((resBuyEnd) => {
                
                
                if (resBuyEnd.data.message === "Order placed successfully") {
                    setIdBuyEnd(resBuyEnd.data.order.id)
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
            })
    }


    //درخواست دوم برا تایید خرید
    useEffect(() => {
    
        if (idBuyEnd) {
            const IDBYUEND = {
                "orderID": idBuyEnd
            }
            

            axios.post(`${siteUrl}/api/v1/user/payment/checkout-session`, IDBYUEND, { headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accesstoken}` } }).
                then((resBuyEnd2) => {
                   
                    if (resBuyEnd2.data.message === "Checkout session created successfully") {
                        setLinkEndBuy(resBuyEnd2.data.sessionUrl)
                        
                    }
                }).catch((error) =>{

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
                })
        }

    },[idBuyEnd])



    // هدایت به صفحه پرداخت نهایی
    if(linkEndBuy.length>0){
        window.location.href=linkEndBuy
    }
  







    return (
        <>
            <Header page={"pageCart"}></Header>
            {showTextSucces && <TextSucces title={titleText} text={valueText}></TextSucces>}
            
            <div className='Shoping'>
                <div className='container'>

                    <div className='Shoping_header'>
                        <div className='Shoping_header_right'>
                            <h2 className='Shoping_header_right_title'>سبد خرید شما :<span className='Shoping_header_right_number'>{Number(itemsCart.length)}کالا</span> </h2>
                        </div>
                        <div className='Shoping_header_left'>
                        </div>
                    </div>

                    <div className='Shoping_content'> 
                        {showModalConfirmDelete && <div className='Parent_modal'>
                            <ConfirmationModal onClose={CloseModalConfirm} onConfirm={confirmDelete}></ConfirmationModal>
                        </div>}

                        <div className='Shoping_content_right'>

                            {itemsCart&&itemsCart.map((itemsCarts, index) => {
                                return (
                                    <div className='Shoping_content_item' key={index + 1}>
                                        <img src={`${siteUrl}${itemsCarts.media}`} alt="" className='Shoping_content_item_img' />
                                        <div className='Shoping_content_item_footer'>
                                            <h1 className='Shoping_content_item_title'>{itemsCarts.courseName}</h1>
                                            <p className='Shoping_content_item_teacher'>مدرس: <span className='Shoping_content_item_nameTeacher'>{itemsCarts.instructor}</span></p>
                                            <div className='Shoping_content_item_footer_price_btn'>
                                                <div className='Shoping_content_item_footer_parentBtn' onClick={() => ClickHandleRemoveItem({ id:itemsCarts.courseID})}>
                                                    <RiDeleteBin6Line className='Shoping_content_item_footer_icon' />
                                                    <button className='Shoping_content_item_footer_btn'>حذف کالا از سبد خرید</button>
                                                </div>
                                                <div className='Shoping_content_item_footer_parent_price'>
                                                    <span className='Shoping_content_item_footer_price'>{itemsCarts.price}تومان</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                            {itemsCart.length <= 0 ? <h3 className='Shoping_content_right_span_empety'>هیچ محصولی در سبد خرید شما موجود نیست.</h3> : ''}

                            
                        </div>
                        <div className='Shoping_content_left'>
                            <h2 className='Shoping_header_left_title'>قیمت کالاها : <span className='Shoping_header_left_number'>{Number(itemsCart.length)}</span></h2>

                            <div className='Shoping_content_left_priceALL'>
                                {/* به ازای هر دوره یکی از این دایو ها  */}
                                <div className='parent_Shoping_left_pricaALL'>

                                    {itemsCart&&itemsCart.map((itemSidebar, index) => {
                                        return (
                                            <div key={index + 1} className='Shoping_content_left_priceALL_item'>
                                                <span className='Shoping_content_left_priceALL_itemName'>{itemSidebar.courseName}</span>
                                                <span className='Shoping_content_left_priceALL_itemProce'>{itemSidebar.price}</span>
                                            </div>
                                        )
                                    })}
                                    {itemsCart.length <= 0 ? <h3 className='Shoping_content_right_span_empety_Sidebar'>هیچ محصولی در سبد خرید شما موجود نیست.</h3> : ''}
                                   
                                    <div className='Shoping_content_left_totalPrice'>
                                        <h1 className='Shoping_content_left_totalPrice_title'>جمع سبد خرید: </h1>
                                        <span className='Shoping_content_left_totalPrice_number'>{itemsCart.length >= 0 ?priceALL:0} تومان</span>
                                    </div>
                                </div>
                                <button className={`Shoping_content_left_totalPrice_btn ${conditionscart?"":"disableBtn"}`} onClick={hanldeClickBuy}>تایید و ادامه فرایند خرید</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}