var map = setUpMap();
var messageObjects = [];
getAllMessages();

function setUpMap(){
    var map = L.map('map').setView([59.3294, 18.0686], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/jalma.oe4kdjb8/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFsbWEiLCJhIjoiY2lpNjN1d3RyMDA2bHZ3bTNmMTVhZ2RscyJ9.N-JYQ1IMDNJ3b4xIymdonA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'jalma.oe4kdjb8',
        accessToken: 'pk.eyJ1IjoiamFsbWEiLCJhIjoiY2lpNjN1d3RyMDA2bHZ3bTNmMTVhZ2RscyJ9.N-JYQ1IMDNJ3b4xIymdonA'
    }).addTo(map);
    return map;
}
function getAllMessages(){
    var url = "http://api.sr.se/api/v2/traffic/messages";
    getMessages(url);
}
function getMessages(url){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.send();
}
function reqListener () {
    var thisPage = this.responseXML.getElementsByTagName("page");
    thisPage = thisPage.item(0).childNodes[0].data;

    var totalPages = this.responseXML.getElementsByTagName("totalpages");
    totalPages = totalPages.item(0).childNodes[0].data;

    var nextPage = this.responseXML.getElementsByTagName("nextpage");
    if(nextPage.item(0) != null){
        nextPage = nextPage.item(0).childNodes[0].data;
    }

    var messages  = this.responseXML.getElementsByTagName("message");
    for(i = 0; i < messages.length; i++){
        var message = {
            priority:i,
            //exactlocation:messages.item(i).childNodes[5].childNodes[0].data,
            description:messages.item(i).childNodes[7].childNodes[0].data,
            lat:messages.item(i).childNodes[9].childNodes[0].data,
            long:messages.item(i).childNodes[11].childNodes[0].data,
            category:messages.item(i).childNodes[15].childNodes[0].data
        };
        messageObjects.push(message);
    }
    if(thisPage != totalPages){
        getMessages(nextPage);
    }
    printMessagesToMap();
}
function printMessagesToMap(){
for (i = 0; i < messageObjects.length; i++) {
    var marker = L.marker([messageObjects[i].lat, messageObjects[i].long]).addTo(map);
    marker.bindPopup("<h2>"+ messageObjects[i].category + "</h2>" + messageObjects[i].description);
}
}