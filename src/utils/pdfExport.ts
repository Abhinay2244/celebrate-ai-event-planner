import { EventPlan } from '../types/planner';
import {
  drawPdfCoverBanner,
  drawPdfBudgetTable,
  drawPdfTimeline,
  drawPdfVendors,
  PdfRenderContext,
} from './pdfSections';

/**
 * Dynamically loads jsPDF on demand and exports a complete celebration blueprint dossier.
 *
 * @param plan The celebration EventPlan to export
 */
export async function exportPlanToPdf(plan: EventPlan): Promise<void> {
  const { default: jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawPageHeader();
    }
  }

  function drawPageHeader() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text('CELEBRATE AI • EVENT DOSSIER', margin, 10);
    doc.text(plan.summary?.title || 'Celebration Dossier', pageWidth - margin, 10, {
      align: 'right',
    });
    doc.setDrawColor(230, 225, 220);
    doc.line(margin, 12, pageWidth - margin, 12);
  }

  const ctx: PdfRenderContext = {
    doc,
    margin,
    contentWidth,
    pageWidth,
    pageHeight,
    checkPageBreak,
  };

  // Section 1: Cover Hero Banner
  y = drawPdfCoverBanner(ctx, plan, y);

  // Section 2: Executive Vision Description
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(27, 30, 75);
  doc.text('1. Celebration Vision & Concept', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  const vibeText = `Theme & Atmosphere: ${plan.summary?.vibeSummary || plan.input?.theme || 'Bespoke Celebration'}`;
  const vibeLines = doc.splitTextToSize(vibeText, contentWidth);
  doc.text(vibeLines, margin, y);
  y += vibeLines.length * 4.5 + 4;

  if (plan.personalizedIdeas?.theme?.description) {
    const themeDescLines = doc.splitTextToSize(
      plan.personalizedIdeas.theme.description,
      contentWidth
    );
    doc.text(themeDescLines, margin, y);
    y += themeDescLines.length * 4.5 + 4;
  }

  // Section 3: Budget Table
  y = drawPdfBudgetTable(ctx, plan, y);

  // Section 4: Timeline Milestones
  y = drawPdfTimeline(ctx, plan, y);

  // Section 5: Vendor Checklist
  y = drawPdfVendors(ctx, plan, y);

  // Footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    doc.text('Generated with Celebrate AI • Powered by Gemini', margin, pageHeight - 8);
  }

  const cleanTitle = (plan.summary?.title || 'celebration-plan')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  doc.save(`${cleanTitle}.pdf`);
}
