import { useEffect, useRef, useState } from 'react';

// Use every other frame to halve load time (96 frames instead of 192)
// Still smooth enough at typical scroll speeds
const TOTAL_FRAMES = 192;
const STEP = 2; // use every 2nd frame
const FRAME_COUNT = Math.ceil(TOTAL_FRAMES / STEP); // 96
const ANIMATION_PATH = '/Animations/_MConverter.eu_Animation-';
const DOT_COUNT = 5;

export default function HeroScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>(new Array(FRAME_COUNT));
    const loadedCountRef = useRef(0);

    const [loadProgress, setLoadProgress] = useState(0); // 0-100
    const [isReady, setIsReady] = useState(false);
    const [activeDot, setActiveDot] = useState(0);

    const currentFrameRef = useRef(0);
    const displayFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const scrollYRef = useRef(0);
    const animationDoneRef = useRef(false);
    const isReadyRef = useRef(false);

    // ─── Lock scroll IMMEDIATELY on mount, before any images load ────────────
    useEffect(() => {
        const lockScroll = () => {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = '0px';
            document.body.style.width = '100%';
        };
        lockScroll();
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

    // ─── Smooth render loop (lerp) ────────────────────────────────────────────
    const startRenderLoop = () => {
        const loop = () => {
            const target = currentFrameRef.current;
            const current = displayFrameRef.current;
            const targetImg = imagesRef.current[Math.round(target)];
            if (!targetImg) return;

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

    // ─── Progressive image loading ────────────────────────────────────────────
    useEffect(() => {
        const imgs = imagesRef.current;

        const loadImage = (frameNum: number, idx: number): Promise<void> =>
            new Promise((resolve) => {
                const img = new Image();
                img.src = `${ANIMATION_PATH}${frameNum}.png`;
                img.onload = img.onerror = () => {
                    imgs[idx] = img;
                    loadedCountRef.current++;
                    const pct = Math.round((loadedCountRef.current / FRAME_COUNT) * 100);
                    setLoadProgress(pct);
                    resolve();
                };
            });

        const run = async () => {
            // Load first frame immediately and draw it
            await loadImage(1, 0);
            drawFrame(0);

            // Load next 9 frames (frames 1-9 at step 2 = source frames 3,5,7...19)
            // This gives us 10 frames total before enabling scroll
            const PRIORITY = 10;
            const priorityBatch: Promise<void>[] = [];
            for (let i = 1; i < PRIORITY; i++) {
                priorityBatch.push(loadImage(1 + i * STEP, i));
            }
            await Promise.all(priorityBatch);

            // Unlock scroll — enough frames to start
            isReadyRef.current = true;
            setIsReady(true);

            // Load remaining frames in background batches of 16
            const BATCH = 16;
            for (let i = PRIORITY; i < FRAME_COUNT; i += BATCH) {
                const end = Math.min(i + BATCH, FRAME_COUNT);
                const batch: Promise<void>[] = [];
                for (let j = i; j < end; j++) {
                    batch.push(loadImage(1 + j * STEP, j));
                }
                await Promise.all(batch);
            }
        };

        run();
    }, []);

    // ─── Scroll event handling (always active, gated by isReadyRef) ──────────
    useEffect(() => {
        const totalScrollRange = window.innerHeight * 2;

        const unlockScroll = () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };

        const handleScroll = (delta: number) => {
            // Don't allow scrolling past animation until ready
            if (!isReadyRef.current || animationDoneRef.current) return;

            scrollYRef.current = Math.max(0, Math.min(scrollYRef.current + delta, totalScrollRange));
            const progress = scrollYRef.current / totalScrollRange;

            // Cap to loaded frames
            const maxFrame = loadedCountRef.current - 1;
            const idealFrame = progress * (FRAME_COUNT - 1);
            const frameIdx = Math.min(Math.max(idealFrame, 0), maxFrame);

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

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            handleScroll(e.deltaY);
        };

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
            window.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions);
            window.removeEventListener('resize', onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-[#080808]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Loading progress bar — thin line at bottom, fades out when ready */}
            {!isReady && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-30">
                    <div
                        className="h-full bg-[#C0392B] transition-all duration-300"
                        style={{ width: `${loadProgress}%` }}
                    />
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
