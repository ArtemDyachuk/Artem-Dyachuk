import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <Link href="/" className="nav-logo">
          Artem Dyachuk
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/experience" className="nav-link">
            Experience
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
} 