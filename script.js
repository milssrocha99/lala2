window.onload = () => {
    currentScreen = 0;
    showScreen("lockscreen");
};

window.showScreen = function(id){

    document.querySelectorAll(".screen").forEach(screen=>{
        screen.classList.remove("active");
    });

    const el = document.getElementById(id);

    if(!el){
        console.log("Tela não encontrada:", id);
        return;
    }

    el.classList.add("active");
};

let pin = "";
const correctPin = "0107";

function updateDots(){

const dots = document.querySelectorAll("#pinDots span");

dots.forEach((dot,index)=>{
    dot.classList.toggle("filled", index < pin.length);
});

}

document.querySelectorAll(".num").forEach(btn=>{

btn.addEventListener("click",()=>{

    if(pin.length >= 4) return;

    pin += btn.textContent;

    updateDots();

    if(pin.length === 4){

        setTimeout(()=>{

            if(pin === correctPin){

                currentScreen = 1;

                showScreen("home");

                if(typeof startFireworks === "function"){
                    startFireworks();
                }

            }else{

                navigator.vibrate?.(300);

                pin = "";

                updateDots();

            }

        },200);

    }

});

});

document.getElementById("delete").addEventListener("click",()=>{

pin = pin.slice(0,-1);

updateDots();


});


function updateTime(){

    const now = new Date();

    const h = now.getHours().toString().padStart(2,'0');
    const m = now.getMinutes().toString().padStart(2,'0');

    const textoHora = `${h}:${m}`;

    document.getElementById("time").textContent = textoHora;

    const homeTime = document.getElementById("homeTime");
    if(homeTime){
        homeTime.textContent = textoHora;
    }

}

updateTime();

setInterval(updateTime,1000);

function startFireworks(){

    const canvas = document.getElementById("fireworks");
    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let rockets = [];

    const colors = [
        "#ff2d75",
        "#00ffff",
        "#7c4dff",
        "#00ff85",
        "#ffd000",
        "#ff00ff"
    ];

    function randColor(){
        return colors[Math.floor(Math.random()*colors.length)];
    }

    function Rocket(){

        this.x = Math.random()*canvas.width;
        this.y = canvas.height;

        this.vx = (Math.random()-0.5)*2;
        this.vy = -(Math.random()*7 + 10);

        this.color = randColor();
        this.trail = [];

    }

    function Particle(x,y,color){

        this.x = x;
        this.y = y;

        this.vx = (Math.random()-0.5)*6;
        this.vy = (Math.random()-0.5)*6;

        this.alpha = 1;
        this.decay = Math.random()*0.015 + 0.01;

        this.color = color;
    }

    function explode(x,y,color){

        for(let i=0;i<80;i++){
            particles.push(new Particle(x,y,color));
        }
    }

    function drawGlow(x,y,color,size){

        ctx.shadowBlur = 20;
        ctx.shadowColor = color;

        ctx.fillStyle = color;

        ctx.beginPath();
        ctx.arc(x,y,size,0,Math.PI*2);
        ctx.fill();
    }

    function animate(){

        // fundo com fade (rastro suave)
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // rockets
        for(let i=rockets.length-1;i>=0;i--){

            const r = rockets[i];

            r.trail.push({x:r.x,y:r.y});

            if(r.trail.length > 8) r.trail.shift();

            r.x += r.vx;
            r.y += r.vy;

            r.vy += 0.02; // gravidade leve

            // rastro do foguete
            for(let j=0;j<r.trail.length;j++){

                const t = r.trail[j];

                ctx.globalAlpha = j / r.trail.length;
                drawGlow(t.x,t.y,r.color,2);
            }

            ctx.globalAlpha = 1;

            drawGlow(r.x,r.y,r.color,3);

            if(r.y < canvas.height*0.35){
                explode(r.x,r.y,r.color);
                rockets.splice(i,1);
            }
        }

        // particles
        for(let i=particles.length-1;i>=0;i--){

            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            p.vy += 0.03; // gravidade

            p.alpha -= p.decay;

            if(p.alpha <= 0){
                particles.splice(i,1);
                continue;
            }

            ctx.globalAlpha = p.alpha;

            drawGlow(p.x,p.y,p.color,2);
        }

        ctx.globalAlpha = 1;

        requestAnimationFrame(animate);
    }

    function launch(){
        rockets.push(new Rocket());
    }

    setInterval(launch, 450);

    animate();
}

document.querySelectorAll(".next-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        nextScreen();

    });

});

window.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".app").forEach(app => {

        app.addEventListener("click", () => {

            const tela = app.dataset.target;

            console.log("app clicado:", tela);

            showScreen(tela);

            if(tela === "gameScreen"){

            requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            startGame();
            });
            });

           }

            if(tela === "birthday"){
                setTimeout(() => {
                    console.log("fireworks chamado");
                    startFireworks();
                }, 100);
            }

        });

    });

});

document.querySelectorAll(".backHome").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll("audio").forEach(audio=>{

            audio.pause();
            audio.currentTime = 0;

        });

        showScreen("home");

    });

});