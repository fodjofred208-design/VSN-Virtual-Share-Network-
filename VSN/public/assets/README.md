# VSN Assets

## Logo

The app ships with a vector logo: **`vsn-logo.svg`** (480×200, gradient V-S-N wordmark).

The UI references it via `next/image`:

```tsx
import Image from "next/image";

<Image src="/assets/vsn-logo.svg" alt="VSN" width={480} height={200} className="h-8 w-auto" />;
```

Used in:

- `src/app/(app)/layout.tsx` (header)
- `src/components/sidebar.tsx`
- `src/components/vsn-splash.tsx` (splash screen)

## Replacing the logo

If you have a custom logo, drop a PNG or SVG into this folder and update the
`src` path in the three components above. Recommended:

- Width ≥ 480px (the SVG is 480×200, ratio 2.4:1)
- Dark-background friendly (the header and splash backgrounds are very dark)
- For PNG: transparency recommended

`vsn-logo-placeholder.svg` is the original placeholder and is no longer
referenced by the UI; keep it for reference or delete it.
