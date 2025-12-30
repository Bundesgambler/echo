
// Metadata stored with each archived image for regeneration
export interface ImageMetadata {
  topic: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  subline: string;
  backgroundInfo: string;
  headlineFixed: boolean;
  sublineFixed: boolean;
  includePerson: boolean;
  personDescription: string;
  important?: string;
}

export interface LibraryImage {
  id: string;
  name: string;
  url: string;
  timestamp: number;
  metadata?: ImageMetadata;
}

const METADATA_STORAGE_KEY = 'archive_metadata';

// Save metadata to localStorage
export const saveImageMetadata = (imageId: string, metadata: ImageMetadata): void => {
  const existing = getMetadataStore();
  existing[imageId] = metadata;
  localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(existing));
};

// Get metadata for a specific image
export const getImageMetadata = (imageId: string): ImageMetadata | null => {
  const store = getMetadataStore();
  return store[imageId] || null;
};

// Get all metadata
const getMetadataStore = (): Record<string, ImageMetadata> => {
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// Delete metadata when image is deleted
export const deleteImageMetadata = (imageId: string): void => {
  const existing = getMetadataStore();
  delete existing[imageId];
  localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(existing));
};

export const saveImageToLibrary = async (name: string, base64: string): Promise<LibraryImage> => {
  const response = await fetch('/api/save-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, base64 })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save image: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.image;
};

export const getLibraryImages = async (): Promise<LibraryImage[]> => {
  const response = await fetch('/api/images');
  if (!response.ok) {
    throw new Error('Failed to fetch image library');
  }
  const images = await response.json();
  return images.sort((a: LibraryImage, b: LibraryImage) => b.timestamp - a.timestamp);
};

export const deleteImage = async (id: string): Promise<void> => {
  const response = await fetch(`/api/delete-image?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete image from filesystem');
  }
};

export const saveToArchive = async (name: string, base64: string): Promise<LibraryImage> => {
  const response = await fetch('/api/save-to-archive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, base64 })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to archive image: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.image;
};

export const getArchiveImages = async (): Promise<LibraryImage[]> => {
  const response = await fetch('/api/archive');
  if (!response.ok) {
    throw new Error('Failed to fetch archive');
  }
  const images = await response.json();
  return images.sort((a: LibraryImage, b: LibraryImage) => b.timestamp - a.timestamp);
};
