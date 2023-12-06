// Skripta za raditi poteze i upravljanje igrom

//GLOBALNE VARIJABLE

let dragged;
const playerList = [];
let timestamp = 0;
let isFirstCall = true;
let isReady = 0;
let isMyTurn = false;

var numberOfCardsFirstOpponent = false;
var numberOfCardsSecondOpponent = false;
var numberOfCardsThirdOpponent = false;
var numberOfCardsFourthOpponent = false;

var usernameFirstOpponent = false;
var usernameSecondOpponent = false;
var usernameThirdOpponent = false;
var usernameFourthOpponent = false;

var idFirstOpponent = false;
var idSecondOpponent = false;
var idThirdOpponent = false;
var idFourthOpponent = false;

var opponentFirstAlive = true;
var opponentSecondAlive = true;
var opponentThirdAlive = true;
var opponentFourthAlive = true;
var opponentFirstAlreadyExploded = false;
var opponentSecondAlreadyExploded = false;
var opponentThirdAlreadyExploded = false;
var opponentFourthAlreadyExploded = false;


var myTurnOrder;
var numberOfPlayers;
var myUserName;

var atLeastOneExplodingKittenDrawn = false;

var defuseCardId = 0;

let activePlayers = [];

let responseUsers = [];

$(document).ready(function () {
    setGameStart();
    const deckBlock = document.getElementById('deck-block');
    const discardPile = document.querySelector('.discard-pile');
    console.log("Discard pile", discardPile);
    deckBlock.addEventListener('click', function () {
        finishMove();
    });

    document.addEventListener("dragstart", function (event) {
        dragged = event.target;
    });

    document.addEventListener("dragend", function (event) {
        event.preventDefault();
        if (event.target.className == "card-on-table") {
            console.log("Dragana karta", dragged.card)
            makeMove(dragged.card)
        }
    });
});

//LONGPOLL
async function longPoll() {
    // Dohvaća novo stanje igre svaki put kad se ono promijeni - sve radi automatski
    // i nije ju ptrebno više puta pozivati (sama sebe pozove čim završi)
    if (isFirstCall) isFirstCall = false;
    else await sleep(300);
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
            // Updateati izgled ekrana ovisno o svemu što se nalazi u response objektu
            // Što se u njemu nalazi, pogledati u: webserver > wait.php

            // BITNO: UPDATEATI APSOLUTNO SVE ŠTO SE PRIKAZUJE NA EKRANU - igrače u gornjem dijelu
            // ekrana, karte u igračevoj ruci, karte na sredini
            // Tako ne miješamo logiku da neke stvari mijenjamo na mjestu A, a neke na mjestu B

            // Provjerava je li igra završila.
            checkForGameOver(response);

            // Postavi globalnu varijable isMyTurn na true ili false.
            updateIsMyTurn(response);

            // Updatea male broj malih karata kod opponenta.
            updateNumberOfOpponentsCards(response);

            updateActivePlayers(response); // potrebno za FAVOR 
            responseUsers = response.users; // potrebno za FAVOR

            // Prikazati karte u ruci.
            updatePlayerCards(response);

            updateOpponentIsAboutToExplode(response);

            // Updateati vrh discard pile-a.
            updateTopOfDiscardPileAndShowEffects(response);

            // Upadatea text na tableu i card counter sa strane.
            updateTextInformationOnScreen(response);

            if (user_id == response.current_player_id) {
                game.yourTurn();
            }

            updateSpinningImageIndicatingTurn(response);

            // Prikazati karte na polju (plus ako je netko odigrao potez, to animirati)
        },
        complete: function () {
            longPoll();
        }
    });
}

function finishMove() {
    $.ajax({
        url: makeMoveUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id,
            "card_id": 0,
        },
        success: function (response) {
            console.log("Sto se tu dogodi?", response);
            
            // ovdje ide sve sto se dogadja nakon sto izvucemo exploding kitten kartu
            if (response === "exploding") {
                console.log("Izvukao si exploding kitten kartu!");
                game.explosionDefuse();
            }
            else{
                game.pickACard(response);
                game.audioController.pickACardSound();
            }
        }
    });
}

function explodeResponseNotDefused() {
    $.ajax({
        url: playerResponseUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id,
            "exploded": true,
        },
        success: function (response) {
            console.log(response);
        }
    });
}

function explodeResponseDefused(put_bomb) {
    $.ajax({
        url: playerResponseUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id,
            "exploded": false,
            "put_bomb": put_bomb,
            "card_id": defuseCardId
        },
        success: function (response) {
            console.log(response);
        }
    });
}

function executeFavor(card) {
    let activeOpponents = [];

    for (let i = 0; i < activePlayers.length; i++)
        if (activePlayers[i] != myUserName)
            activeOpponents.push(activePlayers[i]);

    console.log(activeOpponents);

    resetStaffDiv();
    favor(activeOpponents, function (odgovor) {
        console.log("Uzimam kartu igracu: ", odgovor); // ZOVEM SERVER
        console.log("ZOVEM SERVER za FAVOR");

        second_user_id = -1;
        for (let j = 0; j < responseUsers.length; j++)
            if (responseUsers[j].username == odgovor) {
                second_user_id = responseUsers[j].user_id;
                break;
            }

        console.log(second_user_id);

        $.ajax({
            url: playerFavorUrl,
            method: "GET",
            data: {
                "game_id": game_id,
                "user_id": user_id,
                "card_id": card.card_id,
                "second_user_id": second_user_id
            },
            success: function (response) {
                console.log(response);

                // jako bitno da se kasije opet moze staff animacija koristiti
                // TODO: Možda otkomentirati??
                // resetStaffDiv();
            }
        });

    });
}


function makeMove(card) {
    // Pozvati funkciju na klik karte / drag karte na sredinu, ovisno o implementaciji
    // Sve provjere može li se se događaju na backendu u datoteci action.php

    console.log("makeMove");
    if (card.card_id >= 24 && card.card_id <= 27)
        executeFavor(card);
    else {
        console.log("Zovem action.php jer nisam bacio favor");
        $.ajax({
            url: makeMoveUrl,
            method: "GET",
            data: {
                "game_id": game_id,
                "user_id": user_id,
                "card_id": card.card_id,
            },
            success: function (response) {
                console.log("---RESPONSE SERVERA---");
                response = handleErrors(response);
                var responseData = response;
                console.log(responseData);
                if (card.card_id >= 32 && card.card_id <= 36)  // na ovaj nacin ce se provoditi sve potrebne animacije koje se dogode nakon bacanja karte
                    seeTheFutureAnimation(responseData[0], responseData[1], responseData[2]);

                // Ovdje se ništa ne updejta! Ako je igra uspjela promijeniti bazu, sve informacije
                // će se uspjeti dohvatiti preko longPoll(). Ovo služi samo za loganje poteza
                // Ako nije uspjela updejtati bazu, bio je neispravan potez i kao da nije odigran -
                // treba se zanemariti! Dakle ne baciti tu kartu iz ruke.
            }
        });
    }
}


function setGameStart() {
    setOrderOfPlay();
    // longPoll();
    //setPlayerDivs();
    //dealCards();
}