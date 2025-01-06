export async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Unable to get canvas context');

            const { width, height } = image;
            const { x, y, width: cropWidth, height: cropHeight } = pixelCrop;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(image, x, y, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            // Return the base64 image string
            const croppedImageUrl = canvas.toDataURL('image/jpeg');
            resolve(croppedImageUrl);
        };
        image.onerror = reject;
    });
}
