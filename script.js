document.addEventListener('DOMContentLoaded', (event) => {
    const character = document.getElementById('character');
    const target = document.getElementById('target');
    const obstacles = document.querySelectorAll('.obstacle');
    const heart = document.getElementById('heart');
    const message = document.getElementById('message');
    let characterPosition = { top: 0, left: 0 };
    const moveStep = 10;

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.top = `${y}px`;
        particle.style.left = `${x}px`;
        document.getElementById('game-container').appendChild(particle);
        setTimeout(() => {
            particle.style.top = `${y + (Math.random() - 0.5) * 200}px`;
            particle.style.left = `${x + (Math.random() - 0.5) * 200}px`;
            particle.style.opacity = 1;
        }, 0);
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    function explodeCharacter(x, y) {
        for (let i = 0; i < 20; i++) {
            createParticle(x, y);
        }
    }

    function checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }

    function moveObstacles() {
        obstacles.forEach(obstacle => {
            let top = parseInt(obstacle.style.top);
            top += Math.random() > 0.5 ? moveStep : -moveStep;
            if (top < 0) top = 0;
            if (top > 550) top = 550;
            obstacle.style.top = `${top}px`;

            let left = parseInt(obstacle.style.left);
            left += Math.random() > 0.5 ? moveStep : -moveStep;
            if (left < 0) left = 0;
            if (left > 750) left = 750;
            obstacle.style.left = `${left}px`;
        });
    }

    setInterval(moveObstacles, 1000);

    document.addEventListener('keydown', (event) => {
        let newTop = characterPosition.top;
        let newLeft = characterPosition.left;

        switch(event.key) {
            case 'ArrowUp':
                if (characterPosition.top > 0) {
                    newTop -= moveStep;
                }
                break;
            case 'ArrowDown':
                if (characterPosition.top < 550) {
                    newTop += moveStep;
                }
                break;
            case 'ArrowLeft':
                if (characterPosition.left > 0) {
                    newLeft -= moveStep;
                }
                break;
            case 'ArrowRight':
                if (characterPosition.left < 750) {
                    newLeft += moveStep;
                }
                break;
        }

        // Yeni konumda engelleri kontrol et
        let collision = false;
        const newRect = {
            top: newTop,
            left: newLeft,
            right: newLeft + 50,
            bottom: newTop + 50
        };

        obstacles.forEach(obstacle => {
            const obstacleRect = {
                top: parseInt(obstacle.style.top),
                left: parseInt(obstacle.style.left),
                right: parseInt(obstacle.style.left) + 50,
                bottom: parseInt(obstacle.style.top) + 50
            };
            if (checkCollision(newRect, obstacleRect)) {
                collision = true;
            }
        });

        if (!collision) {
            characterPosition.top = newTop;
            characterPosition.left = newLeft;
            character.style.top = `${characterPosition.top}px`;
            character.style.left = `${characterPosition.left}px`;
        } else {
            explodeCharacter(characterPosition.left, characterPosition.top);
            setTimeout(() => {
                character.style.display = 'none'; // Karakteri görünmez yap
                alert("Oyun Bitti! Engellere çarptınız.");
                location.reload();
            }, 500);
            return; // Hedef kontrolünü atla
        }

        // Hedefe ulaşmayı kontrol et
        const targetRect = {
            top: 550, // Manuel olarak hedefin konumunu ayarladık
            left: 750,
            right: 800,
            bottom: 600
        };
        if (checkCollision(newRect, targetRect)) {
            heart.classList.remove('hidden');
            message.classList.remove('hidden');
        }
    });
});
