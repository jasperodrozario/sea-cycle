"use client";

import React from "react";
import { Bell, AlertTriangle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  {
    id: "M001",
    buoyId: "B-203",
    message: "Battery level is low (15%). Replacement recommended.",
    priority: "High",
  },
  {
    id: "M002",
    buoyId: "B-101",
    message: "GPS signal lost. Investigating.",
    priority: "Critical",
  },
  {
    id: "M003",
    buoyId: "B-405",
    message: "Routine sensor checkup due in 3 days.",
    priority: "Medium",
  },
];

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "Critical":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "High":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Bell className="h-5 w-5 text-blue-500" />;
  }
};

export default function MaintenanceAlerts({ alerts = mockAlerts }) {
  const [visibleAlerts, setVisibleAlerts] = React.useState(alerts);

  const dismissAlert = (id) => {
    setVisibleAlerts(visibleAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Maintenance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {visibleAlerts.length > 0 ? (
          <ul className="space-y-4">
            {visibleAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-shrink-0">
                  {getPriorityIcon(alert.priority)}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">Buoy {alert.buoyId}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-7 w-7"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No active maintenance alerts.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
