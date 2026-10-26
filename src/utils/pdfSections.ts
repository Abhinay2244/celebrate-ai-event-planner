import type jsPDF from 'jspdf';
import { EventPlan } from '../types/planner';
import { formatINR } from './budget';

export interface PdfRenderContext {
  doc: jsPDF;
  margin: number;
  contentWidth: number;
  pageWidth: number;
  pageHeight: number;
  checkPageBreak: (neededHeight: number) => void;
}

/**
 * Draws the cover hero banner on the PDF dossier.
 */
export function drawPdfCoverBanner(ctx: PdfRenderContext, plan: EventPlan, startY: number): number {
  const { doc, margin, contentWidth } = ctx;
  let y = startY;

  doc.setFillColor(27, 30, 75); // Deep Indigo
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(245, 235, 230); // Warm ivory
  doc.text(plan.summary?.title || 'Celebration Blueprint', margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(220, 180, 170); // Rose gold accent
  const subtitle = `${(plan.input?.eventType || 'EVENT').toUpperCase()} • ${(plan.input?.city || 'DESTINATION').toUpperCase()} • ${plan.input?.date || ''} • ${plan.input?.guestCount || 0} GUESTS • ${formatINR(plan.totalBudgetCalculated || 0)}`;
  doc.text(subtitle, margin + 8, y + 20);

  doc.setFontSize(8.5);
  doc.setTextColor(220, 220, 230);
  const tagline = doc.splitTextToSize(plan.summary?.tagline || '', contentWidth - 16);
  doc.text(tagline, margin + 8, y + 27);

  y += 42;
  return y;
}

/**
 * Draws the budget breakdown table on the PDF dossier.
 */
export function drawPdfBudgetTable(ctx: PdfRenderContext, plan: EventPlan, startY: number): number {
  const { doc, margin, contentWidth, checkPageBreak } = ctx;
  let y = startY;

  checkPageBreak(50);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(27, 30, 75);
  doc.text(
    `2. Budget Allocation (Total: ${formatINR(plan.totalBudgetCalculated || 0)})`,
    margin,
    y
  );
  y += 6;

  // Table header
  doc.setFillColor(242, 238, 234);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text('Category', margin + 3, y + 4.8);
  doc.text('Amount (INR)', margin + 80, y + 4.8);
  doc.text('Share', margin + 120, y + 4.8);
  doc.text('Strategic Focus', margin + 140, y + 4.8);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  (plan.budgetBreakdown || []).forEach((item, index) => {
    checkPageBreak(12);
    if (index % 2 === 1) {
      doc.setFillColor(250, 248, 246);
      doc.rect(margin, y, contentWidth, 6.5, 'F');
    }
    doc.setTextColor(30, 30, 30);
    doc.text(item.category, margin + 3, y + 4.5);
    doc.text(formatINR(item.amount), margin + 80, y + 4.5);
    doc.text(`${item.percentage}%`, margin + 120, y + 4.5);
    const shortDesc = doc.splitTextToSize(item.description, contentWidth - 142);
    doc.text(shortDesc[0] || '', margin + 140, y + 4.5);
    y += 6.5;
  });

  y += 8;
  return y;
}

/**
 * Draws the roadmap and timeline milestones on the PDF dossier.
 */
export function drawPdfTimeline(ctx: PdfRenderContext, plan: EventPlan, startY: number): number {
  const { doc, margin, contentWidth, checkPageBreak } = ctx;
  let y = startY;

  checkPageBreak(40);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(27, 30, 75);
  doc.text('3. Planning Roadmap & Timeline', margin, y);
  y += 6;

  (plan.timeline || []).forEach((milestone) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(183, 110, 121);
    doc.text(milestone.timeframe.toUpperCase(), margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 50);
    doc.text(`• ${milestone.title}`, margin + 45, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 70);
    const descLines = doc.splitTextToSize(milestone.description, contentWidth);
    doc.text(descLines, margin + 4, y);
    y += descLines.length * 4 + 2;

    if (milestone.tasks && milestone.tasks.length > 0) {
      milestone.tasks.forEach((task) => {
        checkPageBreak(8);
        doc.text(`[  ]  ${task}`, margin + 8, y);
        y += 4;
      });
      y += 2;
    }
  });

  y += 6;
  return y;
}

/**
 * Draws the vendor due diligence checklist on the PDF dossier.
 */
export function drawPdfVendors(ctx: PdfRenderContext, plan: EventPlan, startY: number): number {
  const { doc, margin, contentWidth, checkPageBreak } = ctx;
  let y = startY;

  checkPageBreak(40);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(27, 30, 75);
  doc.text('4. Vendor Due Diligence & Checklist', margin, y);
  y += 6;

  (plan.vendorChecklist || []).forEach((vendor) => {
    checkPageBreak(22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(27, 30, 75);
    const status = vendor.done ? '[COMPLETED]' : '[PENDING]';
    doc.text(`${status} ${vendor.vendorType} (${vendor.category})`, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    if (vendor.tips) {
      const tipLines = doc.splitTextToSize(`Pro Tip: ${vendor.tips}`, contentWidth - 6);
      doc.text(tipLines, margin + 4, y);
      y += tipLines.length * 3.8 + 2;
    }

    if (vendor.whatToAsk && vendor.whatToAsk.length > 0) {
      doc.text(`Key Questions: ${vendor.whatToAsk.slice(0, 2).join(' • ')}`, margin + 4, y);
      y += 4.5;
    }
    y += 2;
  });

  return y;
}
