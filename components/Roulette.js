"use client";
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const sectors = ['Common','Common','Common','Rare','Rare','Epic','Common','Common','Rare','Legendary'];
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64">
        <div ref={wheelRef}
             style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.3s ease-out' }}
             className="w-full h-full rounded-full overflow-hidden border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#181826] relative">
          {sectors.map((s, i) => {
            const rotate = (360 / sectors.length) * i;
            const color = s === 'Legendary' ? 'linear-gradient(90deg,#f59e0b,#f97316)' : s === 'Epic' ? 'linear-gradient(90deg,#8b5cf6,#a78bfa)' : s === 'Rare' ? 'linear-gradient(90deg,#06b6d4,#60a5fa)' : 'linear-gradient(90deg,#6b7280,#9ca3af)';
            return (
              <div key={i} style={{ transform: `rotate(${rotate}deg) skewY(-${90 - (360/sectors.length)}deg)` }} className="origin-center absolute inset-0">
                <div className="absolute left-1/2 top-0 w-1/2 h-full transform -translate-x-1/2" style={{ background: color }}>
                  <div className="absolute top-6 left-2 text-xs text-black/90 roulette-sector-label" style={{ transform: 'rotate(90deg)' }}>{s}</div>
                </div>
              </div>
            )
          })}

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-sm">Spin</div>
          </div>
        </div>
        {/* Pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
      </div>
      <div className="text-sm text-gray-300">Click Use Spin to rotate the wheel</div>
    </div>
  );
    setAngle(target);
    // wait for transition to end
    const el = wheelRef.current;
    const handler = () => {
      el.removeEventListener('transitionend', handler);
      setSpinning(false);
      if (onEndRef.current) onEndRef.current({ index: idx, sector: sectors[idx] });
    };
    el.addEventListener('transitionend', handler);
  }

  useEffect(()=>{
    // reset small angle to keep numbers small after spin finishes
    if (!spinning) {
      // normalize angle to [0,360)
      const a = angle % 360;
      setAngle(a);
    }
  }, [spinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64">
        <div ref={wheelRef}
             style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.3s ease-out' }}
             className="w-full h-full rounded-full overflow-hidden border border-white/10 bg-gradient-to-br from-black/20 to-white/2">
          {/* Simple sectors as absolutely positioned slices */}
          {sectors.map((s, i) => {
            const rotate = (360 / sectors.length) * i;
            return (
              <div key={i} style={{ transform: `rotate(${rotate}deg) skewY(-${90 - (360/sectors.length)}deg)` }} className="origin-center absolute inset-0">
                <div className="absolute left-1/2 top-0 w-1/2 h-full transform -translate-x-1/2" style={{ background: i%2 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)' }}>
                  <div className="absolute top-6 left-2 text-xs text-white/90 rotate-[90deg] origin-left">{s}</div>
                </div>
              </div>
            )
          })}
        </div>
        {/* Pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white"></div>
      </div>
      <div className="text-sm text-gray-300">Click Use Spin to rotate the wheel</div>
    </div>
  );
});
