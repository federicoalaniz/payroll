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

export const calculateAmount = (percentage: string, base: string, isRemunerative: boolean): string => {
  const baseAmount = parseFloat(base.replace(/\./g, "").replace(",", "."));
  const percentageValue = parseFloat(percentage.replace(",", "."));
  const amount = (baseAmount * percentageValue) / 100;
  return amount.toFixed(2).replace(".", ",");
};

export const calculateTotalRemunerative = (basicSalary: string, items: SalaryItem[]): string => {
  const base = parseFloat(basicSalary.replace(/\./g, "").replace(",", "."));
  const total = items.reduce((sum, item) => {
    if (item.checked) {
      const amount = parseFloat(item.amount.replace(/\./g, "").replace(",", "."));
      return sum + amount;
    }
    return sum;
  }, base);
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