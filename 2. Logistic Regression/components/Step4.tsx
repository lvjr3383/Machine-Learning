
import React, { useMemo } from 'react';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ZAxis, Label } from 'recharts';
import { COLORS } from '../constants';
import { ModelWeights } from '../types';
import { Disc, Award, Ban, Music, Zap, SlidersHorizontal } from 'lucide-react';

interface Step4Props {
  demoStats: { dance: number; energy: number };
  setDemoStats: React.Dispatch<React.SetStateAction<{ dance: number; energy: number }>>;
  weights: ModelWeights;
}

const Step4: React.FC<Step4Props> = ({ demoStats, setDemoStats, weights }) => {
  // Real-time inference using dynamic weights
  const score = weights.dance * demoStats.dance + weights.energy * demoStats.energy;
  const isHit = score >= 100;
  
  // Sigmoid probability: P = 1 / (1 + exp(-z))
  const probability = 1 / (1 + Math.exp(-(score - 100) / 10));

  const boundaryLine = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 100; x += 10) {
      const y = (100 - (weights.dance * x)) / weights.energy;
      points.push({ dance: x, energy: y });
    }
    return points;
  }, [weights]);

  const currentPoint = [{ ...demoStats, name: "Your Input" }];

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Prediction</h3>
        <p className="text-sm text-slate-500">Live inference on the decision boundary.</p>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6">
        <div className="flex-grow relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 min-h-[400px] shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" dataKey="dance" domain={[0, 100]} stroke="#94a3b8" fontSize={10}>
                <Label value="Danceability (%)" position="insideBottom" offset={-25} fill="#94a3b8" fontSize={10} fontWeight="600" />
              </XAxis>
              <YAxis type="number" dataKey="energy" domain={[0, 100]} stroke="#94a3b8" fontSize={10}>
                <Label value="Energy (%)" angle={-90} position="insideLeft" offset={0} fill="#94a3b8" fontSize={10} fontWeight="600" />
              </YAxis>
              <ZAxis type="number" range={[1500, 1500]} />
              
              <Line 
                data={boundaryLine} 
                dataKey="energy" 
                stroke={COLORS.primary} 
                strokeWidth={2} 
                strokeDasharray="10 10" 
                dot={false} 
                activeDot={false}
              />
              
              <Scatter data={currentPoint} fill={isHit ? COLORS.success : COLORS.fail}>
                {currentPoint.map((_, index) => (
                  <Cell 
                    key={index} 
                    className="transition-all duration-300 ease-out"
                    stroke="#fff" 
                    strokeWidth={8}
                    style={{ filter: `drop-shadow(0 0 15px ${isHit ? COLORS.success : COLORS.fail}44)` }}
                  />
                ))}
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 pointer-events-none opacity-5 -z-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 100,100 0,100" fill={COLORS.primary} />
              <polygon points="0,0 100,0 0,100" fill={COLORS.fail} />
            </svg>
          </div>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] pointer-events-none">
            <div className={`flex flex-col items-center justify-center space-y-2 transition-all duration-500 ${isHit ? 'scale-105' : 'scale-100'}`}>
              <div className={`px-8 py-3 rounded-full border-2 bg-white shadow-2xl flex items-center space-x-6 ${isHit ? 'border-green-500' : 'border-slate-300'}`}>
                {isHit ? (
                  <Award className="w-10 h-10 text-green-500 animate-bounce" />
                ) : (
                  <Ban className="w-10 h-10 text-slate-400" />
                )}
                <div className="text-center">
                  <h5 className={`text-2xl font-black italic tracking-tighter uppercase ${isHit ? 'text-green-600' : 'text-slate-500'}`}>
                    {isHit ? 'CLASS 1' : 'CLASS 0'}
                  </h5>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${isHit ? 'bg-green-500' : 'bg-slate-400'}`}
                        style={{ width: `${probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{(probability * 100).toFixed(0)}% CLASS 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 opacity-40 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Weights: D:{weights.dance.toFixed(1)} E:{weights.energy.toFixed(1)}</span>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-80 flex flex-col space-y-8 p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Inputs</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Music className="w-4 h-4 text-indigo-500" /> Danceability
                </label>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg tabular-nums">
                  {demoStats.dance}%
                </span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={demoStats.dance} 
                onChange={(e) => setDemoStats(prev => ({ ...prev, dance: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Disc className="w-4 h-4 text-indigo-500" /> Energy
                </label>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg tabular-nums">
                  {demoStats.energy}%
                </span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={demoStats.energy} 
                onChange={(e) => setDemoStats(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;
