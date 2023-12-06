console.log("======GAME INFO======")
console.log("User id: ", user_id);
console.log("Game id: ", game_id);
console.log("Game code: ", game_code);
console.log("Base server url: ", baseUrl);
console.log("Polling url: ", pollUrl);

var defused = false; //ova služi da znamo kad je čovjek koristio defuse
//zato što može on draggati bilo koja karta iznad defuse kontejner (kad je wick u pitanju), 
//ali nas zanima kad dragga iznad defuse container pravu kartu (defuse)
var game;


class ExplodingKittens {

    //izbrisati stvari iz konstruktora
    constructor(cards) {
        this.cardsArray = cards;
        this.cardStealToCheck = null;
        this.myTurn = true;
        this.audioController = new AudioController();
    }

    start() {
        //this.yourTurn();
        this.audioController.startMusic();
    }

    //zapravo draw a card
    //moguce izvadit, dodati parametar game, testirati
    pickACard() {
        var card = document.getElementsByClassName('invisible')[0];
        var deck_container = document.querySelector('.deck-block');
        var effect_card_container = document.getElementById('myContainer');;
        //dodaje i mice classe
        card.classList.add('pick-effect');
        card.classList.remove('invisible');
        document.getElementById("deck-block").classList.add("no-hover");
        this.audioController.pickACardSound();

        setTimeout(() => {
            gsap.to(".pick-effect", {
                x: 100,
                y: 100,
                duration: 0.1,
                onComplete: appendIt
            })
        }, 2000)

        if (card.id == 'bomb') {
            this.audioController.stopMusic();
            this.explosionDefuse();
        }

        function appendIt() {

            card.classList.remove('deck');
            card.classList.remove('pick-effect');
            deck_container.removeChild(card);
            card.setAttribute('draggable', 'true');
            card.classList.add('card-front');

            card.style.transform = 'none';

            effect_card_container.appendChild(card);
            document.getElementById("deck-block").classList.remove("no-hover");
            //kljucno
            basicFunctions(game);
            this.audioController.pickACardSound();
        }

    }

    opponentPlays() {
        this.audioController.pickACardSound();
    }

    explosionDefuse() {
        this.audioController.stopMusic();
        var tl = gsap.timeline();
        var time = 11000;
        setTimeout(() => {
            //document.getElementById('exploding-kitten-defuse').classList.add('visible');
            createOverlayExplodingKittenDefuse();
            placeTheCardsDefuse(); //ovdje proslijedimo this čisto da možemo pristupiti AudioController
            var tl2 = gsap.from(".defuse-card:not(.dragging)", { duration: 1, y: -60, ease: "bounce.out", repeat: Infinity });
            hoverOverMyDefuseCardsEffect();
            draggingDefuse(tl, tl2, this); //ista fora za this
            var distance = 33 * window.innerWidth / 100;
            tl.to(".spark", { duration: 10, x: -distance, ease: "power0.out" })
            tl.to(".svg-rectangle", { duration: 10, x: -distance, ease: "power0.out", delay: -10 })
            console.log(tl);
            console.log(tl2);
        }, 1000)

        setTimeout(() => {
            this.audioController.wickSound();
        }, 1000)

        setTimeout(() => {
            if (!defused) {
                youExploded();
                console.log("Nisi stavio defuse, umireš!");
                explodeResponseNotDefused();
                // OVDJE ZOVEMO SERVER AKO NE STAVIMO DEFUSE KARTU
            }
        }, time)

        console.log(time);

        // donje dvije linije su nevjerojatno bitne za ispravan rad defuse i exploding kitten karte
        resetStaffDiv();
        defused = false;
    }

    yourTurn() {

        setTimeout(() => {
            document.getElementById('your-turn-image').classList.add('visible');
            this.audioController.yourTurnSound();
        }, 10)
        setTimeout(() => {
            document.getElementById('your-turn-image').classList.remove('visible');
        }, 2000)
    }

    pickACard(idOfAPickedCard){
        if (idOfAPickedCard == null) {
            return;
        }
        if(idOfAPickedCard == "exploding"){
            idOfAPickedCard = 1;
        }
        let card = document.createElement('img');
        card.src = 'view/images/cards-with-id/' + idOfAPickedCard + '.png';
        card.classList.add("card-front");
        card.draggable = true;
        card.id = idOfAPickedCard.card_id;
        card.card = card;

        var deck_container = document.querySelector('.deck-block');
        deck_container.appendChild(card);
        var effect_card_container = document.getElementById('myContainer');;
        card.classList.add('pick-effect');
        card.classList.remove('invisible');
        document.getElementById("deck-block").classList.add("no-hover");
        

        setTimeout(()=>{
            gsap.to(".pick-effect", {
                x: 100,
                y: 100,
                duration: 0.2,
                onComplete: appendIt
            })

        }, 500)
        
        function appendIt(){
                
            card.classList.remove('deck');
            card.classList.remove('pick-effect');
            deck_container.removeChild(card);
            card.setAttribute('draggable','true');
            card.classList.add('card-front');
            card.style.transform = 'none';
            //effect_card_container.appendChild(card);
            document.getElementById("deck-block").classList.remove("no-hover");
            basicFunctions();
            //this.audioController.pickACardSound();
        }

    }
}

function insertHTMLIntoElement(elementId, htmlCode) {
    var element = document.getElementById(elementId);
    if (element) {
        while (element.firstChild) {
            element.firstChild.remove();
        }
        element.innerHTML = htmlCode;
    } else {
        console.error('Element with ID ' + elementId + ' not found.');
    }
}

function resetStaffDiv() {
    var htmlCode = `
    <img src="view/images/staff.png" class="staff">
    <img src="view/images/message-box.png" class="message-box">
    <div class="message-box-container">
        <div class="text-message-box">
            I'M MEOWSTER STAFF, MAKE YOUR DECISION!
        </div>
        <div class="button-container">
        </div>      
    </div>
`;
    insertHTMLIntoElement('kitten-defused', htmlCode);
}

function ready() {
    // 1. da se poziva nakon dealera
    // 2. da se uopće ne poziva jer ne treba
    let allCards = Array.from(document.getElementsByClassName('card-front'));

    //izbrisati parametar
    game = new ExplodingKittens(allCards);

    game.start();

    basicFunctions(game);

    window.addEventListener("scroll", function (event) {
        event.preventDefault();
        window.scrollTo(0, 0);
    });

    const deck = document.querySelector('.deck-block');

    //ovo iskoristit drukcije
    /*deck.addEventListener('click', function(event) {    
        game.pickACard();
    });*/

    const opponent = document.getElementById('third-opponent');
    const opponent2 = document.getElementById('second-opponent');
    //iz overlaya
    const winner = document.getElementById('third-opponent-final');

    //ovako je Luis kreirao karte dosad
    const card = document.createElement("img");
    card.src = "view/images/cards/favor1.png";
    card.id = 'favor';
    //card-on-table je gornja odigrana
    card.classList.add('card-on-table');

    basicFunctions(game);

    //najbitnije funkcije, odnosno jedine koje trebaju, one koriste ostale "pomocne"

    dealerInitializing(/*cards,*/ game, deck);
    //victory(winner, game);
    //kittenOpponentExploding(opponent);  //kad igrac izvuce exploding
    //shuffle(game);
    //seeTheFuture(game);
    //opponentDrawCard(opponent,card, game); //odigrati 
    //opponentPickCard(opponent, game); //povuci
    //opponentStealOpponent(opponent, opponent2); //ovo se jos ne dogadja
    //IStealOpponent(opponent, card, game); 
    //opponentStealsMe(opponent, card);

    //favor ??? mozemo samo stealati random kartu zasad
    basicFunctions(game);

    //setTimeout(basicFunctions(game),10000);

    //prikazuje koji je igrac na potezu
    //opponentsTurn(opponent);
}