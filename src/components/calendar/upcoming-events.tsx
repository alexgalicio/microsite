"use client";

import { formatDate } from "@fullcalendar/core";
import { Calendar, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent } from "@/lib/types";
import { EmptyState } from "../ui/empty-state";

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export default function UpcomingEvents({
  events,
  onEventClick,
}: UpcomingEventsProps) {
  const today = new Date();
  const upcomingEvents = events
    .filter((event) => new Date(event.start) >= today)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="w-3/12 hidden xl:block">
      <div className="flex items-center gap-2 pb-4">
        <span className="text-xl font-bold">Upcoming Events</span>
        <Badge variant="outline" className="text-xs">
          {upcomingEvents.length} Events
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-9.8rem)] pr-4">
        {upcomingEvents.length <= 0 ? (
          <EmptyState
            title="No Events Present"
            description="Get started by creating a new event."
            icon={<Calendar className="w-6 h-6 text-muted-foreground" />}
          />
        ) : (
          <ul className="border rounded-md divide-y">
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="cursor-pointer px-4 py-2 hover:bg-muted transition"
              >
                <div className="flex items-center gap-4 text-blue-800">
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color || "#f5222d" }}
                  />
                  <div>
                    <div className="space-y-2">
                      <div className="text-foreground font-medium">
                        {event.title}
                      </div>

                      <div className="flex items-center text-muted-foreground text-xs gap-1">
                        <Clock size={12} />
                        {formatDate(event.start!, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
