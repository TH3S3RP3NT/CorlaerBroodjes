import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
                <p>© {new Date().getFullYear()} CorlaerBroodjes. Alle rechten voorbehouden.</p>

                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                        Privacybeleid
                    </Link>
                    <Link href="/voorwaarden" className="hover:text-gray-900 transition-colors">
                        Algemene voorwaarden
                    </Link>
                </div>
            </div>
        </footer>
    );
}