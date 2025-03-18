import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { FormControl, FormItem, FormLabel } from "./ui/form";

interface FotoUploadProps {
    value?: string;
    onChange: (value: string) => void;
}

export function FotoUpload({ value, onChange }: FotoUploadProps) {
    const [preview, setPreview] = useState<string>(value || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPreview(base64);
                onChange(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <FormItem>
            <FormLabel>Foto</FormLabel>
            <FormControl>
                <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage 
                            src={preview || "/default-avatar.png"} 
                            alt="Foto de perfil" 
                        />
                        <AvatarFallback>
                            {preview ? "..." : "NA"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-fit"
                        >
                            Subir Foto
                        </Button>
                        {preview && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setPreview("");
                                    onChange("");
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                                className="w-fit"
                            >
                                Quitar foto
                            </Button>
                        )}
                    </div>
                </div>
            </FormControl>
        </FormItem>
    );
}
