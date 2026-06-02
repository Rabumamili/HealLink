'use client';

import { useState } from 'react';
import { HealLinkIcon } from '@/components/icons/healink-icon';
import { labsData } from './landing-data';
import { ServiceList, ServiceBadges } from './service-list';

export function DiagnosticsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-margin-lg bg-surface" id="diagnostics">
      <div className="max-w-[1440px] mx-auto px-container-padding">
        <div className="flex items-center gap-4 mb-margin-md">
          <h2 className="font-headline-lg text-[32px] font-bold text-on-surface">Diagnostic Centers</h2>
          <div className="h-px flex-1 bg-outline-variant/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-margin-md items-start">
          {labsData.map((lab) => {
            const isExpanded = expandedId === lab.id;
            return (
              <div
                key={lab.id}
                className={`group relative isolate overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15 ${isExpanded ? 'card-active ring-2 ring-primary/20' : ''}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={lab.image}
                    alt={lab.name}
                    className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:saturate-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute top-3 right-3">
                    <div className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-translate-y-0.5">
                      ISO Certified
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg leading-tight mb-1">{lab.name}</h3>
                    <div className="flex items-center gap-2 text-xs opacity-90">
                      <HealLinkIcon name="location_on" size={16} className="text-white" />
                      <span>{lab.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {!isExpanded && (
                    <div className="space-y-3">
                      <p className="text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {lab.description}
                      </p>
                      <div className="flex flex-wrap gap-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                        <ServiceBadges items={lab.tests} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {isExpanded && (
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <HealLinkIcon name="call" size={18} className="text-primary" />
                        <span className="font-medium">{lab.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                      <div className="flex items-center gap-0.5 font-bold text-on-surface">
                        <HealLinkIcon name="star" size={14} className="fill-primary text-primary" />
                        <span>{lab.rating}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpand(lab.id)}
                        className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary/10"
                      >
                        {isExpanded ? 'Show Less' : 'View Details'}
                        <HealLinkIcon
                          name="expand_more"
                          size={18}
                          className={`text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="expanded-content">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-2">
                          Test Menu &amp; Requirements
                        </h4>
                        <ServiceList items={lab.tests} icon="science" scrollable />
                      </div>
                      <p className="text-[13px] text-on-surface-variant italic leading-relaxed text-center opacity-85 px-2">
                        &ldquo;{lab.description}&rdquo;
                      </p>
                      <a
                        href="/register?role=patient"
                        className="block w-full py-3 bg-primary text-on-primary text-center font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all mt-4"
                      >
                        Order Selected Tests
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
