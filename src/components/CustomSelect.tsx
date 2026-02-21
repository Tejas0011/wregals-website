// @ts-nocheck
import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Select…', disabled }: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className={`cselect${open ? ' cselect--open' : ''}${disabled ? ' cselect--disabled' : ''}`} ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                className="cselect-trigger"
                onClick={() => !disabled && setOpen(o => !o)}
                disabled={disabled}
            >
                <span className={value ? 'cselect-value' : 'cselect-placeholder'}>
                    {value || placeholder}
                </span>
                <svg className="cselect-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Dropdown list */}
            {open && (
                <ul className="cselect-list" role="listbox">
                    {options.map(opt => (
                        <li
                            key={opt}
                            role="option"
                            aria-selected={opt === value}
                            className={`cselect-option${opt === value ? ' cselect-option--selected' : ''}`}
                            onClick={() => { onChange(opt); setOpen(false); }}
                        >
                            {opt === value && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                                    <path d="M5 13l4 4L19 7" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
