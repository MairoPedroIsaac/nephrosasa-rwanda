import Link from 'next/link';
import { QrCode, ArrowRight } from 'lucide-react';

/** A share link without its token lands here instead of a bare 404. */
export default function SharedRecordMissingToken() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4 dark:bg-ink">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <QrCode size={24} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-gray-900 dark:text-white">This share link is incomplete.</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          It is missing the patient&apos;s token. Ask the patient to open Share Record and send their QR code or link again.
        </p>
        <Link href="/en/doctor/scan-qr" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white hover:bg-primary-dark">
          Scan Patient QR <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
