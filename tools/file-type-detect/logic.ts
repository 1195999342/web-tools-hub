export interface FileTypeResult {
  hex: string;
  mimeType: string;
  extension: string;
  description: string;
}

const SIGNATURES: { bytes: number[]; mask?: number[]; mime: string; ext: string; desc: string }[] = [
  { bytes: [0xFF, 0xD8, 0xFF], mime: 'image/jpeg', ext: '.jpg', desc: 'JPEG Image' },
  { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mime: 'image/png', ext: '.png', desc: 'PNG Image' },
  { bytes: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif', ext: '.gif', desc: 'GIF Image' },
  { bytes: [0x42, 0x4D], mime: 'image/bmp', ext: '.bmp', desc: 'BMP Image' },
  { bytes: [0x52, 0x49, 0x46, 0x46], mime: 'image/webp', ext: '.webp', desc: 'WebP Image (RIFF container)' },
  { bytes: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf', ext: '.pdf', desc: 'PDF Document' },
  { bytes: [0x50, 0x4B, 0x03, 0x04], mime: 'application/zip', ext: '.zip', desc: 'ZIP Archive (or DOCX/XLSX/JAR)' },
  { bytes: [0x1F, 0x8B], mime: 'application/gzip', ext: '.gz', desc: 'GZIP Archive' },
  { bytes: [0x7F, 0x45, 0x4C, 0x46], mime: 'application/x-elf', ext: '.elf', desc: 'ELF Executable' },
  { bytes: [0x4D, 0x5A], mime: 'application/x-msdownload', ext: '.exe', desc: 'Windows Executable (PE)' },
  { bytes: [0x49, 0x44, 0x33], mime: 'audio/mpeg', ext: '.mp3', desc: 'MP3 Audio (ID3)' },
  { bytes: [0x66, 0x74, 0x79, 0x70], mime: 'video/mp4', ext: '.mp4', desc: 'MP4 Video' },
  { bytes: [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70], mime: 'video/mp4', ext: '.mp4', desc: 'MP4 Video' },
  { bytes: [0x1A, 0x45, 0xDF, 0xA3], mime: 'video/webm', ext: '.webm', desc: 'WebM/MKV Video' },
  { bytes: [0x4F, 0x67, 0x67, 0x53], mime: 'audio/ogg', ext: '.ogg', desc: 'OGG Audio' },
  { bytes: [0x66, 0x4C, 0x61, 0x43], mime: 'audio/flac', ext: '.flac', desc: 'FLAC Audio' },
  { bytes: [0x49, 0x49, 0x2A, 0x00], mime: 'image/tiff', ext: '.tiff', desc: 'TIFF Image (LE)' },
  { bytes: [0x4D, 0x4D, 0x00, 0x2A], mime: 'image/tiff', ext: '.tiff', desc: 'TIFF Image (BE)' },
  { bytes: [0x00, 0x00, 0x01, 0x00], mime: 'image/x-icon', ext: '.ico', desc: 'ICO Icon' },
  { bytes: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], mime: 'application/x-7z-compressed', ext: '.7z', desc: '7-Zip Archive' },
  { bytes: [0x52, 0x61, 0x72, 0x21], mime: 'application/x-rar-compressed', ext: '.rar', desc: 'RAR Archive' },
];

export function detectFileType(bytes: Uint8Array): FileTypeResult {
  const hex = Array.from(bytes.slice(0, 16)).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  for (const sig of SIGNATURES) {
    if (sig.bytes.length <= bytes.length) {
      let match = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        if (bytes[i] !== sig.bytes[i]) { match = false; break; }
      }
      if (match) return { hex, mimeType: sig.mime, extension: sig.ext, description: sig.desc };
    }
  }

  // Check for text-based formats
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 100));
  if (text.trimStart().startsWith('<?xml') || text.trimStart().startsWith('<')) return { hex, mimeType: 'text/xml', extension: '.xml', description: 'XML Document' };
  if (text.trimStart().startsWith('{') || text.trimStart().startsWith('[')) return { hex, mimeType: 'application/json', extension: '.json', description: 'JSON Data' };

  return { hex, mimeType: 'application/octet-stream', extension: '', description: 'Unknown file type' };
}
