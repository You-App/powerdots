
var moveX, moveY;
var diffX, diffY;
var clickX = -100, clickY = -100;

var mapSize = 1000;
var points = [
];

var players=[
    {
        velX :0,
        velY :0,
        dirX : -100,
        dirY : -100,
        size : 30,
        color: "red",
        visible: true
    },
    {
        velX :4,
        velY :4,
        dirX : -100,
        dirY : -100,
        size : 50,
        color: "#FD0",
        visible: true
    },
    {
        velX :4,
        velY :4,
        dirX : -100,
        dirY : -100,
        size : 50,
        color: "#DF0",
        visible: true
    },
]


var canvas = document.getElementById('tutorial');
canvas.setAttribute("width", mapSize);
canvas.setAttribute("height", mapSize);
var ctx = canvas.getContext('2d');

function resized(){
    var vw=document.body.clientWidth;
    var vh=document.body.clientHeight;
    var size=Math.min(vw,vh);
    canvas.style.width=size+"px";
    canvas.style.height=size+"px";
}

function point(x0, y0, radius, color) {
    points.push({ x: x0, y: y0, r: radius, color: color, visible: true });
}

function dist(x0, y0, x1, y1) {
    return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
}


function ellipse(x, y, ancho, alto, bgcolor) {
    ctx.fillStyle = bgcolor;
    ctx.beginPath();
    ctx.ellipse(
        x, y, //x,y
        ancho, alto,  // ancho, alto
        0, // rotacion
        0, Math.PI * 2, // angulo inicio y fin
        true);
    ctx.fill();
}

function triamgulo(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}

function rectangulo(x, y, ancho, alto) {
    ctx.fillRect(x, y, ancho, alto);
}

function borrar(x, y, ancho, alto) {
    ctx.clearRect(x, y, ancho, alto);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}


window.addEventListener("mousedown", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = ev.pageX;
    clickY = ev.pageY;
})


window.addEventListener("touchstart", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = ev.touches[0].pageX;
    clickY = ev.touches[0].pageY;
})


window.addEventListener("touchmove", function (ev) {
    //console.log("move",ev.touches[0].pageX,ev.touches[0].pageY);
    moveX = ev.touches[0].pageX;
    moveY = ev.touches[0].pageY;
    diffX = moveX - clickX, diffY = moveY - clickY;
    players[0].dirX = clickX + Math.max(-60, Math.min(60, diffX));
    players[0].dirY = clickY + Math.max(-60, Math.min(60, diffY));
    players[0].velX = Math.min(10, diffX / 100);
    players[0].velY = Math.min(10, diffY / 100);
})

window.addEventListener("mousemove", function (ev) {
    if (clickX < 0) {
        return;
    }
    //console.log("move",ev.touches[0].pageX,ev.touches[0].pageY);
    moveX = ev.pageX;
    moveY = ev.pageY;
    //console.log(diffX = moveX - clickX, diffY = moveY - clickY);
    players[0].dirX = clickX + Math.max(-60, Math.min(60, diffX));
    players[0].dirY = clickY + Math.max(-60, Math.min(60, diffY));
    players[0].velX = Math.min(10, diffX / 100);
    players[0].velY = Math.min(10, diffY / 100);
})

window.addEventListener("touchend", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = -100;
    clickY = -100;
    players[0].dirX = -100;
    players[0].dirY = -100;
})

window.addEventListener("mouseup", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = -100;
    clickY = -100;
    players[0].dirX = -100;
    players[0].dirY = -100;
})

for(var i=0; i<players.length; i++){
    players[i].posX = random(players[i].size, mapSize - players[i].size);
    players[i].posY = random(players[i].size, mapSize - players[i].size);
}

for (var i = 0; i < 20; i++) {
    point(random(5, mapSize - 5), random(5, mapSize - 5), 5, "green");
    point(random(10, mapSize - 10), random(10, mapSize - 10), 10, "blue");
}

var proc=0;
function update() {
    proc++;
    for(var i=0; i<players.length; i++){
        if (players[i].visible==false){
            continue;
        }
        if (i>0 && proc%10==0 ){
            var diffX=players[0].posX-players[i].posX;
            var diffY=players[0].posY-players[i].posY;
            if(Math.abs(diffX)>Math.abs(diffY)){
                var ratio=Math.abs((diffX));
                players[i].velX=diffX/ratio;
                players[i].velY=diffY/ratio;    
            }
            else{
                var ratio=Math.abs(diffY);
                players[i].velX=diffX/ratio;
                players[i].velY=diffY/ratio;    
            }
        }
        players[i].posX = players[i].posX + players[i].velX;
        players[i].posY = players[i].posY + players[i].velY;
        if (players[i].posX < players[i].size) {
            players[i].posX = players[i].size;
        }
        if (players[i].posX > mapSize - players[i].size) {
            players[i].posX = mapSize - players[i].size
        }
        if (players[i].posY < players[i].size) {
            players[i].posY = players[i].size;
        }
        if (players[i].posY > mapSize - players[i].size) {
            players[i].posY = mapSize - players[i].size
        }
    }

    borrar(0, 0, 1000, 1000);

    for (var idx = 0; idx < points.length; idx++) {
        var pt = points[idx];
        for(var i=0; i<players.length; i++){
            if (players[i].visible==false){
                continue;
            }
            var d = dist(players[i].posX, players[i].posY, pt.x, pt.y);
            if (d <= players[i].size && pt.visible) {
                pt.visible = false;
                players[i].size = Math.min(mapSize, players[i].size + pt.r / 10);
            }
            if (i>0 && players[0].visible && proc%10==0){
                var dp = dist(players[i].posX, players[i].posY, players[0].posX, players[0].posY);
                if (dp <= players[i].size+players[0].size) {
                    if (players[i].size>players[0].size){
                        players[i].size = Math.min(mapSize/2, players[i].size +0.2);    
                        players[0].size = Math.max(0, players[0].size -1);    
                        console.log(0,players[0].size);
                        if (players[0].size<1){
                            players[0].visible = false;
                            setTimeout(function(i){
                                players[i].visible = true;
                                players[i].size = 30;
                                players[i].posX = random(players[i].size, mapSize - players[i].size);
                                players[i].posY = random(players[i].size, mapSize - players[i].size);    
                            },1000,0)
                        };
                    }else{
                        players[0].size = Math.min(mapSize/2, players[0].size + 0.2);    
                        players[i].size = Math.max(0, players[i].size - 1); 
                        console.log(i,players[0].size);   
                        if (players[i].size<1){
                            players[i].visible = false;
                            setTimeout(function(i){
                                players[i].visible = true;
                                players[i].size = players[0].size+10;
                                players[i].posX = random(players[i].size, mapSize - players[i].size);
                                players[i].posY = random(players[i].size, mapSize - players[i].size);    
                            },1000,i)
                        }

                    }
                }
            }
        }
        if (pt.visible) {
            ellipse(pt.x, pt.y, pt.r, pt.r, pt.color);
        }
    }
    for(var i=0; i<players.length; i++){
        if (players[i].visible==false){
            continue;
        }
        ellipse(players[i].posX, players[i].posY, players[i].size, players[i].size, players[i].color);
        ctx.fillStyle = "white";
        ctx.font = players[i].size + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(players[i].size), players[i].posX, players[i].posY);
    }

    ellipse(clickX, clickY, 100, 100, "rgba(0,0,0,0.2)");
    ellipse(players[0].dirX, players[0].dirY, 40, 40, "rgba(128,128,128,0.6)");

}


setInterval(update, 40);

setInterval(function () {
    point(random(5, mapSize - 5), random(5, mapSize - 5), 5, "green");
    point(random(10, mapSize - 10), random(10, mapSize - 10), 10, "blue");
}, 1000);

resized();
window.addEventListener("resize",resized);