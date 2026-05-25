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
                className={`bg-white rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all overflow-hidden group ${isExpanded ? 'card-active ring-2 ring-primary/20' : ''}`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={lab.image}
                    alt={lab.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-0.5 bg-primary text-on-primary text-[9px] font-bold rounded-full uppercase tracking-widest">
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
                      <div className="flex flex-wrap gap-2">
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
                        className="flex items-center gap-1 text-primary font-bold text-sm hover:underline"
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
