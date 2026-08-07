import { whatsappLink } from "@/lib/site-config";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink("Olá! Vi o site e gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full btn-neon transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.65 4.53 1.78 6.4L4 29l7.78-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.62 1.03 1.02-4.5-.25-.4A9.66 9.66 0 0 1 6.3 15c0-5.35 4.36-9.7 9.7-9.7s9.7 4.35 9.7 9.7-4.35 9.7-9.7 9.7Zm5.32-7.27c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.14-.2.29-.75.94-.92 1.13-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.2 3.02.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z" />
      </svg>
    </a>
  );
}
