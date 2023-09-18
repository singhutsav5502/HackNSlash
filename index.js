
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


canvas.width = 1024
canvas.height = 576

const gravity = 0.7
ctx.fillRect(0, 0, canvas.width, canvas.height);

//background declaration
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png',
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    frameCount: 6
})

// Players Declaration
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    frameCount: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            frameCount: 8,
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            frameCount: 8,
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            frameCount: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            frameCount: 2,
        },
        attack1: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            frameCount: 6,
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/TakeHit.png',
            frameCount: 4,
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            frameCount: 6,
        }

    },
    attackBox: {
        offset: {
            x: 80,
            y: 50
        },
        width: 160,
        height: 50,
    }
})
const enemy = new Fighter({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },

    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/kenji/Idle.png',
    frameCount: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 175
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            frameCount: 4,
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            frameCount: 8,
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            frameCount: 2,
        },
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            frameCount: 2,
        },
        attack1: {
            imageSrc: './assets/kenji/Attack1.png',
            frameCount: 4,
        },
        takeHit: {
            imageSrc: './assets/kenji/TakeHit.png',
            frameCount: 3,
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            frameCount: 7,
        }

    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50,
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        prpesed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
}


countDown()
function animate() {

    window.requestAnimationFrame(animate)
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    // setting velocity to 0 when key is not pressed
    //setting velocity every frame based on latest key pressed

    //Player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.switchSprite('run')
        player.velocity.x = -5
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.switchSprite('run')
        player.velocity.x = 5
    }
    else { player.switchSprite('idle') }
    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    //Enemy mobement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run')
        enemy.velocity.x = -5
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run')
        enemy.velocity.x = 5
    }
    else { enemy.switchSprite('idle') }
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    // DETECT COLLISION & GET HIT
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.framesCurrent === 4) {
        // only want to count one hit per attack
        player.isAttacking = false
        enemy.takeHit()
        // Decrease Health
        gsap.to('#enemyHealth', { width: enemy.health + '%', duration: 0.2 })
    }
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        // only want to count one hit per attack
        enemy.isAttacking = false
        // Decrease Health
        player.takeHit()
        gsap.to('#playerHealth', { width: player.health + '%', duration: 0.2 })
    }
    //player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }
    // enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }

}

animate()


window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case 'w':
            player.velocity.y = -20
            break;
        case ' ':
            player.attack()
            break;

        //  Enemy Keys
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowDown':
            enemy.attack()
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break;
        case 'a':
            keys.a.pressed = false
            break;
        //  Enemy Keys
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break;
    }
})