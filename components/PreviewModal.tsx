import React from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
    image: string | null;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-[#050b18]/95 backdrop-blur-3xl animate-in fade-in duration-300 flex items-center justify-center p-4 lg:p-12 cursor-zoom-out"
            onClick={onClose}
        >
            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center bg-transparent animate-in zoom-in-95 duration-500">
                {/* Checkered background for transparency visibility */}
                <div className="absolute inset-0 z-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}></div>
                <img src={image} alt="Full Screen Preview" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,1)]" />

                <button
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-0 right-0 lg:-top-6 lg:-right-6 w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-red-700 transition-all hover:scale-110 active:scale-90"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Vollauflösende Vorschau</p>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
