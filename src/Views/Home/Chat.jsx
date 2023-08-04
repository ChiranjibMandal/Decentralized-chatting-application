import React, { useEffect, useState } from 'react'
import syncicon from "../../assets/reply.png"
import sendicon from "../../assets/send.png"
import MessageReceived from '../../components/MessageReceived'
import MessageSend from '../../components/MessageSend'
import axios from 'axios'
import { baseURL, check_msgURL, send_msgURL } from '../../constants'
import getTimeFormated from '../../utils/getTimeFormated'
import appStorage from '../../utils/appStorage'
const MESSAGE_ENUM = {
    RECEIVED: "RECEIVED",
    SENT: "SENT",
}
const initMessageObject = [
    // { msg: "How are you ?", time: '10:26 PM', type: MESSAGE_ENUM.RECEIVED },
    // { msg: "Hi there", time: '10:26 PM', type: MESSAGE_ENUM.SENT },
    // { msg: "Hello", time: '10:26 PM', type: MESSAGE_ENUM.RECEIVED },
]
function Chat({
    // receiver = "",
    changePanel = () => { }
}) {
    const [chatMessages, setChatMessages] = useState([])
    const [progress, setProgress] = useState(false)
    const [checkProgress, setCheckProgress] = useState(false)
    const [sentProgress, setSentProgress] = useState(false)
    const [inputMsg, setInputMsg] = useState("");
    const [receiver, setReceiver] = useState("")
    const checkMessage = async () => {
        setCheckProgress(true)
        await axios.get(baseURL + check_msgURL+"?receiver=" + receiver).then(({ data }) => {
            //Uncomment below line in production
            // console.log("Data : ",data[0]);
            pushDataToStorage(MESSAGE_ENUM.RECEIVED,data[0][1]);
        }).catch(err => {
            console.log("check msg err log : ", err);
        }).finally(() => {
            setCheckProgress(false);
            // below lines need to be remove in production
            // pushDataToStorage(MESSAGE_ENUM.RECEIVED,"Dummy message come from receiver.");
        })
        // setTimeout(() => {
        //     setCheckProgress(false);
        //     const msg_body = { msg: "Dummy message come from receiver.", time: new Date(), type: MESSAGE_ENUM.RECEIVED }
        //     setChatMessages([msg_body, ...chatMessages])
        // }, 2000)
    }
    const pushDataToStorage = (type,msg) => {
        if(msg !== chatMessages[chatMessages.length-1].msg || type == MESSAGE_ENUM.SENT){
            console.log(msg ,chatMessages[chatMessages.length -1].msg );
            const msg_body = { msg: msg, time: new Date(), type }
            let temp = [msg_body, ...chatMessages]
            setChatMessages(temp)
            appStorage.setItem(receiver, temp)
            if(type == MESSAGE_ENUM.SENT){
                setInputMsg("")
            }
        }

    }
    const submitMessage = async (event) => {
        event.preventDefault();
        if (inputMsg) {
            setSentProgress(true);
            await axios.post(baseURL + send_msgURL, {
                receiver,
                msg: inputMsg,
                sender: appStorage.getItem("active_sender")
            }).then(({ data }) => {
                if (data.status) {
                    pushDataToStorage(MESSAGE_ENUM.SENT,inputMsg);
                } else {
                    console.log("send msg err data : ", data);
                }
            }).catch(err => {
                console.log("send msg err log : ", err);
            }).finally(() => {
                setSentProgress(false);
                // below lines need to be remove in production
                // pushDataToStorage(MESSAGE_ENUM.SENT,inputMsg);
            })
        } else {
            alert('Please enter message first.')
        }
    }
    useEffect(() => {
        // setProgress(true);
        let active_receiver = appStorage.getItem("active_receiver")
        if (active_receiver !== null) {
            setReceiver(active_receiver)
            let data = appStorage.getItem(active_receiver)
            if (data !== null) {
                setChatMessages(data)
            }
        }
        // let timeout = setTimeout(() => {
        //     setProgress(false);
        // }, [])
        // let interval = setInterval(()=>checkMessage(),3000)
        // return ()=>{clearInterval(interval)}
    }, [])

    return (
        <div className="chat-container">
            <div style={{ display: "flex", padding: 20, borderBottom: '1px solid var(--light-grey)' }}  >
                <div style={{ flex: 1 }}>
                    <h1 className='title' >De - Chat</h1>
                    <span className='rec-name' >Chatting with {receiver} </span>
                    {/* <span className='rec-add'>[ {receiver.address} ]</span>  */}
                </div>
                <div>
                    <button style={{ display: 'block', width: '100%', margin: 5 }} onClick={() => { changePanel();appStorage.setItem('active_sender', null); appStorage.setItem('active_receiver', null) }} className='btn-danger' >Logout</button>
                    <button style={{ display: 'block', width: '100%', margin: 5 }} onClick={() => { setChatMessages([]); appStorage.setItem(receiver, []) }}  >Clear messages</button>
                </div>
            </div>
            <div className="chat-messages">
                <div className="chat-list">
                    <div onClick={checkMessage} className="message received check-msg">
                        <div className="icon">
                            <img className={checkProgress ? 'spin' : ""} src={syncicon} alt="sync-icon" />
                        </div>
                        <div className="text">
                            Click to check new incoming message.
                        </div>
                    </div>
                    {
                        chatMessages.map((msg, mi) => (
                            msg.type == MESSAGE_ENUM.RECEIVED ?
                                <MessageReceived key={mi} title={msg.msg} time={getTimeFormated.getUTCTime(msg.time)} />
                                :
                                <MessageSend key={mi} title={msg.msg} time={getTimeFormated.getUTCTime(msg.time)} />
                        ))
                    }
                </div>


            </div>
            <form onSubmit={submitMessage} className="chat-input">
                <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Type your message" />
                <button disabled={sentProgress} >{sentProgress ? "Sending ..." : "Send"} </button>
            </form>
        </div>

    )
}


export default Chat