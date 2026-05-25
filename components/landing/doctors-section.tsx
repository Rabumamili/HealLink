'use client';

import { useState } from 'react';
import { HealLinkIcon } from '@/components/icons/healink-icon';
import { doctorsData } from './landing-data';
import { ServiceList, ServiceBadges } from './service-list';

export function DoctorsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-margin-lg bg-surface-container-low" id="doctors">
      <div className="max-w-[1440px] mx-auto px-container-padding">
        <div className="text-center mb-margin-md">
          <h2 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Renowned Specialists</h2>
          <p className="text-on-surface-variant font-body-md text-[16px]">
            Connect with top-tier medical experts in their fields.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-margin-md items-start">
          {doctorsData.map((doctor) => {
            const isExpanded = expandedId === doctor.id;
            return (
              <div
                key={doctor.id}
                className={`bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all overflow-hidden group ${isExpanded ? 'card-active ring-2 ring-secondary/20' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-2xl border-2 border-secondary/10 overflow-hidden shadow-sm">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-outline-variant/10">
                        <HealLinkIcon name="verified" size={14} className="text-secondary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-base text-on-surface leading-tight truncate mr-2">
                          {doctor.name}
                        </h3>
                        <div className="flex items-center gap-0.5 text-[11px] font-bold bg-secondary/10 text-secondary px-1.5 py-0.5 rounded">
                          <HealLinkIcon name="star" size={12} className="fill-secondary text-secondary" />
                          <span>{doctor.rating}</span>
                        </div>
                      </div>
                      <p className="text-secondary text-xs font-semibold mt-0.5">{doctor.specialty}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-outline uppercase tracking-wider">
                        <HealLinkIcon name="map" size={14} />
                        <span className="truncate">{doctor.address}</span>
                      </div>
                    </div>
                  </div>

                  {!isExpanded && (
                    <div className="mt-5 space-y-3">
                      <p className="text-[14px] text-on-surface-variant line-clamp-2 italic leading-relaxed">
                        &ldquo;{doctor.bio}&rdquo;
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <ServiceBadges items={doctor.services} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-outline-variant/10 mt-5 pt-4">
                    {isExpanded && (
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <HealLinkIcon name="phone_android" size={18} className="text-secondary" />
                        <span className="font-medium">{doctor.phone}</span>
                      </div>
                    )}
                    <div className={isExpanded ? '' : 'ml-auto'} />
                    <button
                      type="button"
                      onClick={() => toggleExpand(doctor.id)}
                      className="flex items-center gap-1 text-secondary font-bold text-sm hover:underline"
                    >
                      {isExpanded ? 'Show Less' : 'View Details'}
                      <HealLinkIcon
                        name="expand_more"
                        size={18}
                        className={`text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="expanded-content">
                    <div className="space-y-6">
                      <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                        <p className="text-[13px] text-on-surface-variant italic leading-relaxed">
                          &ldquo;{doctor.bio}&rdquo;
                        </p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
                          <span className="h-px w-6 bg-secondary/20" />
                          Fees &amp; Treatments
                        </h4>
                        <ServiceList items={doctor.services} />
                        <div className="text-[10px] text-outline font-semibold mt-4 flex items-center gap-2">
                          <HealLinkIcon name="verified_user" size={14} />
                          License: {doctor.license} • {doctor.experience} Yrs Exp
                        </div>
                      </div>
                      <a
                        href="/register?role=patient"
                        className="block w-full py-3 bg-secondary text-on-secondary text-center font-bold text-sm rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/95 transition-all mt-4"
                      >
                        Book Consultation
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
