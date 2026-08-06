import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="hi.domains home">
      <span className="flex size-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white shadow-sm">
        hi
      </span>
      <span className="text-base font-semibold tracking-tight text-slate-950">
        hi.domains
      </span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-950 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <BrandMark />
        <p>First-stage product framework. AI analysis is not implemented.</p>
      </div>
    </footer>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <BrandMark />
        <div className="flex flex-1 items-center justify-center py-12">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
