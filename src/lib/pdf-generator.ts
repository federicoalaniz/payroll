import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Liquidacion } from "@/contexts/LiquidacionesContext";
import { formatDate, formatNumber, formatAmountInWords } from "@/lib/utils";

// Definir colores
const PRIMARY_COLOR: [number, number, number] = [0, 0, 0]; // Negro para bordes y texto principal
const SECONDARY_COLOR: [number, number, number] = [100, 100, 100]; // Gris para subtítulos y detalles
const LIGHT_GRAY_COLOR: [number, number, number] = [220, 220, 220]; // Gris claro para separadores

// Extend the jsPDF type to include autoTable
declare module "jspdf" {
    interface jsPDF {
        autoTable: (options: UserOptions) => void;
        lastAutoTable: {
            finalY: number;
        };
    }
}

// Define UserOptions interface based on jspdf-autotable
interface UserOptions {
    head?: string[][];
    body?: string[][];
    foot?: string[][];
    startY?: number | false;
    margin?:
        | number
        | number[]
        | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: "striped" | "grid" | "plain";
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
        halign?: "left" | "center" | "right";
        valign?: "top" | "middle" | "bottom";
        fillStyle?: "F" | "S" | "DF";
        rowHeight?: number;
        minCellHeight?: number;
    };
    headStyles?: string;
    bodyStyles?: string;
    footStyles?: string;
    alternateRowStyles?: string;
    columnStyles?: string;
    tableWidth?: "auto" | "wrap" | number;
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";
    didDrawPage?: (data: string | boolean) => void;
    didParseCell?: (data: string | boolean) => void;
    willDrawCell?: (data: string | boolean) => void;
    didDrawCell?: (data: string | boolean) => void;
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

const generateLiquidacionPage = (
    doc: jsPDF,
    liquidacion: Liquidacion,
    employeeInfo: EmployeeInfo,
    pageTitle: string
) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    doc.setFont("helvetica", "normal");

    // Encabezado del documento
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text(pageTitle, pageWidth / 2, 20, { align: "center" });

    // Información del Empleador y Empleado
    doc.setFontSize(10);
    // doc.setTextColor(...SECONDARY_COLOR);

    // Rectángulo para la información
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, 30, contentWidth, 50, 2, 2, "S");

    // *** Mejoras en la alineación ***
    const empresaX = margin + 10; // Margen izquierdo para la empresa
    const empleadoX = pageWidth / 2; // Margen izquierdo para el empleado
    const labelWidth = 20; // Ancho fijo para las etiquetas "Empresa:", "CUIT:", etc.
    const infoX = empresaX + labelWidth + 2; // Posición de inicio para la información

    // Empleador
    doc.setFont("helvetica", "bold");
    doc.text("EMPRESA:", empresaX, 40);
    doc.setFont("helvetica", "normal");
    doc.text(employeeInfo.empresaNombre || "No especificado", infoX, 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`CUIT:`, empresaX, 46);
    doc.setFont("helvetica", "normal");
    doc.text(employeeInfo.empresaCuit || "No especificado", infoX, 46);
    const empresaDomicilio = employeeInfo.empresaDomicilio || "No especificado";
    const splitEmpresaDomicilio = doc.splitTextToSize(
        empresaDomicilio,
        contentWidth / 2 - labelWidth - 15
    );
    doc.setFont("helvetica", "bold");
    doc.text(`Domicilio:`, empresaX, 52);
    let empresaDomicilioY = 52;
    splitEmpresaDomicilio.forEach((line: string) => {
        // Mostrar domicilio en múltiples líneas
        doc.setFont("helvetica", "normal");
        doc.text(line, infoX, empresaDomicilioY);
        empresaDomicilioY += 6; // Espaciado entre líneas
    });

    // Empleado
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("EMPLEADO:", empleadoX, 40);
    doc.setFont("helvetica", "normal");
    doc.text(employeeInfo.name, empleadoX + labelWidth + 2, 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`CUIL:`, empleadoX, 46);
    doc.setFont("helvetica", "normal");
    doc.text(employeeInfo.cuil, empleadoX + labelWidth + 2, 46);
    const splitAddress = doc.splitTextToSize(
        employeeInfo.address,
        contentWidth / 2 - labelWidth - 10
    );
    doc.setFont("helvetica", "bold");
    doc.text(`Domicilio:`, empleadoX, 52);
    let addressY = 52;
    splitAddress.forEach((line: string) => {
        // Mostrar domicilio en múltiples líneas
        doc.setFont("helvetica", "normal");
        doc.text(line, empleadoX + labelWidth + 2, addressY);
        addressY += 6;
    });
    doc.setFont("helvetica", "bold");
    doc.text(`F. de Ingreso:`, empleadoX, 64);
    doc.setFont("helvetica", "normal");
    doc.text(
        formatDate(employeeInfo.startDate),
        empleadoX + labelWidth + 2,
        64
    );
    doc.setFont("helvetica", "bold");
    doc.text(`Categoría:`, empleadoX, 70);
    doc.setFont("helvetica", "normal");
    doc.text(employeeInfo.category, empleadoX + labelWidth + 2, 70);

    // Período de Liquidación
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFont("helvetica", "normal");
    doc.setFont("helvetica", "bold");
    doc.text(`Período liquidado:`, margin, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`${liquidacion.periodo}`, margin + 32, 90);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
        `Fecha de liquidación:`,
        pageWidth - margin - 20,
        90,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");
    doc.text(
        `${formatDate(liquidacion.fecha)}`,
        pageWidth - margin,
        90,
        { align: "right" }
    );

    // Cabecera de la tabla
    const headers = [
        [
            { content: "Concepto", rowSpan: 2, styles: { halign: "left" } },
            { content: "Haberes", colSpan: 2, styles: { halign: "center" } },
            {
                content: "Deducciones",
                colSpan: 2,
                styles: { halign: "center" },
            },
        ],
        [
            { content: "Rem", styles: { halign: "right" } },
            { content: "No Rem", styles: { halign: "right" } },
            { content: "Rem", styles: { halign: "right" } },
            { content: "No Rem", styles: { halign: "right" } },
        ],
    ];

    // Cuerpo de la tabla
    const body = [
        ["Sueldo básico", formatNumber(liquidacion.basicSalary), "-", "-", "-"],
        [
            `Antigüedad (${
                liquidacion.rowsNonRemunerative.find(
                    (item) => item.isSeniorityRow
                )?.percentage || "0"
            } años)`,
            formatNumber(liquidacion.antiguedadAmount),
            "-",
            "-",
            "-",
        ],
        [
            `Presentismo (${liquidacion.presentismoPercentage}%)`,
            formatNumber(liquidacion.presentismoAmount),
            "-",
            "-",
            "-",
        ],
        ...liquidacion.rowsRemunerative.map((row) => [
            row.name,
            formatNumber(row.amount),
            "-",
            "-",
            "-",
        ]),
        ...liquidacion.rowsNonRemunerative
            .filter((row) => !row.isAttendanceRow && !row.isSeniorityRow)
            .map((row) => [row.name, "-", formatNumber(row.amount), "-", "-"]),
        ...liquidacion.deductionItems.map((item) => [
            item.name,
            "-",
            "-",
            item.remunerativeAmount &&
            parseFloat(item.remunerativeAmount.replace(",", ".")) > 0
                ? formatNumber(item.remunerativeAmount)
                : "-",
            item.nonRemunerativeAmount &&
            parseFloat(item.nonRemunerativeAmount.replace(",", ".")) > 0
                ? formatNumber(item.nonRemunerativeAmount)
                : "-",
        ]),
        [
            "Subtotales",
            formatNumber(liquidacion.totalRemunerativo),
            formatNumber(liquidacion.totalNoRemunerativo),
            formatNumber(liquidacion.deduccionesRemunerativas),
            formatNumber(liquidacion.deduccionesNoRemunerativas),
        ],
    ];

    // Estilos de la tabla
    autoTable(doc, {
        head: headers as unknown as UserOptions["head"],
        body: body,
        didParseCell: (data) => {
            if (data.row.index === body.length - 1) {
                data.cell.styles.fillColor = LIGHT_GRAY_COLOR;
                data.cell.styles.fontStyle = "bold";
            }
        },
        didDrawCell: function (data) {
            const { row } = data;
        
            // Configuración de bordes personalizados
            if (row.section === 'body') {
                // ❌ No dibujar bordes horizontales en el body
                return;
            }
            
        },
        startY: 98,
        theme: "plain",
        styles: {
            lineColor: SECONDARY_COLOR,
            // lineWidth: 0.2,
            cellPadding: [1, 4],
            fontSize: 9,
            font: "helvetica",
            overflow: "linebreak",
        },
        headStyles: {
            textColor: PRIMARY_COLOR,
            fontStyle: "bold",
            halign: "center",
            valign: "middle",
            lineColor: SECONDARY_COLOR, // Keep horizontal lines in header
            fillColor: LIGHT_GRAY_COLOR,
        },
        bodyStyles: {
            textColor: PRIMARY_COLOR,
            halign: "right",
            valign: "middle",
            // lineWidth: 0.1, 
        },
        columnStyles: {
            0: { halign: "left" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
            4: { halign: "right" },
        },
    });

    const finalY = (doc as jsPDF).lastAutoTable.finalY + 10;

    // Totales Finales
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SECONDARY_COLOR);
    doc.text("Sueldo Bruto", margin + 2, finalY);
    doc.text(
        formatNumber(liquidacion.sueldoBruto),
        pageWidth - margin - 2,
        finalY,
        { align: "right" }
    );

    doc.setFontSize(10);
    doc.setTextColor(...SECONDARY_COLOR);
    doc.text("Deducciones", margin + 2, finalY + 6);
    doc.text(
        formatNumber(liquidacion.totalDeducciones),
        pageWidth - margin - 2,
        finalY + 6,
        { align: "right" }
    );

    // Recibo
    doc.setDrawColor(...LIGHT_GRAY_COLOR);
    doc.setLineWidth(8);
    doc.line(margin - 1, finalY + 12.5, pageWidth - margin + 1, finalY + 12.5);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text("SUELDO NETO", margin + 2, finalY + 14);
    doc.text(
        formatNumber(liquidacion.totalNeto),
        pageWidth - margin - 2,
        finalY + 14,
        { align: "right" }
    );

    

    doc.setFontSize(10);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFont("helvetica", "normal");
    const amountInWords = formatAmountInWords(liquidacion.totalNeto);
    const splitAmountInWords = doc.splitTextToSize(amountInWords, contentWidth);
    doc.text('Recibí la suma de pesos', margin, finalY + 25);
    doc.setFont("helvetica", "bold");
    doc.text(`${splitAmountInWords}.`, margin + 40, finalY + 25);

    doc.setFont("helvetica", "normal");
    const receiptText =
        "Por los conceptos indicados en la presente liquidación, dejando constancia de haber recibido un duplicado de este recibo.";
    const splitReceiptText = doc.splitTextToSize(receiptText, contentWidth);
    doc.text(splitReceiptText, margin, finalY + 34);

    doc.setFont("helvetica", "normal");
    doc.text(
        `Son pesos:`,
        margin,
        finalY + 48
    );
    doc.setFont("helvetica", "bold");
    doc.text(
        formatNumber(liquidacion.totalNeto),
        margin + 20,
        finalY + 48
    );

    // Firma
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.setLineDashPattern([1], 2);
    doc.setLineWidth(0.2);
    doc.line(
        pageWidth - margin - 100,
        finalY + 70,
        pageWidth - margin,
        finalY + 70
    );
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Firma del empleado", pageWidth - margin - 50, finalY + 75, {
        align: "center",
    });
};

export const generateLiquidacionPDF = async (
    liquidacion: Liquidacion,
    employeeInfo: EmployeeInfo
) => {
    const doc = new jsPDF();
    generateLiquidacionPage(
        doc,
        liquidacion,
        employeeInfo,
        "LIQUIDACION DE HABERES - ORIGINAL"
    );
    doc.addPage();
    generateLiquidacionPage(
        doc,
        liquidacion,
        employeeInfo,
        "LIQUIDACION DE HABERES - DUPLICADO"
    );
    return doc;
};
