import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Maximum file size is 5MB",
                variant: "destructive"
            });
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "";
            const res = await fetch(`${apiUrl}/api/upload`, {
                method: "POST",
                body: formData,
                credentials: "include", // Required for cross-origin session cookies
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onChange(data.url);
            toast({
                title: "Success",
                description: "Image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Could not upload image",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
            <div className="flex flex-col gap-4">
                {value ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/20 bg-muted/50">
                        <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={() => onChange("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="relative">
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`upload-${label?.replace(/\s+/g, '-').toLowerCase()}`}
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <label
                            htmlFor={`upload-${label?.replace(/\s+/g, '-').toLowerCase()}`}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-primary/50 mb-2" />
                                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                )}
                <div className="flex gap-2">
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or paste image URL here..."
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}
