import React, { useState, useEffect } from 'react';
import './app-main.css';

// Components
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import LibraryGallery from './components/LibraryGallery';
import OutputDisplay from './components/OutputDisplay';
import ArchiveGallery from './components/ArchiveGallery';
import PreviewModal from './components/PreviewModal';
import PasswordGate from './components/PasswordGate';
import SettingsModal from './components/SettingsModal';

// Hooks
import { useImageLibrary } from './hooks/useImageLibrary';
import { useImageArchive } from './hooks/useImageArchive';
import { useImageGeneration } from './hooks/useImageGeneration';
import { useTheme } from './hooks/useTheme';
import { LoadingStatus, OverlaySetting } from './types';
import { constructPrompt } from './services/imageService';
import { ImageMetadata } from './services/storageService';
import { Layers } from 'lucide-react';

const WEBHOOK_URLS = [
  'https://n8n.mariohau.de/webhook/5001781d-c9be-4ef7-8635-4d241a6e8a9a',
  'https://n8n.mariohau.de/webhook/PLACEHOLDER_2',
  'https://n8n.mariohau.de/webhook/PLACEHOLDER_3',
  'https://n8n.mariohau.de/webhook/PLACEHOLDER_4',
  'https://n8n.mariohau.de/webhook/PLACEHOLDER_5',
];

const DEFAULT_SETTINGS: OverlaySetting[] = [
  { name: 'AfD', url: WEBHOOK_URLS[0] },
  { name: 'OV 2', url: WEBHOOK_URLS[1] },
  { name: 'OV 3', url: WEBHOOK_URLS[2] },
  { name: 'OV 4', url: WEBHOOK_URLS[3] },
  { name: 'OV 5', url: WEBHOOK_URLS[4] },
];

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Input State
  const [topic, setTopic] = useState('');
  const [headlineLine1, setHeadlineLine1] = useState('');
  const [headlineLine2, setHeadlineLine2] = useState('');
  const [headlineLine3, setHeadlineLine3] = useState('');
  const [subline, setSubline] = useState('');
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [headlineFixed, setHeadlineFixed] = useState(false);
  const [sublineFixed, setSublineFixed] = useState(false);
  const [includePerson, setIncludePerson] = useState(false);
  const [personDescription, setPersonDescription] = useState('');
  const [importantInfo, setImportantInfo] = useState('');
  const [generationCount, setGenerationCount] = useState<number>(1);
  const [overlaySettings, setOverlaySettings] = useState<OverlaySetting[]>(() => {
    const saved = localStorage.getItem('echo_overlay_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [selectedWebhookUrl, setSelectedWebhookUrl] = useState(overlaySettings[0].url);
  const [showSettings, setShowSettings] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('echo_overlay_settings', JSON.stringify(overlaySettings));
  }, [overlaySettings]);

  // No longer needed

  const {
    archive,
    loadArchive,
    persistToArchive,
    removeArchiveImage
  } = useImageArchive();

  // Core Hooks
  // Core Hooks
  const {
    library,
    selectedImageId,
    customImageBase64,
    selectImage,
    handleImageUpload,
    removeLibraryImage,
    persistToLibrary,
    loadLibrary
  } = useImageLibrary(() => { }, () => { });

  // Archive persister - now correctly routes to archive with metadata
  const handlePersistToArchive = async (name: string, data: string, metadata?: any) => {
    try {
      console.log('[ARCHIVE PERSIST] Saving image to archive:', name);
      const newImg = await persistToArchive(name, data, metadata);

      console.log('[PERSIST] Image saved to archive successfully');
      return newImg;
    } catch (err: any) {
      console.error('[PERSIST ERROR] Failed to save:', err);
      throw new Error(`Failed to save image: ${err.message}`);
    }
  };

  const {
    status,
    statusDetail,
    resultImages,
    error,
    generateImage: triggerGeneration,
    reset,
    setResultImages,
    setStatus,
    setError
  } = useImageGeneration(handlePersistToArchive);

  const currentPayload = JSON.stringify({
    topic, important: importantInfo, headlineLine1, headlineLine2, headlineLine3, subline, backgroundInfo, headlineFixed, sublineFixed,
    customImage: customImageBase64 ? 'BASE64_DATA_BUFFERED' : undefined
  }, null, 2);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerGeneration({
      topic,
      headlineLine1,
      headlineLine2,
      headlineLine3,
      subline,
      backgroundInfo,
      headlineFixed,
      sublineFixed,
      includePerson,
      personDescription,
      important: importantInfo,
      generationCount,
      customImageBase64,
      webhookUrl: selectedWebhookUrl,
      persistToArchive: handlePersistToArchive
    });
  };

  // Update: I'll handle the download here to keep the component simple
  const handleDownload = (imgUrl: string) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `studio_render_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Regenerate using the original prompt stored with the image
  const handleRegenerate = async (metadata: ImageMetadata | undefined) => {
    if (status !== LoadingStatus.IDLE || !metadata) return;

    await triggerGeneration({
      topic: metadata.topic,
      headlineLine1: metadata.headlineLine1,
      headlineLine2: metadata.headlineLine2,
      headlineLine3: metadata.headlineLine3,
      subline: metadata.subline,
      backgroundInfo: metadata.backgroundInfo,
      headlineFixed: metadata.headlineFixed,
      sublineFixed: metadata.sublineFixed,
      includePerson: metadata.includePerson,
      personDescription: metadata.personDescription,
      important: metadata.important || '',
      generationCount: 1, // Always single for regeneration
      customImageBase64: null, // No image - flow generates a fresh one
      webhookUrl: selectedWebhookUrl,
      persistToArchive: handlePersistToArchive
    });
  };

  return (
    <PasswordGate>
      <div className="min-h-screen flex flex-col bg-[var(--bg-deep)] text-[var(--text-main)] selection:bg-red-600/30 transition-colors duration-500">
        <Header theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => setShowSettings(true)} />

        <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <InputPanel
            topic={topic} setTopic={setTopic}
            headlineLine1={headlineLine1} setHeadlineLine1={setHeadlineLine1}
            headlineLine2={headlineLine2} setHeadlineLine2={setHeadlineLine2}
            headlineLine3={headlineLine3} setHeadlineLine3={setHeadlineLine3}
            subline={subline} setSubline={setSubline}
            backgroundInfo={backgroundInfo} setBackgroundInfo={setBackgroundInfo}
            headlineFixed={headlineFixed} setHeadlineFixed={setHeadlineFixed}
            sublineFixed={sublineFixed} setSublineFixed={setSublineFixed}
            includePerson={includePerson} setIncludePerson={setIncludePerson}
            personDescription={personDescription} setPersonDescription={setPersonDescription}
            importantInfo={importantInfo} setImportantInfo={setImportantInfo}
            generationCount={generationCount}
            setGenerationCount={setGenerationCount}
            status={status}
            onGenerate={handleGenerate}
            showJson={showJson} setShowJson={setShowJson}
            currentPayload={currentPayload}
            selectedWebhookUrl={selectedWebhookUrl}
            setSelectedWebhookUrl={setSelectedWebhookUrl}
            overlaySettings={overlaySettings}
          >
            <LibraryGallery
              library={library}
              selectedImageId={selectedImageId}
              status={status}
              onSelect={selectImage}
              onRemove={removeLibraryImage}
              onUpload={handleImageUpload}
              onPreview={setPreviewImage}
            />
          </InputPanel>

          <OutputDisplay
            status={status}
            statusDetail={statusDetail}
            resultImages={resultImages}
            error={error}
            onDownload={handleDownload}
            onPreview={setPreviewImage}
            onReset={reset}
          />

          <ArchiveGallery
            archive={archive}
            onRemove={removeArchiveImage}
            onPreview={setPreviewImage}
            onRegenerate={handleRegenerate}
          />
        </main>

        {previewImage && (
          <PreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={overlaySettings}
          onSave={(newSettings) => {
            setOverlaySettings(newSettings);
            // If the currently selected webhook URL was one of the settings, update it
            // OR simply update based on the current index if we track by index (better).
            // For now, let's keep it simple: if the current selected URL is no longer in settings,
            // or has changed, we might need a more robust way to track selection.
            // Let's assume selection is index-based in a real app, but here it's URL-based.
          }}
        />

        <footer className="mt-auto px-10 py-8 border-t border-white/5 bg-[#0a1122]/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5 opacity-40">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Visual Studio Version 5.1</span>
            </div>
            <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] flex items-center gap-4">
              <span>© {new Date().getFullYear()} Visual Studio Netzwerk</span>
              <span className="text-red-900/40 italic">VERBINDUNG_GESICHERT</span>
            </div>
          </div>
        </footer>
      </div>
    </PasswordGate>
  );
};

export default App;

