/// <reference types="vite/client" />
import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                icon: string;
                width?: string | number;
                "stroke-width"?: string | number;
                class?: string;
            };
        }
    }
}
