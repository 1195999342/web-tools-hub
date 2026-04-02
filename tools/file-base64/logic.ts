export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function fileToBase64(file: File): Promise<ToolResult<{ base64: string; dataUri: string }>> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      const base64 = dataUri.split(',')[1] || '';
      resolve({ output: { base64, dataUri } });
    };
    reader.onerror = () => resolve({ error: 'Failed to read file' });
    reader.readAsDataURL(file);
  });
}

export function base64ToBlob(base64: string, mimeType: string = 'application/octet-stream'): ToolResult<Blob> {
  try {
    const cleaned = base64.replace(/\s/g, '');
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { output: new Blob([bytes], { type: mimeType }) };
  } catch {
    return { error: 'Invalid Base64 string' };
  }
}
