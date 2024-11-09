import React, { useRef, useEffect, useState, CanvasHTMLAttributes } from 'react';
import { LoadingSpinner } from '@/components/spinner';
import { Renderable } from '@/components/renderables/renderable';
import { RenderableImage } from '@/components/renderables/renderable-images';
import { replacePixelsWithColor } from '@/components/renderables/draw-utils';

type CanvasProps = {
  imagesToRender: string[];
  allImages: string[];
} & CanvasHTMLAttributes<HTMLCanvasElement>;

const MaraeCanvas: React.FC<CanvasProps> = ({ imagesToRender, allImages, ...other }) => {
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
      setRenderables(Object.values(imageCache.current));
      setIsBuffering(false);
    };

    preloadImages();
  }, [allImages, imagesToRender]);

  useEffect(() => {
    setRenderables((prevRenderables) =>
      prevRenderables.map((renderable) => {
        if (renderable instanceof RenderableImage) {
          if (imagesToRender.includes(renderable.id) && !renderable.isDrawn) {
            renderable.setToDraw();
          } else if (!imagesToRender.includes(renderable.id) && renderable.isDrawn) {
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
      {isBuffering && <LoadingSpinner className="w-full h-[50px]" />}
      <canvas ref={canvasRef} width="1920" height="1080" {...other} />
    </>
  );
};

export default MaraeCanvas;
