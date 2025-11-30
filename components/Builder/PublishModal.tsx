import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Globe, Copy, ExternalLink, Loader2, Smartphone, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  code: string;
}

type Tab = 'web' | 'mobile';

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, projectName, code }) => {
  const [activeTab, setActiveTab] = useState<Tab>('web');
  const [step, setStep] = useState<'idle' | 'building' | 'deploying' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  // Use number for browser-side timer ID to avoid NodeJS namespace issues
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
        // Reset state when closed
        const timer = setTimeout(() => {
            setStep('idle');
            setProgress(0);
            setActiveTab('web');
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const startSimulation = () => {
    if (step !== 'idle') return;
    
    setStep('building');
    let p = 0;
    setProgress(0);
    
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      // Non-linear progress simulation
      if (p < 50) {
        p += Math.random() * 5; // Slow start
      } else if (p < 80) {
        p += Math.random() * 10; // Fast middle
      } else {
        p += Math.random() * 2; // Slow finish
      }

      if (p >= 100) {
        p = 100;
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setStep('completed');
      }
      
      // State transition for UI feedback
      if (p > 45 && step === 'building') {
          setStep('deploying');
      }

      setProgress(Math.min(p, 100));
    }, activeTab === 'web' ? 200 : 300); // Mobile build takes slightly longer
  };

  useEffect(() => {
      if (isOpen && activeTab === 'web' && step === 'idle') {
          startSimulation();
      }
      return () => {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOpenLive = () => {
     const blob = new Blob([code], { type: 'text/html' });
     const url = URL.createObjectURL(blob);
     window.open(url, '_blank');
  };

  const handleDownloadApk = () => {
      // Simulation: Create a dummy APK file (text content masked as APK)
      const mockContent = `This is a simulation of the APK file for ${projectName}.\n\nSource Code included for debugging:\n\n${code}`;
      const blob = new Blob([mockContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.apk`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const [copied, setCopied] = useState(false);
  const liveUrl = `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.dreamcraft.ai`;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetBuild = () => {
      setStep('idle');
      setProgress(0);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Publish & Export</h2>

        {/* Tabs */}
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg mb-6">
            <button 
                onClick={() => { setActiveTab('web'); resetBuild(); setTimeout(() => startSimulation(), 100) }}
                className={clsx("flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all", activeTab === 'web' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
            >
                <Globe size={16} /> Web
            </button>
            <button 
                onClick={() => { setActiveTab('mobile'); resetBuild(); }}
                className={clsx("flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all", activeTab === 'mobile' ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
            >
                <Smartphone size={16} /> Mobile App
            </button>
        </div>

        {activeTab === 'web' && (
            step !== 'completed' ? (
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                            <Loader2 size={32} className="text-blue-500 animate-spin" />
                        </div>
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    </div>
                    
                    <h2 className="text-lg font-medium text-white mb-2">
                        {step === 'building' ? 'Building Web Bundle...' : 'Deploying to Edge...'}
                    </h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        {step === 'building' ? 'Compiling assets and minifying code' : 'Distributing to global content delivery network'}
                    </p>

                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center py-2 text-center">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                        <Check size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">You're Live!</h2>
                    <p className="text-zinc-400 mb-8 text-sm">Your web app has been successfully deployed.</p>

                    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-3 mb-6">
                        <Globe size={16} className="text-zinc-500" />
                        <span className="flex-1 text-left text-sm text-zinc-300 font-mono truncate">{liveUrl}</span>
                        <button onClick={handleCopy} className="text-zinc-400 hover:text-white transition-colors" title="Copy Link">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                         <div className="flex gap-3 w-full">
                            <Button variant="secondary" className="flex-1" onClick={onClose}>Close</Button>
                            <Button variant="primary" className="flex-1 gap-2 bg-green-600 hover:bg-green-500" onClick={handleOpenLive}>
                                <ExternalLink size={16} /> Open
                            </Button>
                        </div>
                        <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-300 text-xs gap-2 mt-2" onClick={handleDownloadHtml}>
                            <Download size={14} /> Download HTML
                        </Button>
                    </div>
                </div>
            )
        )}

        {activeTab === 'mobile' && (
             step === 'idle' ? (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Smartphone size={32} className="text-zinc-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Export to Android</h3>
                    <p className="text-sm text-zinc-400 mb-8">
                        Compile your project into a standard APK file ready for installation on Android devices or submission to the Play Store.
                    </p>
                    <Button onClick={startSimulation} className="w-full gap-2">
                        Start Build Process
                    </Button>
                </div>
             ) : step !== 'completed' ? (
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center">
                            <Loader2 size={32} className="text-purple-500 animate-spin" />
                        </div>
                        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                    </div>
                    
                    <h2 className="text-lg font-medium text-white mb-2">
                        {step === 'building' ? 'Compiling React Native...' : 'Signing APK...'}
                    </h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        {step === 'building' ? 'Translating web components to native views' : 'Applying security signatures and packaging'}
                    </p>

                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div 
                            className="h-full bg-purple-500 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
             ) : (
                <div className="flex flex-col items-center py-2 text-center">
                    <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
                        <Check size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">APK Ready</h2>
                    <p className="text-zinc-400 mb-8 text-sm">Your Android application package has been generated.</p>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 w-full mb-6 flex items-center gap-4">
                         <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center">
                             <span className="font-bold text-xs">APK</span>
                         </div>
                         <div className="text-left flex-1">
                             <div className="text-sm font-medium text-white">{projectName.replace(/\s+/g, '')}_v1.0.apk</div>
                             <div className="text-xs text-zinc-500">~4.5 MB • Signed</div>
                         </div>
                    </div>

                    <Button variant="primary" className="w-full gap-2 bg-purple-600 hover:bg-purple-500" onClick={handleDownloadApk}>
                        <Download size={16} /> Download APK
                    </Button>
                </div>
             )
        )}
      </div>
    </div>
  );
};