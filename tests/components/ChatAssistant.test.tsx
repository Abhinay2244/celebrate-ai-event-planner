import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatAssistant } from '../../src/components/ChatAssistant';
import { SAMPLE_EVENT_PLAN } from '../fixtures/samplePlan';
import * as api from '../../src/services/api';

vi.mock('../../src/services/api', () => ({
  refinePlanApi: vi.fn(),
}));

describe('ChatAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders collapsed floating trigger button when closed', () => {
    const onUpdatePlan = vi.fn();
    const onToggle = vi.fn();

    render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={onUpdatePlan}
        isOpen={false}
        onToggle={onToggle}
      />
    );

    const openBtn = screen.getByRole('button', { name: /Open Celebrate AI refinement assistant/i });
    expect(openBtn).toBeInTheDocument();

    fireEvent.click(openBtn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders chat dialog and welcome message when open', () => {
    const onUpdatePlan = vi.fn();
    const onToggle = vi.fn();

    render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={onUpdatePlan}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText(/Refine With Celebrate AI/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Hello! I'm your Celebrate AI celebration strategist/i)
    ).toBeInTheDocument();
  });

  it('sends user message, displays assistant response, and calls onUpdatePlan', async () => {
    const onUpdatePlan = vi.fn();
    const onToggle = vi.fn();

    const mockReply = 'I have adjusted the catering to 100% organic Rajasthani dishes.';
    const updatedPlan = {
      ...SAMPLE_EVENT_PLAN,
      summary: {
        ...SAMPLE_EVENT_PLAN.summary,
        tagline: 'Organic royal celebration',
      },
    };

    vi.mocked(api.refinePlanApi).mockResolvedValueOnce({
      reply: mockReply,
      updatedPlan,
    });

    render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={onUpdatePlan}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    const input = screen.getByPlaceholderText(/Make it cheaper/i);
    const sendBtn = screen.getByRole('button', { name: /Send refinement request/i });

    fireEvent.change(input, { target: { value: 'Make catering organic' } });
    fireEvent.click(sendBtn);

    expect(screen.getByText('Make catering organic')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });

    expect(onUpdatePlan).toHaveBeenCalledWith(updatedPlan);
  });

  it('closes dialog on Escape key', () => {
    const onUpdatePlan = vi.fn();
    const onToggle = vi.fn();

    render(
      <ChatAssistant
        plan={SAMPLE_EVENT_PLAN}
        onUpdatePlan={onUpdatePlan}
        isOpen={true}
        onToggle={onToggle}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
