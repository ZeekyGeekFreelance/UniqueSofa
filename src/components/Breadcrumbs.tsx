import { Link } from "wouter";

type BreadcrumbsProps = {
  current: string;
};

export function Breadcrumbs({ current }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-[color:var(--text-faint)]">
      <Link href="/" className="transition-colors hover:text-[color:var(--accent)]">
        Home
      </Link>
      <span>/</span>
      <span className="text-[color:var(--text)]">{current}</span>
    </nav>
  );
}
