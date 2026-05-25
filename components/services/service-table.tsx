// components/services/service-table.tsx
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
import { Edit, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@/types/entities/service.types';

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number, name: string) => void;
  additionalColumns?: Array<{
    header: string;
    accessor: (service: Service) => React.ReactNode;
  }>;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  additionalColumns = []
}: ServiceTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow className="border-b-2 border-gray-200">
              <TableHead className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider">
                Service Name
              </TableHead>
              {additionalColumns.map((col, idx) => (
                <TableHead key={idx} className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider">
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider">
                Duration
              </TableHead>
              <TableHead className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider text-right">
                Fee (ETB)
              </TableHead>
              <TableHead className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-5 text-base font-extrabold text-gray-800 uppercase tracking-wider text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="px-6 py-5">
                  <div>
                    <p className="font-semibold text-gray-900 text-base">{service.name}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                  </div>
                </TableCell>
                {additionalColumns.map((col, idx) => (
                  <TableCell key={idx} className="px-6 py-5">
                    {col.accessor(service)}
                  </TableCell>
                ))}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{service.durationMinutes} min</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-right font-bold text-gray-900 text-base">
                  ETB {service.standardFee.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge className={cn(
                    service.status === "Active" 
                      ? "bg-teal-100 text-teal-800 font-semibold px-3 py-1.5 rounded-lg text-sm" 
                      : "bg-gray-100 text-gray-600 font-semibold px-3 py-1.5 rounded-lg text-sm"
                  )}>
                    {service.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5 text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-teal-600 border-teal-300 hover:bg-teal-50 hover:text-teal-700 font-medium"
                      onClick={() => onEdit(service)}
                    >
                      <Edit className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 font-medium"
                      onClick={() => onDelete(service.id, service.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}