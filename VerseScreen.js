function VerseScreen(){

    const verseScreen = document.getElementById("verseScreen");

    if(verseScreen){

        verseScreen.style.opacity = "0";
        verseScreen.style.transform = "scale(1.05)";

        setTimeout(() => {

            verseScreen.style.transition = "0.5s ease";
            verseScreen.style.opacity = "1";
            verseScreen.style.transform = "scale(1)";

        }, 50);

    }

    const backBtn = document.getElementById("backHome");

    if(backBtn){

        backBtn.onclick = goHome;

    }

}

function goHome(){

    window.location.href = "index.html";

}

window.onload = VerseScreen;

const returnHome = document.getElementById("returnHome");

if(returnHome){

    returnHome.onclick = () => {

        window.location.href = "index.html";

    };

}