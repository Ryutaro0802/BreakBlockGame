export class Item {
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
