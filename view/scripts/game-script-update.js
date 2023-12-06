function updateIsMyTurn(response) {
    if (response.current_player.username == myUserName) {
        isMyTurn = true;
    }
    else {
        isMyTurn = false;
    }
}

function checkForGameOver(response) {
    //bolje bi bilo bar jedan move napravljen
    if (atLeastOneExplodingKittenDrawn == false) {
        (response.cards).forEach(card => {
            if ((card.function == 'exploding') && (card.belongs_to > 0)) {
                atLeastOneExplodingKittenDrawn = true;
                console.log("atLeastOneExplodingKittenDrawn POSTAVLJENO NA TRUE");
            }
        });
    }
    if (atLeastOneExplodingKittenDrawn) {
        let winnerUsername = false;
        let numberOfAlivePlayers = 0;
        (response.users).forEach(user => {
            if (user.user_state == 1) {
                numberOfAlivePlayers++;
                winnerUsername = user.username;
            }
        });
        if (numberOfAlivePlayers == 1) {
            victory(winnerUsername, game);
        }
    }
}

//makne spinning image oko ikone opponenta i postavi samo za igraca koji je na potezu
function updateSpinningImageIndicatingTurn(response) {
    $('.user-logo-container img.user-turn').each(function () {
        $(this).remove();
    });
    if (typeof response.current_player.username !== "undefined") {
        startSpinningImage(response.current_player.username);
    }
}



function updateNumberOfOpponentsCards(response) {
    //postavlja id-eve opponenta i inicijalizira brojace stvarnih karata opponenta na 0
    (response.users).forEach(user => {
        if (user.username == usernameFirstOpponent) {
            idFirstOpponent = user.user_id;
            numberOfCardsFirstOpponent = 0;
        } else if (user.username == usernameSecondOpponent) {
            idSecondOpponent = user.user_id;
            numberOfCardsSecondOpponent = 0;
        } else if (user.username == usernameThirdOpponent) {
            idThirdOpponent = user.user_id;
            numberOfCardsThirdOpponent = 0;
        } else if (user.username == usernameFourthOpponent) {
            idFourthOpponent = user.user_id;
            numberOfCardsFourthOpponent = 0;
        }
    });

    //broj male karte kod svakog opponenta
    let numberOfSmallCardsFirstOpponent = $('#first-opponent .opponent-cards img[src="view/images/cardback.png"].small-card').length;
    let numberOfSmallCardsSecondOpponent = $('#second-opponent .opponent-cards img[src="view/images/cardback.png"].small-card').length;
    let numberOfSmallCardsThirdOpponent = $('#third-opponent .opponent-cards img[src="view/images/cardback.png"].small-card').length;
    let numberOfSmallCardsFourthOpponent = $('#fourth-opponent .opponent-cards img[src="view/images/cardback.png"].small-card').length;

    //prazni ruke opponenta
    $('#first-opponent .opponent-cards').empty();
    $('#second-opponent .opponent-cards').empty();
    $('#third-opponent .opponent-cards').empty();
    $('#fourth-opponent .opponent-cards').empty();

    //broji stvaran broj karata opponenta
    (response.cards).forEach(card => {
        if (idFirstOpponent) {
            if (card.belongs_to == idFirstOpponent) {
                numberOfCardsFirstOpponent = numberOfCardsFirstOpponent + 1;
            }
        }
        if (idSecondOpponent) {
            if (card.belongs_to == idSecondOpponent) {
                numberOfCardsSecondOpponent = numberOfCardsSecondOpponent + 1;
            }
        }
        if (idThirdOpponent) {
            if (card.belongs_to == idThirdOpponent) {
                numberOfCardsThirdOpponent = numberOfCardsThirdOpponent + 1;
            }
        }
        if (idFourthOpponent) {
            if (card.belongs_to == idFourthOpponent) {
                numberOfCardsFourthOpponent = numberOfCardsFourthOpponent + 1;
            }
        }
    });

    //dohvaca id karte s vrha decka da moze prikazati opponenta kako baca tu kartu;
    let topPosition = 0;
    let idOfTheTopCard = 0;
    var functionOfTheTopCard;

    (response.cards).forEach(card => {
        if (card.belongs_to == -1) {
            if (card.position > topPosition) {
                idOfTheTopCard = card.card_id;
                functionOfTheTopCard = card.function;
            }
        }
    });

    // ako je broj malih kartica veci od stvarnog stanja, to znaci da je igrac odigrao karticu, 
    // stoga pokazi animaciju igranja karte
    if (numberOfSmallCardsFirstOpponent > numberOfCardsFirstOpponent) {
        opponentDrawCard(usernameFirstOpponent, idOfTheTopCard, game);
    }
    if (numberOfSmallCardsSecondOpponent > numberOfCardsSecondOpponent) {
        opponentDrawCard(usernameSecondOpponent, idOfTheTopCard, game);
    }
    if (numberOfSmallCardsThirdOpponent > numberOfCardsThirdOpponent) {
        opponentDrawCard(usernameThirdOpponent, idOfTheTopCard, game);
    }
    if (numberOfSmallCardsFourthOpponent > numberOfCardsFourthOpponent) {
        opponentDrawCard(usernameFourthOpponent, idOfTheTopCard, game);
    }

    //dodavaj stvaran broj karata u ruku
    if (idFirstOpponent) {
        for (let cardsDealt = 0; cardsDealt < numberOfCardsFirstOpponent; cardsDealt++) {
            $('#first-opponent .opponent-cards').append('<img src="view/images/cardback.png" class="small-card">');
        }
    }
    if (idSecondOpponent) {
        for (let cardsDealt = 0; cardsDealt < numberOfCardsSecondOpponent; cardsDealt++) {
            $('#second-opponent .opponent-cards').append('<img src="view/images/cardback.png" class="small-card">');
        }
    }
    if (idThirdOpponent) {
        for (let cardsDealt = 0; cardsDealt < numberOfCardsThirdOpponent; cardsDealt++) {
            $('#third-opponent .opponent-cards').append('<img src="view/images/cardback.png" class="small-card">');
        }
    }
    if (idFourthOpponent) {
        for (let cardsDealt = 0; cardsDealt < numberOfCardsThirdOpponent; cardsDealt++) {
            $('#fourth-opponent .opponent-cards').append('<img src="view/images/cardback.png" class="small-card">');
        }
    }


    // ako je broj malih kartica manji od stvarnog stanja, to znaci da je igrac povukao karticu, 
    // stoga pokazi animaciju povlacenja karte
    if (numberOfSmallCardsFirstOpponent < numberOfCardsFirstOpponent) {
        opponentPickCard(usernameFirstOpponent, game);
    }
    if (numberOfSmallCardsSecondOpponent < numberOfCardsSecondOpponent) {
        opponentPickCard(usernameSecondOpponent, game);
    }
    if (numberOfSmallCardsThirdOpponent < numberOfCardsThirdOpponent) {
        opponentPickCard(usernameThirdOpponent, game);
    }
    if (numberOfSmallCardsFourthOpponent < numberOfCardsFourthOpponent) {
        opponentPickCard(usernameFourthOpponent, game);
    }
    
    /*console.log("--------------ZA DEBUGIRATI CETVRTOG OPPONENTA----------------");
    console.log("usernameFourthOpponent: " + usernameFourthOpponent);
    console.log("idFourthOpponent: " + idFourthOpponent);
    console.log("opponentFourthAlreadyExploded: " + opponentFourthAlreadyExploded);
    console.log("opponentFourthAlive: " + opponentFourthAlive);
    */

}

function updatePlayerCards(response) {
    $("#myContainer").text("");
    (response.cards).forEach(card => {
        if (card.belongs_to == user_id) {
            let img = document.createElement('img');
            img.src = 'view/images/cards-with-id/' + card.card_id + '.png';
            img.classList.add("card-front");
            img.draggable = true;
            img.id = card.card_id;
            img.card = card;
            $("#myContainer").append(img);
        }
    });
    basicFunctions(game);
}

function updateOpponentIsAboutToExplode(response) {
    let idOfOpponentWhoIsAboutToExplode = false;
    (response.cards).forEach(card => {
        if ((card.function == "exploding") && (card.belongs_to !== '0')) {
            if ((idFirstOpponent) && (opponentFirstAlive) && (card.belongs_to == idFirstOpponent)) {
                idOfOpponentWhoIsAboutToExplode = card.belongs_to;
            }
            else if ((idSecondOpponent) && (opponentSecondAlive) && (card.belongs_to == idSecondOpponent)) {
                idOfOpponentWhoIsAboutToExplode = card.belongs_to;
            }
            else if ((idThirdOpponent) && (opponentThirdAlive) && (card.belongs_to == idThirdOpponent)) {
                idOfOpponentWhoIsAboutToExplode = card.belongs_to;
            }
            else if ((idFourthOpponent) && (opponentFourthAlive) && (card.belongs_to == idFourthOpponent)) {
                idOfOpponentWhoIsAboutToExplode = card.belongs_to;
            }
        }
    });

    if (idOfOpponentWhoIsAboutToExplode !== false) {
        console.log("Igrac s id-om " + idOfOpponentWhoIsAboutToExplode + " ce da pukne");
        if (idOfOpponentWhoIsAboutToExplode == idFirstOpponent) {
            if (opponentFirstAlive == true) {
                console.log("First opponent ce da pukne");
                kittenOpponentExploding(usernameFirstOpponent, game);
            } 
        }
        else if (idOfOpponentWhoIsAboutToExplode == idSecondOpponent) {
            if (opponentSecondAlive == true) {
                console.log("Second opponent ce da pukne");
                kittenOpponentExploding(usernameSecondOpponent, game);
            }
        }
        else if (idOfOpponentWhoIsAboutToExplode == idThirdOpponent) {
            if (opponentThirdAlive == true) {
                console.log("Third opponent ce da pukne");
                kittenOpponentExploding(usernameThirdOpponent, game);
            }
        }
        else if (idOfOpponentWhoIsAboutToExplode == idFourthOpponent) {
            if (opponentFourthAlive == true) {
                console.log("Fourth opponent ce da pukne");
                kittenOpponentExploding(usernameFourthOpponent, game);
            } 
        }
    }
    else{
        if(idFirstOpponent) kittenOpponentDefused(usernameFirstOpponent,game);
        if(idSecondOpponent) kittenOpponentDefused(usernameSecondOpponent,game);
        if(idThirdOpponent) kittenOpponentDefused(usernameThirdOpponent,game);
        if(idFourthOpponent) kittenOpponentDefused(usernameFourthOpponent,game)
    }
}

function updateTopOfDiscardPileAndShowEffects(response) {
    let topPosition = 0;
    let idOfTheTopCard = 0;
    var functionOfTheTopCard;

    (response.cards).forEach(card => {
        if (card.belongs_to == -1) {
            if (card.position > topPosition) {
                idOfTheTopCard = card.card_id;
                functionOfTheTopCard = card.function;
            }
        }
    });

    const dicardPile = $(".discard-pile");
    let previousImgId = $('.discard-pile img').attr('id');



    let img = document.createElement('img');

    if (idOfTheTopCard == 0) {
        img.src = 'view/images/others/place_cards.png'
        img.id = -1;
    } else {
        img.src = 'view/images/cards-with-id/' + idOfTheTopCard + '.png';
        img.id = idOfTheTopCard;
    }

    img.classList.add("card-on-table");

    //ceka se da se animacija zavrsi pa se pokrecu efekti
    //OVDJE SE POZIVAJU EFEKTI BACENIH KARATA SAMO JEDNOM!
    setTimeout(() => {
        dicardPile.text("");
        dicardPile.append(img);

        if (previousImgId != idOfTheTopCard) {
            if (functionOfTheTopCard == "shuffle") {
                shuffleAnimation();
            }
        }

    }, 1000);

    basicFunctions(game);
}

function updateTableNameOfCurrentPlayer(text) {
    const tableContainer = document.querySelector('.text-table');
    let messageToWriteOnTable = text + "'S TURN!"; 
    tableContainer.textContent = messageToWriteOnTable;
}

function updateTableMovesToPlayOfCurrentPlayer(number) {
    const tableContainer = document.querySelector('.text-table-explanation');
    tableContainer.textContent = "Cards left to draw: " + number;
}

function updateCardsLeft(response) {
    let cardsLeft = 0;
    (response.cards).forEach(card => {
        if (card.belongs_to == 0) {
            cardsLeft++;
        }
    });
    $(".counter-cards").text("Cards left in deck: " + cardsLeft);
}

function updateTextInformationOnScreen(response) {
    updateCardsLeft(response);
    updateTableNameOfCurrentPlayer(response.current_player.username);
    updateTableMovesToPlayOfCurrentPlayer(response.moves_to_play);
}

function updateActivePlayers(response) {
    activePlayers = [];

    (response.users).forEach(user => {
        if (user.user_state == 1)
            activePlayers.push(user.username);
    });

    //ako vise nije aktivan, onda je vrijeme da eksplodira
    updatePlayerDeadIcon();
}

function updatePlayerDeadIcon() {
    opponentFirstAlive = false;
    opponentSecondAlive = false;
    opponentThirdAlive = false;
    opponentFourthAlive = false;
    activePlayers.forEach(player => {
        if (player == usernameFirstOpponent) {
            opponentFirstAlive = true;
        } else if (player == usernameSecondOpponent) {
            opponentSecondAlive = true;
        } else if (player == usernameThirdOpponent) {
            opponentThirdAlive = true;
        } else if (player == usernameFourthOpponent) {
            opponentFourthAlive = true;
        }
    });
    if ((usernameFirstOpponent !== false) && (opponentFirstAlreadyExploded == false)) {
        if (opponentFirstAlive == false) {
            console.log("Prvi opponent treba eksplodirati.");
            kittenOpponentExploded(usernameFirstOpponent);
            opponentFirstAlreadyExploded = true;
        }
    }
    if ((usernameSecondOpponent !== false) && (opponentSecondAlreadyExploded == false)) {
        if (opponentSecondAlive == false) {
            console.log("Drugi opponent treba eksplodirati.");
            kittenOpponentExploded(usernameSecondOpponent);
            opponentSecondAlreadyExploded = true;
        }
    }
    if ((usernameThirdOpponent !== false) && (opponentThirdAlreadyExploded == false)) {
        if (opponentThirdAlive == false) {
            console.log("Treci opponent treba eksplodirati.");
            kittenOpponentExploded(usernameThirdOpponent);
            opponentThirdAlreadyExploded = true;
        }
    }
    if ((usernameFourthOpponent !== false) && (opponentFourthAlreadyExploded == false)) {
        if (opponentFourthAlive == false) {
            console.log("Cetvrti opponent treba eksplodirati.");
            kittenOpponentExploded(usernameFourthOpponent);
            opponentFourthAlreadyExploded = true;
        }
    }
}