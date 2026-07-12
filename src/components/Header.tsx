"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/services", label: "Services" },
  { href: "/service-area", label: "Service Area" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Quote" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid
          ? "bg-[color:var(--ivory)]/95 border-b border-[color:var(--line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href="/"
          className={`font-display text-[1.35rem] tracking-tight md:text-[1.55rem] ${
            solid ? "text-navy" : "text-ivory"
          }`}
        >
          Windermere Cleaning
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`link-underline text-[0.72rem] uppercase tracking-[0.14em] ${
                solid ? "text-navy" : "text-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className={solid ? "btn-primary !py-2.5 !px-4" : "btn-brass !py-2.5 !px-4"}
          >
            Book
          </Link>
        </nav>

        <button
          type="button"
          className={`md:hidden text-[0.7rem] uppercase tracking-[0.14em] ${
            solid ? "text-navy" : "text-ivory"
          }`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-[color:var(--line)] bg-[color:var(--ivory)] md:hidden"
        >
          <div className="container-site flex flex-col gap-4 py-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-2xl text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" className="btn-primary mt-2 w-fit">
              Get a free quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
