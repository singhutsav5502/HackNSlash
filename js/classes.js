class Sprite {
    constructor({ position, imageSrc, scale = 1, frameCount = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameCount = frameCount
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }


    draw() {
        // n frames
        ctx.drawImage(this.image,
            this.framesCurrent * (this.image.width / this.frameCount),
            0,
            this.image.width / this.frameCount,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.frameCount) * this.scale,
            this.image.height * this.scale)
    }
    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.frameCount - 1) {
                this.framesCurrent++;
            }
            else {
                this.framesCurrent = 0
            }
        }
    }
    update() {
        this.draw()
        this.animateFrames()
    }

}
class Fighter extends Sprite {
    constructor({ position, velocity, offset = { x: 0, y: 0 }, imageSrc, scale = 1, frameCount = 1, sprites, attackBox = { offset: {}, width: undefined, height: undefined } }) {
        // inherit from Sprite
        super({
            imageSrc,
            scale,
            frameCount,
            position,
            offset,
        })
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
        this.sprites = sprites
        this.isDead = false
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset
        }
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }


    }

    // originally draw method for fighter created rectangles
    // but actual game needs to use images
    // threfore draw method is now taken from Sprite class which uses images

    update() {
        this.draw()
        if (!this.isDead) {
            this.animateFrames()

            this.attackBox.position.y = this.position.y + this.attackBox.offset.y
            this.attackBox.position.x = this.position.x + this.attackBox.offset.x
            this.position.y += this.velocity.y
            if (this.position.x + this.velocity.x > 0 && this.position.x + this.velocity.x < canvas.width - this.width) {

                this.position.x += this.velocity.x
            }

            // Draw attack Box
            // ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

            if (this.position.y + this.height >= canvas.height - 90) {
                this.velocity.y = 0;
                this.position.y = canvas.height - 90 - this.height
            }
            else {
                this.velocity.y += gravity
            }
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }
    takeHit() {
        this.health -= 10

        if (this.health <= 0) {
            this.switchSprite('death')

        }
        else {
            this.switchSprite('takeHit')
        }
    }
    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.frameCount - 1) {
                this.isDead = true
            }
            return
        }
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.frameCount - 1) return
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.frameCount - 1) return
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.frameCount = this.sprites.idle.frameCount
                    // When we switch to a new sprite we need to start the animation from it's 0th frame
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.frameCount = this.sprites.run.frameCount
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.frameCount = this.sprites.jump.frameCount
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.frameCount = this.sprites.fall.frameCount
                    this.framesCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.frameCount = this.sprites.attack1.frameCount
                    this.framesCurrent = 0
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.frameCount = this.sprites.takeHit.frameCount
                    this.framesCurrent = 0
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.frameCount = this.sprites.death.frameCount
                    this.framesCurrent = 0
                }
                break;
        }
    }
}