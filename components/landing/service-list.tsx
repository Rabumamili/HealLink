import { HealLinkIcon, type HealLinkIconName } from '@/components/icons/healink-icon';
import type { ServiceItem } from './landing-data';

interface ServiceListProps {
  items: ServiceItem[];
  icon?: 'check_circle' | 'science';
  scrollable?: boolean;
}

export function ServiceList({ items, icon = 'check_circle', scrollable }: ServiceListProps) {
  const isScrollable = scrollable ?? items.length > 4;
  const iconName: HealLinkIconName = icon;

  return (
    <div
      className={`flex flex-col gap-y-3 py-1 ${isScrollable ? 'max-h-[300px] overflow-y-auto pr-3 custom-scrollbar' : ''}`}
    >
      {items.map((item) => (
        <div
          key={item.name}
          className="group/service flex items-center justify-between p-3.5 rounded-xl border border-outline-variant/20 bg-white hover:bg-surface-container-low hover:border-primary/40 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <HealLinkIcon
              name={iconName}
              size={18}
              className="text-primary opacity-70 group-hover/service:opacity-100 transition-opacity shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-on-surface group-hover/service:text-primary transition-colors leading-tight truncate">
                {item.name}
              </span>
              {item.preparation && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <HealLinkIcon name="info" size={12} className="text-outline" />
                  <span className="text-[11px] text-on-surface-variant font-medium">{item.preparation}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-baseline gap-1 ml-3 shrink-0">
            <span className="text-[14px] font-bold text-on-surface">{item.fee}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-outline-variant">ETB</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServiceBadges({ items }: { items: ServiceItem[] }) {
  return (
    <>
      {items.slice(0, 2).map((item) => (
        <span
          key={item.name}
          className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium uppercase tracking-wider"
        >
          {item.name}
        </span>
      ))}
    </>
  );
}
