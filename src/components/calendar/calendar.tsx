"use client";

import { useState, useEffect, useRef } from "react";
import { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { useCalendar } from "./calendar-context";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";
import { CalendarEvent } from "@/lib/types";
import FullCalendar from "@fullcalendar/react";
import UpcomingEvents from "./upcoming-events";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./styles.css";

export default function Calendar() {
  const { session } = useSession();
  const { setOpen, setSelectedDate, setSelectedEvent } = useCalendar();
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }

  useEffect(() => {
    const supabase = createClerkSupabaseClient();

    const mapEvent = (event: any): CalendarEvent => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      all_day: event.all_day,
      color: event.color || undefined,
    });

    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*");

      if (!error) {
        setEvents(data.map(mapEvent));
      } else {
        console.error("Error fetching events", error);
      }
    };

    fetchEvents();

    const channel = supabase
      .channel("realtime:calendar_events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendar_events" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setEvents((prev) => [...prev, mapEvent(payload.new)]);
          }
          if (payload.eventType === "UPDATE") {
            setEvents((prev) =>
              prev.map((ev) =>
                ev.id === payload.new.id ? mapEvent(payload.new) : ev
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setEvents((prev) => prev.filter((ev) => ev.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleDateSelect = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setOpen("add");
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo);
    setOpen("edit");
  };

  return (
    <div>
      <div className="flex w-full justify-start items-start gap-2">
        <UpcomingEvents
          events={events}
          onEventClick={(event) => {
            const calendarApi = calendarRef.current?.getApi();
            if (!calendarApi) return;
            const fullCalendarEvent = calendarApi.getEventById(event.id);
            if (!fullCalendarEvent) return;

            setSelectedEvent({ event: fullCalendarEvent } as any);
            setOpen("edit");
          }}
        />

        <div className="w-full xl:w-9/12">
          <FullCalendar
            ref={calendarRef}
            height={"85vh"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable
            selectMirror
            dayMaxEvents
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDisplay="block"
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "narrow",
              omitZeroMinute: true,
            }}
            eventDrop={async (info) => {
              const supabase = createClerkSupabaseClient();
              const { error } = await supabase
                .from("calendar_events")
                .update({
                  start: info.event.start?.toISOString(),
                  end: info.event.end?.toISOString(),
                  all_day: info.event.allDay,
                })
                .eq("id", info.event.id);

              if (error) {
                toast.error("Failed to move event");
                info.revert(); // revert change in UI
              }
            }}
            eventResize={async (info) => {
              const supabase = createClerkSupabaseClient();
              const { error } = await supabase
                .from("calendar_events")
                .update({
                  start: info.event.start?.toISOString(),
                  end: info.event.end?.toISOString(),
                })
                .eq("id", info.event.id);

              if (error) {
                toast.error("Failed to resize event");
                info.revert();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
