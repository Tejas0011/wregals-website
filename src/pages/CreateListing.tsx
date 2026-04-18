// @ts-nocheck
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import IIcon from '../components/IIcon';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
 { id: 'sports', name: 'Sports', color: '#3B82F6' },
 { id: 'cinema', name: 'Cinema', color: '#EC4899' },
 { id: 'musicians', name: 'Musicians & Artists', color: '#8B5CF6' },
 { id: 'creators', name: 'Content Creators', color: '#10B981' },
 { id: 'athletes', name: 'Athletes', color: '#F59E0B' },
 { id: 'tv-stars', name: 'TV & OTT Stars', color: '#F43F5E' },
 { id: 'comedians', name: 'Stand-up & Comedy', color: '#06B6D4' },
 { id: 'fashion', name: 'Fashion', color: '#D946EF' },
 { id: 'entrepreneurs', name: 'Entrepreneurs', color: '#14B8A6' },
 { id: 'others', name: 'Others', color: '#3b82f6' },
];

const CAUSE_TAGS = [
 'Children', 'Education', 'Health', 'Environment',
 'Animals', 'Disaster Relief', 'Poverty', 'Women & Girls', 'Veterans', 'Other',
];

const CHARITY_SPLITS = [25, 50, 75, 100];

const CONDITIONS = [
 { id: 'match-worn', label: 'Match-Worn', desc: 'Used during an official match or event' },
 { id: 'signed', label: 'Signed', desc: 'Authenticated signature present' },
 { id: 'original', label: 'Original / Vintage', desc: 'First edition or historically significant' },
 { id: 'limited-edition', label: 'Limited Edition', desc: 'Official limited-run item' },
 { id: 'other', label: 'Other', desc: 'Does not fit the above categories' },
];

const QUICK_DURATIONS = [
 { label: '12h', hours: 12 },
 { label: '24h', hours: 24 },
 { label: '48h', hours: 48 },
 { label: '72h', hours: 72 },
 { label: '96h', hours: 96 },
];

const POPULAR_CELEBS = [
 { name: 'Virat Kohli', username: '@virat.kohli' },
 { name: 'MS Dhoni', username: '@mahi7781' },
 { name: 'AR Rahman', username: '@arrahman' },
 { name: 'Ranveer Singh', username: '@ranveersingh' },
 { name: 'Deepika Padukone', username: '@deepikapadukone' },
 { name: 'Sachin Tendulkar', username: '@sachintendulkar' },
 { name: 'Priyanka Chopra', username: '@priyankachopra' },
 { name: 'Shah Rukh Khan', username: '@iamsrk' },
 { name: 'Alia Bhatt', username: '@aliaabhatt' },
 { name: 'Bhuvan Bam', username: '@bhuvan.bam22' },
 { name: 'CarryMinati', username: '@carryminati' },
 { name: 'Zakir Khan', username: '@zakirkhan_208' }
];

interface FormData {
 photos: File[];
 title: string;
 category: string;
 condition: string;
 description: string;
 celebrity: string;
 hasCert: boolean;
 certDetails: string;
 startingBid: string;
 bidIncrement: string;
 hasReserve: boolean;
 reservePrice: string;
 startDate: string;
 startTime: string;
 durationHours: string;
 // Charity fields
 isCharity: boolean;
 ngoName: string;
 ngoRegNumber: string;
 charityPercent: number;
 causeTag: string;
}

function PhotoUploadZone({ photos, setPhotos }: { photos: File[]; setPhotos: (f: File[]) => void }) {
 const inputRef = useRef<HTMLInputElement>(null);
 const [dragging, setDragging] = useState(false);

 const addFiles = (files: FileList | null) => {
 if (!files) return;
 const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
 setPhotos([...photos, ...newFiles].slice(0, 8));
 };

 const onDrop = useCallback((e: React.DragEvent) => {
 e.preventDefault();
 setDragging(false);
 addFiles(e.dataTransfer.files);
 }, [photos]);

 const removePhoto = (idx: number) => {
 setPhotos(photos.filter((_, i) => i !== idx));
 };

 return (
 <div className="space-y-4">
 {/* Drop Zone */}
 <div
 onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
 onDragLeave={() => setDragging(false)}
 onDrop={onDrop}
 onClick={() => inputRef.current?.click()}
 className={`border-2 border-dashed rounded-sm cursor-pointer transition-all flex flex-col items-center justify-center gap-3 py-12 select-none
 ${dragging ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/25 hover:bg-white/[0.02]'}`}
 >
 <IIcon icon="solar:gallery-add-linear" width="36" className="text-neutral-600" />
 <div className="text-center">
 <p className="text-sm text-neutral-300 font-light">Drop photos here or <span className="text-white underline underline-offset-2">browse files</span></p>
 <p className="text-[11px] text-neutral-600 mt-1">Up to 8 images · JPG, PNG, WEBP · Max 10MB each</p>
 </div>
 <input
 ref={inputRef}
 type="file"
 multiple
 accept="image/*"
 className="hidden"
 onChange={(e) => addFiles(e.target.files)}
 />
 </div>

 {/* Preview Grid */}
 {photos.length > 0 && (
 <div className="grid grid-cols-4 gap-3">
 {photos.map((file, idx) => (
 <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-white/10">
 <img
 src={URL.createObjectURL(file)}
 alt={`Photo ${idx + 1}`}
 className="w-full h-full object-cover"
 />
 {idx === 0 && (
 <span className="absolute top-1.5 left-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
 Primary
 </span>
 )}
 <button
 onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
 className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
 >
 <IIcon icon="solar:close-square-linear" width="12" className="text-white" />
 </button>
 </div>
 ))}
 {photos.length < 8 && (
 <div
 onClick={() => inputRef.current?.click()}
 className="aspect-square rounded-sm border border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition-colors"
 >
 <IIcon icon="solar:add-square-linear" width="22" className="text-neutral-600" />
 </div>
 )}
 </div>
 )}
 </div>
 );
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
 return (
 <div className="bg-[#0d0d0d] border border-white/5 rounded-sm p-7">
 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
 <IIcon icon={icon} width="18" className="text-blue-400" />
 <h2 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-400">{title}</h2>
 </div>
 {children}
 </div>
 );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
 return (
 <label className="block text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">
 {children}
 {required && <span className="text-blue-400 ml-1">*</span>}
 </label>
 );
}

function Input({ ...props }) {
 return (
 <input
 {...props}
 className={`w-full bg-[#111] border border-white/8 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors font-light ${props.className || ''}`}
 />
 );
}

function Textarea({ ...props }) {
 return (
 <textarea
 {...props}
 className={`w-full bg-[#111] border border-white/8 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors resize-none font-light leading-relaxed ${props.className || ''}`}
 />
 );
}

function Select({ children, ...props }) {
 return (
 <select
 {...props}
 className="w-full bg-[#111] border border-white/8 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/20 transition-colors font-light appearance-none cursor-pointer"
 >
 {children}
 </select>
 );
}

function PriceInput({ prefix = '₹', ...props }) {
 return (
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">{prefix}</span>
 <input
 {...props}
 type="number"
 min="0"
 className="w-full bg-[#111] border border-white/8 rounded-sm pl-9 pr-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors"
 />
 </div>
 );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
 return (
 <button
 type="button"
 onClick={() => onChange(!checked)}
 className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-white' : 'bg-white/10'}`}
 >
 <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
 </button>
 );
}

export default function CreateListing({ user }: { user: any }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    photos: [],
    title: '',
    category: '',
    condition: '',
    description: '',
    celebrity: '',
    hasCert: false,
    certDetails: '',
    startingBid: '',
    bidIncrement: '500',
    hasReserve: false,
    reservePrice: '',
    startDate: new Date().toISOString().slice(0, 10),
    startTime: '12:00',
    durationHours: '',
    isCharity: false,
    ngoName: '',
    ngoRegNumber: '',
    charityPercent: 50,
    causeTag: '',
  });

  const [celebFocused, setCelebFocused] = useState(false);
  const filteredCelebs = form.celebrity.trim()
    ? POPULAR_CELEBS.filter(c => 
        (c.name.toLowerCase().includes(form.celebrity.toLowerCase()) || 
         c.username.toLowerCase().includes(form.celebrity.toLowerCase())) && 
         c.username.toLowerCase() !== form.celebrity.toLowerCase()
      )
    : [];

  const set = (key: keyof FormData) => (val: any) => setForm(f => ({ ...f, [key]: val }));
  const setVal = (key: keyof FormData) => (e: any) => set(key)(e.target.value);

  // Compute end date from startDate + startTime + durationHours
  const computedEndDate = (() => {
    if (!form.startDate || !form.startTime || !form.durationHours || Number(form.durationHours) <= 0) return null;
    const d = new Date(`${form.startDate}T${form.startTime}`);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() + Math.min(Number(form.durationHours), 96));
    return d;
  })();

  const validate = () => {
    const baseValid = form.photos.length > 0 && form.title.trim() && form.category && form.condition && form.celebrity.trim()
      && form.startingBid && Number(form.startingBid) > 0 && form.startDate && form.startTime && form.durationHours && Number(form.durationHours) > 0 && Number(form.durationHours) <= 96;
    
    if (form.hasCert && !form.certDetails.trim()) return false;
    if (form.isCharity && (!form.ngoName.trim() || !form.causeTag)) return false;
    return !!baseValid;
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of form.photos) {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, file, { upsert: false });
      if (error) throw new Error(`Photo upload failed: ${error.message}`);
      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const submitListing = async (status: 'live' | 'draft') => {
    if (status === 'live' && !validate()) {
      setSubmitError('Please fill in all required fields (photos, title, category, condition, starting bid, end date).');
      return;
    }
    if (!user) {
      setSubmitError('You must be signed in to create a listing.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const imageUrls = form.photos.length > 0 ? await uploadPhotos() : [];
      const startsAt = form.startDate && form.startTime
        ? new Date(`${form.startDate}T${form.startTime}`).toISOString()
        : new Date().toISOString();
      const endsAt = computedEndDate ? computedEndDate.toISOString() : null;

      const { error } = await supabase.from('listings').insert({
        seller_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        condition: form.condition,
        celebrity: form.celebrity.trim(),
        images: imageUrls,
        starting_bid: Number(form.startingBid),
        current_bid: Number(form.startingBid),
        bid_increment: Number(form.bidIncrement) || 500,
        reserve_price: form.hasReserve && form.reservePrice ? Number(form.reservePrice) : null,
        starts_at: startsAt,
        ends_at: endsAt,
        status,
        has_cert: form.hasCert,
        cert_details: form.hasCert ? form.certDetails.trim() : null,
      });
      if (error) throw new Error(error.message);
      navigate('/seller/dashboard');
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = () => submitListing('live');
  const handleDraft = () => submitListing('draft');

 return (
 <div className="pt-24 pb-24 px-6 max-w-[860px] mx-auto text-white min-h-screen">

 {/* Header */}
 <div className="flex items-center gap-4 mb-10">
 <button
 onClick={() => navigate('/seller/dashboard')}
 className="text-neutral-500 hover:text-white transition-colors p-1.5"
 >
 <IIcon icon="solar:arrow-left-linear" width="20" />
 </button>
 <div>
 <h1 className="text-2xl font-[300] tracking-widest uppercase">Create Listing</h1>
 <p className="text-neutral-500 text-[11px] tracking-wide mt-0.5">Add a new auction item for bidding</p>
 </div>
 </div>

 <div className="space-y-5">

 {/* ── Listing Type Toggle ── */}
 <SectionCard title="Listing Type" icon="solar:tag-price-bold">
 <div className="grid grid-cols-2 gap-3">
 {/* Standard Auction - active */}
 <button
 type="button"
 onClick={() => set('isCharity')(false)}
 className="text-left px-5 py-4 rounded-sm border transition-all border-blue-500 bg-white/5 text-blue-400"
 >
 <div className="text-xl mb-2">🏷️</div>
 <div className="text-sm font-semibold mb-1">Standard Auction</div>
 <div className="text-[11px] font-light leading-relaxed opacity-80">Seller keeps all proceeds after platform fee.</div>
 </button>

 {/* Charity Auction - Coming Soon */}
 <div className="relative">
 <div className="text-left px-5 py-4 rounded-sm border border-white/5 bg-white/[0.02] text-neutral-600 opacity-50 select-none cursor-not-allowed">
 <div className="text-xl mb-2">♥</div>
 <div className="text-sm font-semibold mb-1">Charity Auction</div>
 <div className="text-[11px] font-light leading-relaxed">Donate a % of winning bid to a verified NGO.</div>
 </div>
 {/* Coming Soon overlay badge */}
 <div className="absolute inset-0 flex items-center justify-center rounded-sm">
 <span className="bg-[#1a1a1a] border border-white/10 text-neutral-300 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full shadow-lg">
 Coming Soon
 </span>
 </div>
 </div>
 </div>
 </SectionCard>

 {/* ── Section 1: Photos ── */}
 <SectionCard title="Photos" icon="solar:gallery-bold">
 <PhotoUploadZone photos={form.photos} setPhotos={set('photos')} />
 <p className="text-[10px] text-neutral-600 mt-3">
 First photo will be the primary listing image. Drag to reorder coming soon.
 </p>
 </SectionCard>

 {/* ── Section 2: Item Details ── */}
 <SectionCard title="Item Details" icon="solar:tag-horizontal-bold">
 <div className="space-y-5">

 {/* Title */}
 <div>
 <Label required>Listing Title</Label>
 <Input
 value={form.title}
 onChange={setVal('title')}
 placeholder="e.g. Match-Worn 2023 World Cup Jersey - Signed"
 maxLength={120}
 />
 <p className="text-[10px] text-neutral-600 mt-1.5">{form.title.length}/120 characters</p>
 </div>

 {/* Category + Condition */}
 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label required>Category</Label>
 <div className="relative">
 <Select value={form.category} onChange={setVal('category')}>
 <option value="" disabled>Select a category</option>
 {CATEGORIES.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </Select>
 <IIcon icon="solar:alt-arrow-down-linear" width="14" className="text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
 </div>
 </div>
 <div>
 <Label required>Item Type / Condition</Label>
 <div className="relative">
 <Select value={form.condition} onChange={setVal('condition')}>
 <option value="" disabled>Select type</option>
 {CONDITIONS.map(c => (
 <option key={c.id} value={c.id}>{c.label}</option>
 ))}
 </Select>
 <IIcon icon="solar:alt-arrow-down-linear" width="14" className="text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
 </div>
 </div>
 </div>

 {/* Celebrity */}
 <div className="relative">
 <Label required>Associated Celebrity / Athlete / Artist</Label>
 <Input
 value={form.celebrity}
 onChange={setVal('celebrity')}
 onFocus={() => setCelebFocused(true)}
 onBlur={() => setTimeout(() => setCelebFocused(false), 200)}
 placeholder="e.g. Virat Kohli, AR Rahman, Ranveer Singh…"
 />
 {celebFocused && form.celebrity.trim() && filteredCelebs.length > 0 && (
 <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-sm shadow-2xl z-20 max-h-48 overflow-y-auto">
 {filteredCelebs.map(c => (
 <button
 key={c.username}
 type="button"
 onMouseDown={(e) => { e.preventDefault(); set('celebrity')(c.username); setCelebFocused(false); }}
 className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.02] last:border-0"
 >
 <div className="text-sm text-neutral-200">{c.name}</div>
 <div className="text-[11px] text-neutral-500 mt-0.5">{c.username}</div>
 </button>
 ))}
 </div>
 )}
 </div>

 {/* Description */}
 <div>
 <Label required>Description</Label>
 <Textarea
 rows={5}
 value={form.description}
 onChange={setVal('description')}
 placeholder="Describe the item - its history, significance, condition, and any notable details that make it special…"
 />
 </div>
 </div>
 </SectionCard>

 {/* ── Section 3: Provenance ── */}
 <SectionCard title="Provenance & Authenticity" icon="solar:shield-check-bold">
 <div className="space-y-5">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-neutral-300 font-light">Certificate of Authenticity (COA)</p>
 <p className="text-[11px] text-neutral-600 mt-0.5">Does this item come with an official COA?</p>
 </div>
 <Toggle checked={form.hasCert} onChange={set('hasCert')} />
 </div>
 {form.hasCert && (
 <div>
 <Label required>COA Details</Label>
 <Textarea
 rows={3}
 value={form.certDetails}
 onChange={setVal('certDetails')}
 placeholder="Issuing authority, certificate number, or other details…"
 />
 </div>
 )}
 </div>
 </SectionCard>

 {/* ── Section 3b: Charity Details (conditional) ── */}
 {form.isCharity && (
 <SectionCard title="Charity Details" icon="solar:heart-bold">
 <div className="space-y-5">
 <div className="flex items-start gap-3 p-4 rounded-sm bg-[#EC4899]/5 border border-[#EC4899]/15">
 <span className="text-[#EC4899] text-lg mt-0.5">♥</span>
 <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
 The NGO you list must be registered with the Indian government (Section 12A / 80G / CSR1).
 Wregals will verify and display the registration details to bidders for trust.
 </p>
 </div>

 {/* NGO Name */}
 <div>
 <Label required>NGO / Beneficiary Organisation</Label>
 <Input
 value={form.ngoName}
 onChange={setVal('ngoName')}
 placeholder="e.g. CRY India, Pratham, GiveIndia…"
 />
 </div>

 {/* Reg number */}
 <div>
 <Label>NGO Registration Number (optional but recommended)</Label>
 <Input
 value={form.ngoRegNumber}
 onChange={setVal('ngoRegNumber')}
 placeholder="80G / 12A / CSR1 registration number"
 />
 <p className="text-[10px] text-neutral-600 mt-1.5">Verified NGOs get a trust badge shown to all bidders.</p>
 </div>

 {/* Cause tag */}
 <div>
 <Label required>Cause Category</Label>
 <div className="flex flex-wrap gap-2">
 {CAUSE_TAGS.map(tag => (
 <button
 key={tag}
 type="button"
 onClick={() => set('causeTag')(tag)}
 className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border rounded-sm transition-colors ${
 form.causeTag === tag
 ? 'border-[#EC4899] text-[#EC4899] bg-[#EC4899]/10'
 : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white hover:bg-white/5'
 }`}
 >
 {tag}
 </button>
 ))}
 </div>
 </div>

 {/* % split */}
 <div>
 <Label required>Proceeds to Charity</Label>
 <div className="flex gap-2">
 {CHARITY_SPLITS.map(pct => (
 <button
 key={pct}
 type="button"
 onClick={() => set('charityPercent')(pct)}
 className={`flex-1 py-3 text-sm font-bold border rounded-sm transition-colors ${
 form.charityPercent === pct
 ? 'border-[#EC4899] text-[#EC4899] bg-[#EC4899]/10'
 : 'border-white/10 text-neutral-400 hover:border-white/25 hover:bg-white/[0.02]'
 }`}
 >
 {pct}%
 </button>
 ))}
 </div>
 <p className="text-[10px] text-neutral-600 mt-2">
 {form.charityPercent}% of the final winning bid goes to {form.ngoName || 'the NGO'}. Wregals' standard platform fee is deducted from the remaining {100 - form.charityPercent}%.
 </p>
 </div>
 </div>
 </SectionCard>
 )}

 {/* ── Section 4: Auction Settings ── */}
 <SectionCard title="Auction Settings" icon="solar:hand-money-bold">
 <div className="space-y-5">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label required>Starting Bid</Label>
 <PriceInput
 value={form.startingBid}
 onChange={setVal('startingBid')}
 placeholder="25000"
 />
 </div>
 <div>
 <Label>Bid Increment</Label>
 <PriceInput
 value={form.bidIncrement}
 onChange={setVal('bidIncrement')}
 placeholder="500"
 />
 <p className="text-[10px] text-neutral-600 mt-1.5">Minimum step per bid</p>
 </div>
 </div>

 {/* Reserve Price */}
 <div>
 <div className="flex items-center justify-between mb-4">
 <div>
 <p className="text-sm text-neutral-300 font-light">Reserve Price</p>
 <p className="text-[11px] text-neutral-600 mt-0.5">Hidden minimum - item only sells if this is reached</p>
 </div>
 <Toggle checked={form.hasReserve} onChange={set('hasReserve')} />
 </div>
 {form.hasReserve && (
 <PriceInput
 value={form.reservePrice}
 onChange={setVal('reservePrice')}
 placeholder="Enter reserve price"
 />
 )}
 </div>
 </div>
 </SectionCard>

 {/* ── Section 5: Timer ── */}
 <SectionCard title="Auction Timer" icon="solar:hourglass-bold">
 <div className="space-y-5">

 {/* Start Date & Time */}
 <div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label required>Start Date</Label>
 <Input
 type="date"
 value={form.startDate}
 onChange={setVal('startDate')}
 min={new Date().toISOString().slice(0, 10)}
 onClick={(e: any) => { try { e.target.showPicker(); } catch (err) {} }}
 />
 </div>
 <div>
 <Label required>Start Time</Label>
 <Input
 type="time"
 value={form.startTime}
 onChange={setVal('startTime')}
 onClick={(e: any) => { try { e.target.showPicker(); } catch (err) {} }}
 />
 </div>
 </div>
 <p className="text-[10px] text-neutral-600 mt-2">The auction will go live on this date and time</p>
 </div>

 {/* Duration */}
 <div>
 <Label required>Auction Duration</Label>

 {/* Quick presets */}
 <div className="flex gap-2 flex-wrap mb-4">
 {QUICK_DURATIONS.map(d => (
 <button
 key={d.label}
 type="button"
 onClick={() => set('durationHours')(String(d.hours))}
 className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase border rounded-sm transition-colors
 ${form.durationHours === String(d.hours)
 ? 'border-blue-500 text-blue-400 bg-white/5'
 : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white hover:bg-white/5'}`}
 >
 {d.label}
 </button>
 ))}
 </div>

 {/* Custom hours */}
 <div className="flex items-center gap-3">
 <div className="relative flex-1">
 <input
 type="number"
 min="1"
 max="96"
 value={form.durationHours}
 onChange={(e) => {
 let val = Number(e.target.value);
 if (val > 96) val = 96;
 set('durationHours')(val ? String(val) : '');
 }}
 placeholder="Max 96 hours"
 className="w-full bg-[#111] border border-white/8 rounded-sm px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-white/20 transition-colors"
 />
 </div>
 <span className="text-neutral-500 text-sm font-light whitespace-nowrap">hours</span>
 </div>
 </div>

 {/* Computed end date preview */}
 {computedEndDate && (
 <div className="bg-white/[0.03] border border-white/5 rounded-sm px-4 py-4 space-y-2.5">
 <div className="flex items-center gap-2.5">
 <IIcon icon="solar:calendar-mark-linear" width="15" className="text-blue-400 flex-shrink-0" />
 <span className="text-[11px] text-neutral-500 font-semibold tracking-wide">Starts</span>
 <span className="text-sm text-white font-light ml-auto">
 {new Date(`${form.startDate}T${form.startTime}`).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 <div className="flex items-center gap-2.5">
 <IIcon icon="solar:clock-circle-linear" width="15" className="text-red-400 flex-shrink-0" />
 <span className="text-[11px] text-neutral-500 font-semibold tracking-wide">Closes</span>
 <span className="text-sm text-white font-light ml-auto">
 {computedEndDate.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 <div className="flex items-center gap-2.5 pt-1 border-t border-white/5">
 <IIcon icon="solar:hourglass-linear" width="15" className="text-neutral-500 flex-shrink-0" />
 <span className="text-[11px] text-neutral-600">Duration: <span className="text-neutral-300 font-medium">{form.durationHours} {Number(form.durationHours) === 1 ? 'hour' : 'hours'}</span></span>
 </div>
 </div>
 )}
 </div>
 </SectionCard>

 {/* ── Section 6: Review Summary ── */}
 {(form.title || form.category || form.startingBid) && (
 <SectionCard title="Listing Summary" icon="solar:document-text-bold">
 <div className="space-y-3">
 {[
 { label: 'Title', val: form.title || 'not set' },
 { label: 'Category', val: CATEGORIES.find(c => c.id === form.category)?.name || 'not set' },
 { label: 'Condition', val: CONDITIONS.find(c => c.id === form.condition)?.label || 'not set' },
 { label: 'Celebrity', val: form.celebrity || 'not set' },
 { label: 'Starting Bid', val: form.startingBid ? `₹${Number(form.startingBid).toLocaleString('en-IN')}` : 'not set' },
 { label: 'Bid Increment', val: form.bidIncrement ? `₹${Number(form.bidIncrement).toLocaleString('en-IN')}` : 'not set' },
 { label: 'Reserve Price', val: form.hasReserve && form.reservePrice ? `₹${Number(form.reservePrice).toLocaleString('en-IN')}` : 'None' },
 { label: 'Starts', val: form.startDate && form.startTime ? new Date(`${form.startDate}T${form.startTime}`).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'not set' },
 { label: 'Duration', val: form.durationHours ? `${Math.min(Number(form.durationHours), 96)} ${Number(form.durationHours) === 1 ? 'hour' : 'hours'}` : 'not set' },
 { label: 'Closes', val: computedEndDate ? computedEndDate.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'not set' },
 { label: 'Photos', val: `${form.photos.length} uploaded` },
 { label: 'COA', val: form.hasCert ? 'Yes' : 'No' },
 ...(form.isCharity ? [
 { label: 'Type', val: 'Charity Auction' },
 { label: 'NGO', val: form.ngoName || 'not set' },
 { label: 'Cause', val: form.causeTag || 'not set' },
 { label: 'Charity %', val: `${form.charityPercent}% of winning bid` },
 ] : [
 { label: 'Type', val: 'Standard Auction' },
 ]),
 ].map(({ label, val }) => (
 <div key={label} className="flex justify-between items-start text-sm border-b border-white/[0.03] pb-3 last:border-0 last:pb-0">
 <span className="text-[11px] text-neutral-500 font-semibold tracking-wide flex-shrink-0 w-32">{label}</span>
 <span className="text-neutral-200 font-light text-right">{val}</span>
 </div>
 ))}
 </div>
 </SectionCard>
 )}

 {/* ── Error message ── */}
 {submitError && (
 <div className="bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3 text-sm text-red-400">
 {submitError}
 </div>
 )}

 {/* ── Action Buttons ── */}
 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <button
 type="button"
 onClick={handleDraft}
 disabled={submitting}
 className="flex-1 border border-white/15 text-neutral-300 px-6 py-3.5 text-[11px] font-semibold tracking-wide hover:bg-white/5 hover:text-white transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <IIcon icon="solar:diskette-linear" width="16" />
 {submitting ? 'Saving...' : 'Save as Draft'}
 </button>
 <button
 type="button"
 onClick={handlePublish}
 disabled={submitting}
 className="flex-1 bg-white text-black px-6 py-3.5 text-[11px] font-semibold tracking-wide font-bold hover:bg-neutral-100 transition-all rounded-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 <IIcon icon="solar:rocket-linear" width="16" />
 {submitting ? 'Publishing...' : 'Publish Listing'}
 </button>
 </div>

 <p className="text-center text-[10px] text-neutral-700 pb-2">
 By publishing, you confirm this item is authentic and agree to Wregals' seller terms.
 </p>
 </div>
 </div>
 );
}
