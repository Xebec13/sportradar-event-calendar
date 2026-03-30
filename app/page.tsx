import CalendarControls from "@/components/calendar/CalendarControls";
import CalendarEventList from "@/components/calendar/CalendarEventList";
import CalendarHeader from "@/components/calendar/CalendarHeader";

export default function Home() {
  return (
    <main>
      <CalendarHeader />
      <CalendarControls />
      <CalendarEventList/>
    </main>
  )
}
