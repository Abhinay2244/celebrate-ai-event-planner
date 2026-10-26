import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OverviewTab } from '../../src/components/tabs/OverviewTab';
import { BudgetTab } from '../../src/components/tabs/BudgetTab';
import { TimelineTab } from '../../src/components/tabs/TimelineTab';
import { VendorsTab } from '../../src/components/tabs/VendorsTab';
import { IdeasTab } from '../../src/components/tabs/IdeasTab';
import { InvitationTab } from '../../src/components/tabs/InvitationTab';
import { SAMPLE_EVENT_PLAN, MINIMAL_EVENT_PLAN } from '../fixtures/samplePlan';

describe('Tab Components Quality & Resilience', () => {
  describe('OverviewTab', () => {
    it('renders completely with rich sample plan', () => {
      const onNavigate = vi.fn();
      render(<OverviewTab plan={SAMPLE_EVENT_PLAN} onNavigateTab={onNavigate} />);

      expect(screen.getByText(SAMPLE_EVENT_PLAN.summary.title)).toBeInTheDocument();
      expect(screen.getByText(SAMPLE_EVENT_PLAN.summary.tagline)).toBeInTheDocument();
      expect(screen.getByText(/Per-Guest Allocation/i)).toBeInTheDocument();
      expect(screen.getByText(/Strategic Roadmap/i)).toBeInTheDocument();
    });

    it('renders gracefully with minimal plan and missing optional properties', () => {
      const onNavigate = vi.fn();
      render(<OverviewTab plan={MINIMAL_EVENT_PLAN} onNavigateTab={onNavigate} />);

      expect(screen.getByText(MINIMAL_EVENT_PLAN.summary.title)).toBeInTheDocument();
      expect(screen.getByText(/0 \/ 0 Locked/i)).toBeInTheDocument();
    });

    it('triggers tab navigation callback when clicking summary card shortcuts', () => {
      const onNavigate = vi.fn();
      render(<OverviewTab plan={SAMPLE_EVENT_PLAN} onNavigateTab={onNavigate} />);

      const budgetShortcut = screen.getByRole('button', { name: /Full Breakdown →/i });
      fireEvent.click(budgetShortcut);
      expect(onNavigate).toHaveBeenCalledWith('budget');
    });
  });

  describe('BudgetTab', () => {
    it('renders budget total, category bars, and tips', () => {
      render(<BudgetTab plan={SAMPLE_EVENT_PLAN} />);

      expect(screen.getByText(/Total Event Budget/i)).toBeInTheDocument();
      expect(screen.getByText(/Venue & Palace Rental/i)).toBeInTheDocument();
      expect(screen.getByText(/Royal Catering & Beverages/i)).toBeInTheDocument();
    });

    it('renders with minimal budget without crashing', () => {
      render(<BudgetTab plan={MINIMAL_EVENT_PLAN} />);

      expect(screen.getAllByText(/₹50,000/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Venue & Drinks/i)).toBeInTheDocument();
    });
  });

  describe('TimelineTab', () => {
    it('renders all chronological phases and tasks', () => {
      const onUpdate = vi.fn();
      render(<TimelineTab plan={SAMPLE_EVENT_PLAN} onUpdatePlan={onUpdate} />);

      expect(screen.getByText(/Foundation & Venue Lock-in/i)).toBeInTheDocument();
      expect(screen.getByText(/Tastings & Couture Lock-in/i)).toBeInTheDocument();
      expect(screen.getByText(/Sign venue contract/i)).toBeInTheDocument();
    });

    it('handles empty timeline gracefully', () => {
      const onUpdate = vi.fn();
      render(<TimelineTab plan={MINIMAL_EVENT_PLAN} onUpdatePlan={onUpdate} />);

      expect(screen.getByText(/Event Milestones & Chronology/i)).toBeInTheDocument();
    });
  });

  describe('VendorsTab', () => {
    it('renders vendor categories and allows toggling status', () => {
      const onUpdate = vi.fn();
      render(<VendorsTab plan={SAMPLE_EVENT_PLAN} onUpdatePlan={onUpdate} />);

      expect(screen.getByText(/Royal Heritage Caterers/i)).toBeInTheDocument();
      expect(screen.getByText(/Candid Moments Studio/i)).toBeInTheDocument();

      const toggleBtn = screen.getByRole('button', {
        name: /Mark Royal Heritage Caterers as pending/i,
      });
      fireEvent.click(toggleBtn);
      expect(onUpdate).toHaveBeenCalledTimes(1);
    });

    it('renders empty vendor checklist with supportive message', () => {
      const onUpdate = vi.fn();
      render(<VendorsTab plan={MINIMAL_EVENT_PLAN} onUpdatePlan={onUpdate} />);

      expect(screen.getByText(/Contracts Finalized:/i)).toBeInTheDocument();
      expect(screen.getByText(/0 \/ 0/i)).toBeInTheDocument();
    });
  });

  describe('IdeasTab', () => {
    it('renders theme scenography, chef menu, and entertainment sections', () => {
      render(<IdeasTab plan={SAMPLE_EVENT_PLAN} />);

      expect(screen.getByText(/Royal Rajputana Gold/i)).toBeInTheDocument();
      expect(screen.getByText(/Regal Mewari & Pan-Indian Fine Dining/i)).toBeInTheDocument();
      expect(screen.getByText(/Mini Pyaaz Kachoris/i)).toBeInTheDocument();
      expect(screen.getByText(/Folk Chari Dance & Dhol Circle/i)).toBeInTheDocument();
    });

    it('renders minimal plan without crashing on empty arrays', () => {
      render(<IdeasTab plan={MINIMAL_EVENT_PLAN} />);

      expect(screen.getByText(/Sunset Minimal/i)).toBeInTheDocument();
      expect(screen.getByText(/Coastal BBQ/i)).toBeInTheDocument();
    });
  });

  describe('InvitationTab', () => {
    it('renders stationery card templates and allows switching', () => {
      render(<InvitationTab plan={SAMPLE_EVENT_PLAN} />);

      expect(screen.getAllByText(/Diya & Kabir Grand Royal Wedding/i).length).toBeGreaterThan(0);

      // Switch to Modern template
      const modernBtn = screen.getByRole('button', { name: /Modern/i });
      fireEvent.click(modernBtn);

      // Switch to Minimal template
      const minimalBtn = screen.getByRole('button', { name: /Minimal/i });
      fireEvent.click(minimalBtn);

      expect(screen.getAllByText(/Diya & Kabir Grand Royal Wedding/i).length).toBeGreaterThan(0);
    });

    it('renders with minimal plan with fallback invitation texts', () => {
      render(<InvitationTab plan={MINIMAL_EVENT_PLAN} />);

      expect(screen.getAllByText(/Beachside Birthday Bonfire/i).length).toBeGreaterThan(0);
    });
  });
});
