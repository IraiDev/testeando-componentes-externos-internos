import { Value } from "react-calendar/dist/cjs/shared/types";
import { DatePicker, dateFormater } from "../components/DatePicker";
import { useState } from "react";

const dates = [
  "2023-05-09",
  "2023-05-10",
  "2023-05-11",
  "2023-05-13",
  "2023-05-15",
  "2023-05-16",
  "2023-05-17",
  "2023-05-18",
  "2023-05-19",
  "2023-05-20",
  "2023-05-21",
  "2023-05-22",
  "2023-05-23",
  "2023-06-11",
  "2023-06-12",
];

function HomePage() {
  const [date, setDate] = useState<Value | null>(null);
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center">
      <DatePicker label="Fecha" dates={dates} value={date} onChange={setDate} />
      <span className="block mx-auto">{dateFormater(date)}</span>
    </main>
  );
}

export default HomePage;
