'use client';

import { useState } from 'react';
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
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
              <TableHead className="font-semibold text-slate-700">Service</TableHead>
              <TableHead className="font-semibold text-slate-700">Duration</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Fee</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="text-center font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-200">
                <TableCell className="py-4">
                  <p className="font-semibold text-slate-900 text-base">{service.name}</p>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    {service.description}
                  </p>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-base text-slate-600">
                    <Clock className="h-4 w-4 text-[#008282]" />
                    {service.durationMinutes} min
                  </div>
                </TableCell>

                <TableCell className="text-right font-semibold text-slate-900 text-base py-4">
                  ETB {service.standardFee.toLocaleString()}
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    className={cn(
                      'font-medium px-3 py-1.5 text-sm',
                      service.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    )}
                  >
                    {service.status}
                  </Badge>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex justify-center gap-2">
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
                        <Edit className="h-4 w-4 mr-1" />
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
                        <Trash2 className="h-4 w-4 mr-1" />
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
      <div className="md:hidden divide-y divide-slate-200">
        {services.map((service) => (
          <div key={service.id} className="p-5 space-y-4 bg-white hover:bg-slate-50/50 transition-colors">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-base">{service.name}</p>
                <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                  {service.description}
                </p>
              </div>

              {/* 3 DOT MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-slate-100"
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

            <div className="flex justify-between items-center text-base">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-[#008282]" />
                {service.durationMinutes} min
              </div>
              <span className="font-semibold text-slate-900">
                ETB {service.standardFee.toLocaleString()}
              </span>
            </div>

            <Badge
              className={cn(
                'font-medium px-3 py-1.5 text-sm',
                service.status === 'Active'
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              )}
            >
              {service.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}