export class Ball {
  constructor({ ctx, x, y, directionX, directionY, speed, imgSrc1, imgSrc2 }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.directionX = directionX;
    this.directionY = directionY;
    this.imgSrc1 = imgSrc1;
    this.imgSrc2 = imgSrc2;
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
    img.src = !this.goThrough ? this.imgSrc1 : this.imgSrc2;
    this.ctx.drawImage(img, this.x, this.y, this.diameter, this.diameter);
  };
  move = () => {
    this.x += this.speed * this.directionX;
    this.y += this.speed * this.directionY;
  };
  reverseX = () => {
    this.directionX *= -1;
  };
  reverseY = () => {
    this.directionY *= -1;
  };
  moveAdjust = adjustX => {
    this.x += adjustX;
  };
  onGoThroughMode = () => {
    this.goThrough = true;
  };
  offGoThroughMode = () => {
    this.goThrough = false;
  };
}
