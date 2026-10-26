import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlannerForm } from '../../src/components/PlannerForm';

describe('PlannerForm Component', () => {
  it('renders all event types and essential form inputs', () => {
    const onSubmit = vi.fn();
    render(<PlannerForm onSubmit={onSubmit} isLoading={false} />);

    expect(screen.getByRole('heading', { name: 'Wedding' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Milestone Birthday' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Community & Gala' })).toBeInTheDocument();

    expect(screen.getByLabelText(/Event Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Host City \/ Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Guest Count/i)).toBeInTheDocument();
  });

  it('displays validation errors and prevents submission when required fields are missing', () => {
    const onSubmit = vi.fn();
    render(<PlannerForm onSubmit={onSubmit} isLoading={false} />);

    const cityInput = screen.getByLabelText(/Host City \/ Destination/i);
    fireEvent.change(cityInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', {
      name: /Formulate Blueprint with Celebrate AI/i,
    });
    fireEvent.click(submitBtn);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/City is required/i)).toBeInTheDocument();
  });

  it('successfully submits when valid inputs are provided', () => {
    const onSubmit = vi.fn();
    render(<PlannerForm onSubmit={onSubmit} isLoading={false} />);

    const cityInput = screen.getByLabelText(/Host City \/ Destination/i);
    fireEvent.change(cityInput, { target: { value: 'Jaipur' } });

    const dateInput = screen.getByLabelText(/Event Date/i);
    fireEvent.change(dateInput, { target: { value: '2026-11-15' } });

    const submitBtn = screen.getByRole('button', {
      name: /Formulate Blueprint with Celebrate AI/i,
    });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData.city).toBe('Jaipur');
    expect(submittedData.date).toBe('2026-11-15');
    expect(submittedData.totalBudget).toBeGreaterThan(0);
  });

  it('applies curated template blueprints when clicking preset buttons', () => {
    const onSubmit = vi.fn();
    render(<PlannerForm onSubmit={onSubmit} isLoading={false} />);

    const birthdayPreset = screen.getByText(/Neon Milestone Birthday/i);
    fireEvent.click(birthdayPreset);

    const cityInput = screen.getByLabelText(/Host City \/ Destination/i) as HTMLInputElement;
    expect(cityInput.value).toBe('Mumbai');
  });

  it('disables submit button and reflects loading spinner state', () => {
    const onSubmit = vi.fn();
    render(<PlannerForm onSubmit={onSubmit} isLoading={true} />);

    const submitBtn = screen.getByRole('button', {
      name: /Architecting Your Celebration Blueprint/i,
    });
    expect(submitBtn).toBeDisabled();
  });
});
