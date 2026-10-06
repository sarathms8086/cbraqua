const DEFAULT_MAX_DIMENSION = 2400;
const DEFAULT_QUALITY = 0.97;
const OUTPUT_TYPE = "image/jpeg";

export function shouldCompressImage(file: File) {
  return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
}

export function getContainDimensions(width: number, height: number, maxDimension = DEFAULT_MAX_DIMENSION) {
  const largestSide = Math.max(width, height);
  if (largestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image: ${file.name}`));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress image."));
      },
      type,
      quality,
    );
  });
}

// Client-side canvas re-encoding is intentionally skipped.
// The server uses Sharp (mozjpeg, progressive, 4:4:4) which produces far better
// output than canvas JPEG. Double-encoding an existing JPEG degrades clarity.
export async function compressImageForWebsite(
  file: File,
  _options: { maxDimension?: number; quality?: number } = {},
) {
  return file;
}

export async function compressImagesForWebsite(files: File[]) {
  return Promise.all(files.map((file) => compressImageForWebsite(file)));
}
