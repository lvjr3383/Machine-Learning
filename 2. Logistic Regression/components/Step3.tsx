
import React, { useMemo } from 'react';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';
import { SONG_DATA, COLORS } from '../constants';
import { ModelWeights } from '../types';
import { ShieldCheck, Percent, AlertCircle } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.title) return null;
    return (
      <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-xl">
        <p className="text-xs font-black text-indigo-600 uppercase mb-1 tracking-tighter">{data.title}</p>
        <div className="space-y-0.5 text-[10px]">
          <p className="text-slate-500">Dance: <span className="font-bold text-slate-700">{data.dance}%</span></p>
          <p className="text-slate-500">Energy: <span className="font-bold text-slate-700">{data.energy}%</span></p>
          <p className={`font-black ${data.label === 1 ? 'text-green-600' : 'text-slate-400'}`}>
            ACTUAL: {data.label === 1 ? 'CLASS 1' : 'CLASS 0'}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

interface Step3Props {
  weights: ModelWeights;
  setWeights: React.Dispatch<React.SetStateAction<ModelWeights>>;
}

const Step3: React.FC<Step3Props> = ({ weights, setWeights }) => {
  const hits = SONG_DATA.filter(s => s.label === 1);
  const flops = SONG_DATA.filter(s => s.label === 0);

  const boundaryLine = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 100; x += 5) {
      const y = (100 - (weights.dance * x)) / weights.energy;
      points.push({ dance: x, energy: y });
    }
    return points;
  }, [weights]);

  // Inference logic: Predicted positive if (w_dance * dance + w_energy * energy) >= 100.
  const missedHits = hits.filter(s => (weights.dance * s.dance + weights.energy * s.energy) < 100);
  const skipRate = Math.round((missedHits.length / hits.length) * 100);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Decision Boundary</h3>
        <p className="text-sm text-slate-500">Adjust weights to see how many positives are missed.</p>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="flex-grow relative rounded-xl border border-slate-100 overflow-hidden shadow-inner bg-slate-50/30">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis type="number" dataKey="dance" domain={[0, 100]} stroke="#94a3b8" fontSize={10}>
                <Label value="Danceability (%)" position="insideBottom" offset={-25} fill="#64748b" fontWeight="600" />
              </XAxis>
              <YAxis type="number" dataKey="energy" domain={[0, 100]} stroke="#94a3b8" fontSize={10}>
                <Label value="Energy (%)" angle={-90} position="insideLeft" offset={0} fill="#64748b" fontWeight="600" />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />

              <Scatter name="Class 1" data={hits} fill={COLORS.primary}>
                {hits.map((s, i) => {
                  const isMissed = (weights.dance * s.dance + weights.energy * s.energy) < 100;
                  return <Cell key={`hit-cell-${i}`} stroke={isMissed ? '#ef4444' : 'none'} strokeWidth={isMissed ? 3 : 0} />;
                })}
              </Scatter>
              <Scatter name="Class 0" data={flops} fill="none">
                {flops.map((_, i) => <Cell key={`flop-cell-${i}`} stroke={COLORS.fail} strokeWidth={2} />)}
              </Scatter>

              <Line 
                data={boundaryLine} 
                dataKey="energy" 
                stroke={COLORS.primary} 
                strokeWidth={4} 
                strokeDasharray="10 10" 
                dot={false} 
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 pointer-events-none opacity-10 -z-10">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 100,100 0,100" fill={COLORS.primary} />
              <polygon points="0,0 100,0 0,100" fill={COLORS.fail} />
            </svg>
          </div>
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-6 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Weight Controls
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase">
                  <span>Dance Weight</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tabular-nums">{weights.dance.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.1" max="2" step="0.1"
                  value={weights.dance}
                  onChange={(e) => setWeights(prev => ({ ...prev, dance: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase">
                  <span>Energy Weight</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tabular-nums">{weights.energy.toFixed(1)}</span>
                </div>
                <input 
                  type="range" min="0.1" max="2" step="0.1"
                  value={weights.energy}
                  onChange={(e) => setWeights(prev => ({ ...prev, energy: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className={`mt-auto p-4 rounded-xl border transition-all duration-300 ${skipRate > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Percent className={`w-4 h-4 ${skipRate > 0 ? 'text-red-600' : 'text-green-600'}`} />
            <h5 className={`text-[10px] font-black uppercase ${skipRate > 0 ? 'text-red-700' : 'text-green-700'}`}>Missed Positives</h5>
            </div>
            <p className={`text-3xl font-black mb-1 ${skipRate > 0 ? 'text-red-600' : 'text-green-600'}`}>{skipRate}%</p>
            {missedHits.length > 0 ? (
              <div className="mt-2 text-[10px] text-red-700 font-medium leading-tight flex items-start gap-1">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Missed: {missedHits.map(m => m.title).join(', ')}</span>
              </div>
            ) : (
              <p className="text-[10px] text-green-700 font-bold italic">No positives missed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
