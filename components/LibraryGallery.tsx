import React, { useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { LibraryImage } from '../services/storageService';
import { LoadingStatus } from '../types';

interface LibraryGalleryProps {
    library: LibraryImage[];
    selectedImageId: string | null;
    status: LoadingStatus;
    onSelect: (img: LibraryImage | null) => void;
    onRemove: (id: string) => void;
    onUpload: (file: File) => void;
    onPreview: (url: string) => void;
}

const LibraryGallery: React.FC<LibraryGalleryProps> = ({
    library,
    selectedImageId,
    status,
    onSelect,
    onRemove,
    onUpload,
    onPreview
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredLibrary = library.filter(img =>
        (img.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Medienbibliothek</label>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors text-[9px] font-black uppercase"
                    disabled={status !== LoadingStatus.IDLE}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Hinzufügen
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Medien filtern..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl py-2 px-3 text-[9px] font-bold uppercase tracking-widest text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all shadow-inner mb-2"
                />
            </div>

            <div className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-2.5 h-44 overflow-y-auto scrollbar-custom shadow-inner transition-colors duration-500">
                {filteredLibrary.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-[var(--text-dim)] text-[10px] font-bold uppercase text-center opacity-40">
                        <ImageIcon className="w-6 h-6 mb-2" />
                        {searchQuery ? "Keine Treffer" : "Keine Medien vorhanden"}
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-2.5">
                        {filteredLibrary.map((img) => (
                            <div
                                key={img.id}
                                onClick={() => onPreview(img.url)}
                                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${selectedImageId === img.id ? 'border-red-600 scale-[0.98]' : 'border-transparent hover:border-white/10'}`}
                            >
                                <img
                                    src={img.url}
                                    alt={img.name}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                                >
                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white transform scale-0 group-hover:scale-100">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div
                                    className="absolute top-1 left-1 z-20"
                                    onClick={(e) => { e.stopPropagation(); onSelect(img); }}
                                >
                                    <div className={`w-6 h-6 rounded-lg border-2 ${selectedImageId === img.id ? 'bg-red-600 border-red-600' : 'bg-black/40 border-white/30'} backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-all`}>
                                        <CheckCircle2 className={`w-4 h-4 text-white transition-opacity ${selectedImageId === img.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                                    className="absolute top-1 right-1 p-1.5 bg-black/80 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white z-20"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryGallery;
