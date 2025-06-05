import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center space-y-6">
      <div className="inline-block">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 text-transparent bg-clip-text sm:text-5xl md:text-6xl pb-3">
          Traffic Signal Identifier
        </h1>
      </div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Upload an image of a traffic signal and our advanced AI will identify its state.
        Quick, accurate, and reliable detection for enhanced traffic management.
      </p>
    </header>
  );
};

export default Header; 