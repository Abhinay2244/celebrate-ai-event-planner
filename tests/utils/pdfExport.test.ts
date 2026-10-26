import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportPlanToPdf } from '../../src/utils/pdfExport';
import { SAMPLE_EVENT_PLAN, MINIMAL_EVENT_PLAN } from '../fixtures/samplePlan';

const mockSave = vi.fn();

class MockJsPDF {
  internal = {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 297,
    },
  };
  setFont = vi.fn();
  setFontSize = vi.fn();
  setTextColor = vi.fn();
  setFillColor = vi.fn();
  setDrawColor = vi.fn();
  roundedRect = vi.fn();
  rect = vi.fn();
  line = vi.fn();
  text = vi.fn();
  addPage = vi.fn();
  getNumberOfPages = vi.fn(() => 2);
  setPage = vi.fn();
  save = mockSave;
  splitTextToSize = vi.fn((text: string) => [text]);
  constructor(_opts?: unknown) {}
}

vi.mock('jspdf', () => ({
  default: MockJsPDF,
}));

describe('PDF Export Dossier (pdfExport.ts & pdfSections.ts)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates and saves complete PDF dossier for a rich event plan', async () => {
    await exportPlanToPdf(SAMPLE_EVENT_PLAN);

    expect(mockSave).toHaveBeenCalledTimes(1);
    const savedFileName = mockSave.mock.calls[0][0];
    expect(savedFileName).toBe('diya-kabir-grand-royal-wedding.pdf');
  });

  it('generates PDF dossier for minimal plan with sparse/empty sections', async () => {
    await exportPlanToPdf(MINIMAL_EVENT_PLAN);

    expect(mockSave).toHaveBeenCalledTimes(1);
    const savedFileName = mockSave.mock.calls[0][0];
    expect(savedFileName).toBe('beachside-birthday-bonfire.pdf');
  });
});
