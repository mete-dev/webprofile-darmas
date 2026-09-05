import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { compressImageToMax100KB, CompressionResult } from '../utils/imageCompression';

interface ImageUploadWithCompressionProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  id?: string;
}

export default function ImageUploadWithCompression({
  value,
  onChange,
  label = 'Unggah Foto',
  helperText = 'Format JPG/PNG. Otomatis dikompresi maksimal < 100 KB.',
  aspectRatio = 'auto',
  id = 'image-upload'
}: ImageUploadWithCompressionProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Harap unggah berkas gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    setIsCompressing(true);
    setErrorMessage(null);

    try {
      const result = await compressImageToMax100KB(file);
      setCompressionInfo(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      console.error('Gagal mengompresi gambar:', err);
      setErrorMessage('Terjadi kesalahan saat memproses dan mengompresi gambar.');
    } finally {
      setIsCompressing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setCompressionInfo(null);
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setCompressionInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-bold text-neutral-800">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1"
          >
            <LinkIcon className="h-3 w-3" />
            {showUrlInput ? 'Gunakan Unggah Berkas' : 'Gunakan Tautan URL'}
          </button>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl || value}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-2 bg-emerald-900 text-white text-xs font-bold rounded-xl hover:bg-emerald-800"
          >
            Terapkan
          </button>
        </div>
      ) : (
        <div>
          {value ? (
            <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-3 flex flex-col sm:flex-row items-center gap-4">
              <div
                className={`relative rounded-xl overflow-hidden border border-neutral-200 bg-white flex-shrink-0 ${
                  aspectRatio === 'square'
                    ? 'w-24 h-24'
                    : aspectRatio === 'video'
                    ? 'w-36 h-20'
                    : 'w-24 h-24'
                }`}
              >
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-left w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Foto Siap Digunakan</span>
                </div>

                {compressionInfo && (
                  <div className="mt-1 space-y-0.5 text-[11px] text-neutral-600">
                    <p>
                      Ukuran Hasil Kompresi:{' '}
                      <strong className="text-emerald-900 font-mono">
                        {compressionInfo.sizeKb} KB
                      </strong>{' '}
                      <span className="inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-md">
                        &lt; 100 KB ✓
                      </span>
                    </p>
                    {compressionInfo.originalSizeKb > 0 && (
                      <p className="text-neutral-400">
                        Ukuran asli: {compressionInfo.originalSizeKb} KB (Hemat {compressionInfo.reductionPercent}%)
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 font-medium text-neutral-700 inline-flex items-center gap-1 shadow-2xs"
                  >
                    <RefreshCw className="h-3 w-3" /> Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg font-medium inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-emerald-600 bg-emerald-50/70 scale-[0.99]'
                  : 'border-neutral-300 hover:border-emerald-700 bg-neutral-50/60 hover:bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={onFileInputChange}
              />

              {isCompressing ? (
                <div className="py-3 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="h-6 w-6 text-emerald-800 animate-spin" />
                  <p className="text-xs font-bold text-neutral-800">
                    Mengompresi gambar otomatis hingga &lt; 100 KB...
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Menyesuaikan resolusi dan kualitas canvas
                  </p>
                </div>
              ) : (
                <div className="py-2 flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">
                    Klik untuk pilih berkas foto, atau seret foto ke sini
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold">
                    ✓ Otomatis dikompresi maksimal &lt; 100 KB
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Mendukung JPG, PNG, WEBP dari kamera ponsel / komputer
                  </p>
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {helperText && !errorMessage && (
        <p className="text-[11px] text-neutral-400">{helperText}</p>
      )}
    </div>
  );
}
