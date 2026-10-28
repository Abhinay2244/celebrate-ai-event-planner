import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { PlannerForm } from '../src/components/PlannerForm';
import { OverviewTab } from '../src/components/tabs/OverviewTab';
import { BudgetTab } from '../src/components/tabs/BudgetTab';
import { TimelineTab } from '../src/components/tabs/TimelineTab';
import { VendorsTab } from '../src/components/tabs/VendorsTab';
import { IdeasTab } from '../src/components/tabs/IdeasTab';
import { InvitationTab } from '../src/components/tabs/InvitationTab';
import { SavedPlansModal } from '../src/components/SavedPlansModal';
import { ChatAssistant } from '../src/components/ChatAssistant';
import { SAMPLE_EVENT_PLAN } from './fixtures/samplePlan';

describe('Automated Accessibility Audits (vitest-axe)', () => {
  it('PlannerForm has zero accessibility violations', async () => {
    const { container } = render(<PlannerForm onSubmit={vi.fn()} isLoading={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('OverviewTab has zero accessibility violations', async () => {
    const { container } = render(<OverviewTab plan={SAMPLE_EVENT_PLAN} onNavigateTab={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BudgetTab has zero accessibility violations', async () => {
    const { container } = render(<BudgetTab plan={SAMPLE_EVENT_PLAN} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TimelineTab has zero accessibility violations', async () => {
    const { container } = render(<TimelineTab plan={SAMPLE_EVENT_PLAN} onUpdatePlan={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('VendorsTab has zero accessibility violations', async () => {
    const { container } = render(<VendorsTab plan={SAMPLE_EVENT_PLAN} onUpdatePlan={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('IdeasTab has zero accessibility violations', async () => {
    const { container } = render(<IdeasTab plan={SAMPLE_EVENT_PLAN} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('InvitationTab has zero accessibility violations', async () => {
    const { container } = render(<InvitationTab plan={SAMPLE_EVENT_PLAN} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('SavedPlansModal has zero accessibility violations when open', async () => {
    const { container } = render(
      <SavedPlansModal
        isOpen={true}
        onClose={vi.fn()}
        savedPlans={[SAMPLE_EVENT_PLAN]}
        activePlanId={SAMPLE_EVENT_PLAN.id}
        onSelectPlan={vi.fn()}
        onDeletePlan={vi.fn()}
        onNewPlan={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ChatAssistant has zero accessibility violations when open', async () => {
    const { container } = render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={vi.fn()}
        isOpen={true}
        onToggle={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
