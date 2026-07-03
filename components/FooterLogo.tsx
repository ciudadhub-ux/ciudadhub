"use client";

import Image from "next/image";
import Link from "next/link";

export default function FooterLogo() {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-block hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo.webp"
        alt="Ciudad Hub Podcast"
        width={69}
        height={80}
        className="h-20 w-auto"
      />
    </Link>
  );
}
