import Home from "./Pages/Home/Home"
import Signup from "./Pages/Signup/Signup"
import Login from "./Pages/Login/Login"
import PanelAdminAddCourse from "./Pages/PanelAdmin/PanelAdmin"
import ShopingCart from "./Pages/ShopingCart/ShopingCart"
import CourseINfo from './Pages/CourseINfo/CourseINfo'
import Error from "./Pages/Error/Error"
import SuucessBuy from "./Pages/SuucessBuy/SuucessBuy"
import OploadVideos from "./Pages/oploadVideos/OploadVideos"
import PaneAdminComments from "./Pages/PaneAdminComments/PaneAdminComments"
import PanelUserpurchasedCourse from "./Pages/PanelUserpurchasedCourse/PanelUserpurchasedCourse"
import PanelUserfavoriteCourse from "./Pages/PanelUserfavoriteCourse/PanelUserfavoriteCourse"
import PanelUserComment from "./Pages/PanelUserComment/PanelUserComment"
import PanelUserInfo from "./Pages/PanelUserInfo/PanelUserInfo"
import FailedBuy from "./Pages/FaildBuy/FailedBuy"

const routes=[{path:"/" ,element:<Signup></Signup>},
     {path:"/Home" ,element :<Home></Home>} ,
    {path:"/Signup" ,element:<Signup></Signup>} ,
    {path:"/Login" ,element:<Login></Login>} ,
    {path:"/PanelAdminAddCourse",element:<PanelAdminAddCourse></PanelAdminAddCourse>} ,  
    {path:"/ShopingCart" ,element:<ShopingCart></ShopingCart>} ,
    {path:"/Course/:id",element:<CourseINfo></CourseINfo>} ,
    {path:"/Error404",element:<Error></Error>},
    {path:"/SuucessBuy",element:<SuucessBuy></SuucessBuy>},
    {path:"/PaneAdminOploadVideos",element:<OploadVideos></OploadVideos>},
    {path:"/PaneAdminComments" ,element:<PaneAdminComments></PaneAdminComments>},
    {path:"/PanelUserpurchasedCourse",element:<PanelUserpurchasedCourse></PanelUserpurchasedCourse>},
    {path:"/PanelUserfavoriteCourse",element:<PanelUserfavoriteCourse></PanelUserfavoriteCourse>},
    {path:"/PanelUserComment",element:<PanelUserComment></PanelUserComment>},
    {path:"/PanelUserInfo" ,element:<PanelUserInfo></PanelUserInfo>},
    {path:"/FailedBuy",element:<FailedBuy></FailedBuy>}
]
export default routes