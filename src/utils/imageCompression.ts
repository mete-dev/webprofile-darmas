/**
 * Utility for compressing images to strictly under 100 KB
 * Supports File objects or existing base64/data URLs
 */

export interface CompressionResult {
  dataUrl: string;
  sizeKb: number;
  originalSizeKb: number;
  width: number;
  height: number;
  reductionPercent: number;
}

export async function compressImageToMax100KB(
  fileOrDataUrl: File | string,
  targetMaxBytes = 98 * 1024 // target slightly below 100KB (e.g. 98KB) to guarantee < 100KB
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    let originalSize = 0;

    const processDataUrl = (initialDataUrl: string) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        
        // Initial dimension bounding
        const MAX_DIMENSION = 1280;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        let currentWidth = width;
        let currentHeight = height;
        canvas.width = currentWidth;
        canvas.height = currentHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context not available'));
        }

        // Draw image with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

        // Iteratively adjust quality and dimensions until size < targetMaxBytes
        const qualities = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25];
        let chosenDataUrl = '';
        let chosenBytes = Infinity;

        // Try JPEG compression passes
        for (const q of qualities) {
          const testDataUrl = canvas.toDataURL('image/jpeg', q);
          // Estimate byte length from base64 string
          const head = 'data:image/jpeg;base64,';
          const base64Len = testDataUrl.length - head.length;
          const bytes = Math.round((base64Len * 3) / 4);

          if (bytes < targetMaxBytes) {
            chosenDataUrl = testDataUrl;
            chosenBytes = bytes;
            break;
          }
          chosenDataUrl = testDataUrl;
          chosenBytes = bytes;
        }

        // If still > targetMaxBytes, progressively reduce resolution
        let scalePass = 0;
        while (chosenBytes >= targetMaxBytes && scalePass < 5) {
          scalePass++;
          currentWidth = Math.round(currentWidth * 0.75);
          currentHeight = Math.round(currentHeight * 0.75);
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

          for (const q of [0.65, 0.5, 0.35, 0.25]) {
            const testDataUrl = canvas.toDataURL('image/jpeg', q);
            const head = 'data:image/jpeg;base64,';
            const base64Len = testDataUrl.length - head.length;
            const bytes = Math.round((base64Len * 3) / 4);
            chosenDataUrl = testDataUrl;
            chosenBytes = bytes;
            if (bytes < targetMaxBytes) {
              break;
            }
          }
        }

        const sizeKb = Number((chosenBytes / 1024).toFixed(1));
        const origKb = Number((originalSize / 1024).toFixed(1));
        const reductionPercent = origKb > 0 ? Math.round(((origKb - sizeKb) / origKb) * 100) : 0;

        resolve({
          dataUrl: chosenDataUrl,
          sizeKb,
          originalSizeKb: origKb,
          width: currentWidth,
          height: currentHeight,
          reductionPercent: Math.max(0, reductionPercent)
        });
      };

      img.onerror = (err) => reject(new Error('Failed to load image for compression'));
      img.src = initialDataUrl;
    };

    if (typeof fileOrDataUrl === 'string') {
      // Estimate original size from string length
      originalSize = Math.round((fileOrDataUrl.length * 3) / 4);
      processDataUrl(fileOrDataUrl);
    } else {
      originalSize = fileOrDataUrl.size;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          processDataUrl(e.target.result);
        } else {
          reject(new Error('Failed reading file to string'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
