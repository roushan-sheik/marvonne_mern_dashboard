import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePreviewStoryQuery, useRegeneratePageIllustrationMutation } from '../store/apiSlice';
import { Loader2, ChevronLeft, ChevronRight, ArrowDown, RefreshCw, Brain } from 'lucide-react';

export default function StoryPreview() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePreviewStoryQuery(id);
  const story = data?.data;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentParaIndex, setCurrentParaIndex] = useState(0);
  const [regenerateImage, { isLoading: isRegenerating }] = useRegeneratePageIllustrationMutation();

  // If story data changes, reset to page 0
  useEffect(() => {
    if (story?.pages?.length) {
      setCurrentPageIndex(0);
      setCurrentParaIndex(0);
    }
  }, [story?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-green-50 to-emerald-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#0d9488]" />
      </div>
    );
  }

  if (isError || !story || !story.pages || story.pages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-green-50 to-emerald-50">
        <p className="text-xl text-red-500 font-bold mb-4">Failed to load story pages or story has no pages.</p>
        <Link to="/" className="px-6 py-2 bg-[#0d9488] text-white rounded-full font-bold">Go Back</Link>
      </div>
    );
  }

  const pages = story.pages;
  const currentPage = pages[currentPageIndex];
  
  // Use a fallback image if individual page images aren't available yet
  const pageImage = currentPage.default_image || story.cover_image || "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1000";

  // Split content into chunks of ~25 words to strictly enforce the 20-28 words max rule
  const words = (currentPage.default_text || "").split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 25) {
    chunks.push(words.slice(i, i + 25).join(" "));
  }

  const handlePrev = () => {
    setCurrentPageIndex((prev) => {
      if (prev > 0) {
        setCurrentParaIndex(0);
        return prev - 1;
      }
      return prev;
    });
  };

  const handleNext = () => {
    setCurrentPageIndex((prev) => {
      if (prev < pages.length - 1) {
        setCurrentParaIndex(0);
        return prev + 1;
      }
      return prev;
    });
  };

  const handleNextPara = () => {
    if (currentParaIndex < chunks.length - 1) {
      setCurrentParaIndex(prev => prev + 1);
    }
  };

  const handleRegenerateImage = async () => {
    try {
      await regenerateImage(currentPage.id).unwrap();
    } catch (err: any) {
      alert(err?.data?.message || err?.message || 'Failed to regenerate image');
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen -m-6 md:-m-10 p-4 md:p-6 bg-gradient-to-br from-[#e8f7ec] via-[#f0fdf4] to-[#ccfbf1] font-sans flex flex-col items-center overflow-hidden relative">
      
      {/* Title Area */}
      <div className="shrink-0 text-center mb-2 md:mb-4 mt-2">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Preview Your Story</h1>
      </div>

      {/* Main Book Spread - Flex-1 to fill available vertical space */}
      <div className="relative w-full max-w-6xl flex-1 min-h-0 flex items-center justify-center mb-2 md:mb-6">
        
        {/* Navigation Buttons (Left / Right) */}
        <button 
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#34d399] to-[#0d9488] text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 md:w-10 md:h-10 ml-[-2px]" />
        </button>

        <button 
          onClick={handleNext}
          disabled={currentPageIndex === pages.length - 1}
          className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#34d399] to-[#0d9488] text-white shadow-lg hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6 md:w-10 md:h-10 mr-[-2px]" />
        </button>

        {/* The Book Container */}
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-2xl relative z-10 w-[90%] md:w-full h-full max-h-[600px] overflow-hidden ring-1 ring-black/5">
          
          {/* Middle Crease Shadow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-12 -ml-6 bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none z-20"></div>
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/5 z-20"></div>

          {/* Left Page (Image) */}
          <div className="w-full md:w-1/2 h-[45%] md:h-full relative bg-gray-100 shrink-0 group">
            <img 
              src={pageImage} 
              alt={`Page ${currentPage.page_number} illustration`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isRegenerating ? 'opacity-40 blur-sm' : 'opacity-100'}`}
            />
            
            {/* Loading Overlay */}
            {isRegenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-20">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl flex flex-col items-center">
                  <Brain className="w-8 h-8 text-[#0d9488] animate-pulse mb-2" />
                  <p className="text-[#0f3a4a] font-bold text-sm">Crafting Magic...</p>
                </div>
              </div>
            )}

            {/* Update Illustration Button */}
            {!isRegenerating && (
              <button
                onClick={handleRegenerateImage}
                className="absolute bottom-4 left-4 z-30 flex items-center px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs md:text-sm font-bold rounded-full transition-all opacity-0 md:group-hover:opacity-100 md:opacity-0 shadow-lg"
                style={{ opacity: window.innerWidth < 768 ? 1 : undefined }} // Always show on mobile, hover on desktop
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Illustration
              </button>
            )}
          </div>

          {/* Right Page (Text) */}
          <div className="w-full md:w-1/2 h-[55%] md:h-full p-6 md:p-12 relative flex flex-col justify-center bg-white overflow-hidden">
            
            {/* Floral/Decorative Corners (Simulated with gradients) */}
            <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-bl from-pink-300/30 via-purple-300/20 to-transparent rounded-bl-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-tr from-teal-300/20 via-blue-300/10 to-transparent rounded-tr-full pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Top Badge */}
              <div className="shrink-0">
                <div className="inline-block px-3 py-1 md:px-4 md:py-1 bg-gradient-to-r from-[#bef264] to-[#4ade80] text-teal-900 rounded-full font-bold text-xs md:text-sm mb-4 md:mb-8 shadow-sm">
                  Page {currentPage.page_number}
                </div>
              </div>

              {/* Text Content area */}
              <div className="flex-1 flex flex-col justify-center relative px-2 md:px-0">
                {/* Animated transition between chunks */}
                <div className="relative w-full">
                  <p className="font-serif text-xl md:text-3xl text-gray-800 leading-relaxed md:leading-loose animate-[fadeIn_0.5s_ease-out]">
                    {chunks[currentParaIndex]}
                  </p>
                </div>
              </div>

              {/* Next Paragraph Button (Absolutely Positioned to avoid layout shift/overflow) */}
              {currentParaIndex < chunks.length - 1 && (
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                  <button 
                    onClick={handleNextPara}
                    className="flex items-center text-xs md:text-sm px-4 py-2 bg-gradient-to-r from-[#0d9488] to-[#0f3a4a] text-white font-bold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    Next Paragraph <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Thumbnails Row (Fixed Height at Bottom) */}
      <div className="shrink-0 w-full max-w-6xl px-4 h-[80px] md:h-[120px] mb-2 md:mb-6">
        <div className="flex gap-3 overflow-x-auto h-full items-center snap-x hide-scrollbar px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {pages.map((page: any, index: number) => (
            <button
              key={page.id}
              onClick={() => {
                setCurrentPageIndex(index);
                setCurrentParaIndex(0);
              }}
              className={`relative flex-shrink-0 w-24 h-16 md:w-40 md:h-24 rounded bg-white shadow-md overflow-hidden transition-all snap-center group ${
                currentPageIndex === index 
                  ? 'ring-2 md:ring-4 ring-[#0d9488] ring-offset-2 scale-105 z-10' 
                  : 'hover:ring-2 hover:ring-[#34d399] opacity-70 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 p-1.5 md:p-3 flex flex-col">
                <div className="inline-block px-1.5 py-0.5 bg-gradient-to-r from-[#bef264] to-[#4ade80] text-[6px] md:text-[9px] text-teal-900 rounded-full font-bold w-max mb-1">
                  Page {page.page_number}
                </div>
                <p className="font-serif text-[5px] md:text-[7px] text-gray-600 leading-tight line-clamp-3 text-left">
                  {page.default_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Info & Dots */}
      <div className="shrink-0 flex flex-col items-center mb-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${currentPageIndex === 0 ? 'bg-[#0d9488]' : 'bg-gray-300'}`}></div>
          <p className="text-[#0f3a4a] text-xs md:text-sm font-bold tracking-wide mx-2">
             {currentPageIndex + 1} of {pages.length}
          </p>
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${currentPageIndex === pages.length - 1 ? 'bg-[#0d9488]' : 'bg-gray-300'}`}></div>
        </div>
      </div>

    </div>
  );
}
