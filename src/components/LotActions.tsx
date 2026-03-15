import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import IIcon from './IIcon';
import ShareSheet from './ShareSheet';

interface LotActionsProps {
    initialLikes: number;
    url: string;
}

export default function LotActions({ initialLikes, url }: LotActionsProps) {
    const [liked, setLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(initialLikes);
    const [shareOpen, setShareOpen] = useState<boolean>(false);
    const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
    const shareButtonRef = useRef<HTMLButtonElement>(null);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    const handleShareToggle = () => {
        if (!shareOpen && shareButtonRef.current) {
            const rect = shareButtonRef.current.getBoundingClientRect();
            // Position the popup below the button, aligning their right edges (w-52 = 208px)
            setPopupPos({ top: rect.bottom + 8, left: rect.right - 208 });
        }
        setShareOpen(!shareOpen);
    };

    const formatLikes = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

    return (
        <div className="flex items-center gap-4 text-neutral-400 relative">
            {/* Like Button */}
            <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'hover:text-white'}`}
            >
                <IIcon icon={liked ? "solar:heart-bold" : "solar:heart-linear"} width="22" />
                <span className="text-[13px] font-bold uppercase tracking-wider">{formatLikes(likes)}</span>
            </button>

            {/* Share Button */}
            <button
                ref={shareButtonRef}
                onClick={handleShareToggle}
                className={`flex items-center transition-colors ${shareOpen ? 'text-sky-400' : 'hover:text-white'}`}
            >
                <IIcon icon="solar:share-circle-linear" width="22" />
            </button>

            {/* Share Sheet popup - rendered via portal to escape clip paths */}
            {shareOpen && popupPos && createPortal(
                <div style={{ position: 'fixed', top: popupPos.top, left: popupPos.left, zIndex: 9999 }}>
                    <ShareSheet url={url} onClose={() => setShareOpen(false)} />
                </div>,
                document.body
            )}
        </div>
    );
}
