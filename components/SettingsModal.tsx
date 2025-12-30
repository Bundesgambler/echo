import React, { useState, useEffect } from 'react';
import { X, Save, Settings as SettingsIcon } from 'lucide-react';
import { OverlaySetting } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: OverlaySetting[];
    onSave: (newSettings: OverlaySetting[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<OverlaySetting[]>(settings);

    useEffect(() => {
        if (isOpen) {
            setLocalSettings(settings);
        }
    }, [isOpen, settings]);

    if (!isOpen) return null;

    const handleChange = (index: number, field: keyof OverlaySetting, value: string) => {
        const updated = [...localSettings];
        updated[index] = { ...updated[index], [field]: value };
        setLocalSettings(updated);
    };

    const handleSave = () => {
        onSave(localSettings);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--bg-panel)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-header)]/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-600/10 p-2 rounded-lg">
                            <SettingsIcon className="w-5 h-5 text-red-500" />
                        </div>
                        <h2 className="text-lg font-news italic tracking-tight text-[var(--text-main)]">OVERLAY KONFIGURATION</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-full transition-colors">
                        <X className="w-5 h-5 text-[var(--text-dim)]" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[var(--text-dim)]/60 mb-2">Einstellungen für die 5 Overlay-Buttons</p>

                    {localSettings.map((setting, idx) => (
                        <div key={idx} className="bg-[var(--bg-deep)] border border-[var(--border)] rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">OV {idx + 1}</span>
                                <input
                                    type="text"
                                    value={setting.name}
                                    onChange={(e) => handleChange(idx, 'name', e.target.value)}
                                    placeholder="Button Name (z.B. Tagesschau)"
                                    className="flex-1 bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-red-600/50"
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] uppercase font-bold text-[var(--text-dim)]/50 ml-1 tracking-tighter">Production Webhook URL</p>
                                <input
                                    type="text"
                                    value={setting.url}
                                    onChange={(e) => handleChange(idx, 'url', e.target.value)}
                                    placeholder="https://n8n.mariohau.de/webhook/..."
                                    className="w-full bg-[var(--bg-panel)] border border-[var(--border)] rounded-xl px-4 py-2 text-[10px] font-mono text-red-400 focus:outline-none focus:ring-1 focus:ring-red-600/50"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--bg-header)]/30">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4" />
                        Speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
