'use client';
import { motion } from 'framer-motion';
import { useAuthStore } from '../lib/auth-store';
import { demoFamilies } from '../lib/data';
import { MapPin, Phone, Clock, Building2, Stethoscope, Heart, ExternalLink } from 'lucide-react';

export default function CarePage() {
  const { householdId, isDemoMode } = useAuthStore();
  // Health centers come from local data in demo, or could be a future API endpoint
  const demoFamily = demoFamilies.find(f => f.id === householdId) ?? demoFamilies[0];
  const healthCenters = demoFamily.healthCenters;

  const typeConfig = (t: string) => {
    if (t === 'PHC') return { icon: Building2, color: 'teal', label: 'Primary Health Center' };
    if (t === 'Hospital') return { icon: Stethoscope, color: 'navy', label: 'Hospital' };
    if (t === 'ASHA') return { icon: Heart, color: 'coral', label: 'ASHA Worker' };
    return { icon: Building2, color: 'sage', label: 'Clinic' };
  };

  const ashaWorkers = healthCenters.filter(h => h.type === 'ASHA');
  const facilities = healthCenters.filter(h => h.type !== 'ASHA');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-800 text-2xl text-white mb-1">Nearby Care</h1>
        <p className="text-sm text-white/35 mb-8">Find health centers and community workers near you</p>
      </motion.div>

      {/* SOS ASHA Access */}
      {ashaWorkers.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <h2 className="font-heading font-700 text-sm text-coral-400 mb-3 flex items-center gap-2">
            <Heart size={14} /> SOS ASHA Access
          </h2>
          {ashaWorkers.map((asha, i) => (
            <div key={asha.id} className="bg-coral-500/[0.06] border border-coral-500/15 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-coral-500/15 flex items-center justify-center">
                    <Heart size={20} className="text-coral-400" />
                  </div>
                  <div>
                    <p className="font-heading font-700 text-white">{asha.name}</p>
                    <p className="text-xs text-white/30 mt-0.5">{asha.address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} /> {asha.distance}</span>
                      {asha.openNow && <span className="text-xs text-teal-400 flex items-center gap-1"><Clock size={10} /> Available Now</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {asha.specialties.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/40">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <a href={`tel:${asha.phone}`} className="flex items-center gap-2 px-4 py-2.5 bg-coral-500 text-white font-heading font-700 text-sm rounded-xl hover:bg-coral-400 transition-colors flex-shrink-0">
                  <Phone size={14} /> Call Now
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Health Centers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-heading font-700 text-sm text-white mb-3 flex items-center gap-2">
          <Building2 size={14} className="text-teal-400" /> Health Centers & Clinics
        </h2>
        <div className="space-y-4">
          {facilities.map((center, i) => {
            const tc = typeConfig(center.type);
            return (
              <motion.div key={center.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-surface-800/40 border border-white/[0.06] rounded-2xl p-5 hover:bg-surface-800/60 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${tc.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                      <tc.icon size={18} className={`text-${tc.color}-400`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-700 text-sm text-white">{center.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-${tc.color}-500/10 text-${tc.color}-400 border border-${tc.color}-500/20`}>{center.type}</span>
                      </div>
                      <p className="text-xs text-white/30 mt-0.5">{center.address}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/40 flex items-center gap-1"><MapPin size={10} /> {center.distance}</span>
                        <span className={`text-xs flex items-center gap-1 ${center.openNow ? 'text-teal-400' : 'text-coral-400'}`}>
                          <Clock size={10} /> {center.openNow ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {center.specialties.map(s => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-white/40">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <a href={`tel:${center.phone}`} className="p-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white/40 hover:text-teal-400 hover:border-teal-500/20 transition-colors flex-shrink-0">
                    <Phone size={16} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
