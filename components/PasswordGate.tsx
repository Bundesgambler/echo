import React, { useState, useEffect } from 'react';

const COOKIE_NAME = 'vs_auth';
const COOKIE_DAYS = 90;
const CORRECT_PASSWORD = 'Alice25!';

// Cookie utilities
const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

interface PasswordGateProps {
    children: React.ReactNode;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // Check existing auth cookie on mount
    useEffect(() => {
        const authCookie = getCookie(COOKIE_NAME);
        setIsAuthenticated(authCookie === 'authenticated');
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === CORRECT_PASSWORD) {
            setCookie(COOKIE_NAME, 'authenticated', COOKIE_DAYS);
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setIsShaking(true);
            setPassword('');
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    // Loading state while checking cookie
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#070d1a]">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Already authenticated - render app
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // Show login screen
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070d1a] p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div
                className={`relative w-full max-w-md ${isShaking ? 'animate-shake' : ''}`}
            >
                {/* Glass card */}
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Logo / Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-600/25 mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Visual Studio</h1>
                        <p className="text-slate-400 text-sm mt-1">Geschützter Bereich</p>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                                Passwort
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError(false);
                                }}
                                placeholder="••••••••"
                                autoFocus
                                className={`w-full px-4 py-3 bg-black/30 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-200 ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'
                                    }`}
                            />
                            {error && (
                                <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Falsches Passwort
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 transition-all duration-200 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Einloggen
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="text-center text-slate-600 text-xs mt-6">
                        Automatische Anmeldung für 90 Tage gespeichert
                    </p>
                </div>
            </div>

            {/* CSS for shake animation */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default PasswordGate;
