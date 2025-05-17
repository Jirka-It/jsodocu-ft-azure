export const getExtensionOfFile = (mimeType: string) => {
  // Mapeo de tipos MIME a extensiones comunes
  const mimeToExt: any = {
    // Images
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    // Files
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    // Audio/Video
    'audio/mpeg': 'mp3',
    'video/mp4': 'mp4',
    // Another
    'application/json': 'json',
    'application/octet-stream': 'bin', // Bynary
  };

  return mimeToExt[mimeType] || 'bin';
};
