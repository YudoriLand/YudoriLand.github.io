        var files_arr = ['/assets/images/yuri_png/yuri_run_1.png', '/assets/images/yuri_png/yuri_run_2.png', '/assets/images/yuri_png/yuri_run_3.png', '/assets/images/yuri_png/yuri_run_4.png'];
        var arrColor = ["powderblue", "lightSteelBlue", "lightBlue", "skyBlue"];
        var isJump = false;
        var isPeak = false;
        var isGround = true;
        var isDead = false;
//        var player = document.getElementById('player');
        var game_box = document.getElementById('game-box');
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        
        var timer = 0;
        var randColor = 0;
        var randSpeed = 0;
        var createCloud = 0;
        var frame = 0;
        var game_boxHeight = game_box.clientHeight;
        var game_boxWidth = game_box.clientWidth;

        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;
        var valRatio = canvasHeight * 0.005;
        
        var jumpPow = 10 * valRatio;
        var velocity = 30 * valRatio;
        var gravity = 5 * valRatio;
        var currVelocity = velocity;
        var currJumpPow = gravity;
        var arrCloud = [];
        var arrTrap = [];
        var img = new Image();
        var i = 0;
        var currentY = 0;

        function playGame() {
            if (isDead) {
                return;
            }
            game_boxHeight = game_box.clientHeight;
            game_boxWidth = game_box.clientWidth;
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            
            valRatio = canvasHeight * 0.005;
            
            randColor = Math.floor((Math.random() * 4) + 0);
            randSpeed = Math.floor((Math.random() * 30) + 10);
            createCloud = Math.floor(Math.random() * 1);
            timer++;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBackground();   
            drawTrap();
            drawPlayer();
        }

        function playerJump(player) {
            if (isJump && !isGround){
                currVelocity -= gravity;
                currJumpPow += currVelocity;
                player.pow = currJumpPow;
                
                if (currJumpPow <= 0){
                    isPeak = true;
                }
            }

            if (currJumpPow <= 0 && !isGround){
                player.y = canvasHeight;
                player.pow = 0;
                isGround = true;
                isJump = false;
                currJumpPow = jumpPow;
                currVelocity = velocity;
            }
        }
       
        function drawPlayer(){
            if (player === null){
                
                return;
            }
            else{
                player.draw(); 
            }
            
            if (!isJump){
                playerAnimation();
            }
            if (isJump){
                playerJump(player);
            }
            
            function playerAnimation(){
                if (frame < 4){
                    img.src = files_arr[frame];
                    frame++;
                if (frame >= 4){
                    frame = 0;
                    }
                }
            }

        }
        class Player{
            constructor(img, pow){
                this.pow = pow;
                this.x = 0;
                this.y = canvasHeight;
                this.width = canvasWidth * 0.2;
                this.height = canvasWidth * 0.2;
                this.img = img;
            }
            draw(){
                ctx.drawImage(this.img, this.x, this.y - this.height - this.pow, this.width, this.height);
            }
        }
        var player= new Player(img, 0);
        
        function drawBackground(){       
            if (timer % 1 === createCloud){
                var cloud = new Cloud(randColor, randSpeed);
                arrCloud.push(cloud);
             }
            arrCloud.forEach((a)=>{
                a.draw();
                a.x -= a.speed;
            })
            
            if (arrCloud.length != 0){
                if (arrCloud[0].x <= -arrCloud[0].width){
                    arrCloud.shift();
                }
            }
        }
        
        class Cloud{
            constructor(idx, speed){
                this.x = canvasWidth;
                this.y = (Math.floor(Math.random() * 50)) * 5;
                this.width = canvasWidth * 0.3;
                this.height = canvasHeight * 0.03;
                this.idx = idx;
                this.speed = speed;
            }
            
            draw(){
                ctx.fillStyle = arrColor[this.idx];
                ctx.fillRect(this.x, this.y, this.width, this.height);
            } 
        }
        
        function drawTrap(){
            var trapSpeed = Math.floor((Math.random() * 20) + 7);
 
            if (timer % 60 === 0){
                var trap = new Trap(trapSpeed);
                arrTrap.push(trap);
            }
            
            arrTrap.forEach((a)=>{
                a.draw();
                a.x -= a.speed;
                checkCollision(player, a);
            })

            if (arrTrap.length != 0){
                if (arrTrap[0].x <= -arrTrap[0].x2){
                    arrTrap.shift();
                }
            }
        }
        
        class Trap{
            constructor(speed){
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
                ctx.fillStyle = "gray";
                ctx.moveTo(this.x + this.x1, this.y + this.y1);
                ctx.lineTo(this.x + this.x2, this.y + this.y1);
                ctx.lineTo(this.x + this.x3, this.y + this.y2);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }
        
        function checkCollision(player, trap){
            var playerWidth = player.width;
            var playerHeight = player.height;
            var trapWidth = Math.abs(trap.x2);
            var trapHeigth = Math.abs(trap.y2);
            
            var x1 = playerWidth * 0.5;
            var y1 = playerHeight * 0.5 + player.pow;
            var x2 = trap.x + (trapWidth * 0.5);
            var y2 = trapHeigth * 0.5;
            var difX = x2 - x1;
            var difY = y2 - y1;
            var powVal = Math.pow(difX, 2) + Math.pow(difY, 2);
            console.log(y2 + ' ' + y1 + ' ' + player.pow);
            
            var minDist = playerHeight * 0.5 + trapHeigth * 0.5;
            var distance = Math.sqrt(powVal);
            
            console.log('playerWidth + trap.x3 > trap.x : ' + playerWidth +'+'+ trap.x3 +'>'+ trap.x + '\n(y1 + player.pow) < -trap.y2) : ' + y1 + '+' + player.pow + '<' + -trap.y2);
            
            if (playerWidth + trap.x3 > trap.x && player.pow < trapHeigth){
                if (minDist > distance ){
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    isDead = true;               
                }   
            }
            
        }
        
        function getDistance(x1, y1, x2, y2){
            var difX = this.x2 - this.x1;
            var difY = this.y2 - this.y1;
            var powVal = Math.pow(this.difx) + Math.pow(this.difY);
            var distance = Math.sqrt(this.powVal);
            return this.distance;
        }
              
        setInterval(playGame, 45);

        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                isJump = true;
                isGround = false;
            }
        })
        
        
function getCursorPosition(canvas, event) {
const rect = canvas.getBoundingClientRect()
const x = event.clientX - rect.left
const y = event.clientY - rect.top
console.log("x: " + x + " y: " + y)
}

canvas.addEventListener('mousedown', function(e) {
getCursorPosition(canvas, e)
})