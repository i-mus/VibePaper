
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  onSelectImage: (image: GeneratedImage) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelectImage }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group transform hover:scale-105 transition-transform duration-300"
          onClick={() => onSelectImage(image)}
        >
          <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
             <p className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
