"use client";

import { getNextEvents } from "@/lib/actions/calendar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fadeUp } from "./animation";

interface EventItem {
  day: string;
  month: string;
  date: string;
  title: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getNextEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section id="calendar">
      <div className="bg-primary/80 py-[45px] min-h-[205px] overflow-hidden">
        <div className="container mx-auto px-4 xl:px-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="p-4 text-white">
                  <div className="flex gap-4 items-stretch mx-auto max-w-[300px]">
                    <div className="flex flex-col justify-center items-center">
                      <div className="font-medium uppercase">{event.day}</div>
                      <div className="text-4xl font-bold uppercase">
                        {event.month}
                      </div>
                      <div className="text-5xl font-bold">{event.date}</div>
                    </div>
                    <div className="leading-tight whitespace-pre-line border-l border-white/30 pl-4 ml-4 flex items-center">
                      {event.title}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
