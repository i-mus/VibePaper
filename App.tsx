
import React, { useState, useCallback, useEffect } from 'react';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage, AspectRatio } from './types';
import ImageGrid from './components/ImageGrid';
import ImageModal from './components/ImageModal';
import Loader from './components/Loader';
import { CloseIcon } from './components/Icons';

const aspectRatios: { label: string, value: AspectRatio }[] = [
    { label: "Phone (9:16)", value: "9:16" },
    { label: "Widescreen (16:9)", value: "16:9" },
    { label: "Square (1:1)", value: "1:1" },
    { label: "Portrait (3:4)", value: "3:4" },
    { label: "Landscape (4:3)", value: "4:3" },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [favorites, setFavorites] = useState<GeneratedImage[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [view, setView] = useState<'generate' | 'favorites'>('generate');

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('vibepaper-favorites');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      const storedHistory = localStorage.getItem('vibepaper-history');
      if (storedHistory) setPromptHistory(JSON.parse(storedHistory));
    } catch (e) {
      console.error("Failed to parse from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vibepaper-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vibepaper-history', JSON.stringify(promptHistory));
  }, [promptHistory]);

  const handleGenerate = useCallback(async (currentPrompt: string, currentAspectRatio: AspectRatio) => {
    if (!currentPrompt) {
      setError("Please enter a vibe to generate.");
      return;
    }
    setView('generate');
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      if (!promptHistory.includes(currentPrompt)) {
        setPromptHistory(prev => [currentPrompt, ...prev.slice(0, 9)]);
      }
      const imageSrcs = await generateWallpapers(currentPrompt, currentAspectRatio);
      setImages(imageSrcs.map(src => ({ src, prompt: currentPrompt, aspectRatio: currentAspectRatio })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [promptHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(prompt, aspectRatio);
  };

  const handleRemix = useCallback((imageToRemix: GeneratedImage) => {
    setSelectedImage(null);
    setPrompt(imageToRemix.prompt);
    setAspectRatio(imageToRemix.aspectRatio as AspectRatio);
    handleGenerate(imageToRemix.prompt, imageToRemix.aspectRatio as AspectRatio);
  }, [handleGenerate]);

  const handleDownload = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `vibepaper-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleFavorite = (image: GeneratedImage) => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.src === image.src);
      return isFavorited ? prev.filter(fav => fav.src !== image.src) : [image, ...prev];
    });
  };

  const handleClearResults = () => {
      setImages([]);
      setError(null);
  }

  const isFavorited = (imageSrc: string) => favorites.some(fav => fav.src === imageSrc);

  const WelcomeScreen = () => (
      <div className="text-center p-8">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to VibePaper</h2>
          <p className="text-lg text-gray-400">Describe a vibe, and we'll generate unique wallpapers for you.</p>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <header className="p-4 text-center sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-600 text-transparent bg-clip-text">
          VibePaper
        </h1>
      </header>
      
      <main className="flex-grow flex flex-col items-center w-full max-w-5xl mx-auto px-4">
        <div className="w-full sticky top-[76px] z-10 bg-gray-900 py-4">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., rainy cyberpunk lo-fi"
              className="flex-grow w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
            <div className="flex gap-2 w-full sm:w-auto">
             <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 transition appearance-none text-center"
              >
                {aspectRatios.map(ar => (
                  <option key={ar.value} value={ar.value} className="bg-gray-800">{ar.label}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-violet-600 rounded-full font-semibold hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "..." : "Generate"}
              </button>
            </div>
          </form>
            {promptHistory.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 text-sm">
                    <span className="text-gray-400">History:</span>
                    {promptHistory.map((p, i) => (
                        <button key={i} onClick={() => setPrompt(p)} className="bg-gray-700/50 px-2 py-1 rounded-md hover:bg-gray-600 transition-colors">
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div className="w-full mt-4">
            <div className="flex items-center justify-between border-b border-gray-700 mb-4">
                <div className="flex space-x-1">
                    <button onClick={() => setView('generate')} className={`px-4 py-2 text-lg font-medium rounded-t-lg ${view === 'generate' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}>
                        Results
                    </button>
                    <button onClick={() => setView('favorites')} className={`px-4 py-2 text-lg font-medium rounded-t-lg ${view === 'favorites' ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'}`}>
                        Favorites {favorites.length > 0 && `(${favorites.length})`}
                    </button>
                </div>
                {view === 'generate' && images.length > 0 && !isLoading && (
                    <button onClick={handleClearResults} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <CloseIcon className="w-4 h-4" /> Clear
                    </button>
                )}
            </div>
        </div>

        <div className="w-full flex-grow flex items-center justify-center pb-4">
          {isLoading && <Loader />}
          {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
          
          {view === 'generate' && !isLoading && !error && images.length === 0 && <WelcomeScreen />}
          {view === 'generate' && !isLoading && !error && images.length > 0 && (
            <ImageGrid images={images} onSelectImage={setSelectedImage} />
          )}

          {view === 'favorites' && favorites.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                  <p>Your favorite wallpapers will appear here.</p>
                  <p>Click the heart icon on an image to save it.</p>
              </div>
          )}
          {view === 'favorites' && favorites.length > 0 && (
              <ImageGrid images={favorites} onSelectImage={setSelectedImage} />
          )}
        </div>
      </main>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          onRemix={handleRemix}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorited(selectedImage.src)}
        />
      )}
    </div>
  );
};

export default App;
