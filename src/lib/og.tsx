import { ImageResponse } from 'next/og';

import { siteConfig } from '@/config/site';

/** Standard OpenGraph / Twitter summary_large_image dimensions. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png';

interface OgCardOptions {
   /** Small uppercase eyebrow, e.g. "// SOFTWARE ENGINEER" or "// PROJECT". */
   eyebrow: string;
   /** Main heading — the name on the home card, or the project/post title on detail cards. */
   title: string;
   /** Optional sub-line under the title (e.g. role, or a short excerpt). */
   subtitle?: string;
}

/**
 * Renders the branded share card as a PNG ImageResponse. Uses only flexbox + system
 * fonts so it renders identically on the Node and Edge runtimes without bundling a
 * font file or fetching any remote asset (next/og forbids `display: grid` and only
 * supports a subset of CSS).
 */
export function buildOgImage({ eyebrow, title, subtitle }: OgCardOptions): ImageResponse {
   const { background, foreground, muted, accent } = siteConfig.og;

   return new ImageResponse(
      (
         <div
            style={{
               width: '100%',
               height: '100%',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between',
               background,
               color: foreground,
               padding: '72px 80px',
               fontFamily: 'monospace',
               // faint dot-grid, echoing the site's body::before texture
               backgroundImage: `radial-gradient(${foreground} 1.2px, transparent 1.2px)`,
               backgroundSize: '40px 40px',
            }}
         >
            {/* Top row: eyebrow */}
            <div
               style={{
                  display: 'flex',
                  fontSize: 26,
                  letterSpacing: 8,
                  textTransform: 'uppercase',
                  color: accent,
               }}
            >
               {eyebrow}
            </div>

            {/* Center: accent left-rule + title block */}
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
               <div
                  style={{
                     width: 6,
                     alignSelf: 'stretch',
                     background: accent,
                     marginRight: 36,
                     borderRadius: 3,
                  }}
               />
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                     style={{
                        display: 'flex',
                        fontSize: 84,
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: -2,
                        maxWidth: 980,
                     }}
                  >
                     {title}
                  </div>
                  {subtitle ? (
                     <div
                        style={{
                           display: 'flex',
                           marginTop: 24,
                           fontSize: 34,
                           lineHeight: 1.3,
                           color: muted,
                           maxWidth: 980,
                        }}
                     >
                        {subtitle}
                     </div>
                  ) : null}
               </div>
            </div>

            {/* Bottom row: brand + domain */}
            <div
               style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 24,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: muted,
               }}
            >
               <div style={{ display: 'flex', color: foreground }}>{siteConfig.name}</div>
               <div style={{ display: 'flex' }}>{siteConfig.url.replace(/^https?:\/\//, '')}</div>
            </div>
         </div>
      ),
      { ...OG_SIZE },
   );
}
