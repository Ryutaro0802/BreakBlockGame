import { Bar } from "./ui/Bar.js";
import { Ball } from "./ui/Ball.js";
import { Block } from "./ui/Block.js";
import { Item } from "./ui/Item.js";
import { MainImage } from "./ui/MainImage.js";
import { rectangleCollisionDetection } from "./utility/rectangleCollisionDetection.js";
import { stringToHtml } from "./utility/stringToHtml.js";

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
        distanceX: Math.floor(Math.random() * 2) ? 1 : -1,
        distanceY: -1,
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
  /**
   * セットアップ
   */
  setUp = () => {
    this.addEvent();
    this.createBlocks();
    this.setHasItem();
    this.main();
  };
  /**
   * ブロック生成
   */
  createBlocks = () => {
    let count = 0;
    let y = 300;
    let x = 0;
    while (count < this.BLOCK_LENGTH) {
      if (count % 94 === 0) {
        y += 5;
        x = 0;
      }
      this.blocks = [
        ...this.blocks,
        new Block({
          ctx: this.ctx,
          x: x * 5,
          y: y
        })
      ];
      x++;
      count++;
    }
  };
  /**
   * ブロックにランダムでアイテムを仕込む
   */
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
  /**
   * イベント登録
   */
  addEvent = () => {
    this.stageElement.addEventListener("mousemove", this.onMouseMove);
  };
  /**
   * マウスが動いたときxとyを更新
   * @param {EventObject} e イベントオブジェクト
   */
  onMouseMove = e => {
    this.mouseX = e.clientX - this.stageElement.offsetLeft;
    this.mouseY = e.clientY - this.stageElement.offsetTop;
  };
  /**
   * ボールとブロックがあたった
   * @param {Ball} ball Ballインスタンス
   * @param {Block} block blockインスタンス
   */
  blockHitDecision = (ball, block) => {
    if (
      rectangleCollisionDetection(
        ball.left,
        ball.top,
        ball.right,
        ball.bottom,
        block.left,
        block.top,
        block.right,
        block.bottom
      )
    ) {
      block.remove();
      if (block.hasItem) {
        this.items = [
          ...this.items,
          new Item({
            ctx: this.ctx,
            x: block.x,
            y: block.y,
            imgSrc: this.imageSrc.star
          })
        ];
      }
      if (!ball.goThrough) {
        ball.reverseX();
        ball.reverseY();
      }
      this.blocks = this.blocks.filter(b => b !== block);
    }
  };
  /**
   * ボールと壁があたった
   * @param {Ball} ball Ballインスタンス
   */
  wallHitDecision = ball => {
    if (ball.left < 0 || ball.right > this.screenWidth) {
      ball.reverseX();
    }
    if (ball.top < 0) {
      ball.reverseY();
    }
  };
  /**
   * バーとボールがあたった
   * @param {Ball} ball Ballインスタンス
   * @param {Bar} bar Barインスタンス
   */
  barBallHitDecision = (ball, bar) => {
    if (
      rectangleCollisionDetection(
        ball.left,
        ball.top,
        ball.right,
        ball.bottom,
        bar.left,
        bar.top,
        bar.right,
        bar.bottom
      )
    ) {
      ball.offGoThroughMode();
      // バーの真ん中あたりにあたったら貫通モードになる
      if (Math.abs(ball.center.x - bar.center) < 2) {
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
  /**
   * アイテムが下まで落ちた
   * @param {Item} item Itemインスタンス
   */
  itemBottomHitDecision = item => {
    if (this.screenHeight < item.bottom) {
      this.items = this.items.filter(i => i !== item);
    }
  };
  /**
   * アイテムとバーがあたった
   * @param {Item} item Itemインスタンス
   * @param {Bar} bar Barインスタンス
   */
  itemBarHitDecision = (item, bar) => {
    if (
      rectangleCollisionDetection(
        item.left,
        item.top,
        item.right,
        item.bottom,
        bar.left,
        bar.top,
        bar.right,
        bar.bottom
      )
    ) {
      this.items = this.items.filter(i => i !== item);
      this.balls = [
        ...this.balls,
        new Ball({
          ctx: this.ctx,
          x: item.left,
          y: item.top - 10,
          distanceX: Math.floor(Math.random() * 2) ? 1 : -1,
          distanceY: -1,
          speed: 2,
          imgSrc1: this.imageSrc.ball3,
          imgSrc2: this.imageSrc.ball2
        })
      ];
    }
  };
  /**
   * ボールが下まで落ちた
   * @param {Ball} ball Ballインスタンス
   */
  ballBottomHitDecision = ball => {
    if (this.screenHeight < ball.bottom) {
      if (ball === this.balls[0]) {
        this.gameOver();
      }
      this.balls.filter(b => b !== ball);
    }
  };
  /**
   * ゲーム終わり
   */
  gameOver = () => {
    const htmlString =
      '<div style="background: black;color: white;font-weight: bold;font-size: 50px;display: flex;align-items: center;justify-content: center;margin: 0 auto;width: 470px;height: 700px;border: 1px solid black;">GAME OVER</div>';
    const stageParentElement = this.stageElement.parentNode;
    stageParentElement.replaceWith(stringToHtml(htmlString));
  };
  /**
   * メインループ
   */
  main = () => {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.mainImage.draw();

    this.balls.forEach(ball => {
      this.wallHitDecision(ball);
      this.ballBottomHitDecision(ball);
      this.barBallHitDecision(ball, this.bar);
      this.blocks.forEach(block => {
        this.blockHitDecision(ball, block);
      });
    });
    this.items.forEach(item => {
      this.itemBottomHitDecision(item);
      this.itemBarHitDecision(item, this.bar);
    });

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
