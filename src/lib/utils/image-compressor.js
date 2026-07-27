import imageCompression from 'browser-image-compression';

/**
 * Comprime una imagen en el lado del cliente antes de subirla a Supabase Storage
 * @param {File} imageFile - El archivo de imagen original
 * @returns {Promise<File>} - El archivo comprimido
 */
export async function compressImage(imageFile) {
  const options = {
    maxSizeMB: 1, // Tamaño máximo 1MB
    maxWidthOrHeight: 1920, // Resolución máxima HD
    useWebWorker: true,
    fileType: 'image/webp' // Convertir a webp para mejor compresión
  }
  
  try {
    const compressedFile = await imageCompression(imageFile, options);
    return compressedFile;
  } catch (error) {
    console.error('Error comprimiendo la imagen:', error);
    // Si falla la compresión por alguna razón, devolvemos el original
    return imageFile; 
  }
}
