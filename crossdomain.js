window.addEventListener('message',function(event){
    if(!event.origin.includes('chrome-extension://')) return false;
    if(event.data.includes('badgeNotifications')) window.localStorage.storageUserProfile = event.data
});