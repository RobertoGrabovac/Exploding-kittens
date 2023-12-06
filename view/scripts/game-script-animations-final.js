/*------------------------------FUNKCIJE KOJE ISPRAVNO ZOVU ANIMACIJE (POCETAK)------------------------------*/

//Pravo znacenje opponent igra kartu, odnosno stavlja ju na vrh discard pilea
function opponentDrawCard(username, idCard, game) {

    // we need to create the card:
    var card = document.createElement("img");
    card.src = 'view/images/cards-with-id/' + idCard + '.png';
    card.classList.add("card-on-table");

    const opponent = getOpponentByUsername(username);

    if (opponent === null) {
        return;
    }
    //console.log(opponent);

    const container = opponent.querySelector("#opponent-cards");
    console.log("container: ");
    console.log(container);
    //container.removeChild(container.querySelector(".small-card"));

    // console.log(container.querySelectorAll(".small-card"));

    const discardPile = document.querySelector(".discard-pile");
    var ls = gsap.timeline()

    //we create the "flying card" to make the effect. It depends on the number of players

    var divElement = document.createElement("div");
    divElement.classList.add('flying-card');
    var img = document.createElement("img");
    img.src = "view/images/cardback.png";
    img.classList.add('flying-cardback');
    divElement.appendChild(img);


    //Get the position of the initial position
    divElement.style.left = container.getBoundingClientRect().left + 'px';
    document.body.appendChild(divElement);

    // Get the position of both divs
    var rect1 = divElement.getBoundingClientRect();
    var rect2 = discardPile.getBoundingClientRect();

    // Calculate the distance between the two divs
    var deltaX = rect2.left - rect1.left + rect2.width / 2;
    var deltaY = rect2.top - rect1.top + rect2.height / 2;

    // Move the first div by the calculated distance
    divElement.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";

    setTimeout(delet, 500);
    function delet() {
        document.body.removeChild(divElement);
        game.audioController.pickACardSound();
        discardPile.appendChild(card);
        ls.from(card, { duration: 0.4, y: 25, ease: "bounce.out" });
    }

}

//Luisova funckija koja prikazuje opponenta da povlaci kartu, implementirana,
//moguca dorada da zadrzimo Luisov efekt
function opponentPickCard(username, game) {

    const opponent = getOpponentByUsername(username);
    //console.log(opponent);
    if (opponent === null) {
        return;
    }
    const container = opponent.querySelector("#opponent-cards");
    if (container === null) {
        return;
    }
    //console.log(container);
    //container.removeChild(container.querySelector(".small-card"));

    //console.log(container.querySelectorAll(".small-card"));

    const deck = document.querySelector(".deck");
    var ls = gsap.timeline()

    //we create the "flying card" to make the effect. 

    var divElement = document.createElement("div");
    divElement.classList.add('flying-card');
    var img = document.createElement("img");
    img.src = "view/images/cardback.png";
    img.classList.add('flying-cardback');
    divElement.appendChild(img);

    //Get the position of the initial position
    divElement.style.left = deck.getBoundingClientRect().left + deck.height / 2 + 'px';
    divElement.style.top = deck.getBoundingClientRect().top + deck.height / 2 + 'px';
    document.body.appendChild(divElement);

    // Get the position of both divs
    var rect1 = divElement.getBoundingClientRect();
    var rect2 = container.getBoundingClientRect();

    // Calculate the distance between the two divs
    var deltaX;
    var deltaY;
    if (!rect2.width) {
        deltaX = rect2.left - rect1.left + 0 / 2;
        deltaY = rect2.top - rect1.top + 0 / 2;
    }
    else {
        deltaX = rect2.left - rect1.left + rect2.width / 2;
        deltaY = rect2.top - rect1.top + rect2.height / 2;
    }

    // Move the first div by the calculated distance
    divElement.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";
    setTimeout(delet, 500);
    function delet() {
        document.body.removeChild(divElement);
        img.classList.remove("flying-cardback");
        img.classList.add("small-card")
        game.audioController.pickACardSound();

        //ovo sam maknuo jer po nasoj logici ta karta koja leti u ruku se ne namjesta u ruku

        /*container.appendChild(img);
        ls.from(container,{duration: 0.4, y: 25, ease: "bounce.out"});
        setTimeout(placeTheCardsOfEachPlayer(), 500);*/
    }

}

//prije zvana opponentsTurn, implementirana, Robi provjeri
function startSpinningImage(username) {
    const opponent = getOpponentByUsername(username);
    if (opponent === null) {
        return;
    }
    container = opponent.querySelector('.user-logo-container');

    var img = document.createElement("img");
    img.src = 'view/images/usersTurn.png';
    img.classList.add('user-turn');
    img.style.position = 'absolute';

    container.appendChild(img);
}

function getOpponentByUsername(username) {
    //const opponents = document.querySelectorAll('.opponent:not(.card-front)');
    const opponents = document.querySelectorAll('#opponents-container > .opponent');

    for (let i = 0; i < opponents.length; i++) {
        const opponentNameElement = opponents[i].querySelector('.opponent-name');
        const opponentName = opponentNameElement.textContent.trim().toUpperCase();

        if (opponentName === username.toUpperCase()) {
            return opponents[i];
        }
    }

    return null; // Return null if no matching opponent is found
}

function seeTheFutureAnimation(id1, id2, id3) {
    var overlay = document.createElement("div");
    overlay.classList.add('overlay-seeTheFuture');
    var box = document.createElement("div");
    box.classList.add('box-seeTheFuture');
    var button = document.createElement("button");
    button.classList.add("red-button-exit");

    //red button image
    var img = document.createElement("img");
    img.src = "view/images/red_button.png";
    img.classList.add("red-button-exit-img");

    //first-card img
    var first = document.createElement("img");
    first.src = "view/images/others/first_card.png";
    first.classList.add("first-card-img");

    button.appendChild(img);
    overlay.appendChild(button);
    overlay.appendChild(first);

    var container = document.createElement("div");
    container.classList.add("future-container");

    var textDiv = document.createElement("div");
    textDiv.textContent = "SEE THE FUTURE";
    textDiv.classList.add("text-future");

    overlay.appendChild(textDiv);
    document.body.prepend(box);

    var img1 = document.createElement("img");
    img1.src = 'view/images/cards-with-id/' + id1 + '.png';
    img1.classList.add("future-card-first");

    var img2 = document.createElement("img");
    img2.src = 'view/images/cards-with-id/' + id2 + '.png';
    img2.classList.add("future-card-second");

    var img3 = document.createElement("img");
    img3.src = 'view/images/cards-with-id/' + id3 + '.png';
    img3.classList.add("future-card-third");

    container.appendChild(img1);
    container.appendChild(img2);
    container.appendChild(img3);

    overlay.appendChild(container);
    document.body.appendChild(overlay);
    // console.log(button);

    document.querySelector('.red-button-exit').addEventListener("mouseover", function () {
        button.style.height = '16%';
        button.style.width = '11%';
        button.style.filter = 'brightness(1.3)';
    });
    document.querySelector('.red-button-exit').addEventListener("mouseout", function () {
        button.style.height = '15%';
        button.style.width = '10%';
        button.style.filter = 'brightness(1)';
    });

    document.querySelector('.red-button-exit').addEventListener("click", function () {
        console.log("click");
        document.body.removeChild(overlay);
        document.body.removeChild(box);
    });

}

function shuffleAnimation() {
    var divElement = document.createElement("div");
    divElement.classList.add('hurricane');
    var img = document.createElement("img");
    img.src = "view/images/hurricane.gif";
    img.classList.add('hurricane-gif');
    divElement.appendChild(img);
    document.body.appendChild(divElement);

    const deck = document.querySelector('.deck-block').getBoundingClientRect();
    divElement.style.bottom = deck.top + 'px';
    divElement.style.left = deck.left + 'px';
    console.log(deck.top)
    console.log(deck.left)

    var tl = gsap.timeline()
    //game.audioController.shuffleSound(); trebao bi game biti u parametru
    tl.to(".hurricane-gif", { duration: 0.5, x: 100, y: 100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: -100, y: 100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: -100, y: -100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: 100, y: -100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: 100, y: 100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: -100, y: 100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: -100, y: -100, ease: "power0.out" });
    tl.to(".hurricane-gif", { duration: 0.5, x: 100, y: -100, ease: "power0.out", opacity: 0, onComplete: delet });

    function delet() {
        document.body.removeChild(divElement);
    }
}

function youExplodedAnimation() {

    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'you-exploded-overlay';
    containerDiv.classList.add('you-exploded-overlay');

    // Create the text explosion container div
    var textExplosionContainerDiv = document.createElement('div');
    textExplosionContainerDiv.classList.add('text-explosion-container');

    // Create the "YOU" text div
    var textYouDiv = document.createElement('div');
    textYouDiv.classList.add('text-explosion');
    textYouDiv.id = 'text-you';
    textYouDiv.textContent = 'YOU';
    textExplosionContainerDiv.appendChild(textYouDiv);

    // Create the "HAVE" text div
    var textHaveDiv = document.createElement('div');
    textHaveDiv.classList.add('text-explosion2');
    textHaveDiv.id = 'text-have';
    textHaveDiv.textContent = 'HAVE';
    textExplosionContainerDiv.appendChild(textHaveDiv);

    // Create the "EXPLODED" text div
    var textExplodedDiv = document.createElement('div');
    textExplodedDiv.classList.add('text-explosion3');
    textExplodedDiv.id = 'text-exploded';
    textExplodedDiv.textContent = 'EXPLODED';

    // Create the "you-dead" image
    var youDeadImg = document.createElement('img');
    youDeadImg.src = 'view/images/you-dead.png';
    youDeadImg.classList.add('you-dead');

    // Create the "you-exploded" image
    var youExplodedImg = document.createElement('img');
    youExplodedImg.src = 'view/images/you-exploded.png';
    youExplodedImg.classList.add('you-exploded');

    // Append all elements to the main container div
    containerDiv.appendChild(textExplosionContainerDiv);
    containerDiv.appendChild(textExplodedDiv);
    containerDiv.appendChild(youDeadImg);
    containerDiv.appendChild(youExplodedImg);

    // Append the main container div to the document body or any desired parent element
    document.getElementById('overlay-container').appendChild(containerDiv);

    gsap.timeline()
        .from(".text-explosion", { duration: 0.5, y: -150, ease: "power0.out", opacity: 0 })
        .from(".text-explosion2", { duration: 0.5, x: 50, ease: "power0.out", opacity: 0 })
        .from(".text-explosion3", { duration: 0.5, ease: "power0.out", opacity: 0 })
        .to(".text-explosion3", { duration: 3.2, x: 30, ease: "power0.out" })
        .from(".you-exploded", { duration: 0.5, ease: "power0.out", opacity: 0 }, "<0.2")
        .to(".you-exploded", { duration: 5.2, x: 50, ease: "power0.out", scale: 1.5 }, "<")
        .from(".you-dead", { duration: 1.5, ease: "power0.out", opacity: 0 }, "<1")
        .to(".you-dead", { duration: 4, x: 50, ease: "power0.out" }, "<");


    setTimeout(() => {
        document.getElementById('overlay-container').removeChild(containerDiv);
        document.getElementById('overlay-container').removeChild(document.getElementById('exploding-kitten-defuse'));

    }, 5000)

    const cards = Array.from(document.querySelector('#myContainer').getElementsByClassName('card-front'));
    const container = document.getElementById('myContainer');

    //container.removeChild(cards);
    cards.forEach(card => {
        container.removeChild(card);
    })

    const logo = document.querySelector('.me-logo-container');
    logo.removeChild(document.querySelector('.me-logo'));
    var img = document.createElement("img");
    img.src = "view/images/userDead.png";
    img.classList.add('me-logo');
    logo.appendChild(img);
}


//tu trenutno radim
function kittenOpponentExploding(username, game) {

    // dohvatimo opponenta
    const opponent = getOpponentByUsername(username);

    //setTheTable(opponent, null, "exploding", "exploding");

    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'someone-is-exploding';
    containerDiv.classList.add('someone-is-exploding');

    // Create the exploding kitten image
    var explodingKittenImg = document.createElement('img');
    explodingKittenImg.src = 'view/images/explodingkitten.png';
    explodingKittenImg.classList.add('kitten-opponent-exploding');

    // Append the exploding kitten image to the main container div
    containerDiv.appendChild(explodingKittenImg);

    // Append the main container div to the document body or any desired parent element
    opponent.appendChild(containerDiv);

    var tl = gsap.timeline()
        .from(".kitten-opponent-exploding", {
            duration: 0.5,
            scale: 1.1,
            ease: "power0.out",
            repeat: 20,
        })
    game.audioController.wickSound();
}

function kittenOpponentDefused(username, game) {
    const opponent = getOpponentByUsername(username);
    //setTheTable(opponent, null, "kitten defused", "defused");
    const explodingKitten = document.querySelector('#someone-is-exploding');

    if (explodingKitten && opponent && (opponent.querySelector('#someone-is-exploding') != null)) {
        opponent.removeChild(explodingKitten);
        game.audioController.miauSound();
    }
}

//------------------------

function kittenOpponentExploded(username) {

    const opponent = getOpponentByUsername(username);
    //setTheTable(opponent, null, "exploded", "exploded");

    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'someone-is-exploding';
    containerDiv.classList.add('someone-is-exploding');

    // Create the exploding kitten image
    var explodingKittenImg = document.createElement('img');
    explodingKittenImg.src = 'view/images/explodingkitten.png';
    explodingKittenImg.classList.add('kitten-opponent-exploding');

    // Append the exploding kitten image to the main container div
    containerDiv.appendChild(explodingKittenImg);

    // Append the main container div to the document body or any desired parent element
    opponent.appendChild(containerDiv);

    opponent.removeChild(containerDiv);
    opponent.removeChild(opponent.querySelector('.opponent-cards'));
    var userLogoContainer = opponent.querySelector('.user-logo-container');
    userLogoContainer.removeChild(userLogoContainer.childNodes[1]);
    var DOM_img = document.createElement("img");
    DOM_img.src = "view/images/userDead.png";
    DOM_img.classList.add('user-logo', 'user-dead');
    var Fire_img = document.createElement("img");
    Fire_img.src = "view/images/fire3.gif";
    Fire_img.classList.add('fire');
    opponent.appendChild(Fire_img);
    var Explosion_img = document.createElement("img");
    Explosion_img.src = "view/images/explosion2.gif";
    Explosion_img.classList.add('explosion');
    opponent.appendChild(Explosion_img);

    gsap.from(".explosion", {
        opacity: 1,
        duration: 3

    });
    gsap.from(".fire", {
        opacity: 1,
        duration: 4
        //onComplete: opponent.removeChild(Explosion_img)
    });
    userLogoContainer.appendChild(DOM_img);
}

function draggingCards(allowed, game) {

    var draw_pile = false;
    const draggables = document.querySelectorAll('.card-front');

    const containers = [
        document.getElementById('myContainer'),
        document.querySelector('.discard-pile')
    ]

    draggables.forEach(draggable => {
        if (allowed || (typeof draggable.card !== 'undefined' && draggable.card.function == "nope")) {
            draggable.addEventListener('dragstart', () => {
                draw_pile = false;
                draggable.classList.add('dragging')
            })

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging')

                if (draw_pile) {
                    draggable.setAttribute('draggable', 'false');
                    containers[1].appendChild(draggable)
                    draggable.classList.remove('card-front');
                    draggable.classList.add('card-on-table');
                    basicFunctions(game);
                    //game.drawCard(draggable);
                    draw_pile = false;
                    gsap.from(draggable, { duration: 0.4, y: 25, ease: "bounce.out" });
                }
            })
        }
    })
    containers.forEach(container => {
        if (container) {
            container.addEventListener('dragover', e => {
                e.preventDefault()
                const afterElement = getDragAfterElement(document.getElementById('myContainer'), e.clientX)
                const draggable = document.querySelector('.dragging')
                if (draggable) {
                    if (container === document.querySelector('.discard-pile')) {
                        draw_pile = true;
                    }
                    else if (afterElement == null) {
                        container.appendChild(draggable)
                        draw_pile = false;
                    }
                    else {
                        container.insertBefore(draggable, afterElement)
                        draw_pile = false;
                    }
                }
            })
        }

    })

    function getDragAfterElement(container, x) {
        const draggableElements = [...container.querySelectorAll('.card-front:not(.dragging)')]

        return draggableElements.reduce((closest, draggableElement) => {
            const box = draggableElement.getBoundingClientRect()
            const offset = x - box.left - box.width / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: draggableElement }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }


}

function placeTheCardsOfEachPlayer() {
    // Calculate the required marginLeft for the me-container 
    const cardCount = document.querySelectorAll('.card-front').length;

    var cardWidth;
    if (cardCount == 0) {
        cardWidth = 0;
    }
    else {
        cardWidth = document.querySelector('.card-front').width; // Width of each card in pixels
    }

    var container = document.getElementById('myContainer');
    var containerWidth = container.offsetWidth;

    if (cardCount > 5) {
        const newCardMargin = parseInt(- Math.floor((cardWidth * cardCount - containerWidth) / cardCount) - 1);
        const cards = document.querySelectorAll('.card-front');

        cards.forEach(card => {
            card.style.marginLeft = newCardMargin.toString() + 'px';
        })
    }

    //Notice that if cardCount < 5 (less than 5 cards), then the default marginLeft is -75px
    //Now we calculate the required marginLeft for each opponent
    opponentDeckCount = document.querySelectorAll('.opponent-cards');
    const opponentCardWidth = 20; // Width of each card in pixels
    const userLogo = document.querySelector('.user-logo').getBoundingClientRect(); // position of logo behind which the cards will be placed

    opponentDeckCount.forEach(opponentDeck => {

        const opponentCardCount = opponentDeck.querySelectorAll('.small-card').length;  //koliko karata ima svaki opponent

        const newOpponentCardMargin = - Math.floor((opponentCardWidth * opponentCardCount - 65) / opponentCardCount) - 1;

        // trebamo kreirati onoliko karata koliko treba i staviti ih u opponentcards
        /*
            var img = document.createElement("img");
            img.src = "images/card-back.png";
            img.classList.add("red-button-exit-img");
        */

        const opponentCards = opponentDeck.querySelectorAll('.small-card:not(:first-child)');

        const newRotateAngle = Math.floor((50) / opponentCardCount);
        var newAngle = -25;

        opponentCards.forEach(card => {
            newAngle = newAngle + newRotateAngle;
            if (opponentCardCount > 6) {
                card.style.marginLeft = newOpponentCardMargin.toString() + 'px';
            }
            card.style.transform = 'rotate(' + newAngle.toString() + 'deg)';
        })

        // place the opponents cards near the logo.
        // becareful! I don't know the reason but when it gets bigger the screen, then it's needed to add. 
        // but when the screen gets smaller, then it's okay
        if (window.innerWidth > 5600) {
            var add = 4 * window.innerWidth / 100;
            opponentDeck.style.marginTop = (userLogo.bottom - add).toString() + 'px';
        }
        else if (window.innerWidth > 5800) {
            var add = 2 * window.innerWidth / 100;
            opponentDeck.style.marginTop = (userLogo.bottom - add).toString() + 'px';
        }
        else {
            opponentDeck.style.marginTop = userLogo.bottom.toString() + 'px';
        }

    })
}

function createOverlayExplodingKittenDefuse() {

    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.id = 'exploding-kitten-defuse';
    containerDiv.classList.add('overlay-defuse');

    // Create the SVG element
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', '2000');
    svgElement.setAttribute('height', '210');
    svgElement.classList.add('svg-rectangle');
    svgElement.id = 'svg-rectangle';

    // Create the rectangle within the SVG element
    var rectangleElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectangleElement.setAttribute('width', '1500');
    rectangleElement.setAttribute('height', '500');
    rectangleElement.style.fill = 'rgb(0,0,0)';
    rectangleElement.style.strokeWidth = '3';
    rectangleElement.style.stroke = 'rgb(0,0,0)';
    svgElement.appendChild(rectangleElement);

    // Create the defuseFont-container div
    var defuseFontContainerDiv = document.createElement('div');
    defuseFontContainerDiv.classList.add('defuseFont-container');

    // Create the defuse-kitten-font image
    var defuseKittenFontImg = document.createElement('img');
    defuseKittenFontImg.src = 'view/images/defuseFittenFont.png';
    defuseKittenFontImg.classList.add('defuse-kitten-font');
    defuseFontContainerDiv.appendChild(defuseKittenFontImg);

    // Create the wick-container div
    var wickContainerDiv = document.createElement('div');
    wickContainerDiv.classList.add('wick-container');

    // Create the wick image
    var wickImg = document.createElement('img');
    wickImg.src = 'view/images/explosionKittenFitilj.png';
    wickImg.classList.add('wick');
    wickContainerDiv.appendChild(wickImg);

    // Create the defuse-container div
    var defuseContainerDiv = document.createElement('div');
    defuseContainerDiv.classList.add('defuse-container');

    // Create the defuseContainer image
    var defuseContainerImg = document.createElement('img');

    defuseContainerImg.src = 'view/images/defuseContainer.png';
    defuseContainerImg.classList.add('img-defuse-container');
    defuseContainerDiv.appendChild(defuseContainerImg);

    // Create the spark image
    var sparkImg = document.createElement('img');
    sparkImg.id = 'spark';
    sparkImg.src = 'view/images/sparkGif.gif';
    sparkImg.classList.add('spark');
    wickContainerDiv.appendChild(defuseContainerDiv);
    wickContainerDiv.appendChild(sparkImg);

    // Create the me-container div
    var meContainerDiv = document.createElement('div');
    meContainerDiv.classList.add('me-container');

    // Create the my-cards-container div
    var myCardsContainerDiv = document.createElement('div');
    myCardsContainerDiv.classList.add('my-cards-container');

    // Create the effect-card-container div
    var effectCardContainerDiv = document.createElement('div');
    effectCardContainerDiv.classList.add('effect-card-container');
    effectCardContainerDiv.id = 'defuseContainer';

    myCardsContainerDiv.appendChild(effectCardContainerDiv);
    meContainerDiv.appendChild(myCardsContainerDiv);

    // Append all elements to the main container div
    containerDiv.appendChild(svgElement);
    containerDiv.appendChild(defuseFontContainerDiv);
    containerDiv.appendChild(wickContainerDiv);
    containerDiv.appendChild(meContainerDiv);

    // Append the main container div to the document body or any desired parent element
    document.getElementById('overlay-container').appendChild(containerDiv);

}

function draggingDefuse(tl, tl2, game) {

    var defuse_container = false;
    const draggables = document.querySelector('#defuseContainer').querySelectorAll('.card-front');

    const container = document.querySelector('.img-defuse-container');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            defuse_container = false;
            draggable.classList.add('dragging');

        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
            if (defuse_container) {

                //sound
                game.audioController.wickSoundStop();
                game.audioController.miauSound();

                //defuse ostane u kontejneru
                document.querySelector('.defuse-container').appendChild(draggable);

                //stavi isti defuse u discard-pile (kloniramo ju)
                var cloneCard = draggable.cloneNode(true);
                cloneCard.classList.remove("defuse-card");
                cloneCard.classList.remove("card-front");
                cloneCard.classList.add('card-on-table');
                cloneCard.removeAttribute('style');
                const discardPile = document.querySelector('.discard-pile');
                console.log("discardPile: ", discardPile);
                discardPile.appendChild(cloneCard);
                console.log("clone: ", cloneCard);

                //promijenimo kartu da stoji na mjesto
                draggable.classList.add('img-defuse-container');
                draggable.classList.remove('defuse-card');
                draggable.setAttribute('draggable', 'false');
                draggable.classList.remove('card-front-defuse');
                defuse_container = false;
                tl2.seek(1);
                tl2.kill();
                tl.kill();

                defused = true;

                document.querySelector('.img-defuse-container:not(.card-front)').style.opacity = '0';

                //kreiramo magic efekt
                var img = document.createElement("img");
                img.src = "view/images/magic.png";
                img.classList.add('magic-defuse');
                var newDiv = document.createElement("div");
                newDiv.classList.add("glow")
                newDiv.style.left = draggable.getBoundingClientRect().left.toString() + 'px';
                document.querySelector('.defuse-container').appendChild(newDiv);
                document.querySelector('.defuse-container').appendChild(img);

                //STAVIO DEFUSE
                console.log("STAVIO DEFUSE");

                setTimeout(() => {
                    game.audioController.miauSound();
                    defusedKitten();
                }, 2000)

            }
        })
    })
    container.addEventListener('dragover', e => {
        e.preventDefault()
        const draggable = document.querySelector('.dragging')

        //ovdje biti oprezan
        if (draggable !== null) {
            //console.log(draggable);
            if ((draggable.id >= 5) && (draggable.id <= 10)) {
                defuse_container = true;
                defuseCardId = draggable.id;
            }
            else {
                //document.querySelector('.defuseContainer').appendChild(draggable);
                defuse_container = false;
            }
        }

    });
}

function favor(usernames, callback) {

    document.getElementById('kitten-defused').classList.add('visible');
    //document.getElementById('exploding-kitten-defuse').classList.remove('visible');

    const buttonContainer = document.querySelector('.button-container');

    function createButton() {
        const button = document.createElement('button');
        button.classList.add("button-to-deck");
        button.classList.add("button-19");
        return button;
    }

    for (let i = 0; i < usernames.length; i++) {
        console.log(usernames[i]);
        var button = createButton();
        button.textContent = usernames[i].toString();
        buttonContainer.appendChild(button);

    }

    var tl = gsap.timeline();
    tl.from(".staff", { duration: 0.5, x: 600, ease: "back.out(1.7)", delay: 2 });
    tl.from(".message-box", { duration: 1, y: -10, ease: "power0.out", opacity: 0 });
    tl.from(".message-box-container", { duration: 0.3, y: -10, ease: "power0.out", opacity: 0 });

    const buttons = document.querySelectorAll('.button-to-deck');

    function handleClick(event) {
        // Remove the 'active' class from all buttons
        buttons.forEach(button => {
            button.classList.remove('active');
        });

        tl.to(".staff", { duration: 2.5, x: 600, ease: "back.out(1.7)", delay: 0.5 });
        tl.to(".message-box", { duration: 0.5, y: -10, ease: "power0.out", opacity: 0 });
        tl.to(".message-box-container", {
            duration: 0.3, y: -10, ease: "power0.out", opacity: 0,
            onComplete: document.getElementById('kitten-defused').classList.remove('visible'), delay: 3
        });

        // Add the 'active' class to the clicked button
        event.target.classList.add('active');
        const clickedButton = event.target;
        const buttonText = clickedButton.textContent;
        console.log(buttonText);

        callback(buttonText);
    }

    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
    });
}

function getOpponentInTheFinalOverlayByUsername(username) {

    const opponents = document.querySelectorAll('div.opponents-container-final div[class="opponent"');

    for (let i = 0; i < opponents.length; i++) {
        const opponentNameElement = opponents[i].querySelector('.opponent-name');
        const opponentName = opponentNameElement.textContent.trim().toUpperCase();

        if (opponentName === username.toUpperCase()) {
            return opponents[i];
        }
    }

    return null; // Return null if no matching opponent is found
}

function victory(username, game) {

    // prikazujemo zadnji overlay
    document.getElementById('final-overlay').classList.add('visible');

    document.getElementById('button-exit-lobby-container').style.visibility = "visible";

    //dohvatimo sve opponente
    const opponents = document.querySelectorAll('div.opponents-container-final div[class="opponent"');

    // odaberemo pobjednika:
    const winner = getOpponentInTheFinalOverlayByUsername(username);


    // za svaki opponent koji nije pobjednik (username koji dobijemo preko varijable)
    opponents.forEach(opponent => {
        if (opponent.id != winner.id) {
            var userLogoContainer = opponent.querySelector('.user-logo-container');
            userLogoContainer.removeChild(userLogoContainer.childNodes[1]);
            var DOM_img = document.createElement("img");
            DOM_img.src = "view/images/userDead.png";
            DOM_img.classList.add('user-logo', 'user-dead');

            userLogoContainer.appendChild(DOM_img);
        }
        else {
            // Get the opponent element
            var opponentElement = document.getElementById(winner.id);

            // Get the explosion image element
            var explosionImage = opponentElement.querySelector('.explosion');
            // Remove the explosion image element
            explosionImage.remove();

        }

    })
    gsap.from(".explosion", {
        opacity: 1,
        duration: 3
    });

    setTimeout(() => {
        if (winner.id == 'me-opponent-final') {
            game.audioController.finalMusic();
            gsap.fromTo(".victory-text", {
                opacity: 0
            }, {
                opacity: 1,
                duration: 1
            });
        }
        else {
            gsap.fromTo(".fail-text", {
                opacity: 0
            }, {
                opacity: 1,
                duration: 1
            });
        }

    }, 2000)

    //document.getElementById('victory-or-fail-text').style.opacity = '1';
}



/*------------------------------FUNKCIJE KOJE ISPRAVNO ZOVU ANIMACIJE (KRAJ)------------------------------*/
