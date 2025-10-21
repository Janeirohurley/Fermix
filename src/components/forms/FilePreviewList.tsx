import React, { useEffect, useState } from 'react';
import {
    FileIcon,
    ImageIcon,
    Music,
    Video,
    FileText,
    X,
} from 'lucide-react';

interface FilePreviewListProps {
    fieldId: string;
    files: File[] | null | undefined;
    onRemove?: (fieldId: string, fileName: string) => void;
}

interface Preview {
    name: string;
    previewUrl?: string;
    type?: string;
}

const getFileIcon = (type?: string) => {
    if (!type) return <FileIcon className="w-4 h-4 text-gray-500" />;
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4 text-purple-500" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4 text-red-500" />;
    if (type.startsWith('text/') || type === 'application/pdf')
        return <FileText className="w-4 h-4 text-green-500" />;
    return <FileIcon className="w-4 h-4 text-gray-500" />;
};

const FilePreviewList: React.FC<FilePreviewListProps> = ({ fieldId, files, onRemove }) => {
    const [previews, setPreviews] = useState<Preview[]>([]);

    useEffect(() => {
        if (!files || files.length === 0) {
            setPreviews([]);
            return;
        }

        const generatePreviews = async () => {
            const previewPromises = files.map(file => {
                return new Promise<Preview>((resolve) => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({
                                name: file.name,
                                previewUrl: reader.result as string,
                                type: file.type,
                            });
                        };
                        reader.readAsDataURL(file);
                    } else {
                        resolve({
                            name: file.name,
                            type: file.type,
                        });
                    }
                });
            });

            const result = await Promise.all(previewPromises);
            setPreviews(result);
        };

        generatePreviews();
    }, [files]);

    if (!previews.length) return null;

    return (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((file, idx) => (
                <div
                    key={idx}
                    className="relative border rounded p-3 bg-gray-50 text-sm overflow-hidden shadow"
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // pour éviter un submit accidentel
                            onRemove?.(fieldId, file.name);
                        }}
                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                        title="Supprimer"
                        type="button"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {file.previewUrl ? (
                        <img
                            src={file.previewUrl}
                            alt={file.name}
                            className="w-full h-32 object-cover rounded mb-2"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-600 truncate">
                            {getFileIcon(file.type)}
                            <span className="truncate">{file.name || 'Fichier inconnu'}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FilePreviewList;
