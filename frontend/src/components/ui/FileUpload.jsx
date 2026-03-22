import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';
import { cn } from '../../utils/cn';

export const FileUpload = ({ 
  onFileSelect, 
  accept = 'image/*',
  maxSize = 5242880, // 5MB
  multiple = false,
  className,
  label,
  error,
  value
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (multiple) {
      onFileSelect(acceptedFiles);
    } else {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400',
          error && 'border-red-500',
          'dark:bg-gray-800'
        )}
      >
        <input {...getInputProps()} />
        
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <File className="h-8 w-8 text-primary-500" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {value.name || 'File selected'}
              </p>
              {value.size && (
                <p className="text-xs text-gray-500">
                  {(value.size / 1024).toFixed(2)} KB
                </p>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {isDragActive 
                ? 'Drop the file here' 
                : 'Drag & drop or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
