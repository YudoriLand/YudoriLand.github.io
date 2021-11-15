var files_arr = ['/assets/images/yuri_png/yuri_run_1.png', '/assets/images/yuri_png/yuri_run_2.png', '/assets/images/yuri_png/yuri_run_3.png', '/assets/images/yuri_png/yuri_run_4.png',
'/assets/images/yuri_png/yuri_sleep.png', '/assets/images/object/bed.png'];
var arrColor = ["powderblue", "lightSteelBlue", "lightBlue", "skyBlue"];

var btnRestart = document.getElementById('restart-button');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var isJump = false;
var isPeak = false;
var isGround = true;
var isDead = false;
var init = false;

var timer = 0;
var randColor = 0;
var randSpeed = 0;
var createCloud = 0;
var lastTouchEnd = 0;
var frame = 0;

var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var valRatio = canvasHeight * 0.005;

var minTrapSpeed = 8;
var maxTrapSpeed = 27;
var randTrapSpeed;

var minCloudSpeed = 10;
var maxCloudSpeed = 40;
var randCloudSpeed;

// create per frame
var createCloudInterval = 1;
var craeteTrapInterval = 40;

// second per frame, second
var SecPerFrame = 0.05;
var frameIntervar;

var jumpPow = 10 * valRatio;
var velocity = 30 * valRatio;
var gravity = 5 * valRatio;
var currVelocity;
var currJumpPow;

var arrCloud = [];
var arrTrap = [];

var img = new Image();
var trapImg = new Image();

var trapSpeed = 0;
var currentY = 0;
var rundist = 0;
var score = 0;
var i = 0;

var colorLength;
var player;
var scoretxt;
var cloud;
var trap;



function loadJQuery() {
    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.charset = "utf-8";		  
    oScript.src = "/js/jquery-3.6.0.js";	
    document.getElementsByTagName("head")[0].appendChild(oScript);
}
loadJQuery();

function preloading (imageArray) { 
    let n = imageArray.length; 
    for (let i = 0; i < n; i++) { 
        let img = new Image(); img.src = imageArray[i]; 
    } 
} 
preloading(files_arr);
trapImg.src = files_arr[5];

function reloadDivArea() {
    $('#divReloadLayer').load(location.href+' #divReloadLayer');
}

function NoClickDelay(el) {
	this.element = el;
	if( window.Touch ) this.element.addEventListener('touchstart', this, false);
}

NoClickDelay.prototype = {
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
		}
	},

	onTouchStart: function(e) {
		e.preventDefault();
		this.moved = false;

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
	},

	onTouchMove: function(e) {
		this.moved = true;
	},

	onTouchEnd: function(e) {
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);

		if( !this.moved ) {
			var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
			if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;

			var theEvent = document.createEvent('MouseEvents');
			theEvent.initEvent('click', true, true);
			theTarget.dispatchEvent(theEvent);
		}
	}
};

$(document).ready(function() {
  $('.noclickdelay').each(function(i,node) {
    new NoClickDelay(node);
  });
  var startTime;
  $('button')
    .bind('touchstart', function(e) { startTime = e.timeStamp; })
    .click(function(e) { $('#result').html(e.timeStamp - startTime); });
});

document.documentElement.addEventListener('touchstart', function (event) {
     if (event.touches.length > 1) {
          event.preventDefault(); 
        } 
    }, false);



document.documentElement.addEventListener('touchend', function (event) {
     var now = (new Date()).getTime();
     if (now - lastTouchEnd <= 300) {
          event.preventDefault(); 
        } lastTouchEnd = now; 
    }, false);

// initialize
function initValue(){
    canvas = document.getElementById('canvas');
    btnRestart.style.visibility = "hidden";
    currJumpPow = jumpPow;
    currVelocity = velocity;
    
    player = new Player(img);
    scoretxt = new scoreText();
    
    timer = 0;
    frame = 0;
    score = 0;
    rundist = 0;
    trapSpeed = 0 ;
    arrCloud = [];
    arrTrap = [];
    
    isJump = false;
    isPeak = false;
    isGround = true;
    isDead = false; 
    
    colorLength = arrColor.length;
   
    randTrapSpeed = (maxTrapSpeed - minTrapSpeed);
    randCloudSpeed = (maxCloudSpeed - minCloudSpeed);
    frameIntervar = SecPerFrame * 1000;
}

// player class
class Player {
    constructor(img) {
        this.pow = 0;
        this.x = 0;
        this.y = canvasHeight;
        this.width = canvasWidth * 0.2;
        this.height = canvasWidth * 0.2;
        this.img = img;
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y - this.height - this.pow, this.width, this.height);
    }
}

// player jump
function playerJump(player) {
    if (isJump && !isGround) {
        currVelocity -= gravity;
        currJumpPow += currVelocity;
        player.pow = currJumpPow;

        if (currJumpPow <= 0) {
            isPeak = true;
        }
    }

    if (currJumpPow <= 0 && !isGround) {
        player.y = canvasHeight;
        player.pow = 0;
        isGround = true;
        isJump = false;
        currJumpPow = jumpPow;
        currVelocity = velocity;
    }
}

// draw player
function drawPlayer() {
    if (player === null) {
        return;
    } else {
        player.draw();
    }

    if (!isJump) {
        playerAnimation();
    }
    if (isJump) {
        playerJump(player);
    }

    function playerAnimation() {
        if (isDead) {
            img.src = files_arr[4];
        } else if (frame < 4) {
            img.src = files_arr[frame];
            frame++;
            if (frame >= 4) {
                frame = 0;
            }
        }
    }

}

// draw background cloud
function drawBackground() {
    if (timer % 1 === createCloud) {
        cloud = new Cloud(randColor, randSpeed);
        arrCloud.push(cloud);
    }
    arrCloud.forEach((a) => {
        a.draw();
        a.x -= a.speed;
    })

    if (arrCloud.length != 0) {
        if (arrCloud[0].x <= -arrCloud[0].width) {
            arrCloud.shift();
        }
    }
}

// cloud class
class Cloud {
    constructor(idx, speed) {
        this.x = canvasWidth;
        this.y = (Math.floor(Math.random() * 50)) * 5;
        this.width = canvasWidth * 0.3;
        this.height = canvasHeight * 0.03;
        this.idx = idx;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = arrColor[this.idx];
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// draw trap
function drawTrap() {
    trapSpeed = Math.floor((Math.random() * randTrapSpeed) + minTrapSpeed);
    if (timer % craeteTrapInterval === 0) {
        trap = new Trap(trapSpeed);
        arrTrap.push(trap);
    }

    arrTrap.forEach((a) => {
        a.draw();
        if (!isDead) {
            a.x -= a.speed;
        }
        checkCollision(player, a);
    })

    if (arrTrap.length != 0) {
        if (arrTrap[0].x <= -arrTrap[0].x2) {
            arrTrap.shift();
        }
    }
}

// trap class
class Trap {
    constructor(speed) {
        this.x1 = 0;
        this.x2 = this.x1 + canvasWidth * 0.1;
        this.x3 = this.x2 / 2;
        this.y1 = 0;
        this.y2 = this.y1 - canvasHeight * 0.1;
        this.speed = speed;
        this.clwd = canvas.clientWidth;
        this.x = canvasWidth;
        this.y = canvasHeight;
    }
    draw() {
        ctx.beginPath();
//        ctx.fillStyle = "purple";
        ctx.moveTo(this.x + this.x1, this.y + this.y1);
        ctx.lineTo(this.x + this.x2, this.y + this.y1);
        ctx.lineTo(this.x + this.x3, this.y + this.y2);
        ctx.closePath();
//        ctx.stroke();
//        ctx.fill();
        ctx.drawImage(trapImg, this.x, this.y, this.x2 * 2, this.y2 * 2)
    }
}

// check collision
function checkCollision(player, trap) {
    let playerWidth = player.width;
    let playerHeight = player.height;
    let trapWidth = Math.abs(trap.x2);
    let trapHeigth = Math.abs(trap.y2);

    let x1 = playerWidth * 0.3;
    let y1 = playerHeight * 0.5 + player.pow;
    let x2 = trap.x + (trapWidth * 0.5);
    let y2 = trapHeigth * 0.5;
    let difX = x2 - x1;
    let difY = y2 - y1;
    let powVal = Math.pow(difX, 2) + Math.pow(difY, 2);

    let minDist = playerHeight * 0.5 + trapHeigth * 0.5;
    let distance = Math.sqrt(powVal);


    if (playerWidth + trap.x3 > trap.x && player.pow < trapHeigth) {
        if (minDist > distance && !isDead) {
            img.src = files_arr[4];
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            isDead = true;
        }
    }

}

// run distance
class scoreText {
    constructor() {
        this.score = score;
    }
    draw() {
        ctx.font = "30px Verdana";
        ctx.textAlign = "center";
        ctx.strokeText(score + " m", canvasWidth * 0.5, canvasHeight * 0.2)
        ctx.strokeStyle = "black ";
        ctx.lineWidth = 5;
        ctx.fillStyle = "white";
        ctx.fillText(score + " m", canvasWidth * 0.5, canvasHeight * 0.2);
    }
}

// restart => initialize
function restart_click() {
    initValue();
}

// jump input
function jump_click() {
    if (!isDead && !isJump) {
        isJump = true;
        isGround = false;
    }
}

// calculation run distance
function calcScore() {
    if (!isDead) {
        rundist = (timer * SecPerFrame);
    }
}

// draw run distance
function drawScore() {
    calcScore();
    scoretxt.draw();
    score = Math.floor(rundist);
}

// check spacedown input
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !isDead) {
        isJump = true;
        isGround = false;
    }
})

// start play
function playGame() {
    timer++;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    valRatio = canvasHeight * 0.005;

    randColor = Math.floor((Math.random() * colorLength));
    randSpeed = Math.floor((Math.random() * randCloudSpeed) + minCloudSpeed);
    createCloud = Math.floor(Math.random() * createCloudInterval);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawTrap();
    drawPlayer();
    drawScore();

    if (isDead) {
        btnRestart.style.visibility = "visible";
        return;
    }
}

initValue();
setInterval(playGame, frameIntervar);