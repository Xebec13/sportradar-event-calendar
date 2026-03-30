'use client';

import { useState } from 'react';
import type { NewEventFormData, FormErrors } from '@/lib/types';
import { validateNewEvent, isFormValid } from '@/lib/form-validation';

const SPORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'soccer',     label: 'Soccer'     },
  { value: 'ice_hockey', label: 'Ice Hockey' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'tennis',     label: 'Tennis'     },
];

const EMPTY_FORM: NewEventFormData = {
  homeTeam: '', awayTeam: '', dateVenue: '', timeVenueUTC: '',
  sport: 'soccer', stadium: '', competitionName: '',
};

const labelClass = 'block text-neutral-50/60 text-xs uppercase tracking-wide font-semibold mb-1.5';
const errorClass = 'text-red-600 text-xs mt-1';

interface Props {
  onSubmit: (data: NewEventFormData) => void;
}

interface FieldProps {
  id: keyof NewEventFormData;
  label: string;
  optional?: boolean;
  error?: string;
  colSpan?: boolean;
  children: React.ReactNode;
}

function FormField({ id, label, optional, error, colSpan, children }: FieldProps) {
  return (
    <div className={colSpan ? 'md:col-span-2' : undefined}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optional && <span className="normal-case font-normal tracking-normal text-neutral-50/30"> (optional)</span>}
      </label>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function AddEventForm({ onSubmit }: Props) {
  const [form, setForm] = useState<NewEventFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof NewEventFormData, boolean>>>({});

  const inputClass = (field: keyof NewEventFormData) =>
    `w-full bg-neutral-900 border rounded-md px-3 py-2 text-sm text-neutral-50 outline-none transition-colors duration-150 ${
      errors[field] ? 'border-red-600/60' : 'border-blue-950 focus:border-red-600/40'
    }`;

  function handleChange(field: keyof NewEventFormData, value: string) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateNewEvent(updated)[field] }));
    }
  }

  function handleBlur(field: keyof NewEventFormData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateNewEvent(form)[field] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY_FORM).map((k) => [k, true])));
    const allErrors = validateNewEvent(form);
    setErrors(allErrors);
    if (!isFormValid(allErrors)) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        <FormField id="homeTeam" label="Home Team" error={errors.homeTeam}>
          <input id="homeTeam" type="text" value={form.homeTeam} placeholder="e.g. Real Madrid"
            onChange={(e) => handleChange('homeTeam', e.target.value)}
            onBlur={() => handleBlur('homeTeam')}
            className={inputClass('homeTeam')} />
        </FormField>

        <FormField id="awayTeam" label="Away Team" error={errors.awayTeam}>
          <input id="awayTeam" type="text" value={form.awayTeam} placeholder="e.g. Barcelona"
            onChange={(e) => handleChange('awayTeam', e.target.value)}
            onBlur={() => handleBlur('awayTeam')}
            className={inputClass('awayTeam')} />
        </FormField>

        <FormField id="dateVenue" label="Date" error={errors.dateVenue}>
          <input id="dateVenue" type="date" value={form.dateVenue}
            onChange={(e) => handleChange('dateVenue', e.target.value)}
            onBlur={() => handleBlur('dateVenue')}
            className={inputClass('dateVenue')} />
        </FormField>

        <FormField id="timeVenueUTC" label="Time (UTC)" error={errors.timeVenueUTC}>
          <input id="timeVenueUTC" type="time" value={form.timeVenueUTC}
            onChange={(e) => handleChange('timeVenueUTC', e.target.value)}
            onBlur={() => handleBlur('timeVenueUTC')}
            className={inputClass('timeVenueUTC')} />
        </FormField>

        <FormField id="sport" label="Sport" error={errors.sport}>
          <select id="sport" value={form.sport}
            onChange={(e) => handleChange('sport', e.target.value)}
            onBlur={() => handleBlur('sport')}
            className={inputClass('sport')}>
            {SPORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </FormField>

        <FormField id="stadium" label="Stadium" optional>
          <input id="stadium" type="text" value={form.stadium} placeholder="e.g. Santiago Bernabéu"
            onChange={(e) => handleChange('stadium', e.target.value)}
            className={inputClass('stadium')} />
        </FormField>

        <FormField id="competitionName" label="Competition" optional colSpan>
          <input id="competitionName" type="text" value={form.competitionName} placeholder="e.g. Champions League"
            onChange={(e) => handleChange('competitionName', e.target.value)}
            className={inputClass('competitionName')} />
        </FormField>

      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit"
          className="bg-red-600 text-neutral-50 rounded-md px-6 py-2.5 text-sm font-semibold tracking-wide cursor-pointer transition-colors duration-150 ease-in-out hover:bg-red-600/80">
          Add Event
        </button>
      </div>
    </form>
  );
}
