import { useState, useEffect } from 'react';
import { getLibraryImages, saveImageToLibrary, deleteImage, LibraryImage } from '../services/storageService';
import { LoadingStatus } from '../types';

export const useImageLibrary = (setError: (err: string | null) => void, setStatus: (status: LoadingStatus) => void) => {
    const [library, setLibrary] = useState<LibraryImage[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);

    useEffect(() => {
        loadLibrary();
    }, []);

    const loadLibrary = async () => {
        try {
            const images = await getLibraryImages();
            setLibrary(images);
        } catch (err) {
            console.error("Failed to load image library", err);
        }
    };

    const selectImage = (img: LibraryImage | null) => {
        if (img && selectedImageId !== img.id) {
            setCustomImageBase64(img.url);
            setSelectedImageId(img.id);
        } else {
            setCustomImageBase64(null);
            setSelectedImageId(null);
        }
    };

    const handleImageUpload = async (file: File) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const rawBase64 = reader.result as string;
            try {
                setStatus(LoadingStatus.PROCESSING_IMAGE);
                const newImg = await saveImageToLibrary(file.name, rawBase64);
                setLibrary(prev => [newImg, ...prev]);
                selectImage(newImg);
                setStatus(LoadingStatus.IDLE);
            } catch (err: any) {
                setError(err.message || "Failed to save image to filesystem.");
                setStatus(LoadingStatus.ERROR);
            }
        };
        reader.readAsDataURL(file);
    };

    const removeLibraryImage = async (id: string) => {
        try {
            console.log('[LIBRARY DELETE] Deleting image:', id);
            await deleteImage(id);
            console.log('[LIBRARY DELETE] Image deleted from filesystem:', id);
            setLibrary(prev => prev.filter(img => img.id !== id));
            console.log('[LIBRARY DELETE] Library state updated');
            if (selectedImageId === id) {
                selectImage(null);
            }
        } catch (err) {
            console.error("[LIBRARY DELETE ERROR] Failed to delete image", id, err);
            throw err; // Re-throw so bulk delete can catch it
        }
    };

    const persistToLibrary = async (name: string, data: string): Promise<LibraryImage> => {
        const newImg = await saveImageToLibrary(name, data);
        setLibrary(prev => [newImg, ...prev]);
        return newImg;
    };

    return {
        library,
        selectedImageId,
        customImageBase64,
        selectImage,
        handleImageUpload,
        removeLibraryImage,
        persistToLibrary,
        loadLibrary
    };
};
