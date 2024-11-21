import { Renderable } from './renderable';

export class RenderableImage extends Renderable {
  image: HTMLImageElement;
  highlightImage: HTMLImageElement | null;
  isInitial: boolean;
  type = 'image';

  constructor(id: string, image: HTMLImageElement, highlightImage: HTMLImageElement | null, isInitial = false) {
    super(id);
    this.image = image;
    this.highlightImage = highlightImage;
    this.isInitial = isInitial;
  }

  render(context: CanvasRenderingContext2D): void {
    if (!this.isDrawn) return;

    const { image, highlightImage, opacity, isInitial } = this;
    const canvasWidth = context.canvas.clientWidth;
    const canvasHeight = context.canvas.clientHeight;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const imageAspectRatio = image.width / image.height;

    let renderWidth: number;
    let renderHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imageAspectRatio > canvasAspectRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imageAspectRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imageAspectRatio;
      renderHeight = canvasHeight;
      offsetX = (canvasWidth - renderWidth) / 2;
      offsetY = 0;
    }

    // Draw the highlight background if it exists
    if (highlightImage !== null && !isInitial && opacity > 0) {
      context.globalAlpha = opacity;
      context.drawImage(highlightImage, offsetX, offsetY, renderWidth, renderHeight);
      this.opacity = Math.max(this.opacity - 0.03, 0);
    }

    // Draw the image
    context.globalAlpha = 1;
    context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
  }

  setToDraw(): void {
    if (!this.isDrawn) {
      this.isDrawn = true;
      if (!this.isInitial) {
        this.opacity = 1;
      }
    }
  }

  setToNotDraw(): void {
    this.isDrawn = false;
  }

  static isOfType(obj: Renderable): obj is RenderableImage {
    return obj.type === 'image';
  }
}
