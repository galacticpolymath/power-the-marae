import React, { useRef, useEffect, CanvasHTMLAttributes, useState } from 'react';

type CanvasProps = {
  imagesToRender: string[];
  allImages: string[];
} & CanvasHTMLAttributes<HTMLCanvasElement>;

const MaraeCanvas: React.FC<CanvasProps> = ({ imagesToRender, allImages, ...other }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maxImageWidth, setMaxImageWidth] = useState(1920);
  const [maxImageHeight, setMaxImageHeight] = useState(1080);
  const imageCache = useRef<Record<string, HTMLImageElement>>({}); // Cache for loaded images
  const [isBuffering, setIsBuffering] = useState(true); // Buffering state

  // Preload all images once
  useEffect(() => {
    const preloadImages = async () => {
      const promises = allImages.map((imageSrc) => {
        return new Promise<void>((resolve) => {
          if (imageCache.current[imageSrc]) {
            resolve(); // Image already in cache
          } else {
            // Load new image and store in cache
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
              imageCache.current[imageSrc] = image;
              resolve();
            };
            image.onerror = () => resolve(); // Resolve even if there's an error
          }
        });
      });

      await Promise.all(promises); // Wait for all images to load
      setIsBuffering(false); // Buffering complete
    };

    preloadImages();
  }, [allImages]);

  // Render selected images once buffering is complete
  useEffect(() => {
    if (isBuffering) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      // Clear the canvas before rendering
      const scale = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      canvas.width = displayWidth * scale;
      canvas.height = displayHeight * scale;

      context.scale(scale, scale);
      context.imageSmoothingEnabled = true;
      context.clearRect(0, 0, displayWidth, displayHeight);

      // Render each selected image from cache
      imagesToRender.forEach((imageSrc) => {
        const image = imageCache.current[imageSrc];
        if (image) {
          const canvasAspectRatio = displayWidth / displayHeight;
          const imageAspectRatio = image.width / image.height;
          const newMaxWidth = Math.max(maxImageWidth, image.width);
          const newMaxHeight = Math.max(maxImageHeight, image.height);

          if (newMaxWidth !== maxImageWidth) setMaxImageWidth(newMaxWidth);
          if (newMaxHeight !== maxImageHeight) setMaxImageHeight(newMaxHeight);

          let renderWidth, renderHeight, offsetX, offsetY;

          // Calculate render size and offsets based on aspect ratio
          if (imageAspectRatio > canvasAspectRatio) {
            renderWidth = displayWidth;
            renderHeight = displayWidth / imageAspectRatio;
            offsetX = 0;
            offsetY = (displayHeight - renderHeight) / 2; // Center vertically
          } else {
            renderWidth = displayHeight * imageAspectRatio;
            renderHeight = displayHeight;
            offsetX = (displayWidth - renderWidth) / 2; // Center horizontally
            offsetY = 0;
          }

          // Draw the image with the calculated dimensions and offsets
          context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);
        }
      });
    }
  }, [imagesToRender, isBuffering, maxImageWidth, maxImageHeight]);

  return (
    <>
      {isBuffering ? <div>Loading images...</div> : null}
      <canvas ref={canvasRef} width={`${maxImageWidth}px`} height={`${maxImageHeight}px`} {...other} />
    </>
  );
};

export default MaraeCanvas;
