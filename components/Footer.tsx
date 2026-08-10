export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* compact mobile: single row */}
        <div className="flex md:hidden items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Motif" width={22} height={22} className="rounded-md" />
            Motif
          </div>
          <div className="flex gap-4 text-[11px] text-zinc-500">
            <a href="/atlas" className="hover:text-white transition">The Room</a>
            <a href="/?submit=1" className="hover:text-white transition">Submit</a>
          </div>
        </div>
        <p className="md:hidden mt-3 text-[10px] text-zinc-600">Free forever. Live-rendered DNA, remixable in your browser.</p>

        {/* full desktop */}
        <div className="hidden md:grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Motif" width={26} height={26} className="rounded-lg shadow-[0_4px_18px_rgba(139,92,246,.4)]" />
              Motif
            </div>
            <p className="mt-3 text-xs text-zinc-500 max-w-xs leading-relaxed">
              An open atlas of premium design DNA — remixed live in your browser, copied as prompts your tools already understand.
            </p>
            <p className="mt-4 text-[10px] text-zinc-600">Free forever. Built for designers, developers, and agents alike.</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Explore</div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><a className="hover:text-white transition" href="/atlas">The Design Room</a></li>
              <li><a className="hover:text-white transition" href="/atlas">Featured</a></li>
              <li><a className="hover:text-white transition" href="/atlas">Apps & UI</a></li>
              <li><a className="hover:text-white transition" href="/atlas">Games & interactive</a></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">Built with</div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Live-rendered DNA (no screenshots)</li>
              <li>Three copy modes</li>
              <li>The Director</li>
              <li>Installable PWA</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
