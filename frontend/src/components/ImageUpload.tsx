import React, { useState, useCallback } from 'react';

interface ImageUploadProps {
  onDetect: (file: File) => void;
  onReset: () => void;
  result: string | null;
  error: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onDetect, onReset, result, error }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onReset();
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDetectClick = () => {
    if (image) {
      onDetect(image);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    onReset();
  };

  return (
    <div id="upload-section" className="animate-slide-up">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 animate-scale-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]
          ${isDragging ? 'border-primary-500 bg-primary-50/50' : 'border-gray-300'}
          ${!image ? 'hover:border-primary-500 hover:bg-primary-50/50' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!image ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block"
            >
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 text-primary-400">
                  <svg
                    className="h-12 w-12 transform transition-transform group-hover:scale-110"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-gray-600">
                  <span className="text-primary-600 font-medium">Upload an image</span>
                  {' or drag and drop'}
                </div>
              </div>
            </label>
          </>
        ) : (
          <div className="space-y-4">
            <img
              src={preview!}
              alt="Preview"
              className="mx-auto max-h-64 rounded-lg shadow-soft animate-scale-up"
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 animate-slide-up">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 animate-slide-up">
          <p className="text-green-700 font-medium">{result}</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleDetectClick}
          disabled={!image}
          className={`px-6 py-2 rounded-lg transition-all duration-300 animate-fade-in [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards] ${
            image 
              ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-lg hover:-translate-y-0.5' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Detect Signal
        </button>
      </div>
    </div>
  );
};

export default ImageUpload; 