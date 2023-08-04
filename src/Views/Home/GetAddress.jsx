import axios from 'axios';
import React, { useState } from 'react'
import { baseURL, sign_upURL } from '../../constants';
import appStorage from '../../utils/appStorage';

function GetAddress({
    changePanel = () => { }
}) {
    const [address, setAddress] = useState("");
    const [progress ,setProgress] = useState(false)
    const [sender ,setSender] = useState("")
    const saveUser = (address)=>{
        appStorage.setItem("active_sender",sender)
        appStorage.setItem("active_receiver",address)
        changePanel(address)
    }
    const submitHandler = async(event) => {
        event.preventDefault();
        if (validate(address)) {
            setProgress(true);
            await axios.post(baseURL + sign_upURL,{
                accountAddress : address
            }).then(({data})=>{
                if(data.status){
                    saveUser(address)
                }else{
                    console.log("sign up err data : ",data);
                }
            }).catch(err=>{
                console.log("sign up err log : ",err);
            }).finally(()=>{
                setProgress(false);
                // below lines need to be remove in production
                saveUser(address)
            })
        } else {
            alert("Not a valid address !" + address)
        }
    }
    const validate = (hex) => {
        return typeof hex === 'string'
            && hex.length === 42
            && !isNaN(Number(hex))
        // Do things with isHex Boolean
    }
    
    return (
        <div className="wrapper">
            <div className="room-box">
                <h1 className='title' >De - Chat</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor="">Sender</label>
                    <input value={sender} onChange={(e) => setSender(e.target.value)} type="text" placeholder='A hexcode address eg: 0xff4656...' />
                    <label htmlFor="">Receiver</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder='A hexcode address eg: 0xff4656...' />
                    <button className='btn'> {progress ? "Entering into chat room ..." : "Start chatting"} </button>
                </form>
            </div>
        </div>
    );
}

export default GetAddress