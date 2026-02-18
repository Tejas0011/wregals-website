import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 192;
const ANIMATION_PATH = '/Animations/_MConverter.eu_Animation-';
const DOT_COUNT = 5;

export default function HeroScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeDot, setActiveDot] = useState(0);
    const currentFrameRef = useRef(0);       // target frame (from scroll)
    const displayFrameRef = useRef(0);       // smoothed frame (lerped)
    const rafRef = useRef<number | null>(null);
    const scrollYRef = useRef(0);
    const animationDoneRef = useRef(false);

    // ─── Preload all frames ───────────────────────────────────────────────────
    useEffect(() => {
        let loaded = 0;
        const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `${ANIMATION_PATH}${i}.png`;
            img.onload = img.onerror = () => {
                imgs[i - 1] = img;
                loaded++;
                if (loaded === FRAME_COUNT) {
                    imagesRef.current = imgs;
                    setIsLoaded(true);
                }
            };
        }
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
        const SHIFT_UP = H * 0.08; // shift image up by 8% of screen height

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

    // ─── Smooth render loop (lerp toward target frame) ────────────────────────
    const startRenderLoop = () => {
        const loop = () => {
            const target = currentFrameRef.current;
            const current = displayFrameRef.current;
            const next = current + (target - current) * 0.12; // easing factor

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

    // ─── Scroll lock + frame scrubbing ───────────────────────────────────────
    useEffect(() => {
        if (!isLoaded) return;

        drawFrame(0);

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
            const frameIdx = Math.min(
                Math.max(progress * (FRAME_COUNT - 1), 0),
                FRAME_COUNT - 1
            );

            currentFrameRef.current = frameIdx;

            // Update active dot
            const dotIdx = Math.min(Math.floor(progress * DOT_COUNT), DOT_COUNT - 1);
            setActiveDot(dotIdx);

            // Kick off smooth render loop
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
        const onTouchStart = (e: TouchEvent) => {
            lastTouchY = e.touches[0].clientY;
        };
        const onTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const delta = lastTouchY - e.touches[0].clientY;
            lastTouchY = e.touches[0].clientY;
            handleScroll(delta * 2);
        };

        const onResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = 0;
                canvas.height = 0;
            }
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
    }, [isLoaded]);

    return (
        <div className="relative w-full h-screen bg-[#080808]">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Dot progress indicator — pushed to far right edge */}
            {isLoaded && (
                <div
                    className="absolute flex flex-col items-center gap-3 z-20 pointer-events-none"
                    style={{ right: '18px', top: '50%', transform: 'translateY(-50%)' }}
                >
                    {Array.from({ length: DOT_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full transition-all duration-300"
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
            {isLoaded && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 pointer-events-none">
                    <span className="text-white text-[10px] uppercase tracking-widest">Scroll</span>
                    <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
                </div>
            )}
        </div>
    );
}
