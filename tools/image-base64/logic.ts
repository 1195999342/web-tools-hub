export function imageToBase64(file: File): Promise<{ base64: string; dataUri: string; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      const base64 = dataUri.split(',')[1] || '';
      resolve({ base64, dataUri, size: file.size });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
