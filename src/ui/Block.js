export class Block {
  constructor({ ctx, x, y, color }) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 5;
    this.color = color;
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
}
