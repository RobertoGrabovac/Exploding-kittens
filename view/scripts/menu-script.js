if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', Ready);
} else {
    Ready()
}


class AudioController {
    constructor() {
        this.themeSong = new Audio('view/audio/theme-song.mp3');
        this.miauSoundEffect = new Audio('view/audio/miau.mp3'); // bezveze miau za priliku
        this.clickSound = new Audio('view/audio/click_button.mp3');
    }
    ThemeAudio() {
        this.themeSong.play();
    }
    MiauAudio() {
        this.miauSoundEffect.play();
    }
    ClickAudio() {
        this.clickSound.play();
    }
}

function ready(){
    window.addEventListener("click", function(event) {
        Ready();
    });

}

function Ready(){
    const audioController = new AudioController();

    audioController.ThemeAudio();

    const logo = document.querySelector(".tacocat");
    const place = document.querySelector(".first-button");

    /*
    const button = document.querySelector("join-game");
    button.style.marginRight = place.getBoundingClientRect().right; 
    console.log('ovo radi');*/

    logo.style.top = (place.getBoundingClientRect().top - 60).toString() + 'px';
    logo.style.left = place.getBoundingClientRect().right.toString() - 250 + 'px';

    const logo2 = document.querySelector(".bunnie");
    const place2 = document.querySelector(".second-button");

    logo2.style.top = (place2.getBoundingClientRect().top - 50).toString() + 'px';
    logo2.style.left = place2.getBoundingClientRect().right.toString() - 200 + 'px';

  



}