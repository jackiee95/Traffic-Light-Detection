import React, { useState, useRef } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const fileInput = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return setError('Please select an image file.');
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Only images allowed.');
      return;
    }
    setError('');
    setImage(URL.createObjectURL(file));
    setImageFile(file);
    setResult('');
  };

  const handleDetect = () => {
    if (!image) return setError('Upload an image first.');
    setError('');
    const fakeResults = [
      '🟥 Red Signal Detected',
      '🟨 Yellow Signal Detected',
      '🟩 Green Signal Detected'
    ];
    const randomResult = fakeResults[Math.floor(Math.random() * fakeResults.length)];
    setTimeout(() => {
      setResult(randomResult);
    }, 1500);
  };

  const resetAll = () => {
    setImage(null);
    setImageFile(null);
    setResult('');
    setError('');
    fileInput.current.value = null;
  };

  return (
    <div className="min-h-screen px-10 py-12 font-sans text-center bg-[url('/bg-light.jpg')] bg-cover bg-fixed bg-no-repeat bg-top">
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-blue-800">Traffic Signal Identifier</h1>
        <p className="text-gray-600">Upload a traffic signal image to detect its status.</p>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4 block mx-auto text-center"
        />

        {image && (
          <div className="mb-4">
            <img src={image} alt="Preview" className="w-48 h-48 object-cover mx-auto rounded-xl shadow" />
          </div>
        )}

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <button
          onClick={handleDetect}
          disabled={!image}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300 disabled:opacity-50"
        >
          Detect Signal
        </button>

        {result && (
          <div className="mt-6 space-y-3">
            <p className="text-xl font-semibold text-green-700">{result}</p>
            <button
              onClick={resetAll}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full transition duration-300"
            >
              Upload Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;