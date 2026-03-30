import Calendar from '@/components/calendar/Calendar';

interface Props {
  searchParams: Promise<{ date?: string; sport?: string }>;
}

function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export default async function Home({ searchParams }: Props) {
  const { date, sport } = await searchParams;
  return <Calendar date={date ?? getTodayString()} sport={sport} />;
}
