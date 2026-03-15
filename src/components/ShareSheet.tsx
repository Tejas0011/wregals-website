import { useRef, useEffect } from 'react';
import IIcon from './IIcon';

interface ShareSheetProps {
    url: string;
    onClose: () => void;
    className?: string;
}

export default function ShareSheet({ url, onClose, className = '' }: ShareSheetProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={ref} className={`z-50 w-52 bg-[#111] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm ${className}`}>
            <p className="text-[9px] uppercase tracking-widest text-neutral-600 px-4 pt-3 pb-1">Share via</p>
            {[
                { label: 'WhatsApp', icon: 'ic:baseline-whatsapp', href: `https://wa.me/?text=${encodeURIComponent(url)}` },
                { label: 'Twitter / X', icon: 'ri:twitter-x-fill', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}` },
                { label: 'LinkedIn', icon: 'mdi:linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
                { label: 'Instagram', icon: 'mdi:instagram', href: '#' },
            ].map(o => (
                <a key={o.label} href={o.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-neutral-300 transition-colors">
                    <IIcon icon={o.icon} width="15" class="text-neutral-400" />{o.label}
                </a>
            ))}
            <button onClick={() => { navigator.clipboard?.writeText(url); onClose(); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-neutral-300 w-full border-t border-white/5 transition-colors">
                <IIcon icon="solar:copy-linear" width="15" class="text-neutral-400" />Copy Link
            </button>
        </div>
    );
}
