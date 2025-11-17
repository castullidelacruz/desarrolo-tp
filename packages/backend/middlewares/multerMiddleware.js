import multer from "multer";

export const multerMiddleware = () => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos de imagen
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Tipo de archivo no válido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, WebP).`,
        ),
        false,
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
    },
  });
  return upload;
};
