'use client';

import { useState } from 'react';

// Small "Copy" control — copies `text` to the clipboard and shows a brief confirmation.
// Used for the email address (clicking a mailto only works for users with a mail client).
export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
   const [copied, setCopied] = useState(false);

   const onClick = () => {
      void navigator.clipboard?.writeText(text).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 1500);
      });
   };

   return (
      <button
         type="button"
         onClick={onClick}
         className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/60 underline underline-offset-4 transition-colors hover:text-foreground"
      >
         {copied ? copiedLabel : label}
      </button>
   );
}
