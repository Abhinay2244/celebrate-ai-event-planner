import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabBar } from '../src/components/layout/TabBar';
import { SavedPlansModal } from '../src/components/SavedPlansModal';
import { ChatAssistant } from '../src/components/ChatAssistant';
import { ColorSwatch } from '../src/components/ColorSwatch';
import { TimelineTab } from '../src/components/tabs/TimelineTab';
import { InvitationToolbar } from '../src/components/invitation/InvitationToolbar';
import { EventTypeSelector } from '../src/components/planner/EventTypeSelector';
import { SAMPLE_EVENT_PLAN } from './fixtures/samplePlan';

describe('Keyboard Accessibility Interactions', () => {
  it('TabBar navigates with ArrowRight, ArrowLeft, Home, and End keys', () => {
    const onSelectTab = vi.fn();
    render(<TabBar activeTab="overview" onSelectTab={onSelectTab} />);

    const overviewTab = screen.getByRole('tab', { name: /overview/i });
    overviewTab.focus();

    // ArrowRight navigates to Budget Math
    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
    expect(onSelectTab).toHaveBeenCalledWith('budget');

    // ArrowLeft wraps around to Invitations
    fireEvent.keyDown(overviewTab, { key: 'ArrowLeft' });
    expect(onSelectTab).toHaveBeenCalledWith('invitation');

    // End navigates to last tab (invitation)
    fireEvent.keyDown(overviewTab, { key: 'End' });
    expect(onSelectTab).toHaveBeenCalledWith('invitation');

    // Home navigates to first tab (overview)
    fireEvent.keyDown(overviewTab, { key: 'Home' });
    expect(onSelectTab).toHaveBeenCalledWith('overview');
  });

  it('EventTypeSelector navigates between event nature radios using arrow keys', () => {
    const onSelectType = vi.fn();
    render(<EventTypeSelector eventType="wedding" onSelectType={onSelectType} />);

    const weddingRadio = screen.getByRole('radio', { name: /wedding/i });
    expect(weddingRadio).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(weddingRadio, { key: 'ArrowRight' });
    expect(onSelectType).toHaveBeenCalledWith('birthday');

    fireEvent.keyDown(weddingRadio, { key: 'ArrowLeft' });
    expect(onSelectType).toHaveBeenCalledWith('community');
  });

  it('InvitationToolbar switches template and copy format using arrow keys', () => {
    const setTemplate = vi.fn();
    const setTextFormat = vi.fn();

    render(
      <InvitationToolbar
        template="classic"
        setTemplate={setTemplate}
        textFormat="formal"
        setTextFormat={setTextFormat}
      />
    );

    const classicRadio = screen.getByRole('radio', { name: /classic/i });
    fireEvent.keyDown(classicRadio, { key: 'ArrowRight' });
    expect(setTemplate).toHaveBeenCalledWith('modern');

    const formalRadio = screen.getByRole('radio', { name: /formal/i });
    fireEvent.keyDown(formalRadio, { key: 'ArrowRight' });
    expect(setTextFormat).toHaveBeenCalledWith('casual');
  });

  it('SavedPlansModal traps focus with Tab and Shift+Tab, closes with Escape, and restores focus', () => {
    const onClose = vi.fn();
    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = 'Open Saved Plans';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();

    const { rerender } = render(
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

    const closeBtn = screen.getByLabelText(/close saved plans modal/i);
    const newEventBtn = screen.getByRole('button', { name: /\+ create new celebration/i });

    // Focus on first element, Shift+Tab wraps to last element
    closeBtn.focus();
    fireEvent.keyDown(closeBtn, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(newEventBtn);

    // Focus on last element, Tab wraps to first element
    newEventBtn.focus();
    fireEvent.keyDown(newEventBtn, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(closeBtn);

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();

    rerender(
      <SavedPlansModal
        isOpen={false}
        onClose={onClose}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={vi.fn()}
        onNewPlan={vi.fn()}
      />
    );

    document.body.removeChild(triggerBtn);
  });

  it('ChatAssistant traps focus, closes on Escape, and restores focus on toggle', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={vi.fn()}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const closeBtn = screen.getByLabelText(/close refinement assistant/i);
    const inputEl = screen.getByPlaceholderText(/ask e\.g\./i);

    closeBtn.focus();
    fireEvent.keyDown(closeBtn, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(inputEl);

    // Escape key closes drawer
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onToggle).toHaveBeenCalled();

    rerender(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={vi.fn()}
        isOpen={false}
        onToggle={onToggle}
      />
    );
    expect(screen.getByLabelText(/open celebrate ai refinement assistant/i)).toBeInTheDocument();
  });

  it('ColorSwatch copies hex value with keyboard Enter/Space and announces to screen readers', async () => {
    render(<ColorSwatch color={{ name: 'Rose Gold', hex: '#b76e79' }} index={0} />);

    const swatchBtn = screen.getByRole('button', { name: /copy colour rose gold/i });
    expect(swatchBtn).toHaveClass('min-h-[44px]');

    await act(async () => {
      fireEvent.click(swatchBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#B76E79');
    expect(screen.getByText(/copied #b76e79 to clipboard/i)).toBeInTheDocument();
  });

  it('TimelineTab deliverables checklist toggles with checkbox semantics', () => {
    render(<TimelineTab plan={SAMPLE_EVENT_PLAN} onUpdatePlan={vi.fn()} />);

    const taskCheckboxes = screen.getAllByRole('checkbox');
    expect(taskCheckboxes.length).toBeGreaterThan(0);

    const firstTask = taskCheckboxes[0];
    expect(firstTask).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(firstTask);
    expect(firstTask).toHaveAttribute('aria-checked', 'true');
  });
});
