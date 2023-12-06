function setMyOpponentUsernames() {
    usernameFirstOpponent = $('#first-opponent .opponent-name').text();
    usernameSecondOpponent = $('#second-opponent .opponent-name').text();
    usernameThirdOpponent = $('#third-opponent .opponent-name').text();
    usernameFourthOpponent = $('#fourth-opponent .opponent-name').text();

    if (numberOfPlayers == 2) {
        usernameSecondOpponent = false;
        usernameThirdOpponent = false;
        usernameFourthOpponent = false;
    } else if (numberOfPlayers == 3) {
        usernameThirdOpponent = false;
        usernameFourthOpponent = false;
    } else if (numberOfPlayers == 4) {
        usernameFourthOpponent = false;
    }
    console.log("Moj prvi opponent (najlijeviji): " + usernameFirstOpponent);
    console.log("Moj drugi opponent: " + usernameSecondOpponent);
    console.log("Moj treci opponent: " + usernameThirdOpponent);
    console.log("Moj cetvrti opponent: " + usernameFourthOpponent);
}

function setMyTurnOrderAndNumberOfPlayers(responseData) {
    let highestOrderOfPlay = 0;
    (responseData.users).forEach(user => {
        let thisUsersOrderOfPlay = Number(user.order_of_play);
        if (thisUsersOrderOfPlay > highestOrderOfPlay) {
            highestOrderOfPlay = thisUsersOrderOfPlay;
        }
        if (user_id == user.user_id) {
            myTurnOrder = thisUsersOrderOfPlay;
            myUserName = user.username;
        }
    });
    numberOfPlayers = highestOrderOfPlay;

    console.log("Moj turn order je " + myTurnOrder);
    if (myTurnOrder == 1) {
        initializeCards();
    }

}

function initializeCards() {
    console.log("Krecem inicijalizirati karte!");
    $.ajax({
        url: initializeCardsUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id
        },
        success: function (response) {
            response = handleErrors(response);
            console.log(response);
            updatePlayerCards(response);
            console.log("Karte su inicijalizirane!");
        }
    });
}


//sad ce i setat final-overlay divs
function setPlayerDivs(responseData) {

    //console.log("Moj username je " + myUserName);
    /*$('#me').each(function () {
        $(this).text(myUserName);
    });*/
    $('#me').text(myUserName);
    $('#me-opponent-final .opponent-name').text(myUserName);
    //console.log("Broj igraca je " + numberOfPlayers);

    var firstOpponentName;
    var secondOpponentName;
    var thirdOpponentName;
    var fourthOpponentName;
    //brisanje viska igraca
    switch (numberOfPlayers) {
        //ILEGALAN CASE '1', ZA DEBUGANJE
        /*case 1:
            $('#first-opponent').remove();
            $('#second-opponent').remove();
            $('#third-opponent').remove();
            $('#fourth-opponent').remove();
            break;*/
        case 2:

            if (myTurnOrder == 1) {
                firstOpponentName;
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 2) {
                        firstOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 2) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 1) {
                        firstOpponentName = user.username;
                    }
                });
            }

            $('#first-opponent .opponent-name').text(firstOpponentName);
            $('#first-opponent-final .opponent-name').text(firstOpponentName);
            $('#second-opponent').remove();
            $('#third-opponent').remove();
            $('#fourth-opponent').remove();
            $('#second-opponent-final').remove();
            $('#third-opponent-final').remove();
            $('#fourth-opponent-final').remove();
            break;
        case 3:
            if (myTurnOrder == 1) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 2) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        secondOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 2) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 3) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        secondOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 3) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 1) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        secondOpponentName = user.username;
                    }
                });
            }
            $('#first-opponent .opponent-name').text(firstOpponentName);
            $('#first-opponent-final .opponent-name').text(firstOpponentName);
            $('#second-opponent .opponent-name').text(secondOpponentName);
            $('#second-opponent-final .opponent-name').text(secondOpponentName);
            $('#third-opponent').remove();
            $('#fourth-opponent').remove();
            $('#third-opponent-final').remove();
            $('#fourth-opponent-final').remove();
            break;
        case 4:

            if (myTurnOrder == 1) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 2) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 4) {
                        thirdOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 2) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 3) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 4) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        thirdOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 3) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 4) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        thirdOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 4) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 1) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        thirdOpponentName = user.username;
                    }
                });
            }

            $('#first-opponent .opponent-name').text(firstOpponentName);
            $('#first-opponent-final .opponent-name').text(firstOpponentName);
            $('#second-opponent .opponent-name').text(secondOpponentName);
            $('#second-opponent-final .opponent-name').text(secondOpponentName);
            $('#third-opponent .opponent-name').text(thirdOpponentName);
            $('#third-opponent-final .opponent-name').text(thirdOpponentName);
            $('#fourth-opponent').remove();
            $('#fourth-opponent-final').remove();
            break;
        case 5:

            if (myTurnOrder == 1) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 2) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 4) {
                        thirdOpponentName = user.username;
                    }
                    if (user.order_of_play == 5) {
                        fourthOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 2) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 3) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 4) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 5) {
                        thirdOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        fourthOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 3) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 4) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 5) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        thirdOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        fourthOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 4) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 5) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 1) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        thirdOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        fourthOpponentName = user.username;
                    }
                });
            }
            else if (myTurnOrder == 5) {
                (responseData.users).forEach(user => {
                    if (user.order_of_play == 1) {
                        firstOpponentName = user.username;
                    }
                    if (user.order_of_play == 2) {
                        secondOpponentName = user.username;
                    }
                    if (user.order_of_play == 3) {
                        thirdOpponentName = user.username;
                    }
                    if (user.order_of_play == 4) {
                        fourthOpponentName = user.username;
                    }
                });
            }
            $('#first-opponent .opponent-name').text(firstOpponentName);
            $('#first-opponent-final .opponent-name').text(firstOpponentName);
            $('#second-opponent .opponent-name').text(secondOpponentName);
            $('#second-opponent-final .opponent-name').text(secondOpponentName);
            $('#third-opponent .opponent-name').text(thirdOpponentName);
            $('#third-opponent-final .opponent-name').text(thirdOpponentName);
            $('#fourth-opponent .opponent-name').text(fourthOpponentName);
            $('#fourth-opponent-final .opponent-name').text(fourthOpponentName);
            break;

        default:
            break;
    }
    setMyOpponentUsernames();
}

function initializeUsingFirstResponse() {
    $.ajax({
        url: gameFunctionsUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id
        },
        success: function (response) {
            response = handleErrors(response);
            var responseData = response;


            setMyTurnOrderAndNumberOfPlayers(responseData);
            setPlayerDivs(responseData);
            ready(); //Luisova skripa za incicizalizaciju audio kontrolera
            longPoll();
        }
    });
}

function setOrderOfPlay() {
    $.ajax({
        url: gameSetupFunctionsUrl,
        method: "GET",
        data: {
            "game_id": game_id,
            "user_id": user_id
        },
        success: function (response) {
            response = handleErrors(response);
            var responseData = response;
            console.log(responseData);
            initializeUsingFirstResponse();
        }
    });
}
