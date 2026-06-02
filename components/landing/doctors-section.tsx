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
                className={`group relative isolate overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/15 ${isExpanded ? 'card-active ring-2 ring-secondary/20' : ''}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/8 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-secondary/10 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:border-secondary/30 group-hover:shadow-lg group-hover:shadow-secondary/15">
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:saturate-110"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-outline-variant/10 bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
                        <HealLinkIcon name="verified" size={14} className="text-secondary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-base text-on-surface leading-tight truncate mr-2">
                          {doctor.name}
                        </h3>
                        <div className="flex items-center gap-0.5 rounded bg-secondary/10 px-1.5 py-0.5 text-[11px] font-bold text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-on-secondary">
                          <HealLinkIcon
                            name="star"
                            size={12}
                            className="fill-secondary text-secondary transition-colors duration-300 group-hover:fill-on-secondary group-hover:text-on-secondary"
                          />
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
                      <div className="flex flex-wrap gap-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
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
                      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-secondary/10"
                    >
                      {isExpanded ? 'Show Less' : 'View Details'}
                      <HealLinkIcon
                        name="expand_more"
                        size={18}
                        className={`text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
