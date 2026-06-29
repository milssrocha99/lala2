function JesusScreen(){

    const screen = document.getElementById("jesusScreen");
    const music = document.getElementById("music");

    if(screen){
        screen.style.display = "flex";
    }

    // 🔥 AUDIO SAFE START
    const startMusic = () => {

        if(!music) return;

        music.currentTime = 0;

        const playPromise = music.play();

        if(playPromise !== undefined){
            playPromise.catch(() => {

                const tryPlay = () => {
                    music.play().catch(()=>{});
                    document.removeEventListener("click", tryPlay);
                    document.removeEventListener("touchstart", tryPlay);
                };

                document.addEventListener("click", tryPlay);
                document.addEventListener("touchstart", tryPlay);
            });
        }
    };

    startMusic();

    // 🔥 BOTÃO (AGORA CORRETO)
    const btn = document.getElementById("verseButton");

    if(btn){

        btn.addEventListener("click", () => {

            if(music){
                music.pause();
                music.currentTime = 0;
            }

            // 🔥 TROCA DE TELA INTERNA
            switchScreen("verseScreen");
        });
    }

    // 🔥 ANIMAÇÃO JESUS
    const jesus = document.getElementById("jesus");

    if(jesus){
        jesus.style.opacity = "0";
        jesus.style.transform = "scale(0.6)";

        setTimeout(() => {
            jesus.style.transition = "0.6s ease";
            jesus.style.opacity = "1";
            jesus.style.transform = "scale(1)";
        }, 100);
    }
}

const btn = document.getElementById("verseButton");

if(btn){

    btn.addEventListener("click", () => {

        if(music){
            music.pause();
            music.currentTime = 0;
        }

        window.location.href = "VerseScreen.html";

    });

}