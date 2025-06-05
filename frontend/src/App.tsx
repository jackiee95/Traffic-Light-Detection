import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Header from './components/Header';

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetection = async (image: File) => {
    try {
      // TODO: Implement backend API call
      // For now, we'll simulate a response
      setError(null);
      setResult('Red Signal Detected');
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setResult(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-background to-accent-50" />
      
      {/* Decorative pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(12, 135, 232, 0.07) 0, rgba(12, 135, 232, 0) 10px),
            radial-gradient(circle at 50px 50px, rgba(236, 72, 153, 0.07) 0, rgba(236, 72, 153, 0) 10px),
            radial-gradient(circle at 80px 80px, rgba(16, 185, 129, 0.07) 0, rgba(16, 185, 129, 0) 10px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Content */}
      <div className="relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Header />
          
          <main className="mt-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft p-8">
              <ImageUpload
                onDetect={handleDetection}
                onReset={handleReset}
                result={result}
                error={error}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;