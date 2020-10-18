
var moveX, moveY;
var diffX, diffY;
var clickX = -100, clickY = -100;

var mapSize = 1000;
var maxSize = mapSize/5;
var minSize = 5;
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
        bonus: 0,
        shield: 10,
        visible: false,
        points: 0,
    },
    {
        velX :4,
        velY :4,
        dirX : -100,
        dirY : -100,
        size : 50,
        color: "#C80",
        shield: 10,
        bonus: 0,
        visible: true,
        points: 0,
    },
    {
        velX :4,
        velY :4,
        dirX : -100,
        dirY : -100,
        size : 50,
        color: "#8C0",
        shield: 10,
        bonus: 0,
        visible: true,
        points: 0,
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

function triangulo(x1, y1, x2, y2, x3, y3) {
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

function texto(x,y,txt,size,fill){
    ctx.fillStyle = fill;
    ctx.font = size + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(txt, x, y);
}

function borrar(x, y, ancho, alto) {
    ctx.clearRect(x, y, ancho, alto);
}

function positionPlayer(i){
    var retries=30;
    var found=false;
    while(!found && retries>0){
        players[i].posX = random(players[i].size, mapSize - players[i].size);
        players[i].posY = random(players[i].size, mapSize - players[i].size);
        
        for(var idx=0; idx<players.length; idx++){
            if (idx==i){
                continue;
            }
            if (players[idx].visible==false){
                continue;
            }
            var dp = dist(players[idx].posX, players[idx].posY, players[i].posX, players[i].posY);
            if (dp>players[idx].size+players[i].size+100){
                console.log("retries "+retries);
                found=true;
                break;
            }
        }
        retries--;
    }
    console.log("retries ",retries,found);
}

function restart(){
    for(var i=0; i<players.length; i++){
        var mp=localStorage.getItem("maxpoints");
        if (!mp || mp<players[i].points){
            localStorage.setItem("maxpoints",Math.round(players[i].points));
        }
        players[i].visible=true;
        players[i].size=30+i*5;
        players[i].points=0;
        positionPlayer(i);
    }
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}


window.addEventListener("mousedown", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = ev.pageX;
    clickY = ev.pageY;
    if (players[0].visible==false){
        restart();
    }
})


window.addEventListener("touchstart", function (ev) {
    //console.log("start",ev.touches[0].pageX,ev.touches[0].pageY);
    clickX = ev.touches[0].pageX;
    clickY = ev.touches[0].pageY;
    if (players[0].visible==false){
        restart();
    }

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

for (var i = 0; i < 20; i++) {
    point(random(5, mapSize - 5), random(5, mapSize - 5), 5, "green");
    point(random(10, mapSize - 10), random(10, mapSize - 10), 10, "blue");
}

var proc=0;

function update() {

    if (players[0].visible==false){
        ctx.fillStyle="rgba(255,255,255,0.3)";
        ctx.fillRect(300, 300, 400, 400);
        texto(500,500,"Start",50,"#f00");
        return;
    }
    borrar(0, 0, 1000, 1000);
    proc++;
    for(var i=0; i<players.length; i++){
        if (players[i].visible==false){
            continue;
        }
        if (proc%10==0){
            if (players[i].shield>0){
                players[i].shield-=1;
            }
        }
        if (players[i].size>40 && proc%500==0){
            players[i].size-=(players[i].size*0.05);
        }
        if (i>0 && proc%10==0 ){
            var diffX=players[0].posX-players[i].posX;
            var diffY=players[0].posY-players[i].posY;
            if(Math.abs(diffX)>Math.abs(diffY)){
                var ratio=Math.abs((diffX/2));
                ratio+=(0.01*players[i].size/maxSize);
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

    for (var idx = 0; idx < points.length; idx++) {
        var pt = points[idx];
        for(var i=0; i<players.length; i++){
            if (players[i].visible==false){
                continue;
            }
            var d = dist(players[i].posX, players[i].posY, pt.x, pt.y);
            if (d <= players[i].size && pt.visible) {
                pt.visible = false;
                players[i].size = Math.min(maxSize, players[i].size + pt.r / 10);
                players[i].points+=pt.r/5;
            }
            if (i>0 && players[0].visible && proc%10==0){
                var dp = dist(players[i].posX, players[i].posY, players[0].posX, players[0].posY);
                if (dp <= players[i].size+players[0].size) {
                    if (players[i].size>players[0].size ){
                        if (players[0].shield==0){
                            players[i].bonus+=0.2;
                            players[i].size = Math.min(maxSize, players[i].size -0.1);    
                            players[0].size = Math.max(0, players[0].size -0.5);    
                            if (players[0].size<minSize){
                                players[i].size+=players[i].bonus;
                                players[i].points+=players[i].bonus*10;
                                players[i].bonus=0;
                                players[0].visible = false;
                            };    
                        }
                    }else{
                        players[0].bonus+=0.2;
                        players[0].size = Math.min(maxSize, players[0].size -0.1);    
                        players[i].size = Math.max(0, players[i].size - 0.5); 
                        if (players[i].size<minSize){
                            players[i].visible = false;
                            players[0].size+=players[0].bonus;
                            players[0].points+=players[0].bonus*10;
                            players[0].bonus=0;
                            players[0].shield=10;
                            setTimeout(function(i){
                                players[i].visible = true;
                                players[i].size = players[0].size+5;
                                positionPlayer(i);
                            },5000,i)
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
        if (players[i].shield>0){
            ctx.fillStyle = "#ee0";
        }
        ctx.font = players[i].size + "px Arial";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(players[i].size), players[i].posX, players[i].posY);

        ctx.font="24px Arial";
        ctx.textAlign="right";
        ctx.fillStyle=players[i].color;
        ctx.fillText(Math.round(players[i].points), 980, 70+30*i);
        ctx.fillStyle="#000";
        ctx.fillText("MAX "+Math.round(localStorage.maxpoints), 980, 40);
        //ctx.font = (players[i].size-4) + "px Arial";
        //ctx.fillText(Math.round(players[i].shield), players[i].posX, players[i].posY+players[i].size/2);
    }

    ellipse(clickX, clickY, 100, 100, "rgba(0,0,0,0.2)");
    ellipse(players[0].dirX, players[0].dirY, 40, 40, "rgba(128,128,128,0.6)");

}


setInterval(update, 40);

setInterval(function () {
    point(random(5, mapSize - 5), random(5, mapSize - 5), 5, "green");
    point(random(10, mapSize - 10), random(10, mapSize - 10), 10, "blue");
}, 1000);

setInterval(function () {
    point(random(20, mapSize - 20), random(20, mapSize - 20), 20, "#C0C");
}, 15000);

resized();
window.addEventListener("resize",resized);