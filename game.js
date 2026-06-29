let gameArea;
let player;

let gameStarted = false;
let gameRunning = false;
let animationId;

let crossScore = 0;
let bibleScore = 0;

let playerX = 50;
let playerY = 170;

let musicStarted = false;

let monstersReleased = false;

let direction = "right";

const speed = 2.8;

const walls = [];
const monsters = [];
const crosses = [];
const bibles = [];

let touchStartX = 0;
let touchStartY = 0;

function startGame() {

    gameArea = document.getElementById("gameArea");

    gameArea.innerHTML = "";

    walls.length = 0;
    monsters.length = 0;
    crosses.length = 0;
    bibles.length = 0;

    createMaze();
    createPlayer();
    createCrosses();
    createBibles();
    createMonsters();

    setTimeout(() => {
    monstersReleased = true;
    }, 2500);

    setTimeout(() => {
    gameStarted = true;
    direction = null; // opcional: ou null se quiser total parado até input
    }, 500);

    setupTouch();
    setupMouse();

    gameRunning = true;
    animationId = requestAnimationFrame(gameLoop);
    
    gameStarted = false;
    direction = null; // não anda até liberar

}

/* =====================
   PLAYER
===================== */

function createPlayer() {

    player = document.createElement("img");

    player.src = "image2.png";
    player.className = "player";

    gameArea.appendChild(player);

    updatePlayerPosition();
}

function updatePlayerPosition() {
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}
/* =====================
   MAZE
===================== */

function createWall(x,y,w,h){

    const wall = document.createElement("div");

    wall.className = "wall";

    wall.style.left = x + "px";
    wall.style.top = y + "px";
    wall.style.width = w + "px";
    wall.style.height = h + "px";

    gameArea.appendChild(wall);

    walls.push({
        x,y,w,h
    });
}

function createMaze(){

    // borda externa (esquerda 10px pra direita)
    createWall(80,120,305,6);
    createWall(30,730,352,6);
    createWall(30,150,6,585);
    createWall(380,120,6,615);

    // blocos superiores (5px mais centralizados)
    createWall(125,210,80,6);
    createWall(125,210,6,80);

    createWall(215,210,80,6);
    createWall(290,210,6,80);

    // centro superior (mantido)
    createWall(140,360,140,6);

    // laterais do centro (mantido)
    createWall(140,360,6,110);
    createWall(275,360,6,110);

    // parte inferior (mais central + levemente menor)
    createWall(105,530,100,6);
    createWall(205,530,100,6);

    createWall(200,530,6,130);

    createWall(140,655,120,6);
}


 function createCrosses(){

    crosses.length = 0;

    // ===== CORREDOR SUPERIOR (10px esquerda) =====
    addCrossLine(90, 155, 350, 155, 20, 13);

    // ===== LATERAL ESQUERDA (mantém) =====
    addCrossLine(70, 190, 70, 680, 20);

    // ===== LATERAL DIREITA (5px esquerda) =====
    addCrossLine(330, 190, 330, 680, 20);

    // ===== SALA SUPERIOR ESQUERDA (5px esquerda + 10px cima) =====
    addCrossLine(155, 240, 155, 320, 20);

    // ===== SALA SUPERIOR DIREITA (10px cima) =====
    addCrossLine(250, 240, 250, 320, 20);

    // ===== COLUNAS CENTRAIS (10px esquerda, ajuste feito via X) =====
    addCrossLine(165, 390, 165, 500, 20);
    addCrossLine(240, 390, 240, 500, 20);

    // ===== CORREDOR INFERIOR SUPERIOR (10px esquerda) =====
    addCrossLine(110, 560, 280, 560, 20);

    // ===== CORREDOR FINAL (10px esquerda) =====
    addCrossLine(140, 600, 250, 600, 20, 4);

    // ===== BASE FINAL =====
    addCrossLine(140, 690, 260, 690, 20);
}

function createBibles(){

    const biblePositions = [

        { x: 210, y: 250 },

        { x: 111, y: 490 },

        { x: 210, y: 695 }

    ];

    biblePositions.forEach(pos => {

        const bible = document.createElement("img");

        bible.src = "bible.png";
        bible.className = "bible";

        bible.style.left = pos.x + "px";
        bible.style.top = pos.y + "px";

        gameArea.appendChild(bible);

        bibles.push(bible);
    });
}

function spawnItem(className, src, array, size){

    const item = document.createElement("img");

    item.src = src;
    item.className = className;

    let x;
    let y;

    do{

        x =
            30 +
            Math.random() *
            (gameArea.clientWidth - 60);

        y =
            100 +
            Math.random() *
            (gameArea.clientHeight - 200);

    }
    while(
        collidesWall(
            x - 20,
            y - 20,
            size + 40,
            size + 40
        )
    );

    item.style.left = x + "px";
    item.style.top = y + "px";

    gameArea.appendChild(item);

    array.push(item);
}
/* =====================
   MONSTERS
===================== */

function createMonsters(){

    const spawnPoints = [

        {x:50,y:220},
        {x:310,y:220},

        {x:160,y:370},

        {x:140,y:560},
        {x:250,y:560}

    ];

    spawnPoints.forEach(pos => {

        const monster =
            document.createElement("img");

        monster.src = "monster.png";
        monster.className = "monster";

        const obj = {

            el: monster,

            x: pos.x,
            y: pos.y,

            direction:
            ["left","right","up","down"]
            [Math.floor(Math.random()*4)],

            speed: 1.2
        };

        monster.style.left = obj.x + "px";
        monster.style.top = obj.y + "px";

        gameArea.appendChild(monster);

        monsters.push(obj);
    });
}


/* =====================
   TOUCH
===================== */

function setupTouch(){

    gameArea.addEventListener("touchstart", e => {

        startMusicOnce();

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

    }, { passive:true });

    gameArea.addEventListener("touchmove", e => {

        const touch = e.touches[0];

        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if(Math.abs(dx) > Math.abs(dy)){

            direction =
                dx > 0
                ? "right"
                : "left";

        }else{

            direction =
                dy > 0
                ? "down"
                : "up";
        }

        player.src = "image1.png";

    }, { passive:true });
}

/* =====================
   LOOP
===================== */

function gameLoop(){

    if(!gameRunning) return;

    if(!gameStarted){
        animationId = requestAnimationFrame(gameLoop);
        return;
    }

    movePlayer();
    moveMonsters();
    collectCrosses();
    collectBibles();
    checkMonsterCollision();

    animationId = requestAnimationFrame(gameLoop);
}


function movePlayer(){

    let nextX = playerX;
    let nextY = playerY;

    // 🔥 impede diagonal fantasma
    const movingHorizontally =
        direction === "left" || direction === "right";

    const movingVertically =
        direction === "up" || direction === "down";

    if(movingHorizontally){
        nextY = playerY; // trava Y
    }

    if(movingVertically){
        nextX = playerX; // trava X
    }

    if(!direction) return;

    if(direction==="left") nextX -= speed;
    if(direction==="right") nextX += speed;
    if(direction==="up") nextY -= speed;
    if(direction==="down") nextY += speed;

   if(
    !collidesWall(nextX, nextY, 34, 34) &&
    isPlayerAllowed(nextX, nextY)
    ){
    playerX = nextX;
    playerY = nextY;
    }

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

function moveMonsters(){

    if(!monstersReleased){
        return;
    }

    monsters.forEach(m => {

        if(Math.random() < 0.01){

            const dirs = [
                "left",
                "right",
                "up",
                "down"
            ];

            m.direction =
                dirs[
                    Math.floor(
                        Math.random()*4
                    )
                ];
        }

        let nx = m.x;
        let ny = m.y;

        if(m.direction==="left")
            nx -= m.speed;

        if(m.direction==="right")
            nx += m.speed;

        if(m.direction==="up")
            ny -= m.speed;

        if(m.direction==="down")
            ny += m.speed;

        // impede sair pela entrada

       if(monsterBlockedZone(nx, ny)){
    m.direction = ["left","right","up","down"][
        Math.floor(Math.random()*4)
    ];
    return;
}

        if(collidesWall(nx,ny,30,30)){

            const dirs = [
                "left",
                "right",
                "up",
                "down"
            ];

            const possible = [];

            dirs.forEach(dir => {

                let tx = m.x;
                let ty = m.y;

                if(dir==="left") tx -= 30;
                if(dir==="right") tx += 30;
                if(dir==="up") ty -= 30;
                if(dir==="down") ty += 30;

                if(
                    !collidesWall(
                        tx,
                        ty,
                        30,
                        30
                    )
                ){
                    possible.push(dir);
                }
            });

            if(possible.length){

                m.direction =
                    possible[
                        Math.floor(
                            Math.random() *
                            possible.length
                        )
                    ];
            }

            return;
        }

        m.x = nx;
        m.y = ny;

        m.el.style.left =
            m.x + "px";

        m.el.style.top =
            m.y + "px";
    });
}
/* =====================
   COLLISION
===================== */

function collidesWall(x, y, w, h){

    const padding = 2; // espaço de respiro

    return walls.some(wall => {

        return (
            x + padding < wall.x + wall.w &&
            x + w - padding > wall.x &&
            y + padding < wall.y + wall.h &&
            y + h - padding > wall.y
        );
    });
}

function intersects(a,b){

    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}

/* =====================
   SCORE
===================== */

function collectCrosses(){

    crosses.forEach((cross,index)=>{

        if(
            intersects(
                player.getBoundingClientRect(),
                cross.getBoundingClientRect()
            )
        ){

            cross.remove();

            crosses.splice(index,1);

            crossScore++;

            document.getElementById(
                "crossScore"
            ).textContent =
            crossScore;
        }
    });
}

function collectBibles(){

    bibles.forEach((bible,index)=>{

        if(
            intersects(
                player.getBoundingClientRect(),
                bible.getBoundingClientRect()
            )
        ){

            bible.remove();

            bibles.splice(index,1);

            bibleScore++;

            document.getElementById(
                "bibleScore"
            ).textContent =
            bibleScore;

            if(bibleScore >= 3){

             setTimeout(() => {
             winGame();
             }, 300);

}
        }
    });
}

function checkMonsterCollision(){

    for(const monster of monsters){

        if(
            intersects(
                player.getBoundingClientRect(),
                monster.el.getBoundingClientRect()
            )
        ){

            restartGame();
        }
    }
}

function addCrossLine(
    startX,
    startY,
    endX,
    endY,
    step = 18,
    fixedCount = null
){

    const dx = endX - startX;
    const dy = endY - startY;

    const distance = Math.hypot(dx, dy);

    const count = fixedCount ?? Math.floor(distance / step);

    for(let i = 0; i <= count; i++){

        const x = startX + (dx * i / count);
        const y = startY + (dy * i / count);

        if(collidesWall(x - 10, y - 10, 20, 20)){
            continue;
        }

        const cross = document.createElement("img");

        cross.src = "cross.png";
        cross.className = "cross";

        cross.style.left = x + "px";
        cross.style.top = y + "px";

        gameArea.appendChild(cross);

        crosses.push(cross);
    }
}

function blockedZone(x, y){
    return (
        x < 100 &&
        y < 160
    );
}

function isPlayerAllowed(x, y){
    return !blockedZone(x, y);
}

function monsterBlockedZone(x, y){
    return blockedZone(x, y);
}

function setupMouse(){

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    gameArea.addEventListener("mousedown", (e) => {

        startMusicOnce();

        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    });

    gameArea.addEventListener("mousemove", (e) => {

        if(!isDragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        // só atualiza se houver movimento relevante
        if(Math.abs(dx) > Math.abs(dy)){

            if(dx > 2) direction = "right";
            else if(dx < -2) direction = "left";

        } else {

            if(dy > 2) direction = "down";
            else if(dy < -2) direction = "up";
        }

        player.src = "image1.png";

        // 🔥 ATUALIZA REFERÊNCIA SEMPRE (ESSENCIAL)
        lastX = e.clientX;
        lastY = e.clientY;
    });

    gameArea.addEventListener("mouseup", () => {
        isDragging = false;
    });

    gameArea.addEventListener("mouseleave", () => {
        isDragging = false;
    });
}

document.addEventListener("keydown", (e) => {

    if(!gameStarted){
    gameStarted = true;
    startMusicOnce();
     }
    
    switch(e.key){

        case "ArrowLeft":
            direction = "left";
            player.src = "image1.png";
            break;

        case "ArrowRight":
            direction = "right";
            player.src = "image1.png";
            break;

        case "ArrowUp":
            direction = "up";
            player.src = "image1.png";
            break;

        case "ArrowDown":
            direction = "down";
            player.src = "image1.png";
            break;
    }

});

function restartGame(){

    // limpa loop antigo (segurança)
   gameRunning = false;
   animationId = cancelAnimationFrame(gameLoop);

    crossScore = 0;
    bibleScore = 0;

    playerX = 50;
    playerY = 170;

    direction = "right";
    monstersReleased = false;

    // limpa DOM do jogo
    if(gameArea){
        gameArea.innerHTML = "";
    }

    walls.length = 0;
    monsters.length = 0;
    crosses.length = 0;
    bibles.length = 0;

    // espera 300ms pra garantir render da tela
    setTimeout(() => {
        startGame();
    }, 300);
}

function winGame(){

    gameRunning = false;
    monstersReleased = false;

    cancelAnimationFrame(animationId);

    // salva estado do jogo (opcional)
    localStorage.setItem("crossScore", crossScore);
    localStorage.setItem("bibleScore", bibleScore);

    // vai para tela de vitória
    window.location.href = "jesus.html";
}

function startMusicOnce(){

    if(musicStarted) return;

    const music = document.getElementById("musica1");

    if(!music){
        console.log("musica1 não encontrada");
        return;
    }

    musicStarted = true;

    music.volume = 1;
    music.currentTime = 0;

    const playPromise = music.play();

    if(playPromise !== undefined){
        playPromise.catch((err)=>{
            console.log("Autoplay bloqueado:", err);
            musicStarted = false; // libera retry
        });
    }
}