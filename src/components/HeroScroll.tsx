import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 192;
const ANIMATION_PATH = '/Animations/_MConverter.eu_Animation-';
const DOT_COUNT = 5;

export default function HeroScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));

    const [loadProgress, setLoadProgress] = useState(0); // 0–100
    const [isReady, setIsReady] = useState(false);

    const [activeDot, setActiveDot] = useState(0);
    const currentFrameRef = useRef(0);
    const displayFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const scrollYRef = useRef(0);
    const animationDoneRef = useRef(false);

    // ─── Lock scroll immediately on mount (before loading even starts) ────────
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = '0px';
        document.body.style.width = '100%';
        // Cleanup: unlock if component unmounts unexpectedly
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, []);

    // ─── Draw a frame with COVER fit ─────────────────────────────────────────
    const drawFrame = (frameIdx: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imagesRef.current[Math.round(frameIdx)];
        if (!canvas || !ctx || !img) return;

        const dpr = window.devicePixelRatio || 1;
        const W = window.innerWidth;
        const H = window.innerHeight;

        if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            ctx.scale(dpr, dpr);
        }

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = W / H;
        const ZOOM = 1.02;
        const SHIFT_UP = H * 0.08;

        let drawW: number, drawH: number, offsetX: number, offsetY: number;

        if (canvasRatio > imgRatio) {
            drawW = W * ZOOM;
            drawH = (W / imgRatio) * ZOOM;
            offsetX = (W - drawW) / 2;
            offsetY = (H - drawH) / 2 + SHIFT_UP;
        } else {
            drawH = H * ZOOM;
            drawW = (H * imgRatio) * ZOOM;
            offsetX = (W - drawW) / 2;
            offsetY = (H - drawH) / 2 + SHIFT_UP;
        }

        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    // ─── Smooth lerp render loop ──────────────────────────────────────────────
    const startRenderLoop = () => {
        const loop = () => {
            const target = currentFrameRef.current;
            const current = displayFrameRef.current;
            const next = current + (target - current) * 0.12;

            if (Math.abs(next - target) > 0.1) {
                displayFrameRef.current = next;
                drawFrame(next);
                rafRef.current = requestAnimationFrame(loop);
            } else {
                displayFrameRef.current = target;
                drawFrame(target);
                rafRef.current = null;
            }
        };
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(loop);
    };

    // ─── Load ALL 192 frames, show progress, then reveal ─────────────────────
    useEffect(() => {
        let loaded = 0;
        const imgs = imagesRef.current;

        const BATCH = 24; // load 24 at a time to avoid overwhelming the browser

        const loadBatch = (start: number): Promise<void> => {
            const end = Math.min(start + BATCH, FRAME_COUNT);
            const promises: Promise<void>[] = [];

            for (let i = start; i < end; i++) {
                promises.push(
                    new Promise<void>((resolve) => {
                        const img = new Image();
                        img.src = `${ANIMATION_PATH}${i + 1}.png`;
                        img.onload = img.onerror = () => {
                            imgs[i] = img;
                            loaded++;
                            setLoadProgress(Math.floor((loaded / FRAME_COUNT) * 100));
                            resolve();
                        };
                    })
                );
            }
            return Promise.all(promises).then(() => { });
        };

        const run = async () => {
            for (let start = 0; start < FRAME_COUNT; start += BATCH) {
                await loadBatch(start);
            }
            // All frames loaded — draw first frame then reveal
            imagesRef.current = imgs;
            drawFrame(0);
            setIsReady(true);
        };

        run();
    }, []);

    // ─── Scroll lock + frame scrubbing (only active after fully loaded) ───────
    useEffect(() => {
        if (!isReady) return;

        const totalScrollRange = window.innerHeight * 2;

        const lockScroll = () => {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = '0px';
            document.body.style.width = '100%';
        };
        const unlockScroll = () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };

        lockScroll();

        const handleScroll = (delta: number) => {
            if (animationDoneRef.current) return;

            scrollYRef.current = Math.max(0, Math.min(scrollYRef.current + delta, totalScrollRange));
            const progress = scrollYRef.current / totalScrollRange;
            const frameIdx = Math.min(Math.max(progress * (FRAME_COUNT - 1), 0), FRAME_COUNT - 1);

            currentFrameRef.current = frameIdx;

            const dotIdx = Math.min(Math.floor(progress * DOT_COUNT), DOT_COUNT - 1);
            setActiveDot(dotIdx);

            startRenderLoop();

            if (scrollYRef.current >= totalScrollRange) {
                animationDoneRef.current = true;
                setActiveDot(DOT_COUNT - 1);
                unlockScroll();
                window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
                window.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions);
            }
        };

        const onWheel = (e: WheelEvent) => { e.preventDefault(); handleScroll(e.deltaY); };

        let lastTouchY = 0;
        const onTouchStart = (e: TouchEvent) => { lastTouchY = e.touches[0].clientY; };
        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const delta = lastTouchY - e.touches[0].clientY;
            lastTouchY = e.touches[0].clientY;
            handleScroll(delta * 2);
        };

        const onResize = () => {
            const canvas = canvasRef.current;
            if (canvas) { canvas.width = 0; canvas.height = 0; }
            drawFrame(displayFrameRef.current);
        };

        window.addEventListener('wheel', onWheel, { passive: false, capture: true });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
        window.addEventListener('resize', onResize);

        return () => {
            unlockScroll();
            window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions);
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isReady]);

    return (
        <div className="relative w-full h-screen bg-[#080808]">
            {/* Canvas — always mounted so first frame can draw into it */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Full-screen loading overlay — covers canvas until all frames ready */}
            {!isReady && (
                <div className="absolute inset-0 z-30 bg-[#080808] flex flex-col items-center justify-center gap-8">
                    {/* WREGALS wordmark */}
                    <span
                        className="text-white/80 uppercase tracking-[0.5em] text-sm font-light"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                        WREGALS
                    </span>

                    {/* Progress bar */}
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#C0392B] transition-all duration-150"
                            style={{ width: `${loadProgress}%` }}
                        />
                    </div>

                    {/* Percentage */}
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
                        {loadProgress}%
                    </span>
                </div>
            )}

            {/* Dot progress indicator */}
            {isReady && (
                <div
                    className="absolute flex flex-col items-center gap-3 z-20 pointer-events-none"
                    style={{ right: '18px', top: '50%', transform: 'translateY(-50%)' }}
                >
                    {Array.from({ length: DOT_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full"
                            style={{
                                width: i === activeDot ? '10px' : '6px',
                                height: i === activeDot ? '10px' : '6px',
                                backgroundColor: i === activeDot ? '#C0392B' : 'rgba(255,255,255,0.3)',
                                boxShadow: i === activeDot ? '0 0 10px rgba(192,57,43,0.8)' : 'none',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Scroll hint */}
            {isReady && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 pointer-events-none">
                    <span className="text-white text-[10px] uppercase tracking-widest">Scroll</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
                </div>
            )}
        </div>
    );
}
