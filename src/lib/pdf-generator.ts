import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Liquidacion } from '@/contexts/LiquidacionesContext';
import { formatDate, formatNumber, formatAmountInWords } from '@/lib/utils';

// Definir colores que coincidan con la UI
const PRIMARY_COLOR = [128, 128, 128]; // Color gris (gray-500)

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: UserOptions) => void;
        lastAutoTable: {
        finalY: number;
        };
    }
}

// Define UserOptions interface based on jspdf-autotable
interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number | false;
    margin?: number | number[] | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: 'striped' | 'grid' | 'plain';
    styles?: {
        font?: string;
        fontStyle?: string;
        fontSize?: number;
        cellPadding?: number;
        lineColor?: number[] | string;
        lineWidth?: number;
        fontColor?: number[] | string;
        fillColor?: number[] | string;
        textColor?: number[] | string;
        halign?: 'left' | 'center' | 'right';
        valign?: 'top' | 'middle' | 'bottom';
        fillStyle?: 'F' | 'S' | 'DF';
        rowHeight?: number;
        minCellHeight?: number;
    };
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    didDrawPage?: (data: any) => void;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
}

interface EmployeeInfo {
    name: string;
    cuil: string;
    address: string;
    startDate: string;
    category: string;
    // Información del empleador
    empresaNombre?: string;
    empresaCuit?: string;
    empresaDomicilio?: string;
}

const formatPeriodType = (type: string | undefined) => {
    switch (type) {
        case "quincena1":
            return "- Primera Quincena";
        case "quincena2":
            return "- Segunda Quincena";
        default:
            return "";
    }
};

// Función auxiliar para generar el contenido de una página de liquidación
const generateLiquidacionPage = (doc: jsPDF, liquidacion: Liquidacion, employeeInfo: EmployeeInfo, pageTitle: string) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    // Configurar fuente para coincidir con la UI
    doc.setFont('helvetica', 'normal');

    // Header con estilo similar al DialogTitle
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text(pageTitle, pageWidth / 2, 20, { align: 'center' });

    // Crear un recuadro para la información del empleado y empleador similar a LiquidacionHeader
    // Dibujar borde del recuadro
    doc.setDrawColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]); // Color primario para el borde
    doc.setLineWidth(0.1);
    // doc.roundedRect(margin, 30, contentWidth, 50, 3, 3, 'S');
    
    // Información del empleador (izquierda superior)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Empresa:', margin + 5, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(employeeInfo.empresaNombre || 'No especificada', margin + 5, 44);
    doc.setFontSize(9);
    doc.text(`CUIT: ${employeeInfo.empresaCuit || 'No especificado'}`, margin + 5, 50);
    
    // Domicilio del empleador
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Manejar texto largo con salto de línea si es necesario
    const empresaDomicilio = employeeInfo.empresaDomicilio || 'No especificado';
    const maxWidth = pageWidth / 2 - margin - 10;
    const splitEmpresaDomicilio = doc.splitTextToSize(empresaDomicilio, maxWidth);
    doc.text(splitEmpresaDomicilio, margin + 5, 56);
    
    // Employee Info (derecha)
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Empleado:', pageWidth / 2, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(employeeInfo.name, pageWidth / 2, 44);
    doc.setFontSize(9);
    doc.text(`CUIL: ${employeeInfo.cuil}`, pageWidth / 2, 50);
    
    // Domicilio del empleado
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // Manejar texto largo con salto de línea si es necesario
    const splitAddress = doc.splitTextToSize(employeeInfo.address, maxWidth);
    doc.text(splitAddress, pageWidth / 2, 56);
    
    // Fecha de ingreso y categoría
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de ingreso: ${formatDate(employeeInfo.startDate)}`, pageWidth / 2, 62);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Categoría: ${employeeInfo.category}`, pageWidth / 2, 68);

    // Period Info con estilo similar a la UI
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Período liquidado: ${liquidacion.periodo} ${formatPeriodType(liquidacion.periodoObj?.type)}`, margin, 90);
    doc.text(`Fecha de liquidación: ${formatDate(liquidacion.fecha)}`, pageWidth - margin, 90, { align: 'right' });

    // Table Header
    const headers = [[
        { content: 'Concepto', rowSpan: 2 },
        { content: 'Haberes', colSpan: 2 },
        { content: 'Deducciones', colSpan: 2 }
    ],
    [
        'Rem',
        'No Rem',
        'Rem',
        'No Rem'
    ]];

    // Table Body
    const body = [
        ['Sueldo básico', formatNumber(liquidacion.basicSalary), '-', '-', '-'],
        [`Antigüedad (${liquidacion.rowsNonRemunerative.find(item => item.isSeniorityRow)?.percentage || '0'} años)`, formatNumber(liquidacion.antiguedadAmount), '-', '-', '-'],
        [`Presentismo (${liquidacion.presentismoPercentage}%)`, formatNumber(liquidacion.presentismoAmount), '-', '-', '-'],
        ...liquidacion.rowsRemunerative.map(row => [
            `${row.name} ${row.checked ? `(${row.percentage}%)` : ''}`,
            formatNumber(row.amount),
            '-',
            '-',
            '-'
        ]),
        ...liquidacion.rowsNonRemunerative
            .filter(row => !row.isAttendanceRow && !row.isSeniorityRow)
            .map(row => [
                `${row.name} ${(row.isAttendanceRow || row.isSeniorityRow) ? `(${row.percentage}%)` : ''}`,
                '-',
                formatNumber(row.amount),
                '-',
                '-'
            ]),
        ...liquidacion.deductionItems.map(item => [
            `${item.name} ${(item.checkedRemunerative || item.checkedNonRemunerative) ? `(${item.percentage}%)` : ''}`,
            '-',
            '-',
            item.remunerativeAmount && parseFloat(item.remunerativeAmount.replace(",", ".")) > 0
                ? formatNumber(item.remunerativeAmount)
                : '-',
            item.nonRemunerativeAmount && parseFloat(item.nonRemunerativeAmount.replace(",", ".")) > 0
                ? formatNumber(item.nonRemunerativeAmount)
                : '-'
        ]),
        [
            'Subtotales',
            formatNumber(liquidacion.totalRemunerativo),
            formatNumber(liquidacion.totalNoRemunerativo),
            formatNumber(liquidacion.deduccionesRemunerativas),
            formatNumber(liquidacion.deduccionesNoRemunerativas)
        ]
    ];
    
    // Generate Table con estilos que coincidan con la UI
    autoTable(doc, {
        head: headers,
        body: body,
        startY: 100,
        theme: 'grid',
        styles: {
            lineColor: [128, 128, 128], // gray-500 equivalent
            lineWidth: 0.1, // Reducir el grosor de los bordes
            cellPadding: 3, // Ajustar el padding para evitar overflow
            fontSize: 9, // Reducir tamaño de fuente para evitar overflow
            overflow: 'linebreak', // Manejar overflow con saltos de línea
        },
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            halign: 'center',
            lineWidth: 0.1, // Reducir el grosor de los bordes
            lineColor: [128, 128, 128], // gray-500 equivalent
        },
        // Definir ancho de columnas para evitar overflow
        columnStyles: {
            0: { cellWidth: 'auto' }, // Concepto - ancho automático
            1: { cellWidth: 30, halign: 'right' }, // Remunerativo
            2: { cellWidth: 30, halign: 'right' }, // No Remunerativo
            3: { cellWidth: 30, halign: 'right' }, // Deducciones Remunerativo
            4: { cellWidth: 30, halign: 'right' }, // Deducciones No Remunerativo
        },
        didParseCell: function(data) {
            const col = data.column.index;
            const row = data.row.index;
            const isHeaderRow = data.section === 'head';
            const isLastBodyRow = data.section === 'body' && row === body.length - 1; // Subtotals row
            
            // Configurar bordes horizontales
            if (!isHeaderRow && !isLastBodyRow) {
                // Eliminar bordes horizontales para filas normales
                data.cell.styles.lineWidth = 0.1;
            } else {
                // Mantener bordes finos para encabezado y subtotales
                data.cell.styles.lineWidth = 0.1;
                data.cell.styles.lineColor = [128, 128, 128];
            }
            
            // Configurar bordes verticales
            // Solo mostrar bordes verticales en las columnas principales
            if (col === 0 || col === 1 || col === 3) {
                // Borde vertical a la derecha de Concepto, Haberes Remunerativo y Deducciones Remunerativo
                data.cell.styles.lineWidth = 0.1;
                data.cell.styles.lineColor = [128, 128, 128];
            }
            
            // Make the last row (subtotals) bold
            if (isLastBodyRow) {
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // Final Totals con estilos que coincidan con la UI
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Sueldo Bruto
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100); // Color gris para texto muted
    doc.setFont('helvetica', 'bold');
    doc.text('Sueldo Bruto', 15, finalY);
    doc.text(formatNumber(liquidacion.sueldoBruto), pageWidth - 15, finalY, { align: 'right' });
    
    // Deducciones
    doc.text('Deducciones', 15, finalY + 8);
    doc.text(formatNumber(liquidacion.totalDeducciones), pageWidth - 15, finalY + 8, { align: 'right' });
    
    // Sueldo Neto
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Color negro para el total
    doc.setFont('helvetica', 'bold');
    doc.text('SUELDO NETO', 15, finalY + 17);
    doc.text(formatNumber(liquidacion.totalNeto), pageWidth - 15, finalY + 17, { align: 'right' });

    // Receipt Section con estilos que coincidan con la UI
    // Dibujar línea divisoria
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineWidth(0.1);
    const receiptY = finalY + 25;
    doc.line(15, receiptY - 5, pageWidth - 15, receiptY - 5);
    
    // Texto del recibo
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Establecer fuente en negrita para el monto en palabras
    doc.setFont('helvetica', 'bold');
    
    // Manejar texto largo con salto de línea
    const amountInWords = `Recibí la suma de pesos ${formatAmountInWords(liquidacion.totalNeto)}.`;
    const splitAmountInWords = doc.splitTextToSize(amountInWords, contentWidth);
    doc.text(splitAmountInWords, 15, receiptY);
    
    // Restaurar fuente normal para el resto del texto
    doc.setFont('helvetica', 'normal');
    
    const receiptText = 'Por los conceptos indicados en la presente liquidación, dejando constancia de haber recibido un duplicado de este recibo.';
    const splitReceiptText = doc.splitTextToSize(receiptText, contentWidth);
    doc.text(splitReceiptText, 15, receiptY + (splitAmountInWords.length > 1 ? 16 : 8));
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Son pesos: ${formatNumber(liquidacion.totalNeto)}`, 15, receiptY + (splitAmountInWords.length > 1 ? 28 : 20));

    // Signature Line
    doc.setDrawColor(0, 0, 0); // Color negro para la línea de firma
    doc.setLineWidth(0.1);
    doc.line(pageWidth - margin - 64, receiptY + 35, pageWidth - margin, receiptY + 35);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Firma del empleado', pageWidth - margin - 32, receiptY + 40, { align: 'center' });
};

export const generateLiquidacionPDF = async (liquidacion: Liquidacion, employeeInfo: EmployeeInfo) => {
    // Crear documento con fondo blanco para coincidir con la UI
    const doc = new jsPDF();
    
    // Generar la primera página (original)
    generateLiquidacionPage(doc, liquidacion, employeeInfo, 'LIQUIDACION DE HABERES - ORIGINAL');
    
    // Agregar una nueva página para el duplicado
    doc.addPage();
    
    // Generar la segunda página (duplicado)
    generateLiquidacionPage(doc, liquidacion, employeeInfo, 'LIQUIDACION DE HABERES - DUPLICADO');
    
    return doc;
};