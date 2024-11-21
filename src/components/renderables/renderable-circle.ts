import { Renderable } from './renderable';
import { EnergyCircle } from '@/app/models/energy-circle';

export class RenderableCircle extends Renderable {
  position: { x: number; y: number };
  radius: number;
  color: string;
  currentRadius: number;
  type = 'circle';

  constructor(energyCircle: EnergyCircle & { color: string }, startingRadius: number = 1, opacity = 0.4) {
    super(`circle-${energyCircle.center.x}-${energyCircle.center.y}-${energyCircle.color}`, true, opacity);
    this.position = energyCircle.center;
    this.radius = energyCircle.radius;
    this.color = energyCircle.color;
    this.currentRadius = startingRadius;
  }

  render(context: CanvasRenderingContext2D): void {
    const { position, currentRadius, radius, color, opacity } = this;
    const sizeWidth = context.canvas.clientWidth;
    const sizeHeight = context.canvas.clientHeight;

    context.globalAlpha = opacity;
    context.beginPath();
    context.arc((position.x / 1920) * sizeWidth, (position.y / 1080) * sizeHeight, currentRadius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
    if (currentRadius < radius) {
      this.currentRadius = Math.min(currentRadius + 2, radius);
    }
    if (currentRadius > radius) {
      this.currentRadius = Math.max(currentRadius - 2, radius);
    }
  }
  static isOfType(obj: Renderable): obj is RenderableCircle {
    return obj.type === 'circle';
  }
}
