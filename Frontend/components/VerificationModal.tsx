'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as XIcon, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import type { HealthEvent } from '../lib/api';

interface VerificationModalProps {
  event: HealthEvent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VerificationData) => Promise<void>;
  isLoading?: boolean;
}

export interface VerificationData {
  verified_by: string;
  verification_notes?: string;
  verification_document_url?: string;
}

const ASHA_WORKERS = ['Priya', 'Anjali', 'Meera', 'Deepa', 'Kavya'];

export function VerificationModal({
  event,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: VerificationModalProps) {
  const [verifiedBy, setVerifiedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verifiedBy.trim()) {
      setError('Please select or enter ASHA worker name');
      return;
    }

    try {
      await onSubmit({
        verified_by: verifiedBy,
        verification_notes: notes || undefined,
        verification_document_url: documentUrl || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setVerifiedBy('');
        setNotes('');
        setDocumentUrl('');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg text-slate-500 hover:text-rose-500 transition-all border border-slate-100 dark:border-slate-700 active:scale-90"
            >
              <XIcon size={20} strokeWidth={3} />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Verify Vaccination
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                {event.name} - {new Date(event.due_date).toLocaleDateString('en-IN')}
              </p>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <CheckCircle size={48} className="text-emerald-500 mb-4" strokeWidth={2} />
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    Verification Submitted!
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* ASHA Worker Selection */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      ASHA Worker Name
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ASHA_WORKERS.map((worker) => (
                        <button
                          key={worker}
                          type="button"
                          onClick={() => setVerifiedBy(worker)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            verifiedBy === worker
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                        >
                          {worker}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter custom name"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Verification Notes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Verification Notes (Optional)
                    </label>
                    <textarea
                      placeholder="e.g., Verified at health camp, Verified at routine checkup"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Document URL */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Document URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/document"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg"
                    >
                      <AlertCircle size={18} strokeWidth={2} />
                      <span className="text-sm font-bold">{error}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold py-3 rounded-lg transition-all active:scale-95"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Verification'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
