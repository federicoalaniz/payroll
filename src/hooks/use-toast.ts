"use client";

import { toast as sonnerToast } from "sonner";

function toast(message: string, type: "success" | "error" | "info" = "info") {
    switch (type) {
        case "success":
            sonnerToast.success(message);
            break;
        case "error":
            sonnerToast.error(message);
            break;
        default:
            sonnerToast(message);
    }
}

function useToast() {
    return { toast };
}

export { useToast, toast };
