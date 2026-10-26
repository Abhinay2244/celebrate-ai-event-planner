import { useState, RefObject } from 'react';
import confetti from 'canvas-confetti';

interface UseInvitationActionsProps {
  cardRef: RefObject<HTMLDivElement | null>;
  eventTitle: string;
  currentContent: string;
}

/**
 * Custom hook managing clipboard copying and PNG downloading for invitations.
 *
 * @param props References to the DOM node and text content
 * @returns State and handlers for copying text and exporting PNG image
 */
export function useInvitationActions({
  cardRef,
  eventTitle,
  currentContent,
}: UseInvitationActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.8 } });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy invitation text:', err);
    }
  };

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#FFFFFF',
      });
      const cleanName = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const link = document.createElement('a');
      link.download = `${cleanName}-invitation.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to export invitation image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    copied,
    isDownloading,
    handleCopyText,
    handleDownloadPng,
  };
}
