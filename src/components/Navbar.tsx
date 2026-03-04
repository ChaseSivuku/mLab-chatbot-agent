import { useState } from 'react';

const navLinks = [
  { label: 'HOME', active: true },
  { label: 'WHO WE ARE', active: false },
  { label: 'WHAT WE DO', active: false },
  { label: 'PARTNERS', active: false },
  { label: 'NEWS', active: false },
  { label: 'RESOURCES', active: false },
  { label: 'CONTACT US', active: false },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="shrink-0">
      <div className="flex bg-[#003d4d] justify-between h-14 sm:h-16 md:h-20 items-center px-4 sm:px-6 md:px-8 lg:px-12">

        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto sm:h-10 md:h-12 md:ml-4" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-4 xl:gap-6 text-white items-center text-sm">
          {navLinks.map(({ label, active }) => (
            <label
              key={label}
              className={`cursor-pointer whitespace-nowrap ${active ? 'border-b-2 border-[#a6ce39]' : ''}`}
            >
              {label}
            </label>
          ))}
          <div className="bg-[#a6ce39] px-4 py-2 flex items-center justify-center h-20 w-40 ml-2">
            <label className="tracking-widest">CODETRIBE</label>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 text-white aria-expanded:bg-white/10 rounded"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-white block transition-transform ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`w-6 h-0.5 bg-white block my-1.5 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white block transition-transform ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-[#003d4d] border-t border-white/10 text-white px-4 py-4 flex flex-col gap-3">
          {navLinks.map(({ label, active }) => (
            <label
              key={label}
              className={`py-2 ${active ? 'border-b-2 border-[#a6ce39] w-fit' : ''}`}
            >
              {label}
            </label>
          ))}
          <div className="bg-[#a6ce39] text-center text-black px-4 py-3 mt-2 flex items-center justify-center gap-2 w-full max-w-xs">
            <label className="tracking-widest font-medium">CODETRIBE</label>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>
      )}
    </nav>
  );
}