import React from 'react';
import { X, Video, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useMedia, MediaFile } from '@/hooks/useMedia';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFile) => void;
  userId?: string;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelect, userId }: Props) {
  const { media, loading } = useMedia(userId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="w-full max-w-4xl max-h-[80vh] flex flex-col bg-white border-none shadow-2xl rounded-[2.5rem] relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between font-black uppercase tracking-tight text-slate-900">
          <h2 className="text-xl">Media Library</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-95">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-2xl" />)
            ) : media.length > 0 ? (
              media.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => { onSelect(item); onClose(); }}
                  className="group relative aspect-square bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden cursor-pointer hover:ring-4 hover:ring-indigo-500 hover:border-indigo-500 transition-all active:scale-95"
                >
                  {item.type.includes('image') ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      {item.type.includes('video') ? <Video size={36} className="text-indigo-500" /> : <FileText size={36} className="text-indigo-500" />}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-slate-900/90 to-transparent">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest truncate">{item.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                 No media assets found in library.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
