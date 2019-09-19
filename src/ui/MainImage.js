export class MainImage {
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
