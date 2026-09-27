/** Max longest edge after resize (keeps localStorage usable). */
const MAX_EDGE = 1200;
const JPEG_QUALITY = 0.72;
/** Soft cap on data-URL length. */
export const MAX_PHOTO_DATA_URL_LENGTH = 1.6e6;

/**
 * Read an image File, resize, and return a JPEG data URL.
 * Rejects non-images or compressions that are still too large.
 */
export function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file (JPEG, PNG, etc.).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image file.'));
    reader.onload = () => {
      const dataUrlSource = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        try {
          const { width, height } = img;
          if (!width || !height) {
            reject(new Error('Could not process this image.'));
            return;
          }
          const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
          const w = Math.max(1, Math.round(width * scale));
          const h = Math.max(1, Math.round(height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not process this image.'));
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
          if (dataUrl.length > MAX_PHOTO_DATA_URL_LENGTH) {
            reject(
              new Error(
                'Photo is still too large after compression. Try a smaller image.',
              ),
            );
            return;
          }
          resolve(dataUrl);
        } catch {
          reject(new Error('Could not process this image.'));
        }
      };
      img.onerror = () => reject(new Error('Could not read that image file.'));
      img.src = dataUrlSource;
    };
    reader.readAsDataURL(file);
  });
}
