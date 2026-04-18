import React, { useState } from 'react';
import { ChefHat, Lock } from 'lucide-react';

interface LockProps {
  onUnlock: () => void;
  expectedPin?: string;
  title?: string;
  accentColor?: string;
}

export const DataLock = ({
  onUnlock,
  expectedPin = '0000',
  title = 'Solo Dueño',
  accentColor = '#f59e0b',
}: LockProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleKey = (n: string) => {
    if (code.length < 4) {
      const newCode = code + n;
      setCode(newCode);
      if (newCode === expectedPin) {
        onUnlock();
      } else if (newCode.length === 4) {
        setError(true);
        setTimeout(() => { setCode(''); setError(false); }, 500);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
      <div className={`w-full max-w-xs bg-white border-2 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center ${error ? 'animate-shake bg-red-50' : ''}`}>
        <Lock className="w-12 h-12 text-black mx-auto mb-4" />
        <h3 className="text-xl font-black uppercase italic mb-6">{title}</h3>
        <div className="flex justify-center gap-4 mb-10">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-black transition-all ${code.length > i ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'X'].map(k => (
            <button 
              key={k} 
              onClick={() => k === 'C' ? setCode('') : k === 'X' ? setCode('') : handleKey(k.toString())}
              className="aspect-square flex items-center justify-center bg-gray-100 rounded-2xl font-black text-xl active:scale-95 transition-all"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const KitchenLock = ({
  onUnlock,
  expectedPin = '0000',
  title = 'Acceso Cocina',
  accentColor = '#f59e0b',
}: LockProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleKey = (n: string) => {
    if (code.length < 4) {
      const newCode = code + n;
      setCode(newCode);
      if (newCode === expectedPin) {
        onUnlock();
      } else if (newCode.length === 4) {
        setError(true);
        setTimeout(() => { setCode(''); setError(false); }, 500);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
      <div className={`w-full max-w-xs bg-white border-2 border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center ${error ? 'animate-shake bg-red-50' : ''}`}>
        <ChefHat className="w-12 h-12 text-black mx-auto mb-4" />
        <h3 className="text-xl font-black uppercase italic mb-6">{title}</h3>
        <div className="flex justify-center gap-4 mb-10">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-black transition-all ${code.length > i ? 'bg-black' : 'bg-transparent'}`}></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'X'].map(k => (
            <button
              key={k}
              onClick={() => k === 'C' ? setCode('') : k === 'X' ? setCode('') : handleKey(k.toString())}
              className="aspect-square flex items-center justify-center bg-gray-100 rounded-2xl font-black text-xl active:scale-95 transition-all"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
