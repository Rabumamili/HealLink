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
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Service</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-gray-50">
                <TableCell>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {service.description}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    {service.durationMinutes} min
                  </div>
                </TableCell>

                <TableCell className="text-right font-semibold">
                  ETB {service.standardFee.toLocaleString()}
                </TableCell>

                <TableCell>
                  <Badge
                    className={cn(
                      service.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {service.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}

                    {onDelete && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => onDelete(service.id, service.name)}
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

      {/* MOBILE CARDS (NO OVERFLOW) */}
      <div className="md:hidden divide-y">
        {services.map((service) => (
          <div key={service.id} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{service.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* 3 DOT MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit?.(service)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete?.(service.id, service.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>{service.durationMinutes} min</span>
              <span className="font-semibold">
                ETB {service.standardFee.toLocaleString()}
              </span>
            </div>

            <Badge
              className={cn(
                service.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
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