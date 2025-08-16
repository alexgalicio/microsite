"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { handleError } from "@/lib/utils";
import { toast } from "sonner";
import { useCalendar } from "./calendar-context";
import { ColorPicker } from "./color-picker";
import React from "react";
import {
  createCalendarEvent,
  updateCalendarEvent,
} from "@/lib/actions/calendar";
import { DateTimePicker } from "./date-time-picker";

const formSchema = z
  .object({
    title: z
      .string()
      .min(1, "Event title is required")
      .max(100, "Title too long"),
    start: z.string(),
    end: z.string(),
    color: z.string().optional(),
    isEdit: z.boolean(),
  })
  .refine((data) => new Date(data.end) > new Date(data.start), {
    message: "End time must be after start time",
    path: ["end"],
  });

type EventForm = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: DateSelectArg | null;
  selectedEvent?: EventClickArg | null;
}

export function CalendarActionDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedEvent,
}: Props) {
  const isEdit = !!selectedEvent;
  const [isLoading, setIsLoading] = useState(false);
  const { setOpen } = useCalendar();

  function getDefaultValues() {
    if (isEdit && selectedEvent) {
      return {
        title: selectedEvent.event.title || "",
        color: selectedEvent.event.backgroundColor || "#f5222d",
        start:
          selectedEvent.event.start?.toISOString() || new Date().toISOString(),
        end: selectedEvent.event.end?.toISOString() || new Date().toISOString(),
        isEdit,
      };
    }
    if (selectedDate) {
      return {
        title: "",
        color: "#f5222d",
        start: selectedDate.start.toISOString(),
        end: selectedDate.end.toISOString(),
        isEdit,
      };
    }
    return {
      title: "",
      color: "#f5222d",
      start: new Date().toISOString(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      isEdit,
    };
  }

  const form = useForm<EventForm>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedDate, selectedEvent]);

  async function onSubmit(values: EventForm) {
    setIsLoading(true);

    try {
      if (isEdit && selectedEvent) {
        const editRes = await updateCalendarEvent(
          selectedEvent.event.id,
          values.title,
          selectedEvent.event.allDay,
          values.start,
          values.end,
          values.color
        );

        if (editRes.success === false) {
          console.error(handleError(editRes.error));
        }
      } else if (selectedDate) {
        const addRes = await createCalendarEvent(
          values.title,
          values.start,
          values.end,
          false,
          values.color
        );

        if (addRes.success === false) {
          console.error(handleError(addRes.error));
        }
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(handleError(error));
      console.error("Calendar Action Dialog Error: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEdit ? "Edit Event" : "Create New Event"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DateTimePicker field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      background={field.value || "#f5222d"}
                      setBackground={(color) => {
                        field.onChange(color);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          {isEdit && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen("delete")}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            form="event-form"
            className="w-30"
            disabled={isLoading || !form.formState.isDirty}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
