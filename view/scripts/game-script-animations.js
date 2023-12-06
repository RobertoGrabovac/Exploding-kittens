//Luisova skripta s efektima


//functions to be called prije svakog poziva
function basicFunctions(game) {
    placeTheCardsOfEachPlayer(); //calculate how many cards and therefore the distribution
    hoverOverMyCardsEffect(); //effect over the cards when hover is on them
    hoverOverDeck();
    placeMyName();
    draggingCards(isMyTurn, game);
}
function dealerInitializing(/*cards,*/ game, deck) {
    // cards moraju biti točno kako će ih biti u html-u 
    // (dakle moraju imati class card-front, biti draggable=true itd)

    const opponents = document.querySelector('.game-container').querySelectorAll('.opponent');

    console.log(deck);

    var tl = gsap.timeline();

    //givingCardsToOpponents();


    /*setTimeout(()=>{
        givingCardsToMe();
    }, 2000)*/


    setTimeout(() => {
        tl.from(".cards-in-deck", {
            duration: 0.2,
            x: -100,
            onStart: function () {
                document.querySelector('.cards-in-deck').style.opacity = '1';
                game.audioController.moveSound();
            }

        });
        tl.to(document.querySelector('.discard-pile'), {
            //onComplete: function(){ document.querySelector('.discard-pile').style.opacity = '1';},
            duration: 0.2,
            opacity: 1,
        })
        tl.from(document.querySelector('.table'), {
            onStart: function () { document.querySelector('.table').style.opacity = '1'; },
            duration: 0.3,
            x: 300,
            //delay: -2,
            onComplete: function () {
                setTimeout(() => {
                    document.querySelector('.table-inside').style.opacity = '1';
                    document.querySelector('.user-playing-table').style.opacity = '1';
                    game.audioController.moveSound();
                }, 500)
            },

        })

    }, 5000)

    /*
    function givingCardsToOpponents(){
        game.audioController.pickACardSound();
        opponents.forEach(opponent=>{
            console.log(opponent);
            setTimeout(()=>{
                for(let i = 0; i < 4; i++){
                    setTimeout(()=>{
                        opponentPickCard(opponent)
                        placeTheCardsOfEachPlayer();
                    }, 100)      
                }
            }, 200)  
        })
    }*/
    /*
    function givingCardsToMe(){
        //mozda i ne mora
        placeTheCardsOfEachPlayer();
        
        setTimeout(()=>{
            cards.forEach(card => {
                console.log(card);
                IStealOpponent(deck, card, game);
                //IStealOpponent(myContainer, card, game);
                placeTheCardsOfEachPlayer();
            })
            game.audioController.pickACardSound();
        }, 1000)

    }
    */

    basicFunctions(game);

}


//ANIMACIJE ZA FAVOR
function opponentStealOpponent(opponent1, opponent2) {

    const sourceOpponent = document.getElementById(opponent1.id).querySelector(".opponent-cards");
    const targetOpponent = document.getElementById(opponent2.id).querySelector(".opponent-cards");
    const card = sourceOpponent.querySelector('.small-card');

    const cardClone = card.cloneNode(true);
    const sourceRect = card.getBoundingClientRect();
    const targetRect = targetOpponent.getBoundingClientRect();

    card.style.opacity = 0;
    sourceOpponent.appendChild(cardClone);

    var ls = gsap.timeline();
    var distance = 50;
    ls.to(cardClone, {
        y: distance,
        //ease: "circ.out",
        duration: 0.5
    })
    ls.to(cardClone, {
        duration: 0.5,
        x: targetRect.left - sourceRect.left,
        y: targetRect.top - sourceRect.top,
        //ease: "circ.out",
        onComplete: () => {
            //targetOpponent.querySelector('.opponent-cards').appendChild(cardClone);
            cardClone.style.opacity = 1;
            card.style.opacity = 1;
            card.remove();

            var img = document.createElement("img");
            img.src = "view/images/cardback.png";
            img.classList.add('small-card');
            targetOpponent.appendChild(img);


            placeTheCardsOfEachPlayer();
            cardClone.remove();
        }
    });


}
function IStealOpponent(opponent, card, game) {

    let sourceOpponent;
    console.log(opponent);

    if (opponent.id == 'deck-block') {
        sourceOpponent = opponent;
        console.log("if");
    }
    else {
        sourceOpponent = document.getElementById(opponent.id).querySelector(".opponent-cards");
        console.log("else");
        console.log(sourceOpponent);
    }
    console.log(sourceOpponent);
    const targetOpponent = document.getElementById('myContainer');
    var flyingCard = sourceOpponent.querySelector('.small-card');
    if (flyingCard == null) {
        flyingCard = document.createElement("img");
        flyingCard.src = "view/images/cardback.png";
        flyingCard.classList.add('small-card');
    }
    const cardClone = flyingCard.cloneNode(true);
    const sourceRect = flyingCard.getBoundingClientRect();
    const targetRect = targetOpponent.getBoundingClientRect();

    flyingCard.style.opacity = 0;
    sourceOpponent.appendChild(cardClone);

    var ls = gsap.timeline();

    ls.to(cardClone, {
        duration: 0.5,
        x: targetRect.left - sourceRect.left + targetRect.width / 2,
        y: targetRect.top - sourceRect.top + targetRect.height / 2,
        //ease: "circ.out",
        onComplete: () => {
            //targetOpponent.querySelector('.opponent-cards').appendChild(cardClone);
            cardClone.style.opacity = 1;
            flyingCard.style.opacity = 1;
            flyingCard.remove();
            card.classList.add('card-front');
            card.setAttribute("draggable", "true");
            card.classList.remove('card-on-table');
            targetOpponent.appendChild(card);
            cardClone.remove();
            game.audioController.pickACardSound();
            basicFunctions(game);
            //placeTheCardsOfEachPlayer();
            //hoverOverMyCardsEffect();
        }
    });
}
function opponentStealsMe(opponent, stolenCard) {

    const sourceOpponent = document.getElementById('myContainer');
    const targetOpponent = document.getElementById(opponent.id).querySelector(".opponent-cards");

    const card = sourceOpponent.querySelector('#' + stolenCard.id.toString());
    const flyingCard = document.createElement("img");
    flyingCard.src = "view/images/cardback.png";
    flyingCard.classList.add('small-card');
    const cardClone = flyingCard;


    //flyingCard.style.opacity = 0;
    sourceOpponent.appendChild(cardClone);
    cardClone.style.position = 'absolute';
    cardClone.style.top = '30%';

    const sourceRect = flyingCard.getBoundingClientRect();
    const targetRect = targetOpponent.getBoundingClientRect();


    var ls = gsap.timeline();

    ls.to(cardClone, {
        duration: 0.5,
        x: targetRect.left - sourceRect.left + targetRect.width / 2,
        y: targetRect.top - sourceRect.top + targetRect.height / 2,
        //ease: "circ.out",
        onComplete: () => {
            //targetOpponent.querySelector('.opponent-cards').appendChild(cardClone);
            cardClone.style.opacity = 1;
            flyingCard.style.opacity = 1;
            var img = document.createElement("img");
            img.src = "view/images/cardback.png";
            img.classList.add('small-card');
            targetOpponent.appendChild(img);
            sourceOpponent.removeChild(flyingCard);
            placeTheCardsOfEachPlayer();
            hoverOverMyCardsEffect();
        }
    });


}

//automatic functions 
function youExploded() {

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
function hoverOverDeck() {
    const deck = document.querySelector('.deck-block');
    deck.addEventListener('mouseover', () => {
        deck.style.filter = 'brightness(1.1)';
    });
    deck.addEventListener('mouseout', () => {
        deck.style.filter = 'none';
    });
}

function hoverOverMyCardsEffect() {

    const container = document.getElementById('myContainer');
    const cards = container.querySelectorAll('.card-front');
    cards.forEach(card => {
        const marginLeft = parseInt(window.getComputedStyle(card).marginLeft);

        if (!card.classList.contains('card-on-table')) {
            card.addEventListener('mouseover', () => {
                card.style.transitionDuration = '0.8s';
                card.style.top = '-85px';
                const final = marginLeft + 20;
                card.style.marginLeft = final.toString() + 'px';
                card.style.marginRight = '50px';
            });


            card.addEventListener('mouseout', () => {
                card.style.transitionDuration = '0.5s';
                card.style.top = '0px';
                card.style.marginLeft = marginLeft.toString() + 'px';
                card.style.marginRight = '0px';
            });
        }

    });
}
function hoverOverMyDefuseCardsEffect() {

    const container = document.getElementById('defuseContainer');
    const cards = container.querySelectorAll('.card-front');

    cards.forEach(card => {
        const marginLeft = parseInt(window.getComputedStyle(card).marginLeft);

        if (!card.classList.contains('card-on-table')) {
            card.addEventListener('mouseover', () => {
                card.style.transitionDuration = '0.8s';
                card.style.top = '-85px';
                const final = marginLeft + 20;
                card.style.marginLeft = final.toString() + 'px';
                card.style.marginRight = '50px';
            });


            card.addEventListener('mouseout', () => {
                card.style.transitionDuration = '0.5s';
                card.style.top = '0px';
                card.style.marginLeft = marginLeft.toString() + 'px';
                card.style.marginRight = '0px';
            });
        }

    });
}
function placeTheCardsDefuse() {

    const cardCount = document.querySelectorAll('.card-front').length;
    const cardsElement = document.querySelector('.card-front'); // Width of each card in pixels
    if (cardsElement == null) {
        return;
    }
    const cardWidth = cardsElement.width; // Width of each card in pixels

    const container_defuse = document.getElementById('defuseContainer');

    const cards = document.querySelectorAll('.card-front');

    cards.forEach(card => {

        const clonedElement = card.cloneNode(true);

        if (clonedElement.getAttribute('id') === 'defuse') {
            clonedElement.classList.add('defuse-card');
        }

        container_defuse.appendChild(clonedElement);

    })


    var container = document.getElementById('myContainer');
    var containerWidth = container.offsetWidth;

    if (cardCount > 5) {
        const newCardMargin = parseInt(- Math.floor((cardWidth * cardCount - containerWidth) / cardCount) - 1);

        const Mycards = document.querySelectorAll('.card-front-defuse');

        Mycards.forEach(card => {

            card.style.marginLeft = newCardMargin.toString() + 'px';

        })
    }

}

function getRandomRotation() {
    return Math.floor(Math.random() * 21) - 5;
}
function placeMyName() {
    const name = document.querySelector(".my-name");
    const logo = document.querySelector(".me-logo");

    name.style.top = logo.getBoundingClientRect().top.toString() + 'px';
    name.style.left = logo.getBoundingClientRect().left.toString() + 'px';

}
