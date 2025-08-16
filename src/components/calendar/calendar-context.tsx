"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";

type CalendarDialogType = "add" | "edit" | "delete";

interface CalendarContextType {
  open: CalendarDialogType | null;
  setOpen: (str: CalendarDialogType | null) => void;
  selectedDate: DateSelectArg | null;
  setSelectedDate: (date: DateSelectArg | null) => void;
  selectedEvent: EventClickArg | null;
  setSelectedEvent: (date: EventClickArg | null) => void;
}

const CalendarContext = React.createContext<CalendarContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function CalendarProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CalendarDialogType>(null);
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null
  );

  return (
    <CalendarContext
      value={{
        open,
        setOpen,
        selectedDate,
        setSelectedDate,
        selectedEvent,
        setSelectedEvent,
      }}
    >
      {children}
    </CalendarContext>
  );
}

export const useCalendar = () => {
  const calendarContext = React.useContext(CalendarContext);

  if (!calendarContext) {
    throw new Error("useCalendar has to be used within <CalendarContext>");
  }

  return calendarContext;
};
