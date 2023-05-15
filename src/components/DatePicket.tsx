import Calendar from "react-calendar";
import { Value, View } from "react-calendar/dist/cjs/shared/types";
import "react-calendar/dist/Calendar.css";
import "../calendar.css";
import moment from "moment";
import { IconCalendarPlus, IconChevronDown } from "@tabler/icons-react";
import { useLayoutEffect, useRef, useState } from "react";

function dateLimit(date: string | undefined) {
  if (date === undefined) return new Date();
  return new Date(
    Number(date.split("-")[0]),
    Number(date.split("-")[1]) - 1,
    Number(date.split("-")[2])
  );
}

interface ReactCalendar {
  date: Date;
  view: View;
}

interface Props {
  dates: string[];
  value: Value;
  onChange: (value: Value) => void;
}

export const DatePicket = ({ dates, value, onChange }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function tileDisabled({ date, view }: ReactCalendar) {
    const fecha = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    return view === "month" && !dates.includes(fecha);
  }

  function formatNavigationLabel({ date, view }: ReactCalendar) {
    switch (view) {
      case "month":
        return date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      case "year":
        return date.toLocaleString("default", { year: "numeric" });
      case "decade":
        return `${date.getFullYear() - 9} - ${date.getFullYear()}`;
      default:
        return "";
    }
  }

  function handleChange(value: Value) {
    onChange(value);
    setIsOpen(false);
  }

  useLayoutEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-max group">
      <Calendar
        className={[
          "!bg-white shadow-lg !border-neutral-200 !p-3 !rounded-xl !absolute top-[110%] left-1/2",
          "transition-all duration-200 origin-top",
          "-translate-x-1/2 !min-w-[300px]",
          isOpen
            ? "visible opacity-100 scale-100"
            : "scale-90 opacity-0 invisible",
        ].join(" ")}
        tileClassName="disabled:!bg-neutral-300"
        onChange={handleChange}
        minDate={dateLimit(dates[0])}
        maxDate={dateLimit(dates.at(-1))}
        value={value}
        tileDisabled={tileDisabled}
        showNeighboringMonth={false}
        navigationLabel={formatNavigationLabel}
      />

      <section
        className="flex items-center gap-4 px-3 py-2 rounded-lg bg-neutral-200 border-2 border-transparent hover:border-indigo-500 hover:transition-colors duration-200 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IconCalendarPlus className="text-neutral-700" size={19} />
        <span className="pt-0.5">
          {value === null
            ? "dd-mm-yyyy"
            : moment(value.valueOf()).format("DD-MM-yyyy")}
        </span>
        <IconChevronDown
          size={19}
          className={`${
            isOpen ? "rotate-180" : ""
          } transition-transform duration-200 text-neutral-700`}
        />
      </section>
    </div>
  );
};
