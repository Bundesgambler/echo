import { useState } from 'react';
import { triggerWorkflow } from '../services/n8nService';
import { LoadingStatus, N8nPayload } from '../types';
import { ImageMetadata } from '../services/storageService';
import { compressImage, blobToBase64, constructPrompt, formatHeadline } from '../services/imageService';

interface GenerationContext {
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
    important: string;
    customImageBase64: string | null;
    generationCount: number;
    webhookUrl: string;
    persistToArchive: (name: string, data: string, metadata?: ImageMetadata) => Promise<any>;
}

export const useImageGeneration = (
    persistToArchive: (name: string, data: string, metadata?: ImageMetadata) => Promise<any>
) => {
    const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
    const [statusDetail, setStatusDetail] = useState<string | null>(null);
    const [resultImages, setResultImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const generateImage = async (ctx: GenerationContext) => {
        const hasHeadline = ctx.headlineLine1.trim() !== '' || ctx.headlineLine2.trim() !== '' || ctx.headlineLine3.trim() !== '';
        const hasRequiredInputs = ctx.topic.trim() !== '' || (ctx.subline.trim() !== '' && hasHeadline);

        if (!hasRequiredInputs || status !== LoadingStatus.IDLE) return;

        setError(null);
        setStatusDetail(null);
        setResultImages([]);

        try {
            setStatus(LoadingStatus.PROCESSING_IMAGE);

            let compressedPayloadImage: string | undefined = undefined;
            if (ctx.customImageBase64) {
                compressedPayloadImage = await compressImage(ctx.customImageBase64);
            }

            const payload: N8nPayload = {
                chatInput: constructPrompt(ctx),
                headline: formatHeadline(ctx.headlineLine1, ctx.headlineLine2, ctx.headlineLine3),
                subline: ctx.subline,
                backgroundInfo: ctx.backgroundInfo,
                headlineFixed: ctx.headlineFixed,
                sublineFixed: ctx.sublineFixed,
                important: ctx.important,
                customImage: compressedPayloadImage
            };

            setStatus(LoadingStatus.COMMUNICATING_WEBHOOK);

            // Simulation of progress details
            const statusSteps = [
                "Synthesizing Prompt...",
                "Establishing Secure Uplink...",
                "Rendering Engine Active...",
                "Finalizing Asset Pixels..."
            ];

            let stepIdx = 0;
            setStatusDetail(statusSteps[0]);
            const statusInterval = setInterval(() => {
                if (stepIdx < statusSteps.length - 1) {
                    stepIdx++;
                    setStatusDetail(statusSteps[stepIdx]);
                }
            }, 2500);

            try {
                const requests = Array.from({ length: ctx.generationCount }, () => triggerWorkflow(payload, ctx.webhookUrl));
                const sourceUrls = await Promise.all(requests);

                setResultImages(sourceUrls);
                setStatus(LoadingStatus.SUCCESS);
                setStatusDetail(null);

                // Archive results
                const timestamp = Date.now();
                const baseName = (ctx.topic.replace(/[^a-z0-9]/gi, '_') || 'asset').substring(0, 60);

                const metadata: ImageMetadata = {
                    topic: ctx.topic,
                    headlineLine1: ctx.headlineLine1,
                    headlineLine2: ctx.headlineLine2,
                    headlineLine3: ctx.headlineLine3,
                    subline: ctx.subline,
                    backgroundInfo: ctx.backgroundInfo,
                    headlineFixed: ctx.headlineFixed,
                    sublineFixed: ctx.sublineFixed,
                    includePerson: ctx.includePerson,
                    personDescription: ctx.personDescription,
                    important: ctx.important
                };

                const archivePromises = sourceUrls.map(async (url, idx) => {
                    const dataToSave = url.startsWith('data:image') ? url : await blobToBase64(url);
                    const filename = `${baseName}_v${idx + 1}_${timestamp}.png`;
                    return ctx.persistToArchive(filename, dataToSave, metadata);
                });

                await Promise.all(archivePromises);
                setStatus(LoadingStatus.IDLE);
            } catch (err: any) {
                console.error("Generation/Archive error:", err);
                setError(err.message || 'Workflow failed.');
                setStatus(LoadingStatus.ERROR);
            } finally {
                clearInterval(statusInterval);
            }
        } catch (err: any) {
            console.error("Pre-generation error:", err);
            setError(err.message || 'Failed to prepare generation.');
            setStatus(LoadingStatus.ERROR);
        }
    };

    const reset = () => {
        setStatus(LoadingStatus.IDLE);
        setStatusDetail(null);
        setResultImages([]);
        setError(null);
    };

    return {
        status,
        statusDetail,
        resultImages,
        error,
        generateImage,
        reset,
        setResultImages,
        setStatus,
        setError
    };
};
