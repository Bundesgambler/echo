import { useState, useEffect } from 'react';
import {
    getArchiveImages,
    saveToArchive,
    deleteImage,
    LibraryImage,
    ImageMetadata,
    saveImageMetadata,
    getImageMetadata,
    deleteImageMetadata
} from '../services/storageService';

export const useImageArchive = () => {
    const [archive, setArchive] = useState<LibraryImage[]>([]);

    useEffect(() => {
        loadArchive();
    }, []);

    const loadArchive = async () => {
        try {
            const images = await getArchiveImages();
            // Enrich images with their stored metadata
            const enrichedImages = images.map(img => ({
                ...img,
                metadata: getImageMetadata(img.id) || undefined
            }));
            setArchive(enrichedImages);
        } catch (err) {
            console.error("Failed to load archive", err);
        }
    };

    const persistToArchive = async (name: string, data: string, metadata?: ImageMetadata) => {
        const newArc = await saveToArchive(name, data);

        // Save metadata if provided
        if (metadata) {
            saveImageMetadata(newArc.id, metadata);
            newArc.metadata = metadata;
        }

        setArchive(prev => [newArc, ...prev]);
        return newArc;
    };

    const removeArchiveImage = async (id: string) => {
        try {
            await deleteImage(id);
            deleteImageMetadata(id); // Also remove metadata
            setArchive(prev => prev.filter(img => img.id !== id));
        } catch (err) {
            console.error("Failed to delete archive image", err);
        }
    };

    return {
        archive,
        loadArchive,
        persistToArchive,
        removeArchiveImage
    };
};
