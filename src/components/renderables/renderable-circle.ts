import { Renderable } from './renderable';

export class RenderableCircle extends Renderable {
  position: { x: number; y: number };
  radius: number;
  color: string;

  constructor(id: string, position: { x: number; y: number }, radius: number, color: string, opacity = 1) {
    super(id, true, opacity);
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  render(context: CanvasRenderingContext2D): void {
    const { position, radius, color, opacity } = this;

    context.globalAlpha = opacity;
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
  }
}
