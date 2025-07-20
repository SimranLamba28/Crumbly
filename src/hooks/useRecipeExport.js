import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useRecipeExport = () => {
  const exportRef = useRef(null);

  // ——— Helpers ———
  const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    if (isMobile()) document.body.appendChild(link);
    link.click();
    if (isMobile()) document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // Shared html2canvas options
  const canvasOpts = () => ({
    scale:              isMobile() ? 2 : 3,
    useCORS:            true,
    allowTaint:         true,
    backgroundColor:    '#ffffff',
    logging:            false,
    width:              exportRef.current?.scrollWidth,
    height:             exportRef.current?.scrollHeight,
    windowWidth:        exportRef.current?.scrollWidth,
    windowHeight:       exportRef.current?.scrollHeight,
  });

  // ——— Image Download ———
  const downloadImage = async (fileName = 'recipe') => {
    if (!exportRef.current) return;
    try {
      const canvas = await html2canvas(exportRef.current, canvasOpts());
      canvas.toBlob(blob => {
        if (!blob) return;
        const cleanName = `${fileName.replace(/[^a-z0-9]/gi,'_')}.jpg`.toLowerCase();
        downloadBlob(blob, cleanName);
      }, 'image/jpeg', 0.95);
    } catch (e) {
      console.error('Error generating image:', e);
      throw new Error('Could not generate image');
    }
  };

  // ——— PDF Download ———
 const downloadPDF = async (fileName = 'recipe') => {
  if (!exportRef.current) return;
  
  try {
    // 1) Render to canvas
    const canvas = await html2canvas(exportRef.current, canvasOpts());

    // 2) PDF setup
    const imgW = canvas.width;
    const imgH = canvas.height;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait', 
      compress: true 
    });
    
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availW = pdfW - 2 * margin;
    const availH = pdfH - 2 * margin;
    const ratio = availW / imgW;
    const scaledH = imgH * ratio;

    // 3) Single-page shortcut
    if (scaledH <= availH + 10) {
      pdf.addImage(imgData, 'JPEG', margin, margin, availW, scaledH);
    } else {
      // 4) Slice into pages
      const pxPerPage = availH / ratio;
      const pages = Math.ceil(imgH / pxPerPage);

      for (let i = 0; i < pages; i++) {
        const yPx = i * pxPerPage;
        const hPx = i === pages - 1 ? imgH - yPx : pxPerPage;
        const sliceC = document.createElement('canvas');
        sliceC.width = imgW;
        sliceC.height = hPx;
        const ctx = sliceC.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, imgW, hPx);
        ctx.drawImage(canvas, 0, yPx, imgW, hPx, 0, 0, imgW, hPx);

        if (i > 0) pdf.addPage();
        const pageImg = sliceC.toDataURL('image/jpeg', 0.95);
        pdf.addImage(pageImg, 'JPEG', margin, margin, availW, hPx * ratio);
      }
    }
    
    // 5) Download
    const cleanName = `${fileName.replace(/[^a-z0-9]/gi,'_')}.pdf`.toLowerCase();
    const blob = pdf.output('blob');
    downloadBlob(blob, cleanName);

  } catch (e) {
    console.error('Error generating PDF:', e);
    throw new Error('Could not generate PDF');
  }
};

  return {
    exportRef,
    downloadImage,
    downloadPDF,
    isMobile: isMobile(),
  };
};

export default useRecipeExport;
