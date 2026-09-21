import { useEffect } from "react";
import { useRefreshMutation } from "Api/AuthApi";

export default function AuthBootstrap(){
    const [refresh] = useRefreshMutation()

    useEffect(()=>{
        refresh()
    },[])

    return null
}
