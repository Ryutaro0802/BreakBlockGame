const stageElement = document.getElementById("stage");
const ctx = stageElement.getContext("2d");
const imgSrc = {
  ball1: "./assets/ball1.gif",
  ball2: "./assets/ball2.gif",
  star: "./assets/star.png",
  xxx: "./assets/xxx.jpg"
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
  get center() {
    return this.x + this.width / 2;
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
    this.distanceX = -1;
    this.distanceY = -1;
    this.imgSrc = imgSrc;
    this.life = 1;
    this.diameter = 12;
    this.goThrough = false;
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
  reverseX = () => {
    this.distanceX *= -1;
  };
  reverseY = () => {
    this.distanceY *= -1;
  };
  moveAdjust = adjustX => {
    this.x += adjustX;
  };
  remove = () => {
    this.life = 0;
  };
  onGoThroughMode = () => {
    this.goThrough = true;
  };
  offGoThroughMode = () => {
    this.goThrough = false;
  };
}

class Block {
  constructor({ ctx, x, y, color }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 5;
    this.color = color;
    this.life = 1;
    this.hasItem = false;
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
  remove = () => {
    this.life = 0;
  };
}

class Item {
  constructor({ ctx, x, y, imgSrc }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.imgSrc = imgSrc;
    this.life = 1;
    this.width = 40;
    this.height = 40;
  }
  get center() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
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
    const img = new Image();
    img.src = this.imgSrc;
    this.ctx.drawImage(img, this.x, this.y, this.width, this.height);
  };
  move = () => {
    this.y += this.speed;
  };
  remove = () => {
    this.life = 0;
  };
}

class MainImage {
  constructor({ ctx, imgSrc }) {
    this.ctx = ctx;
    this.imgSrc = imgSrc;
  }
  draw = () => {
    const img = new Image();
    img.src = this.imgSrc;
    this.ctx.drawImage(img, 0, 0, 470, 700);
  };
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
      y: this.screenHeight - 20
    });
    this.mainImage = new MainImage({ ctx, imgSrc: imgSrc.xxx });
    this.balls = [
      new Ball({
        ctx,
        x: this.bar.right,
        y: this.bar.top,
        speed: 2,
        imgSrc: imgSrc.ball1
      })
    ];
    this.blocks = [];
    this.items = [];
    this.BLOCK_LENGTH = 4700;
    this.ITEM_LENGTH = 200;
  }
  setUp = () => {
    this.addEvent();
    this.createBlocks();
    this.setHasItem();
    requestAnimationFrame(this.main);
  };
  createBlocks = () => {
    let count = 0;
    let y = 300;
    let x = 0;
    while (count < this.BLOCK_LENGTH) {
      if (count % 94 === 0) {
        y += 5;
        x = 0;
      }
      this.blocks.push(
        new Block({
          ctx,
          x: x * 5,
          y: y
        })
      );
      x++;
      count++;
    }
  };
  setHasItem = () => {
    let count = 0;
    while (count < this.ITEM_LENGTH) {
      const hasItemBlock = this.blocks[
        Math.floor(Math.random() * this.BLOCK_LENGTH)
      ];
      hasItemBlock.hasItem = true;
      count++;
    }
  };
  addEvent = () => {
    this.stageElement.addEventListener("mousemove", this.onMouseMove);
  };
  onMouseMove = e => {
    this.mouseX = e.clientX - this.stageElement.offsetLeft;
    this.mouseY = e.clientY - this.stageElement.offsetTop;
  };
  blockHitDecision = (ball, block) => {
    if (
      ball.left < block.right &&
      ball.top < block.bottom &&
      ball.right > block.left &&
      ball.bottom > block.top
    ) {
      block.remove();
      if (block.hasItem) {
        this.items.push(
          new Item({
            ctx,
            x: block.x,
            y: block.y,
            imgSrc: imgSrc.star
          })
        );
      }
      if (!ball.goThrough) {
        ball.reverseX();
        ball.reverseY();
      }
      this.blocks = this.blocks.filter(blockItem => !!blockItem.life);
    }
  };
  wallHitDecision = ball => {
    if (ball.left < 0 || ball.right > this.screenWidth) {
      ball.reverseX();
    }
    if (ball.top < 0) {
      ball.reverseY();
    }
  };
  barHitDecision = (ball, bar) => {
    if (
      ball.left > bar.left &&
      ball.right < bar.right &&
      ball.bottom > bar.top
    ) {
      ball.offGoThroughMode();
      // バーの真ん中あたりにあたったら貫通モードになる
      if (Math.abs(ball.center.x - bar.center) < 1) {
        ball.onGoThroughMode();
      }
      // 当たらないブロックが存在しそうになるので動きを調整する
      if (ball.center.x < bar.center) {
        ball.moveAdjust(Math.floor(Math.random() * 7) * -1);
      } else {
        ball.moveAdjust(Math.floor(Math.random() * 7));
      }
      ball.reverseY();
    }
  };
  checkGameOver = ball => {
    if (ball.bottom > this.screenHeight) {
      console.log("GameOver!!");
    }
  };
  main = () => {
    ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.mainImage.draw();

    this.balls.forEach(ball => {
      this.wallHitDecision(ball);
      this.barHitDecision(ball, this.bar);
      this.blocks.forEach(block => {
        this.blockHitDecision(ball, block);
      });
    });

    this.checkGameOver(this.balls[0]);

    this.bar.move(this.mouseX);
    this.balls.forEach(ball => {
      ball.move();
    });
    this.items.forEach(item => {
      item.move();
    });

    this.bar.draw();
    this.balls.forEach(ball => {
      if (ball.life) {
        ball.draw();
      }
    });
    this.blocks.forEach(block => {
      if (block.life) {
        block.draw();
      }
    });
    this.items.forEach(item => {
      console.log(item);
      if (item.life) {
        item.draw();
      }
    });

    requestAnimationFrame(this.main);
  };
}

const game = new Game({ stageElement });
game.setUp();
