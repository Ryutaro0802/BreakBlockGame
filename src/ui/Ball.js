export class Ball {
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
