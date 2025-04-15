import { createContext ,useContext } from "react";
const UrlBack=createContext()

export const SiteProvider= ({children})=> {
    const siteUrl="https://f8f2-18-199-182-141.ngrok-free.app"



    function checkAccess() {


    }
    


    return (
        <UrlBack.Provider value={{siteUrl,checkAccess}}>
            {children}
        </UrlBack.Provider>
    )
}

//ساخت هوک اختصاصی
export const useSite=()=>useContext(UrlBack)