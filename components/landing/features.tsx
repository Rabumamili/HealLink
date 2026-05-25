import { HealLinkIcon, type HealLinkIconName } from '@/components/icons/healink-icon';

const cards: {
  icon: HealLinkIconName;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    icon: 'hub',
    title: 'Centralized Network',
    description:
      'Connect with the top clinics and specialists across Addis Ababa and beyond in one seamless interface.',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    icon: 'lab_research',
    title: 'Precision Diagnostics',
    description:
      'Access laboratory results and imaging digitally. Fast, accurate, and always within reach.',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-secondary',
  },
  {
    icon: 'health_and_safety',
    title: 'Patient-Centric',
    description:
      'Your health records, history, and prescriptions secured with advanced clinical standards.',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
];

export function Features() {
  return (
    <section className="py-margin-lg bg-surface-container-lowest" id="about">
      <div className="max-w-[1440px] mx-auto px-4 md:px-container-padding">
        <div className="grid md:grid-cols-3 gap-6 md:gap-margin-md">
          {cards.map((card) => (
            <div
              key={card.title}
              className="p-6 md:p-margin-md rounded-[24px] bg-white border border-outline-variant/30 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} mb-6`}
              >
                <HealLinkIcon name={card.icon} size={24} />
              </div>
              <h3 className="font-headline-md text-[24px] font-semibold text-on-surface mb-4">
                {card.title}
              </h3>
              <p className="text-on-surface-variant font-body-md text-[16px] leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
