import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SalaryItem, NonRemunerativeItem, DeductionItem } from "@/contexts/LiquidacionesContext"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calculateYearsOfService = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  return Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
};

export const calculateSeniorityAmount = (basicSalary: string, yearsOfService: number): string => {
  const baseAmount = parseFloat(basicSalary.replace(/\./g, "").replace(",", "."));
  const seniorityPercentage = yearsOfService * 1; // 1% por año
  const amount = (baseAmount * seniorityPercentage) / 100;
  return amount.toFixed(2).replace(".", ",");
};

export const calculateAmount = (percentage: string, base: string): string => {
  const baseAmount = parseFloat(base.replace(/\./g, "").replace(",", "."));
  const percentageValue = parseFloat(percentage.replace(",", "."));
  const amount = (baseAmount * percentageValue) / 100;
  return amount.toFixed(2).replace(".", ",");
};

export const calculateTotalRemunerative = (basicSalary: string, items: SalaryItem[]): string => {
  // Convertir el sueldo básico a número
  const base = parseFloat(basicSalary.replace(/\./g, "").replace(",", "."));
  
  // Sumar todos los items remunerativos (incluyendo antigüedad y presentismo)
  const total = items.reduce((sum, item) => {
      if (item.checked || item.isSeniorityRow || item.isAttendanceRow) {
          const amount = parseFloat(item.amount.replace(/\./g, "").replace(",", "."));
          return sum + amount;
      }
      return sum;
  }, base); // Agregamos el sueldo básico como valor inicial
  
  return total.toFixed(2).replace(".", ",");
};

export const calculateTotalNonRemunerative = (items: NonRemunerativeItem[]): string => {
  const total = items.reduce((sum, item) => {
    if (item.checked) {
      const amount = parseFloat(item.amount.replace(/\./g, "").replace(",", "."));
      return sum + amount;
    }
    return sum;
  }, 0);
  return total.toFixed(2).replace(".", ",");
};

export const calculateDeductionTotals = (items: DeductionItem[], totalRemunerativo: string, totalNoRemunerativo: string) => {
  let remunerative = 0;
  let nonRemunerative = 0;

  items.forEach(item => {
    if (item.checkedRemunerative) {
      const base = parseFloat(totalRemunerativo.replace(/\./g, "").replace(",", "."));
      const percentage = parseFloat(item.percentage.replace(",", "."));
      remunerative += (base * percentage) / 100;
    }
    if (item.checkedNonRemunerative) {
      const base = parseFloat(totalNoRemunerativo.replace(/\./g, "").replace(",", "."));
      const percentage = parseFloat(item.percentage.replace(",", "."));
      nonRemunerative += (base * percentage) / 100;
    }
  });

  return {
    remunerative: remunerative.toFixed(2).replace(".", ","),
    nonRemunerative: nonRemunerative.toFixed(2).replace(".", ",")
  };
};

export const calculateTotalNeto = (totalRemunerativo: string, totalNoRemunerativo: string, totalDeduccionesRemunerativo: string, totalDeduccionesNoRemunerativo: string): string => {
  const remunerativo = parseFloat(totalRemunerativo.replace(/\./g, "").replace(",", "."));
  const noRemunerativo = parseFloat(totalNoRemunerativo.replace(/\./g, "").replace(",", "."));
  const deduccionesRemunerativo = parseFloat(totalDeduccionesRemunerativo.replace(/\./g, "").replace(",", "."));
  const deduccionesNoRemunerativo = parseFloat(totalDeduccionesNoRemunerativo.replace(/\./g, "").replace(",", "."));

  const total = remunerativo + noRemunerativo - deduccionesRemunerativo - deduccionesNoRemunerativo;
  return total.toFixed(2).replace(".", ",");
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Funciones para el nuevo formato de periodo
export const formatPeriodoToString = (periodoObj: { month: number; year: number; type: 'monthly' | 'quincena1' | 'quincena2' }): string => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const typeLabels = {
    'monthly': '',
    'quincena1': ' - Primera Quincena',
    'quincena2': ' - Segunda Quincena'
  };
  
  return `${monthNames[periodoObj.month - 1]} ${periodoObj.year}${typeLabels[periodoObj.type]}`;
};

export const parsePeriodoString = (periodoStr: string): { month: number; year: number; type: 'monthly' | 'quincena1' | 'quincena2' } | null => {
  // Para compatibilidad con el formato anterior (YYYY-MM)
  if (periodoStr.match(/^\d{4}-\d{1,2}$/)) {
    const [yearStr, monthStr] = periodoStr.split('-');
    return {
      month: parseInt(monthStr, 10),
      year: parseInt(yearStr, 10),
      type: 'monthly'
    };
  }
  
  // Intentar parsear el nuevo formato
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  let type: 'monthly' | 'quincena1' | 'quincena2' = 'monthly';
  let periodoLower = periodoStr.toLowerCase();
  
  if (periodoLower.includes('primera quincena')) {
    type = 'quincena1';
    periodoLower = periodoLower.replace('primera quincena', '').trim();
  } else if (periodoLower.includes('segunda quincena')) {
    type = 'quincena2';
    periodoLower = periodoLower.replace('segunda quincena', '').trim();
  }
  
  // Buscar el mes en el string
  const monthIndex = monthNames.findIndex(month => periodoLower.includes(month));
  if (monthIndex === -1) return null;
  
  // Buscar el año en el string
  const yearMatch = periodoLower.match(/\d{4}/);
  if (!yearMatch) return null;
  
  return {
    month: monthIndex + 1,
    year: parseInt(yearMatch[0], 10),
    type
  };
};

export const formatNumber = (value: string) => {
  if (!value) return "";

  // Elimina cualquier carácter no numérico excepto la coma
  value = value.replace(/[^0-9,]/g, "");

  // Si hay una coma, separamos la parte entera y decimal
  let [integer, decimal] = value.split(",");

  // Formateamos la parte entera con separadores de miles
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Si no hay parte decimal, se agrega ",00"
  if (!decimal) {
      decimal = "00";
  } else {
      // Si hay una parte decimal, la limitamos a 2 dígitos
      decimal = decimal.length === 1 ? `${decimal}0` : decimal.slice(0, 2);
  }

  // Retorna la parte entera con los decimales formateados
  return `${integer},${decimal}`;
};

export const numberToWords = (number: number): string => {
  const units = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  const convertLessThanOneThousand = (num: number): string => {
    if (num === 0) return '';
    
    if (num === 100) return 'cien';
    
    let result = '';
    
    // Handle hundreds
    if (num >= 100) {
      result = hundreds[Math.floor(num / 100)] + ' ';
      num %= 100;
    }
    
    // Handle tens and units
    if (num >= 10 && num < 20) {
      // Special case for 10-19
      result += teens[num - 10];
      return result.trim();
    } else if (num >= 20) {
      // For 20 and above
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      
      if (unit === 0) {
        result += tens[ten];
      } else if (ten === 2) {
        // Special case for 21-29
        result += 'veinti' + units[unit];
      } else {
        result += tens[ten] + ' y ' + units[unit];
      }
    } else {
      // For 1-9
      result += units[num];
    }
    
    return result.trim();
  };

  if (number === 0) return 'cero';
  
  let result = '';
  
  // Handle millions
  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    if (millions === 1) {
      result += 'un millón ';
    } else {
      result += convertLessThanOneThousand(millions) + ' millones ';
    }
    number %= 1000000;
  }
  
  // Handle thousands
  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    if (thousands === 1) {
      result += 'mil ';
    } else {
      result += convertLessThanOneThousand(thousands) + ' mil ';
    }
    number %= 1000;
  }
  
  // Handle the rest
  if (number > 0) {
    result += convertLessThanOneThousand(number);
  }
  
  return result.trim();
};

export const formatAmountInWords = (amount: string): string => {
  // Parse the amount string to get the integer and decimal parts
  const cleanAmount = amount.replace(/\./g, "").replace(",", ".");
  const [integerPart, decimalPart = "00"] = parseFloat(cleanAmount).toFixed(2).split(".");
  
  // Convert integer part to words
  const integerWords = numberToWords(parseInt(integerPart));
  
  // Capitalize first letter
  const capitalizedWords = integerWords.charAt(0).toUpperCase() + integerWords.slice(1);
  
  // Format the final string
  return `${capitalizedWords} con ${decimalPart}/100`;
};