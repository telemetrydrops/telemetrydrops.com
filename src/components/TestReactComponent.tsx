import { useState } from 'react';

interface TestReactComponentProps {
  title?: string;
}

export default function TestReactComponent({ title = "React Component Test" }: TestReactComponentProps) {
  const [count, setCount] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-telemetria-dark mb-4">{title}</h3>
      
      <div className="space-y-4">
        <p className="text-telemetria-gray">
          This is an interactive React component running in Astro!
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-telemetria-dark">
            Count: <span className="text-telemetria-orange">{count}</span>
          </span>
          
          <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform ${
              isClicked 
                ? 'bg-telemetria-orange text-white scale-95' 
                : 'bg-telemetria-orange hover:bg-orange-600 text-white hover:scale-105'
            }`}
          >
            Increment
          </button>
        </div>
        
        {count > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              ✅ React state management is working! You've clicked {count} times.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}