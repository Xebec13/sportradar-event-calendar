import Calendar from '@/components/calendar/Calendar';

interface Props {
  searchParams: Promise<{ date?: string; sport?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { date, sport } = await searchParams;
  return <Calendar date={date} sport={sport} />;
}
