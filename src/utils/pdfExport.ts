import { EventPlan } from '../types/planner';
import { formatINR } from './budget';

/**
 * Dynamically loads jsPDF on demand to keep the initial JavaScript bundle ultra-lightweight.
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
    doc.text(plan.summary?.title || 'Celebration Dossier', pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(230, 225, 220);
    doc.line(margin, 12, pageWidth - margin, 12);
  }

  // --- Cover Banner ---
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

  // --- Executive Summary ---
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
    const themeDescLines = doc.splitTextToSize(plan.personalizedIdeas.theme.description, contentWidth);
    doc.text(themeDescLines, margin, y);
    y += themeDescLines.length * 4.5 + 4;
  }

  // --- Budget Breakdown Table ---
  checkPageBreak(50);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(27, 30, 75);
  doc.text(`2. Budget Allocation (Total: ${formatINR(plan.totalBudgetCalculated || 0)})`, margin, y);
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

  // --- Timeline Milestones ---
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

  // --- Vendor Checklist & Questions ---
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

  // Footer on all pages
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
