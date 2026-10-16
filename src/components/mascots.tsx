/** Illustrated avatars used in the conversation section. */

export function FatherAvatar() {
  return (
    <svg viewBox="7 6 34 34" className="block size-full" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#E3F4F1" />
      <path d="M8 48c1-9 7-13 16-13s15 4 16 13z" fill="#0B1A3D" />
      <path d="M20 35l4 5 4-5" fill="#fff" />
      <circle cx="24" cy="22" r="10" fill="#F2C29B" />
      <path d="M14 20c0-7 4-10 10-10s10 3 10 9c-2-3-6-4-10-4s-8 1-10 5z" fill="#3B2A20" />
      <path d="M14.5 21c-.5 2 0 4 1 5M33.5 21c.5 2 0 4-1 5" stroke="#3B2A20" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="22" r="3" fill="none" stroke="#0B1A3D" strokeWidth="1.4" />
      <circle cx="28" cy="22" r="3" fill="none" stroke="#0B1A3D" strokeWidth="1.4" />
      <path d="M23 22h2" stroke="#0B1A3D" strokeWidth="1.4" />
      <circle cx="20" cy="22" r="1" fill="#0B1A3D" />
      <circle cx="28" cy="22" r="1" fill="#0B1A3D" />
      <path d="M20 27.5c1.3-1 2.6-1.2 4-.6 1.4-.6 2.7-.4 4 .6" stroke="#3B2A20" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function StudentAvatar() {
  return (
    <svg viewBox="7 6 34 34" className="block size-full" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#FFF4DB" />
      <path d="M8 48c1-9 7-13 16-13s15 4 16 13z" fill="#0E7C70" />
      <path d="M18 36c2 3 10 3 12 0" stroke="#fff" strokeWidth="2" fill="none" />
      <circle cx="24" cy="23" r="10" fill="#E8B48A" />
      <path d="M13.5 22c-1-8 4-12 11-12 6 0 10 4 9.5 10-3-4-8-5-13-4-3 1-5 3-7.5 6z" fill="#1B1B24" />
      <circle cx="20.5" cy="23.5" r="1.3" fill="#0B1A3D" />
      <circle cx="27.5" cy="23.5" r="1.3" fill="#0B1A3D" />
      <path d="M21 28c1.8 1.4 4.2 1.4 6 0" stroke="#0B1A3D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="26.5" r="1.4" fill="#F59E0B" opacity=".5" />
      <circle cx="30" cy="26.5" r="1.4" fill="#F59E0B" opacity=".5" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2.1 1.3 2.4 1.4.3.2.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
    </svg>
  );
}
