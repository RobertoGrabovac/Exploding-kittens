class AudioController {
    constructor() {
        this.yourTurnSoundEffect = new Audio('view/audio/your-turn.mp3 '); // svaki put kad je my turn
        this.wickSoundEffect = new Audio('view/audio/wick.mp3');    // kad ja ili opponent izvuče bombu dok ne defusa (ili umire)
        //this.themeSong = new Audio('view/audio/theme-song.mp3');
        this.shuffleSoundEffect = new Audio('view/audio/shuffle.mp3'); // kad se odigra kartu: shuffle
        this.shoutSound = new Audio('view/audio/shout.mp3'); // kad neki opponent umire (ne ja!)
        this.pickOrDrawSound = new Audio('view/audio/pick-a-card.mp3'); // svaki put kad netko izvuče kartu ili ju odigra
        this.miauSoundEffect = new Audio('view/audio/miau.mp3'); // bezveze miau za priliku
        this.iExplodedSound = new Audio('view/audio/I-exploded.mp3'); //kad ja eksplodiram
        this.finalSound = new Audio('view/audio/final.mp3'); // na kraju kod pozivanja overlay-a final
        this.moveSoundEffect = new Audio('view/audio/move.mp3'); // svaki put kad se nešto miče
        this.clickSoundEffect = new Audio('view/audio/click_button.mp3');
        this.bgMusic = new Audio('view/audio/ambience.mp3'); //ambience
  
        //stisavanje volumea
        this.bgMusic.volume = 0.02;
        this.bgMusic.loop = true;
        this.wickSoundEffect.playbackRate = 0.8;

    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    pickACardSound() {
        this.pickOrDrawSound.play();
    }
    drawACardSound() {
        this.pickOrDrawSound.play();
    }
    yourTurnSound(){
        this.yourTurnSoundEffect.play();
    }
    clickSound(){
        this.clickSoundEffect.play();
    }
    dyingSound() {
        this.shoutSound.play();
    }
    explosionSound() {
        this.iExplodedSound.play();
    }
    miauSound() {
        this.miauSoundEffect.play();
    }
    moveSound() {
        this.moveSoundEffect.play();
    }
    shuffleSound(){
        this.shuffleSoundEffect.play();
    }
    wickSound() {
        this.wickSoundEffect.play();
    }
    wickSoundStop() {
        this.wickSoundEffect.pause();
    }
    finalMusic() {
        this.stopMusic();
        this.finalSound.play();
    }
}