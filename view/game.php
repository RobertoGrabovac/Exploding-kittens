<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://code.jquery.com/ui/1.13.0/jquery-ui.min.js"></script>

  

  <link rel="stylesheet" href="css/game-style.css"> 
  <!--linkovi su promijenjeni i stvari rade, Zvone-->
  <!-- ovdje ce biti drugaciji link od ovoga jer cemo skriptu ukljucivati iz main.php, a ne joj direktno pristupati. Vrlo vjerojatno ce link biti css/game-style.php -->
  <script>
    const baseUrl = "https://rp2.studenti.math.hr<?php echo __SITE_URL?>/"
    const pollUrl = baseUrl + "webserver/wait.php";
    const makeMoveUrl = baseUrl + "webserver/action.php";
    const setReadyUrl = baseUrl + "webserver/setReadyState.php";
    const gameFunctionsUrl = baseUrl + "webserver/gameFunctions.php";
    const gameSetupFunctionsUrl = baseUrl + "webserver/gameSetupFunctions.php";
    const initializeCardsUrl = baseUrl + "webserver/initializeCards.php";
    const playerResponseUrl = baseUrl + "webserver/actionPlayerResponse.php";
    const playerFavorUrl = baseUrl + "webserver/actionPlayerFavor.php";
    
    var game_id = <?php echo $game->id; ?>;
    var game_code = "<?php echo $game->code; ?>";
    var user_id = <?php echo $user_id; ?>;
  </script>
  <script src="view/scripts/functions.js"></script>
  <script src="view/scripts/game-script-initialize.js"></script>
  <script src="view/scripts/audio-script.js"></script>
  <script src="view/scripts/game-script-setup.js"></script>
  <script src="view/scripts/game-script-update.js"></script>
  <script src="view/scripts/game-script.js"></script>
  <script src="view/scripts/game-script-animations-final.js"></script> 
  <script src="view/scripts/game-script-animations.js"></script> 
  <script src="view/scripts/game-script-response.js"></script> 

  <script src= "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
  
  <title>Exploding kittens</title>
  <body>

<div class="overlay-container" id="overlay-container">
    <div id="your-turn-image" class="overlay-your-turn">
        <img  src= "view/images/yourTurn.png" class="image-yourTurn">
        
    </div> 
    <div id="kitten-defused" class="kitten-defused">
        <img  src="view/images/staff.png" class="staff">
        <img src="view/images/message-box.png" class="message-box">
        <div class="message-box-container">
            <div class="text-message-box">
                I'M MEOWSTER STAFF, MAKE YOUR DECISION!
            </div>
            <div class="button-container">
            </div>      
        </div>
    </div>  
    <div class="final-overlay" id="final-overlay">
        <div class="victory-text" id="victory-text">
            VICTORY!
        </div>
        <div class="fail-text" id="fail-text">
            LOOSER
        </div>
        <div class="opponents-container-final" id="opponents-container-final">
            <!--OPREZ! dodana promjena u iducoj liniji, prije bilo id="me"-->
            <div class="opponent" id="me-opponent-final"> 
                <div class="opponent-name">
                    MESSITHEBEST
                </div>
                <div class="user-logo-container">
                    <img src="view/images/user1.png" class="user-logo">
                    <img src="view/images/explosion2.gif" class="explosion">
                </div>
            </div>
            <div class="opponent"  id="first-opponent-final"> 
                <div class="opponent-name">
                    ANDY
                </div>
                <div class="user-logo-container">
                    <img src="view/images/user2.png" class="user-logo">
                    <img src="view/images/explosion2.gif" class="explosion">
                </div>
            </div>
            <div class="opponent"  id="second-opponent-final"> 
                <div class="opponent-name">
                    PEROTERMINATOR2
                </div>
                <div class="user-logo-container">
                    <img src="view/images/user3.png" class="user-logo">
                    <img src="view/images/explosion2.gif" class="explosion">
                </div>
            </div>
            <div class="opponent" id="third-opponent-final"> 
                <div class="opponent-name" >
                    PCELAMAJA
                </div>
                <div class="user-logo-container">
                    <img src="view/images/user4.png" class="user-logo">
                    <img src="view/images/explosion2.gif" class="explosion">
                </div>
            </div>
            <div class="opponent" id="fourth-opponent-final">
                <div class="opponent-name" >
                    KRALJ ZVONE
                </div> 
                <div class="user-logo-container">
                    <img src="view/images/user5.png" class="user-logo">
                    <img src="view/images/explosion2.gif" class="explosion">
                </div>    
            </div>
        </div>
    </div>
</div>
<div class="game-container">  
    <!-- 
        opponents-container sadrzi containere za podatke svakog igraca (username, sliku) te njihove karte.
    -->
    <div class="opponents-container" id="opponents-container">
        <div class="opponent" id="first-opponent"> 
            <div class="opponent-name">
                ANDY
            </div>
            <div class="user-logo-container">
                <img src="view/images/user2.png" class="user-logo"> 
            </div>
            <div class="opponent-cards" id = "opponent-cards">
                <img src="view/images/cardback.png" class="small-card">
            </div>
        </div>
        <div class="opponent" id="second-opponent"> 
            <div class="opponent-name">
                PEROTERMINATOR2
            </div>
            <div class="user-logo-container">
                <img src="view/images/user3.png" class="user-logo"> 
                <!--<img src="view/images/userDead.png" class="user-logo user-dead">-->
            </div>
            <div class="opponent-cards" id = "opponent-cards">
                
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
                
            </div>
        </div>
        <div class="opponent" id="third-opponent"> 
            <div class="opponent-name">
                PCELAMAJA
            </div>

            <div class="user-logo-container">
                <img src="view/images/user4.png" class="user-logo"> 
            </div>
            <div class="opponent-cards" id = "opponent-cards">
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
            </div>         
        </div>
        <div class="opponent" id="fourth-opponent">
            <div class="opponent-name">
                KRALJ ZVONE
            </div> 
            <div class="user-logo-container">
                <img src="view/images/user5.png" class="user-logo"> 
            </div>
            <div class="opponent-cards" id = "opponent-cards">
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
                <img src="view/images/cardback.png" class="small-card">
            </div> 
        </div>
         
    </div>
    <div class="gameboard-container">
        <div class="game-buttons">
            <div class = "steal-button">
                <svg height="100" width="100">
                    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                </svg>
            </div>
            <div class="logout-button">
                <svg height="100" width="100">
                    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                </svg>
            </div>
        </div>
        <div class="cards-in-deck" id="cards-in-deck">
            <!--
            <div class="fixed-text-cards">
                CARDS LEFT IN DECK:
            </div>
            -->
            <div class="counter-cards">
                25
            </div>
        </div>
        <div class="deck-block" id="deck-block"> 
            <img src="view/images/deck.png" class="deck">
            <img src="view/images/cards/future2.png" id="future" class="deck invisible">
        </div> 
        <div class="discard-pile">
            <img src="view/images/cards/skip1.png" class="card-on-table" id="skip" style="opacity: 0">
            <img src="view/images/cards/steal4.png" class="card-on-table" id="steal">
            <img src="view/images/others/place_cards.png" class="card-on-table text-place-cards">
        </div>
        <div class="table-container">
            <img src="view/images/table.png" class="table">
            <img src="view/images/user1.png" class="user-playing-table"> 
            <div class="table-inside">
                <div class="table-first-row">
                    <!--<img src="view/images/steal-icon.png" class="icon-in-table"> -->
                    <div class="text-table">
                         FROM 
                    </div>
                    <!--<img src="view/images/user2.png" class="user-in-table"> -->
                </div>
                <div class="text-table-explanation">
                    2 TURNS LEFT
                </div>
            </div>
            
            
        </div>
    
    </div>
    <div class="me-container">
        <!--
    me-container sadrzi nasu sliku i username (username ulogiranog korisnika nalazi se u $_SESSION['username'])
    -->
        <div class="me-logo-container"> 
            <img src="view/images/user1.png" class="me-logo"> 
            <div class="my-name" id="me">
                MESSITHEBEST
            </div>
        </div>   
        
        <div class="my-cards-container">
            <div class="effect-card-container" id = "myContainer"> 
                <img src="view/images/cards/steal4.png" id="steal" class="card-front first-card" draggable="true">
                <img src="view/images/cards/defuse2.png" id="defuse" class="card-front" draggable="true">
                <img src="view/images/cards/steal1.png" id="steal" class="card-front" draggable="true">
                <img src="view/images/cards/favor1.png" id="favor" class="card-front" draggable="true">
                <img src="view/images/cards/skip1.png" id="skip" class="card-front" draggable="true">
                <img src="view/images/cards/defuse1.png" id="defuse" class="card-front" draggable="true">
                <img src="view/images/cards/attack1.png" id="attack" class="card-front" draggable="true">
                <img src="view/images/cards/steal2.png" id="steal" class="card-front" draggable="true">
                <img src="view/images/cards/shuffle1.png" id="shuffle" class="card-front" draggable="true">
            </div>
        </div>
    </div>

    <div visibility="hidden" class="button-exit-lobby-container" id="button-exit-lobby-container">
        <form method="get" action="main.php">
            <input type="hidden" name="rt" value='menu'/>
            <button type="submit" id="exit" class="button-42 exit" role="button"> menu </button>
        </form>
    </div>
</div>


</body>
</html>   