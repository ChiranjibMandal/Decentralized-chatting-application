export default {
    setItem : (key,value)=>{
        localStorage.setItem(key,JSON.stringify(value))
    },
    getItem : (key)=>{
        let temp =  localStorage.getItem(key);
        if(temp !== null) return JSON.parse(temp)
        return null;
    },
    removeItem : (key)=>{
        localStorage.removeItem(key);
    },
    clear : ()=>localStorage.clear()
}