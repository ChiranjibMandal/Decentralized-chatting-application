import React, {useEffect, useState} from 'react'
import GetAddress from './GetAddress'
import Chat from './Chat'
import appStorage from '../../utils/appStorage'
const PANEL_ENUM = {
    GET_ADDRESS : "GET_ADDRESS",
    CHAT : "CHAT",
    PENDING : "PENDING"
}
function Home() {
    const [activePanel , setActivePanel]= useState(PANEL_ENUM.PENDING)
    const [receiver,setReceiver] = useState("")
    const changePanelToChat = (add)=>{
        setReceiver(add)
        setActivePanel(PANEL_ENUM.CHAT);
    }
    const changePanelToAddress = ()=>{
        setReceiver("")
        setActivePanel(PANEL_ENUM.GET_ADDRESS);
    }
    useEffect(()=>{
        let active = appStorage.getItem("active_receiver")
        if(active !== null){
            setActivePanel(PANEL_ENUM.CHAT)
        }else{
            setActivePanel(PANEL_ENUM.GET_ADDRESS)
        }
    },[])
    if(activePanel ==  PANEL_ENUM.CHAT){
        return <Chat changePanel={changePanelToAddress} receiver={receiver} />
        
    }else if(activePanel ==  PANEL_ENUM.GET_ADDRESS){
        return <GetAddress changePanel={changePanelToChat} />
    }else{
        return null
    }
}


export default Home