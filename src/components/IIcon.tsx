// Bundled Iconify icon — replaces the CDN <iconify-icon> web component.
// Usage: <IIcon icon="solar:star-shine-bold" width={16} className="text-[#D4AF37]" />
import { Icon } from '@iconify/react';

interface IIconProps {
    icon: string;
    width?: number | string;
    /** mirrors the web-component `class` attribute */
    class?: string;
    className?: string;
    style?: React.CSSProperties;
    'stroke-width'?: number | string;
}

export default function IIcon({ icon, width, class: cls, className, style, 'stroke-width': sw }: IIconProps) {
    return (
        <Icon
            icon={icon}
            width={width}
            className={cls ?? className}
            style={style}
            stroke={sw ? String(sw) : undefined}
        />
    );
}
