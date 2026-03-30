'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/hooks/use-events';
import Icon from '@/components/ui/icons/Icons';
import GridBg from '@/components/ui/GridBg';
import AddEventForm from '@/components/forms/AddEventForm';
import type { NewEventFormData } from '@/lib/types';

export default function Form() {
  const router = useRouter();
  const { addEvent } = useEvents();

  function handleSubmit(data: NewEventFormData) {
    addEvent(data);
    router.push('/');
  }

  return (
    <section className="relative flex flex-col min-h-screen p-3 md:p-6 max-w-full md:max-w-3/4 mx-auto w-full">
      <GridBg />
      <div className="flex items-center gap-3 my-5">
        <Link href="/" className="flex items-center py-1 px-2 md:py-2 md:px-4 rounded-md  bg-blue-950/80 transition-colors duration-150 ease-in-out hover:bg-blue-900/80 inset-shadow-xs inset-shadow-neutral-950/60 cursor-pointer">
          <Icon name="ArrowLeft" size={18} />
        </Link>
        <h1 className="text-lg md:text-xl font-semibold tracking-wide text-neutral-50">
          Add Event
        </h1>
      </div>
      <div className="bg-blue-950/80 border-blue-950 border-2 shadow-lg shadow-blue-950 rounded-md p-4 md:p-6">
        <AddEventForm onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
