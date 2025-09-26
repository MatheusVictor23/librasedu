// [INÍCIO DO CÓDIGO]
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Garante que o diretório de uploads exista
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Salva os arquivos na pasta 'uploads/'
  },
  filename: (req, file, cb) => {
    // Cria um nome de arquivo único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas arquivos de vídeo
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado! Por favor, envie apenas vídeos.'), false);
  }
};

// Configuração do Multer com limites de tamanho
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limite de 50MB por arquivo
  }
});

export default upload;
// [FIM DO CÓDIGO]