import React from 'react';
import { Layers, Monitor, Download, RefreshCw, Trash2, CheckSquare, Square, Maximize2 } from 'lucide-react';
import { LibraryImage, ImageMetadata } from '../services/storageService';

interface ArchiveGalleryProps {
    archive: LibraryImage[];
    onRemove: (id: string) => void;
    onPreview: (url: string) => void;
    onRegenerate: (metadata: ImageMetadata | undefined) => void;
}

const ArchiveGallery: React.FC<ArchiveGalleryProps> = ({ archive, onRemove, onPreview, onRegenerate }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedImages, setSelectedImages] = React.useState<Set<string>>(new Set());

    const filteredArchive = archive.filter(item =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelection = (id: string) => {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedImages.size === filteredArchive.length) {
            setSelectedImages(new Set());
        } else {
            setSelectedImages(new Set(filteredArchive.map(img => img.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedImages.size === 0) return;

        console.log('[BULK DELETE] Starting bulk delete of', selectedImages.size, 'images');
        const deletePromises = Array.from(selectedImages).map(async (id) => {
            try {
                console.log('[BULK DELETE] Deleting:', id);
                await onRemove(id);
                console.log('[BULK DELETE] Deleted:', id);
            } catch (err) {
                console.error('[BULK DELETE] Failed to delete:', id, err);
            }
        });

        await Promise.all(deletePromises);
        console.log('[BULK DELETE] All deletes completed');
        setSelectedImages(new Set());
    };

    return (
        <section className="lg:col-span-12 mt-8 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-[var(--bg-panel)] backdrop-blur-xl rounded-[3rem] border border-[var(--border)] p-10 overflow-hidden relative group/archive transition-colors duration-500">
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 border-b border-[var(--border)] pb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-600/10 p-3 rounded-2xl border border-red-600/20">
                            <Layers className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-news text-[var(--text-main)] italic tracking-tighter uppercase">Produktionsarchiv</h2>
                            <p className="text-[10px] text-[var(--text-dim)] font-black uppercase tracking-widest mt-0.5">Dauerhafter Bildspeicher</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Archiv durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl py-2 pl-4 pr-10 text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all shadow-inner"
                            />
                        </div>
                        <div className="px-4 py-2 bg-[var(--bg-deep)] rounded-full border border-[var(--border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)] whitespace-nowrap">
                            {filteredArchive.length} Bilder gespeichert
                        </div>
                        {filteredArchive.length > 0 && (
                            <>
                                <button
                                    onClick={toggleSelectAll}
                                    className="px-4 py-2 bg-[var(--bg-deep)] rounded-xl border border-[var(--border)] text-[9px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-white/5 transition-all flex items-center gap-2"
                                >
                                    {selectedImages.size === filteredArchive.length ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                                    {selectedImages.size > 0 ? `${selectedImages.size} Selected` : 'Select All'}
                                </button>
                                {selectedImages.size > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-4 py-2 bg-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-red-700 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete {selectedImages.size}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {filteredArchive.length === 0 ? (
                    <div className="py-20 text-center">
                        <Monitor className="w-12 h-12 text-[var(--text-dim)] mx-auto mb-6 opacity-20" />
                        <p className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest">
                            {searchQuery ? "Keine passenden Bilder gefunden" : "Noch keine Bilder archiviert"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {filteredArchive.map((item, idx) => {
                            const isSelected = selectedImages.has(item.id);
                            return (
                                <div
                                    key={item.id}
                                    className={`group relative aspect-square rounded-[2rem] overflow-hidden border ${isSelected ? 'border-red-600 ring-2 ring-red-600/50' : 'border-[var(--border)]'} bg-[var(--bg-deep)] hover:border-red-600/30 transition-all duration-500 shadow-xl cursor-zoom-in animate-in fade-in zoom-in-95`}
                                    style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'backwards' }}
                                    onClick={() => onPreview(item.url)}
                                >
                                    <div
                                        className="absolute top-3 left-3 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(item.id);
                                        }}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border-2 ${isSelected ? 'bg-red-600 border-red-600' : 'bg-black/40 border-white/30'} backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-all`}>
                                            {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                    <img
                                        src={item.url}
                                        alt="Archived asset"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />

                                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onPreview(item.url); }}
                                            className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
                                            title="Vorschau"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={item.url}
                                            download={`archive_${item.id}`}
                                            className="flex-1 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRegenerate(item.metadata); }}
                                            className="w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
                                            title="Variante neu generieren"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                                            className="w-10 h-10 bg-black/40 backdrop-blur-md text-red-500 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-white/5"
                                            title="Endgültig löschen"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ArchiveGallery;
