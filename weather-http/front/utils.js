function getBackgroundWrtTime(){
    let hour = new Date().getHours();

    if(hour > 22 || hour < 7)
        return "blue-gradient"; // Night
    else if(hour >= 7 && hour <= 12)
        return "juicy-peach-gradient"; // Morning
    else if(hour >= 12 && hour <= 19)
        return "sunny-morning-gradient"; // Day
    else
        return "deep-blue-gradient"; //Evening
}

function getTextColorWrtTime(muted){
    let hour = new Date().getHours();

    if(hour > 22 || hour < 7)
        return "text-white"; // Night
    else
        return muted ? "text-muted" : "" ;
}

export { getBackgroundWrtTime, getTextColorWrtTime }