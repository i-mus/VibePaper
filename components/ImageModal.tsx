
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, RemixIcon, CloseIcon, HeartIcon } from './Icons';

interface ImageModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onDownload: (imageSrc: string) => void;
  onRemix: (image: GeneratedImage) => void;
  onToggleFavorite: (image: GeneratedImage) => void;
  isFavorite: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDownload, onRemix, onToggleFavorite, isFavorite }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative w-full max-w-lg h-full max-h-[85vh] flex flex-col items-center justify-center">
        <img
          src={image.src}
          alt={image.prompt}
          className="w-auto h-full object-contain rounded-lg shadow-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 sm:space-x-4 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
          <button
            onClick={() => onToggleFavorite(image)}
            className={`flex items-center space-x-2 ${isFavorite ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-700 hover:bg-gray-600'} text-white px-6 py-3 rounded-full transition-colors shadow-lg`}
          >
            <HeartIcon className="w-6 h-6" filled={isFavorite} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>
          <button
            onClick={() => onDownload(image.src)}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors shadow-lg"
          >
            <DownloadIcon className="w-6 h-6" />
            <span>Download</span>
          </button>
          <button
            onClick={() => onRemix(image)}
            className="flex items-center space-x-2 bg-violet-500 text-white px-6 py-3 rounded-full hover:bg-violet-600 transition-colors shadow-lg"
          >
            <RemixIcon className="w-6 h-6" />
            <span>Remix</span>
          </button>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
      >
        <CloseIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ImageModal;
