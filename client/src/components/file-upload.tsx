import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    accept?: string;
}

export default function FileUpload({ value, onChange, label, accept = "*" }: FileUploadProps) {
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
                credentials: "include",
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed with status ${res.status}`);
            }

            const data = await res.json();
            onChange(data.url);
            toast({
                title: "Success",
                description: "File uploaded successfully",
            });
        } catch (error: any) {
            console.error("Upload error:", error);
            toast({
                title: "Upload failed",
                description: error.message || "Could not upload file",
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
                    <div className="relative w-full h-32 rounded-lg border border-primary/20 bg-muted/50 flex flex-col items-center justify-center">
                        <FileText className="h-8 w-8 text-primary mb-2" />
                        <span className="text-sm text-muted-foreground truncate px-4 w-full text-center">{value.split('/').pop()}</span>
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
                            accept={accept}
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
                                        <p className="text-sm text-muted-foreground">Click to upload file</p>
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
                        placeholder="Or paste file URL here..."
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}
