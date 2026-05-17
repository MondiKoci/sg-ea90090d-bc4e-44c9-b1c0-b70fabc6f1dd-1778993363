import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fileService } from "@/services/fileService";
import type { PatientDocument } from "@/services/fileService";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, FileText, Download, Trash2 } from "lucide-react";

interface FileUploadProps {
  patientId: string;
  uploadedBy: string;
  onUploadComplete?: () => void;
}

export function FileUpload({ patientId, uploadedBy, onUploadComplete }: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<PatientDocument["document_type"]>("medical_record");
  const [notes, setNotes] = useState("");
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    loadDocuments();
  });

  const loadDocuments = async () => {
    try {
      const docs = await fileService.getPatientDocuments(patientId);
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await fileService.uploadDocument(
        patientId,
        selectedFile,
        documentType,
        uploadedBy,
        notes || undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: "Document uploaded successfully",
        description: `${selectedFile.name} has been uploaded.`,
      });

      // Reset form
      setSelectedFile(null);
      setNotes("");
      setDocumentType("medical_record");
      setUploadProgress(0);
      
      // Reload documents
      await loadDocuments();
      
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: PatientDocument) => {
    try {
      const blob = await fileService.downloadDocument(doc.file_path);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (doc: PatientDocument) => {
    if (!confirm(`Delete ${doc.file_name}?`)) return;

    try {
      await fileService.deleteDocument(doc.id, doc.file_path);
      toast({ title: "Document deleted" });
      loadDocuments();
    } catch (error) {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      medical_record: "Medical Record",
      id_document: "ID Document",
      insurance: "Insurance",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      medical_record: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      id_document: "bg-purple-500/10 text-purple-700 border-purple-500/20",
      insurance: "bg-green-500/10 text-green-700 border-green-500/20",
      other: "bg-muted text-muted-foreground border-border",
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Upload medical records, ID documents, or other files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <File className="w-8 h-8 text-accent" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {fileService.formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop a file here, or
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select
                  value={documentType}
                  onValueChange={(value: PatientDocument["document_type"]) =>
                    setDocumentType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical_record">Medical Record</SelectItem>
                    <SelectItem value="id_document">ID Document</SelectItem>
                    <SelectItem value="insurance">Insurance Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any relevant notes about this document..."
                  rows={3}
                />
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Documents
          </CardTitle>
          <CardDescription>
            View and manage all uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : documents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-accent shrink-0" />
                      <div>
                        <p className="font-medium">{doc.file_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getDocumentTypeBadge(doc.document_type)}>
                            {getDocumentTypeLabel(doc.document_type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {fileService.formatFileSize(doc.file_size)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {doc.notes && (
                      <p className="text-sm text-muted-foreground ml-8">
                        {doc.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc)}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}