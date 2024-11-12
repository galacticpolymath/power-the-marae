import React, { useRef, useEffect, useState, CanvasHTMLAttributes, MouseEvent } from 'react';
import { LoadingSpinner } from '@/components/spinner';
import { Renderable } from '@/components/renderables/renderable';
import { RenderableImage } from '@/components/renderables/renderable-images';
import { replacePixelsWithColor } from '@/components/renderables/draw-utils';
import { EnergyCircle } from '@/app/models/energy-circle';
import { RenderableCircle } from '@/components/renderables/renderable-circle';

type CanvasProps = {
  imagesToRender: string[];
  allImages: string[];
  circles: (EnergyCircle & { color: string })[];
} & CanvasHTMLAttributes<HTMLCanvasElement>;

const MaraeCanvas: React.FC<CanvasProps> = ({ imagesToRender, circles, allImages, ...other }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderables, setRenderables] = useState<Renderable[]>([]);
  const [isBuffering, setIsBuffering] = useState(true);
  const imageCache = useRef<Record<string, RenderableImage>>({});

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
      if (renderables.length === 0) {
        setRenderables(Object.values(imageCache.current));
      }
      setIsBuffering(false);
    };

    preloadImages();
  }, [allImages, imagesToRender, renderables]);

  function getCursorPosition(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const circleConfig = {
      center: {
        x: Math.floor(x * (1920 / canvas.clientWidth)),
        y: Math.floor(y * (1080 / canvas.clientHeight)),
      },
      radius: 10,
    };
    console.log(`"circle": ${JSON.stringify(circleConfig)},`);
  }

  useEffect(() => {
    setRenderables((prevRenderables) => [
      ...prevRenderables
        .map((renderable) => {
          if (renderable instanceof RenderableImage) {
            if (imagesToRender.includes(renderable.id) && !renderable.isDrawn) {
              renderable.setToDraw();
            } else if (!imagesToRender.includes(renderable.id) && renderable.isDrawn) {
              renderable.setToNotDraw();
            }
          }
          if (renderable instanceof RenderableCircle) {
            const currentCircles = circles.map((c) => new RenderableCircle(c));
            if (!currentCircles.some((c) => c.id === renderable.id)) {
              return null;
            }
          }
          return renderable;
        })
        .filter((x) => x !== null),
      ...circles.map((c) => new RenderableCircle(c)).filter((x) => prevRenderables.every((y) => y.id !== x.id)),
    ]);
  }, [imagesToRender, circles]);

  // Animation loop for rendering
  useEffect(() => {
    if (isBuffering) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    let animationFrameId: number;
    let lastRenderTime = 0;
    const targetFPS = 60;
    const frameDuration = 1000 / targetFPS;

    const render = (timestamp: number) => {
      if (!lastRenderTime) lastRenderTime = timestamp;
      const deltaTime = timestamp - lastRenderTime;

      if (deltaTime >= frameDuration) {
        lastRenderTime = timestamp;

        if (canvas && context) {
          // Reset transform before scaling
          context.setTransform(1, 0, 0, 1, 0, 0);

          // Scaling for high DPI displays
          const scale = window.devicePixelRatio || 1;
          const displayWidth = canvas.clientWidth;
          const displayHeight = canvas.clientHeight;
          canvas.width = displayWidth * scale;
          canvas.height = displayHeight * scale;
          context.scale(scale, scale);

          // Clear the canvas
          context.clearRect(0, 0, displayWidth, displayHeight);

          // Render each object
          renderables.forEach((renderable) => {
            renderable.render(context);
          });
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, [renderables, isBuffering]);

  return (
    <>
      {isBuffering && (
        <div className="w-full h-[75vh] flex justify-center items-center">
          <LoadingSpinner className="w-[50px] h-[50px]" />
        </div>
      )}
      <canvas onClick={getCursorPosition} ref={canvasRef} width="1920" height="1080" {...other} />
    </>
  );
};

export default MaraeCanvas;
