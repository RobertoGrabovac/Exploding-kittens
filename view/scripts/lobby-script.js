
console.log("======GAME INFO======")
console.log("User id: ", user_id);
console.log("Game id: ", game_id);
console.log("Game code: ", game_code);
console.log("Base server url: ", baseUrl);
console.log("Polling url: ", pollUrl);

const playerList = [];
let timestamp = 0;
let isFirstCall = true;
let isReady = 0;

class AudioController {
    constructor() {
        this.holdMusic = new Audio('view/audio/hold.mp3 '); // svaki put kad je my turn
        this.miauSoundEffect = new Audio('assets/audio/miau.mp3');
 
        this.holdMusic.loop = true;

    }
    startMusic() {
        this.holdMusic.play();
    }
    stopMusic() {
        this.holdMusic.pause();
        this.holdMusic.currentTime = 0;
    }
    miauSound() {
        this.miauSoundEffect.play();
    }

}

const audioController = new AudioController();
audioController.startMusic();



// funkcija OD INTERESA!
function updatePlayerList(playerList) {
    const playersElement = document.getElementById('playerList');
    playersElement.innerHTML = '';

    playerList.forEach(player => {

        //kreiram sve divove koji mi trebaju
        const div = document.createElement('div');
        div.classList.add('img-div');

        const textDiv = document.createElement('div');
        textDiv.classList.add('text-username-div');
        textDiv.textContent = player.username;
        const tick = document.createElement('img');


        // provjeravam treba li imati tick igrač ili ne
        if(player.user_state == 1){
            tick.src="view/images/tick.png";
            tick.classList.add('tick');
            div.appendChild(tick);
   
            audioController.miauSound();
        }

        //nastavljam kreirati potrebne divove
        const img = document.createElement('img');
        img.src="view/images/user1.png";
        img.classList.add('user-image');

        div.appendChild(img);
        div.appendChild(textDiv);

        textDiv.style.left = img.getBoundingClientRect().left + 'px';

        playersElement.appendChild(div);
    });
}

// Update the position of the white circle when the window is resized
window.addEventListener('resize', () => {
  const codeTextRect = codeText.getBoundingClientRect();
  const topPosition = codeTextRect.top + (codeTextRect.height / 2) - 5;
  whiteCircle.style.top = `${topPosition}px`;
});




//ignoriraj

//trenutna verzija provjeri je li broj igraca od 2 do 5 i ako su svi oznacili ready usmjerava na igru
//moguca poboljsanja - odbrojavanje tipa 3 2 1 
//                   - host moze pokrenuti igru pritiskom na gumb
function checkForGameStart(playerList) {
    let numberOfPLayersInThisLobby = 0;
    let numberOfPLayersReadyInThisLobby = 0;
    playerList.forEach(player => {
        numberOfPLayersInThisLobby++;
        if (player.user_state == 1) {
            numberOfPLayersReadyInThisLobby++;
        }
    });
    
    if ((numberOfPLayersInThisLobby === numberOfPLayersReadyInThisLobby) && (numberOfPLayersReadyInThisLobby >= 2) && (numberOfPLayersReadyInThisLobby <= 5)) {
        console.log("The game is ready to start!");
        window.location.href = "main.php?rt=game";
    }
}

async function fetchGame() {
    const response = await fetch(getGameUrl);
    return response.json();
}

async function longPoll() {
    if (isFirstCall) isFirstCall = false;
    else await sleep(1000);
    $.ajax({
        url: pollUrl,
        method: "GET",
        data: {
            "lastAccess": timestamp,
            "game_id": game_id,
            "user_id": user_id,
        },
        success: function (response) {
            response = handleErrors(response);
            console.log(response);
            if (response && response.lastModified) {
                timestamp = response.lastModified;
            }
            updatePlayerList(response.users);
            checkForGameStart(response.users);
        },
        complete: function () {
            longPoll();
        }
    });
}

async function setReadyState(user_state) {
    $.ajax({
        url: setReadyUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id,
            "user_state": user_state
        },
    });
}





// od interesa

$(document).ready(function () {
    console.log("Dokument je ready");
    updatePlayerList(playerList);
    const readyBtn = document.getElementById('readyBtn');
    readyBtn.addEventListener('click', function () {
        if (isReady === 0) {
            isReady = 1;
            setReadyState(1);
            console.log('Player is ready!');
        }
        else {
            isReady = 0;
            setReadyState(0);
            console.log('Player is not ready!');
        }
    });

    longPoll();
})