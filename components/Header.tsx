import React from 'react';
import { Zap, Monitor, Sun, Moon, Settings } from 'lucide-react';

interface HeaderProps {
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenSettings }) => {
    return (
        <header className="px-6 py-5 bg-[var(--bg-header)] border-b border-[var(--border)] backdrop-blur-xl sticky top-0 z-50 transition-colors duration-500">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-red-600 p-2 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-news text-[var(--text-main)] italic tracking-tighter leading-none">
                            VISUAL <span className="text-red-600">STUDIO</span>
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            <p className="text-[var(--text-dim)] text-[8px] font-bold uppercase tracking-[0.2em]">Live-Verbindung Aktiv</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={onToggleTheme}
                        className="w-10 h-10 rounded-xl bg-[var(--border)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={onOpenSettings}
                        className="w-10 h-10 rounded-xl bg-[var(--border)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-[var(--text-main)]"
                    >
                        <Settings className="w-5 h-5" />
                    </button>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="px-3 py-1 bg-red-600/5 rounded-full border border-red-600/20 flex items-center gap-2">
                            <Monitor className="w-3 h-3 text-red-500" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">Verbunden</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
