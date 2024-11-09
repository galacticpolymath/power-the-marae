export abstract class Renderable {
  id: string;
  isDrawn: boolean;
  opacity: number;

  constructor(id: string, isDrawn = false, opacity = 1) {
    this.id = id;
    this.isDrawn = isDrawn;
    this.opacity = opacity;
  }

  abstract render(context: CanvasRenderingContext2D): void;
}
