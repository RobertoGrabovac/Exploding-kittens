function defusedKitten() {
    //TU NEGDJE POZIV SERVERU
    console.log("Poziv serveru");

    document.getElementById('overlay-container').removeChild(document.getElementById('exploding-kitten-defuse'));
    document.getElementById('kitten-defused').classList.add('visible');
    //document.getElementById('exploding-kitten-defuse').classList.remove('visible');

    const buttonContainer = document.querySelector('.button-container');
    const deck = document.querySelector('.deck-block');
    const images = deck.querySelectorAll("img");
    const nodesLength = images.length;

    function createButton() {
        const button = document.createElement('button');
        button.classList.add("button-to-deck");
        button.classList.add("button-19");
        return button;
    }

    //dodati buttone pliz

    const button4 = createButton();
    button4.textContent = 'TOP';
    buttonContainer.appendChild(button4);
    const button5 = createButton();
    button5.textContent = 'RANDOM';
    buttonContainer.appendChild(button5);
    const button6 = createButton();
    button6.textContent = 'BOTTOM';
    buttonContainer.appendChild(button6);

    const container = document.getElementById('myContainer');
    const bomb = container.querySelector('#bomb');

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

        tl.to(".staff", { duration: 2.5, x: 600, ease: "back.out(1.7)", delay: 2 });
        tl.to(".message-box", { duration: 0.5, y: -10, ease: "power0.out", opacity: 0 });
        tl.to(".message-box-container", {
            duration: 0.3, y: -10, ease: "power0.out", opacity: 0,
            onComplete: document.getElementById('kitten-defused').classList.remove('visible'), delay: 3
        });

        // Add the 'active' class to the clicked button
        event.target.classList.add('active');
        const clickedButton = event.target;
        const buttonText = clickedButton.textContent;
        
        console.log("clicked buttonText", buttonText);
        
        let where = buttonText.toLowerCase();
        console.log(where);
        explodeResponseDefused(where);
    }

    buttons.forEach(button => {
        button.addEventListener('click', handleClick);
    });


}