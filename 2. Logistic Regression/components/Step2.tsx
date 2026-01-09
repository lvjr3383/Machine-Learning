
import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Scatter, ZAxis, Cell, Tooltip } from 'recharts';
import { COLORS } from '../constants';
import { Zap, Info } from 'lucide-react';

const CustomTrackTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.title) return null;
    return (
      <div className="bg-white p-2 border border-slate-100 rounded-lg shadow-xl text-[10px]">
        <p className="font-black text-indigo-600 uppercase tracking-tight">{data.title}</p>
        <p className="text-slate-500 font-bold">Prob: {data.prob.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const Step2: React.FC = () => {
  const [slope, setSlope] = useState(1.5);

  // Generate sigmoid data based on slope intensity.
  const plotData = useMemo(() => {
    return Array.from({ length: 61 }, (_, i) => {
      const x = (i - 30) / 3; // Range -10 to 10
      const sigmoid = 1 / (1 + Math.exp(-x * slope));
      return { x, prob: sigmoid * 100 };
    });
  }, [slope]);

  // Example points positioned on the X axis.
  const samplePoints = useMemo(() => [
    { x: -6, prob: (1 / (1 + Math.exp(6 * slope))) * 100, title: "Example A" },
    { x: 0, prob: 50, title: "Boundary" },
    { x: 6, prob: (1 / (1 + Math.exp(-6 * slope))) * 100, title: "Example B" }
  ], [slope]);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Sigmoid Curve</h3>
        <p className="text-sm text-slate-500">How a linear score becomes a 0% to 100% probability.</p>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6">
        {/* Graph Container */}
        <div className="flex-grow min-h-[350px] relative bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 40, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[-10, 10]} 
                hide 
              />
              <YAxis 
                type="number" 
                domain={[0, 100]} 
                stroke="#94a3b8" 
                fontSize={10} 
                tickFormatter={(v) => `${v}%`} 
              />
              <ZAxis type="number" range={[150, 150]} />
              <Tooltip content={<CustomTrackTooltip />} />
              <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
              
              <Line 
                data={plotData}
                type="monotone" 
                dataKey="prob" 
                stroke={COLORS.primary} 
                strokeWidth={4} 
                dot={false} 
                isAnimationActive={false}
              />
              
              {/* Fixing Scatter visibility by explicitly mapping x and y dataKeys */}
              <Scatter data={samplePoints} dataKey="prob">
                {samplePoints.map((p, i) => (
                  <Cell 
                    key={`point-${i}`} 
                    fill={p.prob > 50 ? COLORS.success : COLORS.fail} 
                    stroke="#fff" 
                    strokeWidth={3}
                    className="cursor-help"
                  />
                ))}
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold space-y-1">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Class 1 (&gt;50%)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span>Class 0 (&lt;50%)</span>
             </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Linear Score (Input)<br/>
            <span className="text-[8px] normal-case font-medium text-slate-300">Sum of features x weights</span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-72 flex flex-col gap-6 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Model Confidence</h4>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                Cranking this intensity represents increasing weights. A steeper curve means the model is more binary (Class 1 vs Class 0) and leaves less room for uncertainty.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <span>Slope Intensity</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">{slope.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.1" max="5" step="0.1"
                  value={slope}
                  onChange={(e) => setSlope(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="mt-auto p-3 bg-indigo-50/50 rounded-lg flex items-start gap-2 border border-indigo-100/50">
             <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
             <p className="text-[11px] text-indigo-600 leading-tight font-medium">
               Notice how the sample points shift toward the extremes as you increase confidence.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
