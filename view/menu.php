<!DOCTYPE html>
<html>
<head>
  <title>Game Menu</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="view/scripts/menu-script.js"></script>
</head>

<body>
  <div class="lobby">
    <div class="first-row">
      <img src="view/images/title.png" class="title">
      <form method="get" action="main.php">
        <input type="hidden" name="rt" value='logout'/>
        <button type="submit" id="exit" class="button-42 exit" role="button"> logout </button>
      </form>
    </div>

    <div class="columns">
      <div class="avatar-container">
        <div class="text-container">
          <div class="text">
            Hello <?php echo($_SESSION['username']); ?>!
          </div>
        </div>
        <img src="view/images/user1.png" class="user-logo">
      </div>

      <div class="button-container">
        
        <div  class="first-button">
          <form method="get">
            <input type="hidden" name="code_rand" value=<?php echo $code_rand?>/>
            <button type="submit" id="createGameBtn" name="rt" value="create" class="button-42">Create game</button>
          </form>
        </div>
  
        <div class="second-button">
          <form method="get">
            <input type="text" id="gameCodeInput" name="code" placeholder="Enter game code" class="join-code">
            <button type="submit" id="joinGameBtn" name="rt" value="join" class="button-42 join-game">Join game</button>
          </form>
        </div>

        <div class="third-button">
          <form method="get" action="https://www.explodingkittens.com/pages/rules-kittens">
            <button type="submit" id="howToPlay" name="pdf" value="how-to-play" class="button-42 how-to" role="button">
              how to play
            </button>
          </form>
        </div>


      </div>
      
    </div>
    <img src="view/images/bunnie.png" class="bunnie">
    <img src="view/images/tacocat.png" class="tacocat">
    <img src="view/images/playing.png" class="playing">

  </div>

</body>
</html>

