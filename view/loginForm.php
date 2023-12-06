<?php 
require_once __DIR__ . '/_header.php'; ?>
	<div class="login-title">
        <img id="logo" src="view/images/exploding-kittens-logo1.svg">
	</div>
	
	<div class="loginRegister-container">
		<div class="exploding-kittens-logo">
			<img src="view/images/exploding-kittens-logo.png" alt="Exploding Kittens Logo">
		</div>

		<form class="login-form" method="post" action="<?php echo htmlentities( $_SERVER["PHP_SELF"] ); ?>">
			<input type="text" name="username" placeholder="Username"/>
			<br />
			<input type="password" name="password" placeholder="Password"/>
			<br />
			<button class="button-42" type="submit" name="rt" value="login">Login</button>
		</form>

		<br>

		<form class="register-form" method="get" action="<?php echo htmlentities( $_SERVER["PHP_SELF"] ); ?>">
		<button class="button-42" type="submit" name="rt" value="register">Create account</button>
	</div>

	<!-- ovo sluzi za slideshow
	<div class="slideshow-container" style="margin-left: 7%; margin-top: 7%">
      <img src="nekaSlikaKarte.png1" style="width: 20%">
  	</div>
	-->

	<script>
    window.addEventListener('DOMContentLoaded', () => {
	console.log(document.currentScript.src);
      const logoImg = document.querySelector('.exploding-kittens-logo img');
      logoImg.addEventListener('mouseenter', () => {
        logoImg.style.transform = 'scale(1.1)';
      });
      logoImg.addEventListener('mouseleave', () => {
        logoImg.style.transform = 'scale(1)';
      });
    });
  </script>

<?php require_once __DIR__ . '/_footer.php'; ?>