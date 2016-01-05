var map = setUpMap();
var messageObjects = [];
getAllMessages();
var movingDiv = false;
document.getElementById("information").onmousedown=function(){
    movingDiv = true;
    document.onmousemove = readMouseMove;
};
document.getElementById("information").onmouseup=function(){
   movingDiv = false;
};
function readMouseMove(e){
    if(movingDiv){

        var result_x = document.getElementById('x_result');
        var result_y = document.getElementById('y_result');
        document.getElementById("information").style.top =  e.clientY - 10 +"px";
        document.getElementById("information").style.left = e.clientX - 10 +"px";
        document.getElementById("information").style.backgroundColor = "red";
        result_x.innerHTML = e.clientX;
        result_y.innerHTML = e.clientY;
    }
}
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
        if(messages.item(i).childNodes[5].childNodes[0] == null){
            var exlocat = null;
            console.log("Ingen exakt lokation");
            }
        else{
            exlocat = messages.item(i).childNodes[5].childNodes[0].data;
        }
        var desc = messages.item(i).childNodes[7].childNodes[0].data;
        var latitude = messages.item(i).childNodes[9].childNodes[0].data;
        var longitude = messages.item(i).childNodes[11].childNodes[0].data;
        var cat = messages.item(i).childNodes[15].childNodes[0].data;

        var message = {
            priority:i,
            exactlocation:exlocat,
            description: desc,
            lat: latitude,
            long: longitude,
            category: cat
        };
        messageObjects.push(message);
    }
    if(thisPage != totalPages){
        getMessages(nextPage);
    }
    else{
        setInfo("Information loaded sucessfully");
        printMessagesToMap();
    }
}
function printMessagesToMap(){
    console.log(messageObjects);
for (i = 0; i < messageObjects.length; i++) {
    var marker = L.marker([messageObjects[i].lat, messageObjects[i].long]).addTo(map);
    if(messageObjects[i].exactlocation == null){
        marker.bindPopup("<h2>"+ messageObjects[i].category + "</h2>" + messageObjects[i].description);
    }
    else{
        marker.bindPopup("<h2>"+ messageObjects[i].category + "</h2><h3>"+ messageObjects[i].exactlocation +"</h3>" + messageObjects[i].description);
    }
}
}
function setInfo(message){
    var p = document.createElement("P");
    var infoText = document.createTextNode(message);
    p.appendChild(infoText);
    document.getElementById("info_infospace").appendChild(p);
}