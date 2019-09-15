const stageElement = document.getElementById("stage");
const ctx = stageElement.getContext("2d");
const imgSrc = {
  ball1: "./assets/ball1.gif",
  ball2: "./assets/ball2.gif"
};

class Bar {
  constructor({ ctx, x, y, color }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = 50;
    this.height = 5;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  draw = () => {
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  move = mouseX => {
    this.x = mouseX;
  };
}

class Ball {
  constructor({ ctx, x, y, speed, imgSrc }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.distanceX = 1;
    this.distanceY = 1;
    this.imgSrc = imgSrc;
    this.life = 1;
    this.diameter = 12;
  }
  get center() {
    return {
      x: this.x + this.diameter / 2,
      y: this.y + this.diameter / 2
    };
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.diameter;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.diameter;
  }
  draw = () => {
    const img = new Image();
    img.src = this.imgSrc;
    this.ctx.drawImage(img, this.x, this.y, this.diameter, this.diameter);
  };
  move = () => {
    this.x += this.speed * this.distanceX;
    this.y += this.speed * this.distanceY;
  };
  remove = () => {
    this.life = 0;
  };
}

class Block {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 1;
    this.hasItem = false;
  }
  draw = () => {};
  remove = () => {
    this.life = 0;
  };
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1;
  }
}

class Game {
  constructor({ stageElement }) {
    this.stageElement = stageElement;
    this.screenWidth = this.stageElement.width;
    this.screenHeight = this.stageElement.height;
    this.mouseX = 0;
    this.mouseY = 0;
    this.bar = new Bar({
      ctx,
      x: 25,
      y: this.screenHeight - 20,
      moveX: 1,
      moveY: 1
    });
    this.balls = [
      new Ball({
        ctx,
        x: 20,
        y: 20,
        speed: 2,
        imgSrc: imgSrc.ball1
      })
    ];
    this.blocks = [];
  }
  setUp = () => {
    this.addEvent();
    requestAnimationFrame(this.main);
  };
  addEvent = () => {
    this.stageElement.addEventListener("mousemove", this.onMouseMove);
  };
  onMouseMove = e => {
    this.mouseX = e.clientX - this.stageElement.offsetLeft;
    this.mouseY = e.clientY - this.stageElement.offsetTop;
  };
  blockHitDecision = () => {};
  wallHitDecision = ball => {
    if (
      ball.left < 0 ||
      ball.right > this.screenWidth ||
      ball.top < 0 ||
      ball.bottom > this.screenHeight
    ) {
      ball.distanceX *= -1;
      ball.distanceY *= -1;
    }
  };
  barHitDecision = (ball, bar) => {
    if (
      ball.left > bar.left &&
      ball.right < bar.right &&
      ball.bottom > bar.top
    ) {
      ball.distanceY *= -1;
    }
  };
  main = () => {
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

    this.bar.move(this.mouseX);
    this.balls[0].move();

    this.balls[0].draw();
    this.bar.draw();

    this.wallHitDecision(this.balls[0]);
    this.barHitDecision(this.balls[0], this.bar);

    requestAnimationFrame(this.main);
  };
}

const game = new Game({ stageElement });
game.setUp();
