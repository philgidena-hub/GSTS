// Cloudinary Upload Service
// Uses unsigned uploads via Cloudinary's REST API (no backend needed)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  bytes: number;
  format: string;
  resource_type: string;
  width?: number;
  height?: number;
}

interface UploadResult {
  url: string;
  publicId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export const cloudinaryService = {
  /**
   * Upload a file to Cloudinary using unsigned upload
   * @param file - The file to upload
   * @param folder - The folder path in Cloudinary (e.g., 'hero', 'blog', 'resources')
   * @returns Upload result with URL and metadata
   */
  async uploadFile(file: File, folder: string): Promise<UploadResult> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        'Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
      );
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `gsts/${folder}`);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Upload failed' } }));
      throw new Error(error.error?.message || `Upload failed with status ${response.status}`);
    }

    const data: CloudinaryUploadResponse = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      fileName: file.name,
      fileSize: data.bytes,
      fileType: file.type,
    };
  },

  /**
   * Upload an image to Cloudinary with automatic optimization
   * @param file - The image file to upload
   * @param folder - The folder path in Cloudinary
   * @returns Upload result with optimized URL
   */
  async uploadImage(file: File, folder: string): Promise<UploadResult> {
    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate size (5MB max for images)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }

    return this.uploadFile(file, folder);
  },

  /**
   * Upload a document to Cloudinary
   * @param file - The document file to upload
   * @param folder - The folder path in Cloudinary
   * @returns Upload result with URL and metadata
   */
  async uploadDocument(file: File, folder: string): Promise<UploadResult> {
    // Validate size (20MB max for documents)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Document must be less than 20MB');
    }

    return this.uploadFile(file, folder);
  },

  /**
   * Get an optimized image URL from Cloudinary
   * Adds automatic format and quality optimization
   */
  getOptimizedUrl(url: string, options?: { width?: number; height?: number; quality?: string }): string {
    if (!url || !url.includes('cloudinary.com')) {
      return url; // Return as-is if not a Cloudinary URL
    }

    const transforms: string[] = ['f_auto', 'q_auto'];
    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    if (options?.quality) transforms.push(`q_${options.quality}`);

    // Insert transforms into the URL
    return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
  },
};
