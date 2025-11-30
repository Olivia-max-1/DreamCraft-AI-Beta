import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Linkedin, Facebook, Link as LinkIcon, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, projectName, onDownload }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://dreamcraft.ai/p/${projectName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(7)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <LinkIcon size={20} className="text-blue-500" />
            Share Project
        </h2>

        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium text-zinc-400 mb-2 block">Project Link</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono truncate">
                        {shareUrl}
                    </div>
                    <Button variant="secondary" onClick={handleCopy} className="w-24">
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-zinc-400 mb-3 block">Share to Socials</label>
                <div className="flex gap-3">
                    <button className="flex-1 h-10 rounded-lg bg-[#1DA1F2]/10 text-[#1DA1F2] border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 flex items-center justify-center transition-colors">
                        <Twitter size={18} />
                    </button>
                    <button className="flex-1 h-10 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20 flex items-center justify-center transition-colors">
                        <Linkedin size={18} />
                    </button>
                    <button className="flex-1 h-10 rounded-lg bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2]/20 flex items-center justify-center transition-colors">
                        <Facebook size={18} />
                    </button>
                </div>
            </div>
            
            <div className="pt-6 border-t border-border mt-6">
                 <Button variant="ghost" className="w-full text-zinc-400 hover:text-white gap-2" onClick={onDownload}>
                    <Download size={16} /> Download Source Code
                 </Button>
            </div>
        </div>
      </div>
    </div>
  );
};