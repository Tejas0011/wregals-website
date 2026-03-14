import { useState } from 'react';
import { Link } from 'react-router-dom';
import IIcon from './IIcon';

export default function HomeHero() {
    const lot1Images = [
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587280501635-68a0e82c5fbf?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=2000&auto=format&fit=crop"
    ];

    const lot2Images = [
        "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1564186763535-ebb50fd419e1?q=80&w=2000&auto=format&fit=crop"
    ];

    const lot3Images = [
        "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580234811497-9df7fd2f3570?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
    ];

    const lot4Images = [
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1543857778-c4a1a3e0f2eb?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520697830682-8f1cebb1bb56?q=80&w=2000&auto=format&fit=crop"
    ];

    const [currentImage1, setCurrentImage1] = useState(0);
    const [currentImage2, setCurrentImage2] = useState(0);
    const [currentImage3, setCurrentImage3] = useState(0);
    const [currentImage4, setCurrentImage4] = useState(0);

    const nextImage1 = () => setCurrentImage1((prev) => (prev + 1) % lot1Images.length);
    const prevImage1 = () => setCurrentImage1((prev) => (prev - 1 + lot1Images.length) % lot1Images.length);

    const nextImage2 = () => setCurrentImage2((prev) => (prev + 1) % lot2Images.length);
    const prevImage2 = () => setCurrentImage2((prev) => (prev - 1 + lot2Images.length) % lot2Images.length);

    const nextImage3 = () => setCurrentImage3((prev) => (prev + 1) % lot3Images.length);
    const prevImage3 = () => setCurrentImage3((prev) => (prev - 1 + lot3Images.length) % lot3Images.length);

    const nextImage4 = () => setCurrentImage4((prev) => (prev + 1) % lot4Images.length);
    const prevImage4 = () => setCurrentImage4((prev) => (prev - 1 + lot4Images.length) % lot4Images.length);
    return (
        <section className="relative w-full min-h-screen bg-[#080808] pt-20 pb-20">
            <div className="max-w-[1800px] mx-auto flex flex-col gap-20 py-10 px-6 md:px-12">
            
            {/* LOT 01 */}
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#212121]">
                
                {/* ── Left Column: Featured Auction ──────────────────────────────── */}
                <div className="relative flex-1 bg-[#111] overflow-hidden">
                    <img 
                        src={lot1Images[currentImage1]} 
                        alt="Match-Worn 2023 World Cup Jersey" 
                        key={currentImage1}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 object-top"
                    />
                    
                    {/* Image Navigation */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-30 pointer-events-none">
                        {currentImage1 > 0 ? (
                            <button 
                                onClick={prevImage1}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-left-linear" width="24" />
                            </button>
                        ) : <div />}
                        {currentImage1 < lot1Images.length - 1 ? (
                            <button 
                                onClick={nextImage1}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-right-linear" width="24" />
                            </button>
                        ) : <div />}
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                        {lot1Images.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentImage1(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage1 ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                    
                    {/* Gradient Overlay for Text Readability */}
                    

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        
                        
                        {/* Badges removed */}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                            </div>
                            <div className="text-left md:text-right shrink-0">
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#212121] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Virat Kohli" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-xl" />
                                <div className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
                                    <span className="text-white text-[6px] font-bold">✓</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white text-base font-medium tracking-tight">Virat Kohli</h3>
                                <p className="text-neutral-500 text-xs">@virat.kohli</p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="px-6 py-4">
                        <h2 className="serif text-white text-xl tracking-tight leading-snug mb-3 uppercase">
                            Match-Worn 2023 World Cup Jersey — Signed
                        </h2>
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">Item Details</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed">
                            An exceptionally rare, match-worn example of the 2023 Cricket World Cup jersey. Featuring Virat Kohli's authentic signature on the front. Accompanied by original authentication papers and photographic proof.
                        </p>
                    </div>

                    {/* Interaction & Timer */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-neutral-400">
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                                <IIcon icon="solar:heart-linear" width="18" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">1.2k</span>
                            </button>
                            <button className="flex items-center hover:text-white transition-colors">
                                <IIcon icon="solar:share-circle-linear" width="18" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300">
                            <IIcon icon="solar:clock-circle-linear" width="18" className="text-neutral-500" />
                            <span className="font-mono text-sm tracking-tight text-white/90">04h 12m 39s</span>
                        </div>
                    </div>

                    {/* Bidding Info */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-end justify-between">
                        <div>
                            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                                Next Bid
                            </p>
                            <div className="text-white font-mono text-lg font-light">
                                ₹85,000
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-neutral-500 text-[10px] uppercase font-semibold flex items-center justify-end gap-1.5 font-mono">
                                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                Starting Bid
                            </p>
                            <div className="text-neutral-400 font-mono text-lg font-light">
                                ₹50,000
                            </div>
                        </div>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <Link 
                                to="/auctions/live" 
                                className="bg-white text-black px-6 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center"
                            >
                                Place Bid
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Bidder 1 (Highest) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/10" />
                                    <div>
                                        <h5 className="text-white text-[12px] font-medium">@marcus_t</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">Just now</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#D4AF37] text-sm font-mono">₹84,000</p>
                                </div>
                            </div>

                            {/* Bidder 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-400 text-xs text-base">S</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-300 text-[12px] font-medium">@sarah_kl</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">2m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-mono">₹82,500</p>
                                </div>
                            </div>

                            {/* Bidder 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5 opacity-80" />
                                    <div>
                                        <h5 className="text-neutral-400 text-[12px] font-medium">@james_w</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">15m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-300 text-sm font-mono">₹80,000</p>
                                </div>
                            </div>

                            {/* Bidder 4 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-500 text-xs text-base">M</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-500 text-[12px] font-medium">@mike_r</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">1h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-sm font-mono">₹78,500</p>
                                </div>
                            </div>

                            {/* Bidder 5 (Faded) */}
                            <div className="flex items-center justify-between opacity-30 grayscale">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5" />
                                    <div>
                                        <h5 className="text-neutral-600 text-[12px] font-medium">@laura_v</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">3h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-600 text-sm font-mono">₹75,000</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* LOT 02 */}
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#212121]">
                
                {/* ── Left Column: Featured Auction ──────────────────────────────── */}
                <div className="relative flex-1 bg-[#111] overflow-hidden">
                    <img 
                        src={lot2Images[currentImage2]}
                        alt="1998 Custom Painted Stratocaster" 
                        key={currentImage2}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500"
                    />

                    {/* Image Navigation */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-30 pointer-events-none">
                        {currentImage2 > 0 ? (
                            <button 
                                onClick={prevImage2}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-left-linear" width="24" />
                            </button>
                        ) : <div />}
                        {currentImage2 < lot2Images.length - 1 ? (
                            <button 
                                onClick={nextImage2}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-right-linear" width="24" />
                            </button>
                        ) : <div />}
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                        {lot2Images.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentImage2(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage2 ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                    
                    {/* Gradient Overlay for Text Readability */}
                    

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        
                        
                        {/* Badges removed */}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                            </div>
                            <div className="text-left md:text-right shrink-0">
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#212121] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1516280440502-d2fdaa0bf5e2?q=80&w=200&auto=format&fit=crop" alt="Jane Doe" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-xl" />
                                <div className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
                                    <span className="text-white text-[6px] font-bold">✓</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white text-base font-medium tracking-tight">Jane Doe</h3>
                                <p className="text-neutral-500 text-xs">@jane_doe</p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="px-6 py-4">
                        <h2 className="serif text-white text-xl tracking-tight leading-snug mb-3 uppercase">
                            1998 Custom Stratocaster — Studio Used
                        </h2>
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">Item Details</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed">
                            Played extensively during the recording sessions for their multi-platinum album. Body features custom hand-painted artwork. Comes fully authenticated by the artist's estate.
                        </p>
                    </div>

                    {/* Interaction & Timer */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-neutral-400">
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                                <IIcon icon="solar:heart-linear" width="18" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">8.4k</span>
                            </button>
                            <button className="flex items-center hover:text-white transition-colors">
                                <IIcon icon="solar:share-circle-linear" width="18" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300">
                            <IIcon icon="solar:clock-circle-linear" width="18" className="text-neutral-500" />
                            <span className="font-mono text-sm tracking-tight text-white/90">01h 45m 12s</span>
                        </div>
                    </div>

                    {/* Bidding Info */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-end justify-between">
                        <div>
                            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                                Next Bid
                            </p>
                            <div className="text-white font-mono text-lg font-light">
                                ₹215,000
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-neutral-500 text-[10px] uppercase font-semibold flex items-center justify-end gap-1.5 font-mono">
                                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                Starting Bid
                            </p>
                            <div className="text-neutral-400 font-mono text-lg font-light">
                                ₹150,000
                            </div>
                        </div>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <Link 
                                to="/auctions/live" 
                                className="bg-white text-black px-6 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center"
                            >
                                Place Bid
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Bidder 1 (Highest) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/10" />
                                    <div>
                                        <h5 className="text-white text-[12px] font-medium">@alex_b</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">Just now</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#D4AF37] text-sm font-mono">₹210,000</p>
                                </div>
                            </div>

                            {/* Bidder 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-400 text-xs text-base">J</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-300 text-[12px] font-medium">@jason_k</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">4m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-mono">₹205,500</p>
                                </div>
                            </div>

                            {/* Bidder 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5 opacity-80" />
                                    <div>
                                        <h5 className="text-neutral-400 text-[12px] font-medium">@emily_r</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">12m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-300 text-sm font-mono">₹200,000</p>
                                </div>
                            </div>

                            {/* Bidder 4 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-500 text-xs text-base">C</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-500 text-[12px] font-medium">@chris_89</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">28m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-sm font-mono">₹195,000</p>
                                </div>
                            </div>

                            {/* Bidder 5 (Faded) */}
                            <div className="flex items-center justify-between opacity-30 grayscale">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5" />
                                    <div>
                                        <h5 className="text-neutral-600 text-[12px] font-medium">@david_m</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">2h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-600 text-sm font-mono">₹190,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOT 03 */}
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#212121]">
                
                {/* ── Left Column: Featured Auction ──────────────────────────────── */}
                <div className="relative flex-1 bg-[#111] overflow-hidden">
                    <img 
                        src={lot3Images[currentImage3]} 
                        alt="Vintage 1960s Desk Lamp" 
                        key={currentImage3}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500"
                    />
                    
                    {/* Image Navigation */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-30 pointer-events-none">
                        {currentImage3 > 0 ? (
                            <button 
                                onClick={prevImage3}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-left-linear" width="24" />
                            </button>
                        ) : <div />}
                        {currentImage3 < lot3Images.length - 1 ? (
                            <button 
                                onClick={nextImage3}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-right-linear" width="24" />
                            </button>
                        ) : <div />}
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                        {lot3Images.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentImage3(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage3 ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                    
                    {/* Gradient Overlay for Text Readability */}
                    

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        
                        
                        {/* Badges removed */}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                            </div>
                            <div className="text-left md:text-right shrink-0">
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#212121] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=200&auto=format&fit=crop" alt="Mark Studio" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-xl" />
                                <div className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
                                    <span className="text-white text-[6px] font-bold">✓</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white text-base font-medium tracking-tight">Mark Studio</h3>
                                <p className="text-neutral-500 text-xs">@mark_antiques</p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="px-6 py-4">
                        <h2 className="serif text-white text-xl tracking-tight leading-snug mb-3 uppercase">
                            Mid-Century Modern Desk Lamp
                        </h2>
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">Item Details</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed">
                            An original restored piece from the early 1960s. Features a distinct brass finish and minimalist industrial design, completely rewired for modern safety standards.
                        </p>
                    </div>

                    {/* Interaction & Timer */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-neutral-400">
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                                <IIcon icon="solar:heart-linear" width="18" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">942</span>
                            </button>
                            <button className="flex items-center hover:text-white transition-colors">
                                <IIcon icon="solar:share-circle-linear" width="18" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300">
                            <IIcon icon="solar:clock-circle-linear" width="18" className="text-neutral-500" />
                            <span className="font-mono text-sm tracking-tight text-white/90">06h 20m 15s</span>
                        </div>
                    </div>

                    {/* Bidding Info */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-end justify-between">
                        <div>
                            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                                Next Bid
                            </p>
                            <div className="text-white font-mono text-lg font-light">
                                ₹22,500
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-neutral-500 text-[10px] uppercase font-semibold flex items-center justify-end gap-1.5 font-mono">
                                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                Starting Bid
                            </p>
                            <div className="text-neutral-400 font-mono text-lg font-light">
                                ₹10,000
                            </div>
                        </div>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <Link 
                                to="/auctions/live" 
                                className="bg-white text-black px-6 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center"
                            >
                                Place Bid
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Bidder 1 (Highest) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/10">
                                        <span className="text-white text-xs">R</span>
                                    </div>
                                    <div>
                                        <h5 className="text-white text-[12px] font-medium">@retro_man</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">Just now</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#D4AF37] text-sm font-mono">₹22,000</p>
                                </div>
                            </div>

                            {/* Bidder 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5 opacity-80" />
                                    <div>
                                        <h5 className="text-neutral-300 text-[12px] font-medium">@susan_w</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">5m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-mono">₹20,500</p>
                                </div>
                            </div>

                            {/* Bidder 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-400 text-xs text-base">T</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-400 text-[12px] font-medium">@thomas_builds</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">22m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-300 text-sm font-mono">₹18,000</p>
                                </div>
                            </div>

                            {/* Bidder 4 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-700 text-xs text-base">E</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-500 text-[12px] font-medium">@erica_99</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">1h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-sm font-mono">₹15,000</p>
                                </div>
                            </div>

                            {/* Bidder 5 (Faded) */}
                            <div className="flex items-center justify-between opacity-30 grayscale">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5" />
                                    <div>
                                        <h5 className="text-neutral-600 text-[12px] font-medium">@john_doe</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">4h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-600 text-sm font-mono">₹12,500</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOT 04 */}
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#212121]">
                
                {/* ── Left Column: Featured Auction ──────────────────────────────── */}
                <div className="relative flex-1 bg-[#111] overflow-hidden">
                    <img 
                        src={lot4Images[currentImage4]} 
                        alt="Handcrafted Leather Messenger Bag" 
                        key={currentImage4}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500"
                    />
                    
                    {/* Image Navigation */}
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-30 pointer-events-none">
                        {currentImage4 > 0 ? (
                            <button 
                                onClick={prevImage4}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-left-linear" width="24" />
                            </button>
                        ) : <div />}
                        {currentImage4 < lot4Images.length - 1 ? (
                            <button 
                                onClick={nextImage4}
                                className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-lg"
                            >
                                <IIcon icon="solar:alt-arrow-right-linear" width="24" />
                            </button>
                        ) : <div />}
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                        {lot4Images.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentImage4(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImage4 ? 'bg-white w-5' : 'bg-white/30 w-1.5 hover:bg-white/60'}`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                    
                    {/* Gradient Overlay for Text Readability */}
                    

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        
                        
                        {/* Badges removed */}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                            </div>
                            <div className="text-left md:text-right shrink-0">
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#212121] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="Artisan Crafts" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-xl" />
                            </div>
                            <div>
                                <h3 className="text-white text-base font-medium tracking-tight">Artisan Crafts</h3>
                                <p className="text-neutral-500 text-xs">@artisan_leather</p>
                            </div>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="px-6 py-4">
                        <h2 className="serif text-white text-xl tracking-tight leading-snug mb-3 uppercase">
                            Handcrafted Leather Messenger Bag
                        </h2>
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">Item Details</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed">
                            Precision hand-stitched from premium Italian full-grain leather. Designed for durability and timeless style, featuring solid brass hardware and meticulous detailing.
                        </p>
                    </div>

                    {/* Interaction & Timer */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-neutral-400">
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                                <IIcon icon="solar:heart-linear" width="18" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">1.8k</span>
                            </button>
                            <button className="flex items-center hover:text-white transition-colors">
                                <IIcon icon="solar:share-circle-linear" width="18" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-300">
                            <IIcon icon="solar:clock-circle-linear" width="18" className="text-neutral-500" />
                            <span className="font-mono text-sm tracking-tight text-white/90">11h 05m 12s</span>
                        </div>
                    </div>

                    {/* Bidding Info */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-end justify-between">
                        <div>
                            <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">
                                Next Bid
                            </p>
                            <div className="text-white font-mono text-lg font-light">
                                ₹36,000
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-neutral-500 text-[10px] uppercase font-semibold flex items-center justify-end gap-1.5 font-mono">
                                <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                Starting Bid
                            </p>
                            <div className="text-neutral-400 font-mono text-lg font-light">
                                ₹18,000
                            </div>
                        </div>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                                <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                            </div>
                            <Link 
                                to="/auctions/live" 
                                className="bg-white text-black px-6 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center"
                            >
                                Place Bid
                            </Link>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Bidder 1 (Highest) */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/10" />
                                    <div>
                                        <h5 className="text-white text-[12px] font-medium">@jessica_p</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">Just now</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#D4AF37] text-sm font-mono">₹35,500</p>
                                </div>
                            </div>

                            {/* Bidder 2 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-400 text-xs text-base">G</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-300 text-[12px] font-medium">@greg_style</h5>
                                        <p className="text-neutral-500 text-[9px] uppercase font-semibold mt-0.5">12m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-white text-sm font-mono">₹34,000</p>
                                </div>
                            </div>

                            {/* Bidder 3 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=150&auto=format&fit=crop" alt="Bidder" className="w-11 h-11 rounded-full object-cover border-2 border-white/5 opacity-80" />
                                    <div>
                                        <h5 className="text-neutral-400 text-[12px] font-medium">@mark_ryan</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">34m ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-300 text-sm font-mono">₹31,500</p>
                                </div>
                            </div>

                            {/* Bidder 4 */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-500 text-xs text-base">A</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-500 text-[12px] font-medium">@anna_leather</h5>
                                        <p className="text-neutral-600 text-[9px] uppercase font-semibold mt-0.5">2h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-500 text-sm font-mono">₹29,000</p>
                                </div>
                            </div>

                            {/* Bidder 5 (Faded) */}
                            <div className="flex items-center justify-between opacity-30 grayscale">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-white/5">
                                        <span className="text-neutral-500 text-xs text-base">K</span>
                                    </div>
                                    <div>
                                        <h5 className="text-neutral-600 text-[12px] font-medium">@kevin_p</h5>
                                        <p className="text-neutral-700 text-[9px] uppercase font-semibold mt-0.5">5h ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-600 text-sm font-mono">₹25,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        </section>
    );
}
