'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Clock, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@/services/service.service';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ServiceTableProps {
  services: Service[];
  onEdit?: (service: Service) => void;
  onDelete?: (id: number, name: string) => void;
}

export function ServiceTable({ services, onEdit, onDelete }: ServiceTableProps) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
      {/* DESKTOP TABLE */}
      <div className="hidden lg:block w-full">
        <Table className="table-fixed">
          <colgroup>
            <col className="w-[50%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>
          <TableHeader>
            <TableRow className="border-b border-slate-300 bg-gradient-to-r from-slate-50 to-slate-100/50">
              <TableHead className="border-r border-slate-300 px-6 font-semibold text-slate-700">Service</TableHead>
              <TableHead className="border-r border-slate-300 px-6 font-semibold text-slate-700">Duration</TableHead>
              <TableHead className="border-r border-slate-300 px-6 text-right font-semibold text-slate-700">Fee</TableHead>
              <TableHead className="border-r border-slate-300 px-6 font-semibold text-slate-700">Status</TableHead>
              <TableHead className="px-6 text-center font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="border-b border-slate-300 transition-colors hover:bg-slate-50/80">
                <TableCell className="min-w-0 whitespace-normal border-r border-slate-200 px-6 py-4">
                  <p className="line-clamp-2 text-xl font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                    {service.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500 [overflow-wrap:anywhere]">
                    {service.description}
                  </p>
                </TableCell>

                <TableCell className="whitespace-normal border-r border-slate-200 px-6 py-4">
                  <div className="flex min-w-0 items-center gap-2 text-base text-slate-600">
                    <Clock className="h-4 w-4 shrink-0 text-[#008282]" />
                    <span className="truncate">{service.durationMinutes} min</span>
                  </div>
                </TableCell>

                <TableCell className="whitespace-normal border-r border-slate-200 px-6 py-4 text-right text-base font-semibold text-slate-900">
                  ETB {service.standardFee.toLocaleString()}
                </TableCell>

                <TableCell className="whitespace-normal border-r border-slate-200 px-6 py-4">
                  <Badge
                    className={cn(
                      'max-w-full px-3 py-1.5 text-sm font-medium',
                      service.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    )}
                  >
                    {service.status}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-normal px-6 py-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(service);
                        }}
                        className="hover:bg-[#008282]/10 hover:text-[#008282] hover:border-[#008282]"
                      >
                        <Edit className="mr-1 h-4 w-4 shrink-0" />
                        Edit
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(service.id, service.name);
                        }}
                      >
                        <Trash2 className="mr-1 h-4 w-4 shrink-0" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARDS */}
      <div className="divide-y divide-slate-300 lg:hidden">
        {services.map((service) => (
          <div key={service.id} className="space-y-4 bg-white p-4 transition-colors hover:bg-slate-50/50 sm:p-5">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="line-clamp-2 text-xl font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                  {service.name}
                </p>
                <p className="mt-1 line-clamp-3 text-sm leading-5 text-slate-500 [overflow-wrap:anywhere]">
                  {service.description}
                </p>
              </div>

              {/* 3 DOT MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 hover:bg-slate-100"
                    aria-label={`Open actions for ${service.name}`}
                  >
                    <MoreVertical className="h-5 w-5 text-slate-600" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-32">
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(service);
                      }}
                      className="hover:bg-[#008282]/10 hover:text-[#008282] cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(service.id, service.name);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col gap-3 text-base sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 shrink-0 text-[#008282]" />
                {service.durationMinutes} min
              </div>
              <span className="font-semibold text-slate-900 [overflow-wrap:anywhere]">
                ETB {service.standardFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end">
              <Badge
                className={cn(
                  'max-w-full px-3 py-1.5 text-sm font-medium',
                  service.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                )}
              >
                {service.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
