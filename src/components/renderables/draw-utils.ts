export const replacePixelsWithColor = (image: HTMLImageElement, color: [number, number, number]): HTMLImageElement => {
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
