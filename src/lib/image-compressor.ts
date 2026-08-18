export async function compressImageToWebP(
  file: File
): Promise<File> {
  const image = await loadImage(file);

  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const maxDimension = 1600;

  // Resize large images first
  if (width > maxDimension || height > maxDimension) {
    const scale = Math.min(
      maxDimension / width,
      maxDimension / height
    );

    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const webBlob = await createWebPBlob(
    image,
    width,
    height,
    0.85
  )

  return new File(
    [webBlob],
    replaceExtension(file.name, "webp"),
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to load image"));
    };

    image.src = url;
  });
}

function createWebPBlob(
  image: HTMLImageElement,
  width: number,
  height: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas is not supported"));
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(image, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("WebP conversion failed"));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

function replaceExtension(
  filename: string,
  extension: string
) {
  return filename.replace(/\.[^/.]+$/, `.${extension}`);
}