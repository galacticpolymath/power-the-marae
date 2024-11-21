export abstract class Renderable {
  id: string;
  isDrawn: boolean;
  opacity: number;
  abstract type: string;

  constructor(id: string, isDrawn = false, opacity = 1) {
    this.id = id;
    this.isDrawn = isDrawn;
    this.opacity = opacity;
  }

  abstract render(context: CanvasRenderingContext2D): void;
}
