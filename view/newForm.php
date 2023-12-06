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
		<input type="text" name="newusername" placeholder="Username"/>
		<br />
		<input type="password" name="newpassword" placeholder="Password"/>
		<br />
		<input type="text" name="email" placeholder="Email"/>
		<br />
		<button class="button-42" type="submit">Create account!</button>
	</form>
	<p class="returnBack">
		<a href="main.php">Homepage</a>.
	</p>
	</div>

	<script>
    window.addEventListener('DOMContentLoaded', () => {
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