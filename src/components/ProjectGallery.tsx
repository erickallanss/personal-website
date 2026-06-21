'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import type { ProjectImage } from '@/lib/projectImages';

export interface GalleryLabels {
   previous: string;
   next: string;
   close: string;
   open: string;
   goToImage: string;
   zoomIn: string;
   zoomOut: string;
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
   return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
         {dir === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
   );
}

function XIcon() {
   return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
         <path d="M6 6l12 12M18 6L6 18" />
      </svg>
   );
}

const overlayNav =
   'grid size-9 place-items-center rounded-full bg-background/70 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background';
const lightboxNav =
   'grid size-10 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white';

export function ProjectGallery({ images, name, labels }: { images: ProjectImage[]; name: string; labels: GalleryLabels }) {
   const [index, setIndex] = useState(0);
   const [open, setOpen] = useState(false);
   const [zoomed, setZoomed] = useState(false);
   const dialogRef = useRef<HTMLDivElement>(null);
   const count = images.length;
   const current = images[index];

   const goTo = (next: number) => {
      setIndex(((next % count) + count) % count);
      setZoomed(false);
   };
   const step = (delta: number) => goTo(index + delta);

   useEffect(() => {
      if (!open) return;
      const dialog = dialogRef.current;
      const previouslyFocused = document.activeElement as HTMLElement | null;

      const onKey = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            setOpen(false);
            return;
         }
         if (event.key === 'ArrowLeft') {
            setIndex((i) => ((i - 1) % count + count) % count);
            setZoomed(false);
            return;
         }
         if (event.key === 'ArrowRight') {
            setIndex((i) => (i + 1) % count);
            setZoomed(false);
            return;
         }
         if (event.key === 'Tab' && dialog) {
            const focusables = Array.from(
               dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
            );
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) {
               event.preventDefault();
               last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
               event.preventDefault();
               first.focus();
            }
         }
      };

      document.addEventListener('keydown', onKey);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog?.focus();

      return () => {
         document.removeEventListener('keydown', onKey);
         document.body.style.overflow = previousOverflow;
         previouslyFocused?.focus?.();
      };
   }, [open, count]);

   return (
      <div>
         <div className="group relative aspect-video overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5">
            <button
               type="button"
               onClick={() => {
                  setZoomed(false);
                  setOpen(true);
               }}
               aria-label={labels.open}
               className="absolute inset-0 cursor-zoom-in"
            >
               <Image
                  src={current.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  priority
                  className="object-cover"
               />
            </button>
            {count > 1 && (
               <>
                  <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={`absolute left-3 top-1/2 z-10 -translate-y-1/2 ${overlayNav}`}>
                     <Chevron dir="left" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={labels.next} className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 ${overlayNav}`}>
                     <Chevron dir="right" />
                  </button>
               </>
            )}
         </div>

         {count > 1 && (
            <div className="mt-3 flex justify-center gap-1">
               {images.map((img, i) => (
                  <button
                     key={img.src}
                     type="button"
                     onClick={() => goTo(i)}
                     aria-label={`${labels.goToImage} ${i + 1}`}
                     aria-current={i === index}
                     className="group grid size-6 place-items-center"
                  >
                     <span
                        className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/25 group-hover:bg-foreground/50'}`}
                     />
                  </button>
               ))}
            </div>
         )}

         {open && (
            <div
               ref={dialogRef}
               tabIndex={-1}
               role="dialog"
               aria-modal="true"
               aria-label={name}
               className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 outline-none"
            >
               {/* Click-away backdrop. Non-focusable + AT-hidden; the visible X and Escape close it. */}
               <div aria-hidden onClick={() => setOpen(false)} className="absolute inset-0" />

               <span className="absolute left-4 top-4 z-10 text-sm tabular-nums text-white/60">
                  {index + 1} / {count}
               </span>
               <button type="button" aria-label={labels.close} onClick={() => setOpen(false)} className="absolute right-4 top-4 z-10 text-white/70 transition-colors hover:text-white">
                  <XIcon />
               </button>

               {count > 1 && (
                  <>
                     <button type="button" aria-label={labels.previous} onClick={() => step(-1)} className={`absolute left-3 top-1/2 z-10 -translate-y-1/2 ${lightboxNav}`}>
                        <Chevron dir="left" />
                     </button>
                     <button type="button" aria-label={labels.next} onClick={() => step(1)} className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 ${lightboxNav}`}>
                        <Chevron dir="right" />
                     </button>
                  </>
               )}

               <div className="relative z-10 flex max-h-full max-w-full items-center justify-center overflow-auto">
                  <button
                     type="button"
                     aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
                     aria-pressed={zoomed}
                     onClick={() => setZoomed((value) => !value)}
                     className={zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
                  >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img
                        src={current.src}
                        alt=""
                        className={zoomed ? 'max-h-none max-w-none' : 'max-h-[88vh] max-w-[92vw] object-contain'}
                     />
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
