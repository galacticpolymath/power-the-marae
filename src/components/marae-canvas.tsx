import React, { useRef, useEffect, CanvasHTMLAttributes, useState } from 'react';
import { LoadingSpinner } from '@/components/spinner';

abstract class Renderable {
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

class RenderableImage extends Renderable {
  image: HTMLImageElement;
  highlightImage: HTMLImageElement;
  isInitial: boolean;

  constructor(id: string, image: HTMLImageElement, highlightImage: HTMLImageElement, isInitial = false) {
    super(id);
    this.image = image;
    this.highlightImage = highlightImage;
    this.isInitial = isInitial;
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.isDrawn) return; // Skip rendering if not marked to be drawn

    const { image, highlightImage, opacity, isInitial } = this;
    const canvasWidth = context.canvas.clientWidth;
    const canvasHeight = context.canvas.clientHeight;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    const imageAspectRatio = image.width / image.height;

    let renderWidth, renderHeight, offsetX, offsetY;

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

    // Draw the base image at full opacity
    context.globalAlpha = 1;
    context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);

    // Only draw the highlight overlay if not an initial image
    if (!isInitial && opacity > 0) {
      context.globalAlpha = opacity;
      context.drawImage(highlightImage, offsetX, offsetY, renderWidth, renderHeight);
      this.opacity = Math.max(this.opacity - 0.02, 0); // Reduce opacity for fade-out
    }
  }

  // Set the image to be drawn, reset opacity for highlight if not an initial image
  setToDraw() {
    this.isDrawn = true;
    if (!this.isInitial) {
      this.opacity = 1; // Reset opacity for highlight overlay
    }
  }

  // Set the image to not be drawn
  setToNotDraw() {
    this.isDrawn = false;
  }
}

class RenderableCircle extends Renderable {
  position: { x: number; y: number };
  radius: number;
  color: string;

  constructor(id: string, position: { x: number; y: number }, radius: number, color: string, opacity = 1) {
    super(id, true, opacity);
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  render(context: CanvasRenderingContext2D) {
    const { position, radius, color, opacity } = this;

    context.globalAlpha = opacity;
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();
    context.globalAlpha = 1;
  }
}

type CanvasProps = {
  imagesToRender: string[];
  allImages: string[];
} & CanvasHTMLAttributes<HTMLCanvasElement>;

// Utility to replace non-transparent pixels with a color
const replacePixelsWithColor = (image: HTMLImageElement, color: number[]): HTMLImageElement => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return image;

  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      // Non-transparent pixels
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    }
  }

  context.putImageData(imageData, 0, 0);
  const coloredImage = new Image();
  coloredImage.src = canvas.toDataURL();
  return coloredImage;
};

const MaraeCanvas: React.FC<CanvasProps> = ({ imagesToRender, allImages, ...other }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderables, setRenderables] = useState<Renderable[]>([]);
  const [isBuffering, setIsBuffering] = useState(true);
  const imageCache = useRef<Record<string, RenderableImage>>({});

  // Preload all images once and initialize RenderableImage objects
  useEffect(() => {
    const preloadImages = async () => {
      const promises = allImages.map(
        (src) =>
          new Promise<void>((resolve) => {
            if (imageCache.current[src]) {
              resolve();
            } else {
              const image = new Image();
              image.src = src;
              image.onload = () => {
                const highlightImage = replacePixelsWithColor(image, [0, 0, 255]);
                // Mark images in the initial imagesToRender as isInitial
                const isInitial = imagesToRender.includes(src);
                const renderableImage = new RenderableImage(src, image, highlightImage, isInitial);
                renderableImage.isDrawn = isInitial;
                imageCache.current[src] = renderableImage;
                resolve();
              };
              image.onerror = () => resolve();
            }
          }),
      );
      await Promise.all(promises);

      // Initialize renderables list with all cached images
      setRenderables(Object.values(imageCache.current));
      setIsBuffering(false);
    };

    preloadImages();
  }, [allImages, imagesToRender]);

  // Update `isDrawn` state based on `imagesToRender`
  useEffect(() => {
    setRenderables((prevRenderables) =>
      prevRenderables.map((renderable) => {
        if (renderable instanceof RenderableImage) {
          // Set `isDrawn` and reset opacity only for newly added images
          if (imagesToRender.includes(renderable.id) && !renderable.isDrawn) {
            renderable.setToDraw();
          } else if (!imagesToRender.includes(renderable.id)) {
            renderable.setToNotDraw();
          }
        }
        return renderable;
      }),
    );
  }, [imagesToRender]);

  // Animation loop for rendering
  useEffect(() => {
    if (isBuffering) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    let animationFrameId: number;

    const render = () => {
      if (canvas && context) {
        // Clear the canvas
        const scale = window.devicePixelRatio || 1;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        canvas.width = displayWidth * scale;
        canvas.height = displayHeight * scale;
        context.scale(scale, scale);
        context.clearRect(0, 0, displayWidth, displayHeight);

        // Render each object
        renderables.forEach((renderable) => {
          renderable.render(context);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [renderables, isBuffering]);

  return (
    <>
      {isBuffering ? <LoadingSpinner className="w-full h-[50px]" /> : null}
      <canvas ref={canvasRef} width="1920" height="1080" {...other} />
    </>
  );
};

export default MaraeCanvas;
