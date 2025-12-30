import React from 'react';
import { Image as ImageIcon, Zap, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { LoadingStatus } from '../types';

interface OutputDisplayProps {
    status: LoadingStatus;
    resultImages: string[];
    error: string | null;
    onDownload: (url: string) => void;
    onPreview: (url: string) => void;
    onReset: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
    status,
    resultImages,
    error,
    onDownload,
    onPreview,
    onReset
}) => {
    return (
        <div className="lg:col-span-4">
            <div className="relative aspect-square lg:aspect-auto lg:h-full bg-[var(--bg-header)] rounded-[3rem] border border-[var(--border)] flex items-center justify-center overflow-hidden shadow-2xl group min-h-[500px] lg:min-h-full transition-colors duration-500">

                {status === LoadingStatus.IDLE && resultImages.length === 0 && (
                    <div className="text-center p-12">
                        <div className="w-24 h-24 bg-[var(--bg-deep)] rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-[var(--border)] group-hover:border-red-600/20 transition-all duration-700">
                            <ImageIcon className="w-10 h-10 text-[var(--text-dim)] group-hover:text-red-600/40 transition-colors" />
                        </div>
                        <h3 className="text-2xl font-news text-[var(--text-main)] mb-4 uppercase italic tracking-tighter">Ausgabebereich</h3>
                        <p className="text-[var(--text-dim)] text-xs max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
                            Studio bereit. Warte auf Eingabe...
                        </p>
                    </div>
                )}

                {(status !== LoadingStatus.IDLE && status !== LoadingStatus.SUCCESS && status !== LoadingStatus.ERROR) && (
                    <div className="absolute inset-0 z-20 bg-[var(--bg-deep)]/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 transition-colors duration-500">
                        <div className="w-full max-w-xs space-y-10 text-center">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 border-2 border-[var(--border)] border-t-red-600 rounded-full animate-spin mx-auto" />
                                <Zap className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse fill-red-600" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.3em] animate-pulse">
                                    {status === LoadingStatus.COMMUNICATING_WEBHOOK ? (error || "Verbindung wird hergestellt") : "Generierung läuft"}
                                </h4>
                                <p className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-widest">Bitte warten...</p>
                            </div>
                        </div>
                    </div>
                )}

                {(status === LoadingStatus.SUCCESS || status === LoadingStatus.IDLE) && resultImages.length > 0 && (
                    <div className="w-full h-full p-8 overflow-y-auto scrollbar-custom grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-700">
                        {resultImages.map((img, idx) => (
                            <div key={idx} className="relative group/result aspect-square bg-black rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl cursor-zoom-in" onClick={() => onPreview(img)}>
                                <img src={img} alt={`Render ${idx + 1}`} className="w-full h-full object-contain" />

                                <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover/result:opacity-100 transition-all duration-300 translate-y-2 group-hover/result:translate-y-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDownload(img); }}
                                        className="h-12 px-6 bg-red-600 text-white rounded-xl shadow-2xl hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 font-news text-sm italic"
                                    >
                                        <Download className="w-4 h-4" />
                                        EXPORT
                                    </button>
                                </div>

                                <div className="absolute bottom-6 left-6 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5">
                                    VARIANTE_{idx + 1}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={onReset}
                            className="md:col-span-2 h-16 bg-[var(--bg-deep)] hover:bg-red-600/10 hover:border-red-600/20 text-[var(--text-dim)] hover:text-red-500 rounded-2xl border border-[var(--border)] transition-all font-news italic text-lg tracking-tighter"
                        >
                            ERGEBNISSE LÖSCHEN
                        </button>
                    </div>
                )}

                {status === LoadingStatus.ERROR && (
                    <div className="p-12 text-center max-w-md relative z-10 animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-600/20 shadow-inner">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-xl font-news text-[var(--text-main)] mb-4 uppercase italic tracking-tighter">Verbindungsfehler</h3>
                        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 mb-10 text-left">
                            <p className="text-red-400 text-xs font-medium leading-relaxed font-mono">{error}</p>
                        </div>
                        <button onClick={onReset} className="px-12 py-4 bg-[var(--bg-panel)] hover:bg-red-600/10 text-[var(--text-main)] rounded-2xl border border-[var(--border)] font-news italic tracking-tighter flex items-center gap-3 mx-auto transition-all active:scale-95">
                            <RefreshCw className="w-5 h-5" />
                            NEU STARTEN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutputDisplay;
