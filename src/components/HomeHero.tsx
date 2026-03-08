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
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#0A0A0A]">
                
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
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none"></div>

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        {/* Uploader Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" alt="Virat Kohli" className="w-12 h-12 rounded-full object-cover shadow-lg transition-transform" />
                            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md">Virat Kohli</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white text-[#002f5d] px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-md">
                                <span className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full animate-pulse"></span>
                                LIVE
                            </div>
                            <div className="bg-[#2a2a2a] border border-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest shadow-md">
                                Lot 01
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                                <h1 className="serif text-white text-4xl md:text-5xl tracking-tight leading-tight mb-4 uppercase">
                                    Match-Worn 2023 World Cup Jersey — Signed
                                </h1>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed hidden md:block">
                                    An exceptionally rare, match-worn example of the 2023 Cricket World Cup jersey. Featuring Virat Kohli's authentic signature on the front. Accompanied by original authentication papers and photographic proof.
                                </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">
                                    Current Bid
                                </p>
                                <div className="text-white font-mono text-4xl md:text-5xl font-light mb-1.5">
                                    ₹84,000
                                </div>
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold flex items-center justify-start md:justify-end gap-1.5">
                                    <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                    Starting Bid ₹50,000
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-6">
                            <div className="flex items-center gap-6 text-neutral-400">
                                <button className="flex items-center gap-2 hover:text-white transition-colors">
                                    <IIcon icon="solar:heart-linear" width="20" />
                                    <span className="text-xs font-medium">1.2k</span>
                                </button>
                                <button className="flex items-center hover:text-white transition-colors">
                                    <IIcon icon="solar:share-circle-linear" width="20" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <IIcon icon="solar:clock-circle-linear" width="18" />
                                    <span className="font-mono text-sm">04h 12m 39s</span>
                                </div>
                                <Link 
                                    to="/auctions/live" 
                                    className="bg-white text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center shadow-lg"
                                >
                                    Place Bid
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0A0A0A] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-6">
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

                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="text-center">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">12</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Posts</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">4</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Lots</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">8.2M</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Followers</div>
                            </div>
                        </div>
                    </div>

                    {/* Curator Bio */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">About</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed mb-2">
                            Virat Kohli is widely regarded as one of the greatest batsmen in the history of cricket. Known for his aggressive batting style and unyielding passion on the field, he has set numerous records across all formats of the game.
                        </p>
                        <p className="text-neutral-400 text-[10px] leading-relaxed">
                            This exclusive collection features match-worn gear, signed memorabilia, and personal items directly from his personal archives.
                        </p>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
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
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#0A0A0A]">
                
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
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none"></div>

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        {/* Uploader Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1516280440502-d2fdaa0bf5e2?q=80&w=200&auto=format&fit=crop" alt="Jane Doe" className="w-12 h-12 rounded-full object-cover shadow-lg transition-transform" />
                            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md">Jane Doe</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white text-[#002f5d] px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-md">
                                <span className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full animate-pulse"></span>
                                LIVE
                            </div>
                            <div className="bg-[#2a2a2a] border border-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest shadow-md">
                                Lot 02
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                                <h1 className="serif text-white text-4xl md:text-5xl tracking-tight leading-tight mb-4 uppercase">
                                    1998 Custom Stratocaster — Studio Used
                                </h1>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed hidden md:block">
                                    Played extensively during the recording sessions for their multi-platinum album. Body features custom hand-painted artwork. Comes fully authenticated by the artist's estate.
                                </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">
                                    Current Bid
                                </p>
                                <div className="text-white font-mono text-4xl md:text-5xl font-light mb-1.5">
                                    ₹210,000
                                </div>
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold flex items-center justify-start md:justify-end gap-1.5">
                                    <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                    Starting Bid ₹150,000
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-6">
                            <div className="flex items-center gap-6 text-neutral-400">
                                <button className="flex items-center gap-2 hover:text-white transition-colors">
                                    <IIcon icon="solar:heart-linear" width="20" />
                                    <span className="text-xs font-medium">8.4k</span>
                                </button>
                                <button className="flex items-center hover:text-white transition-colors">
                                    <IIcon icon="solar:share-circle-linear" width="20" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <IIcon icon="solar:clock-circle-linear" width="18" />
                                    <span className="font-mono text-sm">01h 45m 12s</span>
                                </div>
                                <Link 
                                    to="/auctions/live" 
                                    className="bg-white text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center shadow-lg"
                                >
                                    Place Bid
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0A0A0A] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-6">
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

                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="text-center">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">84</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Posts</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">31</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Lots</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">4.1M</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Followers</div>
                            </div>
                        </div>
                    </div>

                    {/* Curator Bio */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">About</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed mb-2">
                            Jane Doe is an internationally recognized session guitarist who has collaborated with top names in the rock and blues industries over her 25-year career.
                        </p>
                        <p className="text-neutral-400 text-[10px] leading-relaxed">
                            Her curated vault offers a rare glimpse into studio-used instruments, custom pedalboards, and historically significant musical artifacts.
                        </p>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
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
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#0A0A0A]">
                
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
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none"></div>

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        {/* Uploader Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=200&auto=format&fit=crop" alt="Mark Studio" className="w-12 h-12 rounded-full object-cover shadow-lg transition-transform" />
                            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md">Mark Studio</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white text-[#002f5d] px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-md">
                                <span className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full animate-pulse"></span>
                                LIVE
                            </div>
                            <div className="bg-[#2a2a2a] border border-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest shadow-md">
                                Lot 03
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                                <h1 className="serif text-white text-4xl md:text-5xl tracking-tight leading-tight mb-4 uppercase">
                                    Mid-Century Modern Desk Lamp
                                </h1>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed hidden md:block">
                                    An original restored piece from the early 1960s. Features a distinct brass finish and minimalist industrial design, completely rewired for modern safety standards.
                                </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">
                                    Current Bid
                                </p>
                                <div className="text-white font-mono text-4xl md:text-5xl font-light mb-1.5">
                                    ₹22,000
                                </div>
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold flex items-center justify-start md:justify-end gap-1.5">
                                    <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                    Starting Bid ₹10,000
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-6">
                            <div className="flex items-center gap-6 text-neutral-400">
                                <button className="flex items-center gap-2 hover:text-white transition-colors">
                                    <IIcon icon="solar:heart-linear" width="20" />
                                    <span className="text-xs font-medium">942</span>
                                </button>
                                <button className="flex items-center hover:text-white transition-colors">
                                    <IIcon icon="solar:share-circle-linear" width="20" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <IIcon icon="solar:clock-circle-linear" width="18" />
                                    <span className="font-mono text-sm">06h 20m 15s</span>
                                </div>
                                <Link 
                                    to="/auctions/live" 
                                    className="bg-white text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center shadow-lg"
                                >
                                    Place Bid
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0A0A0A] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-6">
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

                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="text-center">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">340</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Posts</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">88</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Lots</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">12.4K</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Followers</div>
                            </div>
                        </div>
                    </div>

                    {/* Curator Bio */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">About</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed mb-2">
                            Specializing in mid-century artifacts and industrial design history. We restore items to gallery condition while maintaining their original character.
                        </p>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
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
            <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-200px)] min-h-[600px] border border-white/10 rounded-sm overflow-hidden shadow-2xl snap-start bg-[#0A0A0A]">
                
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
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent pointer-events-none"></div>

                    {/* Top Elements */}
                    <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
                        {/* Uploader Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="Artisan Crafts" className="w-12 h-12 rounded-full object-cover shadow-lg transition-transform" />
                            <span className="text-white text-sm font-semibold tracking-wide drop-shadow-md">Artisan Crafts</span>
                        </div>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-3">
                            <div className="bg-white text-[#002f5d] px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-md">
                                <span className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full animate-pulse"></span>
                                LIVE
                            </div>
                            <div className="bg-[#2a2a2a] border border-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-medium tracking-widest shadow-md">
                                Lot 04
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 flex flex-col justify-end">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-2xl">
                                <h1 className="serif text-white text-4xl md:text-5xl tracking-tight leading-tight mb-4 uppercase">
                                    Handcrafted Leather Messenger Bag
                                </h1>
                                <p className="text-neutral-400 text-sm md:text-base leading-relaxed hidden md:block">
                                    Precision hand-stitched from premium Italian full-grain leather. Designed for durability and timeless style, featuring solid brass hardware and meticulous detailing.
                                </p>
                            </div>
                            <div className="text-left md:text-right shrink-0">
                                <p className="text-neutral-500 text-[10px] uppercase tracking-widest mb-1">
                                    Current Bid
                                </p>
                                <div className="text-white font-mono text-4xl md:text-5xl font-light mb-1.5">
                                    ₹35,500
                                </div>
                                <p className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold flex items-center justify-start md:justify-end gap-1.5">
                                    <span className="w-1 h-1 bg-neutral-500 rounded-full"></span>
                                    Starting Bid ₹18,000
                                </p>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 gap-6">
                            <div className="flex items-center gap-6 text-neutral-400">
                                <button className="flex items-center gap-2 hover:text-white transition-colors">
                                    <IIcon icon="solar:heart-linear" width="20" />
                                    <span className="text-xs font-medium">1.8k</span>
                                </button>
                                <button className="flex items-center hover:text-white transition-colors">
                                    <IIcon icon="solar:share-circle-linear" width="20" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto gap-8">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <IIcon icon="solar:clock-circle-linear" width="18" />
                                    <span className="font-mono text-sm">11h 05m 12s</span>
                                </div>
                                <Link 
                                    to="/auctions/live" 
                                    className="bg-white text-black px-10 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-neutral-200 transition-colors duration-300 text-center shadow-lg"
                                >
                                    Place Bid
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Sidebar ────────────────────────────────────────── */}
                <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#0A0A0A] border-l border-white/5 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Curator Profile */}
                    <div className="px-6 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="Artisan Crafts" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-xl" />
                            </div>
                            <div>
                                <h3 className="text-white text-base font-medium tracking-tight">Artisan Crafts</h3>
                                <p className="text-neutral-500 text-xs">@artisan_leather</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <div className="text-center">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">89</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Posts</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">12</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Lots</div>
                            </div>
                            <div className="text-center border-l border-white/10">
                                <div className="text-white font-mono text-lg mb-0.5 truncate">45K</div>
                                <div className="text-neutral-500 text-[8px] uppercase tracking-widest font-semibold">Followers</div>
                            </div>
                        </div>
                    </div>

                    {/* Curator Bio */}
                    <div className="px-6 py-4 border-b border-white/5">
                        <h4 className="text-neutral-500 text-[9px] uppercase tracking-widest font-semibold mb-2 block">About</h4>
                        <p className="text-neutral-300 text-[12px] leading-relaxed mb-2">
                            A collective of independent leatherworkers crafting bespoke, heirloom-quality goods. We use traditional techniques and ethically sourced materials for every piece.
                        </p>
                    </div>

                    {/* Live Bidding Feed */}
                    <div className="p-6 flex-1 bg-[#080808]/50 overflow-y-auto no-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="text-neutral-500 text-[10px] uppercase tracking-widest font-semibold block">Live Bidding</h4>
                            <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
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

        {/* Navigation Arrows */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
                <button 
                    onClick={() => window.scrollBy({ top: -(window.innerHeight - 120), behavior: 'smooth' })}
                    className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 shadow-xl"
                    aria-label="Previous Lot"
                >
                    <IIcon icon="solar:alt-arrow-up-linear" width="20" />
                </button>
                <button 
                    onClick={() => window.scrollBy({ top: window.innerHeight - 120, behavior: 'smooth' })}
                    className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300 shadow-xl"
                    aria-label="Next Lot"
                >
                    <IIcon icon="solar:alt-arrow-down-linear" width="20" />
                </button>
            </div>
        </section>
    );
}
