import { Bar } from "./ui/Bar.js";
import { Ball } from "./ui/Ball.js";
import { Block } from "./ui/Block.js";
import { Item } from "./ui/Item.js";
import { MainImage } from "./ui/MainImage.js";

export class Game {
  constructor({ stageElement }) {
    this.stageElement = stageElement;
    this.ctx = this.stageElement.getContext("2d");
    this.imageSrc = {
      ball1: "./assets/ball1.gif",
      ball2: "./assets/ball2.gif",
      ball3: "./assets/ball3.gif",
      star: "./assets/star.png",
      xxx: "./assets/xxx.jpg"
    };
    this.screenWidth = this.stageElement.width;
    this.screenHeight = this.stageElement.height;
    this.mouseX = 0;
    this.mouseY = 0;
    this.bar = new Bar({
      ctx: this.ctx,
      x: 25,
      y: this.screenHeight - 20
    });
    this.mainImage = new MainImage({
      ctx: this.ctx,
      imgSrc: this.imageSrc.xxx
    });
    this.balls = [
      new Ball({
        ctx: this.ctx,
        x: this.bar.right,
        y: this.bar.top,
        speed: 2,
        imgSrc1: this.imageSrc.ball1,
        imgSrc2: this.imageSrc.ball2
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
          ctx: this.ctx,
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
            ctx: this.ctx,
            x: block.x,
            y: block.y,
            imgSrc: this.imageSrc.star
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
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
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
      if (item.life) {
        item.draw();
      }
    });

    requestAnimationFrame(this.main);
  };
}
