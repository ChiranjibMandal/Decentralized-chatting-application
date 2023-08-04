export default {
    getUTCTime: (d = new Date()) => {
        var currentTime;
        var currentDate = new Date(d)
        var hour = currentDate.getHours();
        var meridiem = hour >= 12 ? "PM" : "AM";
        currentTime = ((hour + 11) % 12 + 1) + ":" + currentDate.getMinutes() +" " + meridiem;
        return currentTime;
    }
}