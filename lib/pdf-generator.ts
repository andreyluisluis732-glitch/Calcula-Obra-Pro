import { jsPDF } from 'jspdf';

interface ProjectData {
  title: string;
  area: number;
  rooms: number;
  roomsList?: string;
  floorPlanImage?: string;
  tier: string;
  cost: string;
  date: string;
  id: string;
}

export const generateProjectPDF = (data: ProjectData) => {
  console.log('Starting PDF generation for project:', data.id);
  try {
    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CALCULA OBRA PRO', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('RELATÓRIO TÉCNICO DE ESTIMATIVA', 140, 25);
    
    // Project Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(data.title || 'Projeto Residencial', 20, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID do Projeto: ${data.id || 'N/A'}`, 20, 70);
    doc.text(`Data de Emissão: ${data.date || new Date().toLocaleDateString()}`, 20, 75);
    
    // Divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, 85, 190, 85);
    
    // Details Table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Especificações Técnicas', 20, 100);
    
    const details = [
      ['Área Total Construída', `${data.area || 0} m²`],
      ['Total de Cômodos', `${data.rooms || 0}`],
      ['Padrão de Acabamento', data.tier || 'N/A'],
      ['Localização GPS', 'Simulado (Sector A)'],
    ];
    
    let y = 115;
    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, 20, y);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 120, y);
      y += 10;
    });

    // Floor Plan Image
    if (data.floorPlanImage) {
      console.log('Adding floor plan image to PDF...');
      try {
        y += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Planta Baixa (Design)', 20, y);
        y += 10;
        
        // Add image
        const imgWidth = 170;
        const imgHeight = 100; // Approximate
        doc.addImage(data.floorPlanImage, 'PNG', 20, y, imgWidth, imgHeight, undefined, 'FAST');
        y += imgHeight + 10;
      } catch (imgError) {
        console.error('Error adding image to PDF:', imgError);
        doc.setTextColor(255, 0, 0);
        doc.text('Erro ao incluir imagem da planta.', 20, y);
        doc.setTextColor(15, 23, 42);
      }
    }

    // Floor Plan Details (Text)
    if (data.roomsList && !data.floorPlanImage) {
      y += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalhamento da Planta', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = data.roomsList.split('\n');
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 25, y);
        y += 7;
      });
    }
    
    // Investment Section (Move to new page if needed)
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, y, 170, 40, 'F');
    
    doc.setTextColor(234, 88, 12); // orange-600
    doc.setFontSize(14);
    doc.text('Investimento Total Estimado', 30, y + 15);
    
    doc.setFontSize(24);
    doc.text(data.cost || 'R$ 0,00', 30, y + 30);
    
    // Footer
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8);
    doc.text('Este documento é uma estimativa baseada em parâmetros técnicos e pode variar de acordo com o mercado local.', 20, 280);
    doc.text('Calcula Obra Pro - Engenharia de Precisão', 140, 280);
    
    // Save the PDF
    const fileName = `Orcamento_${(data.id || 'projeto').replace(/#/g, '')}.pdf`;
    doc.save(fileName);
    console.log('PDF generated and saved successfully:', fileName);
  } catch (error) {
    console.error('CRITICAL: Failed to generate PDF:', error);
  }
};
