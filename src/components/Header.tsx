import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-12">
          <Link href="/" className="text-xl font-bold">
            Source Dive
          </Link>
        </div>
        <div className="flex items-center gap-4 h-12 justify-between">
          <div className="flex items-center gap-4">
            <Link href="https://github.com/seungdeok/sourcedive" target="_blank" className="text-xl font-bold">
              Github
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
