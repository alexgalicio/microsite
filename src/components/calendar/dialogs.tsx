"use client";

import { useCalendar } from "./calendar-context";
import { CalendarActionDialog } from "./action-dialog";
import { CalendarDeleteDialog } from "./delete-dialog";

export function CalendarDialogs() {
  const { open, setOpen, selectedDate, setSelectedEvent, selectedEvent } =
    useCalendar();
  return (
    <>
      <CalendarActionDialog
        key="calendar-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        selectedDate={selectedDate}
      />

      {selectedEvent && (
        <>
          <CalendarActionDialog
            key={`calendar-edit-${selectedEvent.event.title}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setSelectedEvent(null);
              }, 500);
            }}
            selectedEvent={selectedEvent}
          />

          <CalendarDeleteDialog
            key={`calendar-delete-${selectedEvent.event.title}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setSelectedEvent(null);
              }, 500);
            }}
            selectedEvent={selectedEvent}
          />
        </>
      )}
    </>
  );
}
