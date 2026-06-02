'use client';

import { useState } from 'react';
import { HealLinkIcon } from '@/components/icons/healink-icon';
import { clinicsData } from './landing-data';
import { ServiceList, ServiceBadges } from './service-list';
export function ClinicsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleBooking = () => {
    window.location.href = '/register?role=patient';
  };

  return (
    <section className="py-margin-lg bg-surface" id="clinics">
      <div className="max-w-[1440px] mx-auto px-container-padding">
        <div className="flex justify-between items-end mb-margin-md">
          <div>
            <h2 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Partner Clinics</h2>
            <p className="text-on-surface-variant font-body-md text-[16px]">
              Accredited medical facilities with specialized departments.
            </p>
          </div>
          <button type="button" className="text-primary font-label-md text-[14px] font-semibold flex items-center gap-1 group">
            View All
            <HealLinkIcon name="arrow_forward" size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-margin-md items-start">
          {clinicsData.map((clinic) => {
            const isExpanded = expandedId === clinic.id;
            return (
              <div
                key={clinic.id}
                className={`group relative isolate overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15 ${isExpanded ? 'card-active ring-2 ring-primary/20' : ''}`}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110 group-hover:saturate-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-white">
                      <h3 className="font-bold text-lg leading-tight mb-1">{clinic.name}</h3>
                      <div className="flex items-center gap-2 text-xs opacity-90">
                        <HealLinkIcon name="location_on" size={16} className="text-white" />
                        <span>{clinic.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-xs font-bold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/25">
                      <HealLinkIcon name="star" size={14} className="text-white fill-white" />
                      <span>{clinic.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {!isExpanded && (
                    <div className="space-y-3">
                      <p className="text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                        {clinic.description}
                      </p>
                      <div className="flex flex-wrap gap-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                        <ServiceBadges items={clinic.services} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {isExpanded && (
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <HealLinkIcon name="phone_iphone" size={18} className="text-primary" />
                        <span className="font-medium">{clinic.phone}</span>
                      </div>
                    )}
                    <div className={isExpanded ? '' : 'ml-auto'} />
                    <button
                      type="button"
                      onClick={() => toggleExpand(clinic.id)}
                      className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary/10"
                    >
                      {isExpanded ? 'Show Less' : 'View Details'}
                      <HealLinkIcon
                        name="expand_more"
                        size={18}
                        className={`text-primary transition-transform chevron-icon ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="expanded-content">
                    <div className="space-y-6">
                      <p className="text-[14px] text-on-surface-variant leading-relaxed pl-4 border-l-2 border-primary/20">
                        {clinic.description}
                      </p>
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/60 flex items-center gap-2">
                          <span className="h-px w-6 bg-primary/20" />
                          Specialized Services
                        </h4>
                        <ServiceList items={clinic.services} scrollable />
                      </div>
                      <button
                        type="button"
                        onClick={handleBooking}
                        className="w-full py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all mt-4"
                      >
                        Secure Appointment
                      </button>
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
