'use client';
import { ScannerView } from '@/components/ScannerView';

export default function ScanMedicinePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto h-[calc(100vh-100px)]">
      <ScannerView />
    </div>
  );
}
