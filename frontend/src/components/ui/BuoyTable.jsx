"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

// Helper to determine badge variant based on status
const getStatusColorCode = (status) => {
  switch (status) {
    case "Critical":
      return "bg-red-500";
    case "Overflowing":
      return "bg-black";
    case "Elevated":
      return "bg-yellow-400";
    default:
      return "bg-green-600";
  }
};

export default function BuoyTable({ buoys }) {
  const [filter, setFilter] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    Normal: true,
    Elevated: true,
    Critical: true,
    Overflowing: true,
  });

  const onStatusChange = (status, checked) => {
    setStatusFilters((prev) => ({ ...prev, [status]: checked }));
  };

  const filteredBuoys = useMemo(() => {
    return buoys.filter((buoy) => {
      const searchMatch =
        filter === "" ||
        buoy.buoy_id.toLowerCase().includes(filter.toLowerCase()) ||
        (buoy.location &&
          buoy.location.toLowerCase().includes(filter.toLowerCase()));
      const statusMatch = statusFilters[buoy.fill_status];
      return searchMatch && statusMatch;
    });
  }, [buoys, filter, statusFilters]);

  // Unique statuses for the filter dropdown
  const uniqueStatuses = [...new Set(buoys.map((b) => b.fill_status))];

  return (
    <div className="border rounded-lg w-full bg-card text-card-foreground shadow-sm">
      <div className="p-4 flex items-center gap-4">
        <Input
          placeholder="Filter by ID or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Status
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {uniqueStatuses.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilters[status]}
                onCheckedChange={(checked) => onStatusChange(status, checked)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-auto px-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buoy ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fill Level</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuoys.length > 0 ? (
              filteredBuoys.map((buoy) => (
                <TableRow key={buoy.buoy_id}>
                  <TableCell className="font-medium">{buoy.buoy_id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColorCode(buoy.fill_status)}>
                      {buoy.fill_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{buoy.fill_level_percent}%</TableCell>
                  <TableCell>{buoy.gps.latitude || "N/A"}</TableCell>
                  <TableCell>{buoy.gps.longitude || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
