import jsPDF from 'jspdf';

export function generatePDF(title: string, content: string, date: string): void {
  const pdf = new jsPDF();
  
  // Set up Japanese font (using built-in font for simplicity)
  pdf.setFont('helvetica');
  
  // Title
  pdf.setFontSize(16);
  pdf.text(title, 20, 30);
  
  // Date
  pdf.setFontSize(10);
  pdf.text(`作成日: ${date}`, 20, 45);
  
  // Content
  pdf.setFontSize(11);
  const splitContent = pdf.splitTextToSize(content, 170);
  pdf.text(splitContent, 20, 60);
  
  // Save the PDF
  pdf.save(`${title}.pdf`);
}