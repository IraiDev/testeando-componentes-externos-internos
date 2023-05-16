import CalendarComponent from "react-calendar";
import { Value, View } from "react-calendar/dist/cjs/shared/types";
import "react-calendar/dist/Calendar.css";
import "../calendar.css";
import moment from "moment";
import {
  IconCalendarPlus,
  IconChevronDown,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import { useLayoutEffect, useRef, useState } from "react";

function dateAdapter(date: string | undefined) {
  if (date === undefined) return new Date();
  return new Date(
    Number(date.split("-")[0]),
    Number(date.split("-")[1]) - 1,
    Number(date.split("-")[2])
  );
}

export function dateFormater(
  value: Value,
  format: string | undefined = "yyyy-MM-DD"
): string {
  return moment(value?.valueOf()).format(format);
}

interface ReactCalendar {
  date: Date;
  view: View;
}

interface Props {
  label: string;
  disabled?: boolean;
  dates: string[];
  value: Value;
  onChange: (value: Value) => void;
}

const Calendar = ({
  dates,
  value,
  disabled = false,
  label,
  onChange,
}: Props) => {
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

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-max group">
      <CalendarComponent
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
        minDate={dateAdapter(dates[0])}
        maxDate={dateAdapter(dates.at(-1))}
        value={value}
        tileDisabled={tileDisabled}
        showNeighboringMonth={false}
        navigationLabel={formatNavigationLabel}
      ></CalendarComponent>
      <span className="font-semibold text-center block mx-auto mb-0.5">
        {label}
      </span>
      <section
        className={[
          "flex items-center gap-4 px-3 py-1.5 rounded-2xl border-2 border-transparent",
          "transition-colors duration-200",
          disabled
            ? "bg-neutral-300 text-neutral-500"
            : "cursor-pointer hover:border-indigo-500 bg-neutral-200",
        ].join(" ")}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <IconCalendarPlus size={19} />
        <span className="pt-0.5">
          {value === null ? "dd-mm-yyyy" : dateFormater(value, "DD-MM-yyyy")}
        </span>
        <IconChevronDown
          size={19}
          className={[
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </section>
    </div>
  );
};

export const DatePicker = ({
  dates,
  value,
  disabled = false,
  label,
  onChange,
}: Props) => {
  const handleClick = (modifier: number) => {
    const idx = dates.findIndex((el) => el === dateFormater(value));
    if (idx === -1) return;
    const newValue = dateAdapter(dates[idx + modifier]);
    onChange(newValue);
  };
  return (
    <div className="flex items-end gap-1.5">
      <Button
        onClick={() => handleClick(-1)}
        disabled={dates[0] === dateFormater(value) || disabled}
      >
        <IconArrowNarrowLeft size={19} />
      </Button>
      <Calendar
        label={label}
        disabled={disabled}
        dates={dates}
        value={value}
        onChange={onChange}
      />
      <Button
        onClick={() => handleClick(1)}
        disabled={dates.at(-1) === dateFormater(value) || disabled}
      >
        <IconArrowNarrowRight size={19} />
      </Button>
    </div>
  );
};

const Button = ({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={[
        "hover:bg-neutral-200 h-9 w-9 flex items-center justify-center rounded-full",
        "transition-colors duration-200 mb-0.5",
        "disabled:hover:bg-neutral-300 disabled:bg-neutral-300 disabled:text-neutral-500",
        "disabled:cursor-not-allowed",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
