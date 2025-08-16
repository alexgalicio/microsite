"use client";

import Calendar from "@/components/calendar/calendar";
import CalendarProvider from "@/components/calendar/calendar-context";
import { CalendarDialogs } from "@/components/calendar/dialogs";

export default function Page() {
  return (
    <CalendarProvider>
      <Calendar />
      <CalendarDialogs />
    </CalendarProvider>
  );
}
