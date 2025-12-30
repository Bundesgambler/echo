import React from 'react';
import { Sparkles, Code, Lock, Unlock, Send, RefreshCw, User, UserX } from 'lucide-react';
import { LoadingStatus, OverlaySetting } from '../types';

interface InputPanelProps {
    topic: string;
    setTopic: (v: string) => void;
    headlineLine1: string;
    setHeadlineLine1: (v: string) => void;
    headlineLine2: string;
    setHeadlineLine2: (v: string) => void;
    headlineLine3: string;
    setHeadlineLine3: (v: string) => void;
    subline: string;
    setSubline: (v: string) => void;
    backgroundInfo: string;
    setBackgroundInfo: (v: string) => void;
    headlineFixed: boolean;
    setHeadlineFixed: (v: boolean) => void;
    sublineFixed: boolean;
    setSublineFixed: (v: boolean) => void;
    includePerson: boolean;
    setIncludePerson: (v: boolean) => void;
    personDescription: string;
    setPersonDescription: (v: string) => void;
    importantInfo: string;
    setImportantInfo: (v: string) => void;
    generationCount: number;
    setGenerationCount: (v: number) => void;
    status: LoadingStatus;
    onGenerate: (e: React.FormEvent) => void;
    showJson: boolean;
    setShowJson: (v: boolean) => void;
    currentPayload: string;
    selectedWebhookUrl: string;
    setSelectedWebhookUrl: (v: string) => void;
    overlaySettings: OverlaySetting[];
    children?: React.ReactNode;
}

const InputPanel: React.FC<InputPanelProps> = ({
    topic, setTopic,
    headlineLine1, setHeadlineLine1,
    headlineLine2, setHeadlineLine2,
    headlineLine3, setHeadlineLine3,
    subline, setSubline,
    backgroundInfo, setBackgroundInfo,
    headlineFixed, setHeadlineFixed,
    sublineFixed, setSublineFixed,
    includePerson, setIncludePerson,
    personDescription, setPersonDescription,
    importantInfo, setImportantInfo,
    generationCount, setGenerationCount,
    status, onGenerate,
    showJson, setShowJson,
    currentPayload,
    selectedWebhookUrl,
    setSelectedWebhookUrl,
    overlaySettings,
    children
}) => {
    const hasHeadline = headlineLine1.trim() !== '' || headlineLine2.trim() !== '' || headlineLine3.trim() !== '';
    const isTopicFilled = topic.trim() !== '';
    const isImportantInfoMissing = isTopicFilled && importantInfo.trim() === '';
    const isGenerateDisabled = (topic.trim() === '' && (subline.trim() === '' || !hasHeadline)) || isImportantInfoMissing || status !== LoadingStatus.IDLE;

    return (
        <div className="lg:col-span-8 flex flex-col gap-6 selection:bg-red-600/30">
            <section className="bg-[var(--bg-panel)] rounded-[2rem] border border-[var(--border)] p-8 shadow-2xl relative overflow-hidden transition-colors duration-500">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
                        <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-[var(--text-dim)]">
                            <Sparkles className="w-4 h-4 text-red-500" />
                            Eingabeformular
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowJson(!showJson)}
                            className={`p-2 rounded-lg transition-all ${showJson ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'hover:bg-[var(--bg-deep)] text-[var(--text-dim)]'}`}
                        >
                            <Code className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={onGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1">Hauptthema</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Beschreibe den Kontext oder das Nachrichtenereignis..."
                                className="w-full h-24 bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-4 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all resize-none shadow-inner"
                                disabled={status !== LoadingStatus.IDLE}
                            />
                        </div>

                        {topic.trim() !== '' && (
                            <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest">Was ist besonders wichtig? (Pflichtfeld)</label>
                                    <span className="text-[8px] font-black text-red-500/50 uppercase">Erforderlich</span>
                                </div>
                                <textarea
                                    value={importantInfo}
                                    onChange={(e) => setImportantInfo(e.target.value)}
                                    placeholder="Hebe spezifische Details, Farben oder Stimmungen hervor..."
                                    className={`w-full h-20 bg-[var(--bg-deep)] border ${importantInfo.trim() === '' ? 'border-red-600/50' : 'border-[var(--border)]'} rounded-2xl p-4 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all resize-none shadow-inner`}
                                    disabled={status !== LoadingStatus.IDLE}
                                    required
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Dachzeile</label>
                                    <button
                                        type="button"
                                        onClick={() => setSublineFixed(!sublineFixed)}
                                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black transition-all ${sublineFixed ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[var(--bg-deep)] text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                                    >
                                        {sublineFixed ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                                        {sublineFixed ? 'FIX' : 'AUTO'}
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={subline}
                                    onChange={(e) => setSubline(e.target.value)}
                                    className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all"
                                    placeholder="z.B. EILMELDUNG"
                                    disabled={status !== LoadingStatus.IDLE}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Schlagzeile</label>
                                    <button
                                        type="button"
                                        onClick={() => setHeadlineFixed(!headlineFixed)}
                                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black transition-all ${headlineFixed ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-[var(--bg-deep)] text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                                    >
                                        {headlineFixed ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                                        {headlineFixed ? 'FIX' : 'AUTO'}
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={headlineLine1}
                                        onChange={(e) => setHeadlineLine1(e.target.value)}
                                        className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all"
                                        placeholder="Zeile 1..."
                                        disabled={status !== LoadingStatus.IDLE}
                                    />
                                    <input
                                        type="text"
                                        value={headlineLine2}
                                        onChange={(e) => setHeadlineLine2(e.target.value)}
                                        className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all"
                                        placeholder="Zeile 2..."
                                        disabled={status !== LoadingStatus.IDLE}
                                    />
                                    <input
                                        type="text"
                                        value={headlineLine3}
                                        onChange={(e) => setHeadlineLine3(e.target.value)}
                                        className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all"
                                        placeholder="Zeile 3..."
                                        disabled={status !== LoadingStatus.IDLE}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* This space is reserved for the LibraryGallery component via children or separate render */}
                        {children}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest ml-1">Atmosphäre & Stil</label>
                            <input
                                type="text"
                                value={backgroundInfo}
                                onChange={(e) => setBackgroundInfo(e.target.value)}
                                className="w-full bg-[var(--bg-deep)] border border-[var(--border)] rounded-xl p-3.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all"
                                placeholder="Dunkel, filmisch, urban, Neon..."
                                disabled={status !== LoadingStatus.IDLE}
                            />
                        </div>

                        {/* Person Toggle */}
                        <div className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-4 space-y-3 transition-colors duration-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {includePerson ? (
                                        <User className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <UserX className="w-4 h-4 text-[var(--text-dim)]" />
                                    )}
                                    <div>
                                        <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Person hinzufügen</p>
                                        <p className="text-[8px] text-[var(--text-dim)]/60 uppercase font-bold mt-0.5">
                                            {includePerson ? 'Beschreibe wer zu sehen sein soll' : 'Keine Personen im Bild'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIncludePerson(!includePerson)}
                                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${includePerson ? 'bg-red-600 shadow-lg shadow-red-900/40' : 'bg-[var(--bg-panel)] border border-[var(--border)]'
                                        }`}
                                    disabled={status !== LoadingStatus.IDLE}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${includePerson ? 'left-7' : 'left-1'
                                        }`} />
                                </button>
                            </div>

                            {includePerson && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <textarea
                                        value={personDescription}
                                        onChange={(e) => setPersonDescription(e.target.value)}
                                        placeholder="Beschreibe die Person(en): z.B. 'Ein selbstbewusster Geschäftsmann im Anzug, Mitte 40, blickt direkt in die Kamera'"
                                        className="w-full h-20 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50 shadow-inner transition-all resize-none"
                                        disabled={status !== LoadingStatus.IDLE}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-4 transition-colors duration-500">
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Overlay-Auswahl</p>
                                <p className="text-[8px] text-[var(--text-dim)]/60 uppercase font-bold mt-0.5">Webhook Konfiguration wählen</p>
                            </div>
                            <div className="flex bg-[var(--bg-panel)] p-1 rounded-xl border border-[var(--border)] gap-1 flex-wrap justify-end">
                                {overlaySettings.filter(s => s.url && s.url.trim() !== '').map((setting) => (
                                    <button
                                        key={setting.url}
                                        type="button"
                                        onClick={() => setSelectedWebhookUrl(setting.url)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${selectedWebhookUrl === setting.url ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-[var(--text-dim)] hover:text-[var(--text-main)] bg-[var(--bg-deep)]'}`}
                                    >
                                        {setting.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-4 transition-colors duration-500">
                            <div>
                                <p className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest">Mehrfach-Generierung</p>
                                <p className="text-[8px] text-[var(--text-dim)]/60 uppercase font-bold mt-0.5">Mehrere Varianten erstellen</p>
                            </div>
                            <div className="flex bg-[var(--bg-panel)] p-1 rounded-xl border border-[var(--border)]">
                                {[1, 2, 3, 4].map(count => (
                                    <button
                                        key={count}
                                        type="button"
                                        onClick={() => setGenerationCount(count)}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${generationCount === count ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
                                    >
                                        {count}X
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerateDisabled}
                            className={`w-full py-5 rounded-2xl font-news text-xl italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-xl
                ${status === LoadingStatus.IDLE
                                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30 active:scale-[0.98]'
                                    : 'bg-[var(--bg-deep)] text-[var(--text-dim)] cursor-not-allowed'}`}
                        >
                            {status === LoadingStatus.IDLE ? (
                                <>
                                    <Send className="w-5 h-5" />
                                    BILD GENERIEREN
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    WIRD ERSTELLT...
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {showJson && (
                <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-2xl p-6 font-mono text-[9px] animate-in slide-in-from-top-4 duration-300 shadow-2xl overflow-hidden transition-colors duration-500">
                    <span className="text-red-500 font-bold uppercase tracking-widest block mb-4 border-b border-[var(--border)] pb-2">DEBUG_PAYLOAD</span>
                    <pre className="text-[var(--text-dim)] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto scrollbar-custom">
                        {currentPayload}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default InputPanel;
