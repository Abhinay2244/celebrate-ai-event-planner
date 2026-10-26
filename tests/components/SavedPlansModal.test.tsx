import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavedPlansModal } from '../../src/components/SavedPlansModal';
import { SAMPLE_EVENT_PLAN, MINIMAL_EVENT_PLAN } from '../fixtures/samplePlan';

describe('SavedPlansModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <SavedPlansModal
        isOpen={false}
        onClose={vi.fn()}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={vi.fn()}
        onNewPlan={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders saved plans and selects a plan when clicked', () => {
    const onClose = vi.fn();
    const onSelectPlan = vi.fn();

    render(
      <SavedPlansModal
        isOpen={true}
        onClose={onClose}
        savedPlans={[SAMPLE_EVENT_PLAN, MINIMAL_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={onSelectPlan}
        onDeletePlan={vi.fn()}
        onNewPlan={vi.fn()}
      />
    );

    expect(screen.getByText(/Saved Celebration Blueprints/i)).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_EVENT_PLAN.summary.title)).toBeInTheDocument();
    expect(screen.getByText(MINIMAL_EVENT_PLAN.summary.title)).toBeInTheDocument();

    const minimalPlanCard = screen.getByText(MINIMAL_EVENT_PLAN.summary.title);
    fireEvent.click(minimalPlanCard);

    expect(onSelectPlan).toHaveBeenCalledWith(MINIMAL_EVENT_PLAN);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('handles inline delete confirmation and triggers onDeletePlan', () => {
    const onDeletePlan = vi.fn();

    render(
      <SavedPlansModal
        isOpen={true}
        onClose={vi.fn()}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={onDeletePlan}
        onNewPlan={vi.fn()}
      />
    );

    const deleteBtn = screen.getByRole('button', {
      name: new RegExp(`Delete ${SAMPLE_EVENT_PLAN.summary.title}`, 'i'),
    });
    fireEvent.click(deleteBtn);

    // Confirmation UI should now be displayed
    expect(screen.getByText(/Delete\?/i)).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /^Confirm$/i });
    fireEvent.click(confirmDeleteBtn);

    expect(onDeletePlan).toHaveBeenCalledWith(SAMPLE_EVENT_PLAN.id);
  });

  it('cancels deletion when clicking Cancel', () => {
    const onDeletePlan = vi.fn();

    render(
      <SavedPlansModal
        isOpen={true}
        onClose={vi.fn()}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={onDeletePlan}
        onNewPlan={vi.fn()}
      />
    );

    const deleteBtn = screen.getByRole('button', {
      name: new RegExp(`Delete ${SAMPLE_EVENT_PLAN.summary.title}`, 'i'),
    });
    fireEvent.click(deleteBtn);

    const cancelBtn = screen.getByRole('button', { name: /^Cancel$/i });
    fireEvent.click(cancelBtn);

    expect(onDeletePlan).not.toHaveBeenCalled();
    expect(screen.queryByText(/Delete\?/i)).not.toBeInTheDocument();
  });

  it('triggers onNewPlan when clicking Create New Celebration', () => {
    const onNewPlan = vi.fn();
    const onClose = vi.fn();

    render(
      <SavedPlansModal
        isOpen={true}
        onClose={onClose}
        savedPlans={[]}
        activePlanId={null}
        onSelectPlan={vi.fn()}
        onDeletePlan={vi.fn()}
        onNewPlan={onNewPlan}
      />
    );

    expect(screen.getByText(/No saved celebrations yet/i)).toBeInTheDocument();
    const createBtn = screen.getByRole('button', { name: /\+ Create New Celebration/i });
    fireEvent.click(createBtn);

    expect(onNewPlan).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();

    render(
      <SavedPlansModal
        isOpen={true}
        onClose={onClose}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={vi.fn()}
        onNewPlan={vi.fn()}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
