import React, { useEffect, useRef } from 'react';
import { DeviceFrame } from '../../types';
import { clsx } from 'clsx';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface PreviewPanelProps {
  code: string;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, deviceFrame, setDeviceFrame }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  const getWidth = () => {
    switch (deviceFrame) {
      case DeviceFrame.MOBILE: return '375px';
      case DeviceFrame.TABLET: return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0c0e]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg">
           <button 
             onClick={() => setDeviceFrame(DeviceFrame.MOBILE)}
             className={clsx("p-1.5 rounded-md transition-colors", deviceFrame === DeviceFrame.MOBILE ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}
             title="Mobile"
           >
             <Smartphone size={16} />
           </button>
           <button 
             onClick={() => setDeviceFrame(DeviceFrame.TABLET)}
             className={clsx("p-1.5 rounded-md transition-colors", deviceFrame === DeviceFrame.TABLET ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}
             title="Tablet"
           >
             <Tablet size={16} />
           </button>
           <button 
             onClick={() => setDeviceFrame(DeviceFrame.DESKTOP)}
             className={clsx("p-1.5 rounded-md transition-colors", deviceFrame === DeviceFrame.DESKTOP ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300")}
             title="Desktop"
           >
             <Monitor size={16} />
           </button>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
            {deviceFrame === DeviceFrame.MOBILE ? '375 x 812' : deviceFrame === DeviceFrame.TABLET ? '768 x 1024' : 'Responsive'}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
        <div 
          style={{ 
            width: getWidth(), 
            height: deviceFrame === DeviceFrame.DESKTOP ? '100%' : '95%',
            transition: 'width 0.3s ease' 
          }}
          className={clsx(
            "bg-white shadow-2xl overflow-hidden transition-all duration-300",
            deviceFrame !== DeviceFrame.DESKTOP ? "rounded-[2rem] border-[8px] border-zinc-800" : "rounded-none w-full h-full"
          )}
        >
          <iframe
            ref={iframeRef}
            title="App Preview"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts allow-modals allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};