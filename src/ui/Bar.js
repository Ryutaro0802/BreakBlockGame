export class Bar {
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
