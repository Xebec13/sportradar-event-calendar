import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddEventForm from '@/components/forms/AddEventForm';

describe('AddEventForm — rendering', () => {
  it('renders all required fields', () => {
    render(<AddEventForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/home team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/away team/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sport/i)).toBeInTheDocument();
  });

  it('renders optional fields (stadium, competition)', () => {
    render(<AddEventForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/stadium/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/competition/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<AddEventForm onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add event/i })).toBeInTheDocument();
  });
});

describe('AddEventForm — validation on submit', () => {
  it('does not call onSubmit when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(<AddEventForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /add event/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows error messages when submitting empty form', async () => {
    render(<AddEventForm onSubmit={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /add event/i }));

    expect(screen.getByText(/home team is required/i)).toBeInTheDocument();
    expect(screen.getByText(/away team is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn();
    render(<AddEventForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/home team/i), 'Real Madrid');
    await userEvent.type(screen.getByLabelText(/away team/i), 'Barcelona');
    await userEvent.type(screen.getByLabelText(/date/i), '2025-06-15');
    await userEvent.type(screen.getByLabelText(/time/i), '20:00');

    await userEvent.click(screen.getByRole('button', { name: /add event/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        dateVenue: '2025-06-15',
        timeVenueUTC: '20:00',
      }),
    );
  });
});

describe('AddEventForm — inline validation (onBlur)', () => {
  it('shows error after leaving homeTeam field empty', async () => {
    render(<AddEventForm onSubmit={vi.fn()} />);

    await userEvent.click(screen.getByLabelText(/home team/i));
    await userEvent.tab();

    expect(screen.getByText(/home team is required/i)).toBeInTheDocument();
  });

  it('clears error after correcting invalid field', async () => {
    render(<AddEventForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText(/home team/i);
    await userEvent.click(input);
    await userEvent.tab();
    expect(screen.getByText(/home team is required/i)).toBeInTheDocument();

    await userEvent.type(input, 'Real Madrid');
    await userEvent.tab();
    expect(screen.queryByText(/home team is required/i)).not.toBeInTheDocument();
  });

  it('shows same-team error when awayTeam matches homeTeam', async () => {
    render(<AddEventForm onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/home team/i), 'Real Madrid');
    await userEvent.type(screen.getByLabelText(/away team/i), 'Real Madrid');
    await userEvent.tab();

    expect(screen.getByText(/must differ/i)).toBeInTheDocument();
  });
});
