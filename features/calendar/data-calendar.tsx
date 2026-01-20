"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  getDay,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale"; // Standard export path in 2026
import "react-big-calendar/lib/css/react-big-calendar.css"; // Correct path for compiled CSS

import { Task } from "../tasks/types";
import { EventCard } from "./eventCard";
import { useState } from "react";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import "./data-calendar.css";
import { Views } from "react-big-calendar";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const availableViews = [Views.WEEK, Views.WORK_WEEK, Views.MONTH];

interface DataCalendarProps {
  data: Task[];
}

interface CustomToolBarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  views: string[];
  onView: (view: string) => void;
  view: string;
}

const CustomToolBar = ({
  date,
  onNavigate,
  views,
  onView,
  view,
}: CustomToolBarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
        <Button
          onClick={() => {
            onNavigate("TODAY");
          }}
          variant={"outline"}
        >
          Today
        </Button>
        <Button
          onClick={() => {
            onNavigate("PREV");
          }}
          variant="outline"
          size={"icon"}
        >
          <ChevronLeftIcon size={5} />
        </Button>
        <div className="flex justify-center items-center border border-input rounded-md py-2 px-3 h-8 w-full lg:w-auto">
          <CalendarIcon className="size-5 mr-2" />
          <p className="text-sm">{format(date, "MMMM yyyy")}</p>
        </div>
        <Button
          onClick={() => {
            onNavigate("NEXT");
          }}
          variant="outline"
          size={"icon"}
        >
          <ChevronRightIcon size={5} />
        </Button>
      </div>
      <div className="flex gap-x-2 p-1 rounded-md">
        {views.map((name) => (
          <Button
            key={name}
            onClick={() => onView(name)}
            variant={view === name ? "secondary" : "outline"}
            className="capitalize"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "TODAY") setValue(new Date());
  };

  const [view, setView] = useState<any>(Views.MONTH); // Default view
  console.log(view);

  return (
    <div className="py-4" style={{ height: "700px" }}>
      <Calendar
        localizer={localizer}
        date={value}
        events={data}
        views={availableViews}
        view={view}
        onView={(newView) => setView(newView)}
        defaultView="month"
        startAccessor={(event: Task) => new Date(event.dueDate || "")}
        endAccessor={(event: Task) => new Date(event.dueDate || "")}
        titleAccessor="name" // Use 'name' from Task as the calendar title
        style={{ height: "100%" }}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer?.format(date, "EEE", culture) ?? "",
        }}
        components={{
          event: ({ event }) => (
            <EventCard
              id={event.$id}
              title={event.name}
              status={event.status}
            />
          ),
          toolbar: (toolbarProps) => (
            <CustomToolBar
              date={toolbarProps.date}
              onNavigate={handleNavigate}
              views={availableViews}
              onView={setView}
              view={view}
            />
          ),
        }}
        onNavigate={(newDate) => setValue(newDate)} // Sync external state
      />
    </div>
  );
};
