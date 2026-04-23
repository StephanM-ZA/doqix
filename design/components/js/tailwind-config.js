/* Do.Qix Tailwind CDN configuration — shared across all pages */
if (typeof tailwind === 'undefined') { console.warn('Tailwind CDN not loaded before tailwind-config.js'); }
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                "inverse-on-surface": "#303036",
                "surface-container-low": "#101C36",
                "surface-container-highest": "#1E3050",
                "on-tertiary-container": "#744c00",
                "on-surface": "#e4e1e9",
                "on-surface-variant": "#bacbbf",
                "surface-bright": "#223656",
                "on-secondary-fixed": "#311300",
                "on-primary": "#003824",
                "on-secondary": "#502400",
                "surface-dim": "#0C1830",
                "tertiary-container": "#ffbd5b",
                "secondary-fixed-dim": "#ff8000",
                "surface-tint": "#00e29e",
                "primary": "#00e5a0",
                "surface-variant": "#35343a",
                "on-primary-container": "#006141",
                "surface-container-high": "#1A2A48",
                "background": "#0C1830",
                "error": "#ffb4ab",
                "primary-fixed": "#47ffb8",
                "on-tertiary-fixed": "#291800",
                "outline-variant": "#3b4a41",
                "on-tertiary": "#452b00",
                "on-error": "#690005",
                "on-background": "#e4e1e9",
                "on-primary-fixed-variant": "#005236",
                "outline": "#84958a",
                "on-tertiary-fixed-variant": "#624000",
                "secondary-container": "#ff8000",
                "error-container": "#93000a",
                "on-secondary-fixed-variant": "#723600",
                "secondary-fixed": "#ffdcc7",
                "tertiary-fixed-dim": "#fcba59",
                "primary-container": "#00e5a0",
                "surface": "#0C1830",
                "surface-container-lowest": "#081024",
                "on-secondary-container": "#5e2b00",
                "tertiary": "#ffe1bb",
                "on-primary-fixed": "#002114",
                "tertiary-fixed": "#ffddb3",
                "on-error-container": "#ffdad6",
                "inverse-surface": "#e4e1e9",
                "inverse-primary": "#006c49",
                "primary-fixed-dim": "#00e29e",
                "surface-container": "#14203C",
                "secondary": "#ff8000"
            },
            "borderRadius": {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
            "fontFamily": {
                "headline": ["Inter"],
                "body": ["Inter"],
                "label": ["Inter"]
            }
        },
    }
}
