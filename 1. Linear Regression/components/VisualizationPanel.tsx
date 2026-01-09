
import React, { useMemo, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, Cell
} from 'recharts';
import { Step, Movie, DecadeFilter } from '../types';
import { movieData, BAD_FIT, calculateRegression, calculateMetrics, STEP_METADATA } from '../constants';

interface VisualizationPanelProps {
  currentStep: Step;
}

const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ currentStep }) => {
  const [userBudget, setUserBudget] = useState<number>(200);
  const [filter, setFilter] = useState<DecadeFilter>('All');

  const filteredData = useMemo(() => {
    if (filter === 'All') return movieData;
    const start = filter === '1990s' ? 1990 : filter === '2000s' ? 2000 : 2010;
    return movieData.filter(m => m.year >= start && m.year <= start + 9);
  }, [filter]);

  const bestFitParams = useMemo(() => calculateRegression(filteredData), [filteredData]);
  const currentParams = useMemo(() => currentStep >= Step.BEST_FIT ? bestFitParams : BAD_FIT, [currentStep, bestFitParams]);
  const metrics = useMemo(() => calculateMetrics(filteredData, currentParams.m, currentParams.b), [filteredData, currentParams]);
  
  const predictedRevenue = useMemo(() => {
    return Math.round(bestFitParams.m * userBudget + bestFitParams.b);
  }, [userBudget, bestFitParams]);

  // Color logic for prediction tiers.
  const predictionColor = useMemo(() => {
    if (predictedRevenue > userBudget * 3) return '#fbbf24';
    if (predictedRevenue > userBudget * 1.5) return '#3b82f6';
    return '#ef4444';
  }, [predictedRevenue, userBudget]);

  const predictionVibe = useMemo(() => {
    if (predictedRevenue > userBudget * 3) return 'High return';
    if (predictedRevenue > userBudget * 1.5) return 'Moderate return';
    return 'Low return';
  }, [predictedRevenue, userBudget]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.[0]) {
      const d = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-xs">
          <p className="text-blue-600 font-bold mb-1">{d.title || "Your Input"} ({d.year || "Future"})</p>
          <p className="text-slate-500">Budget: <span className="text-slate-900 font-bold">${d.budget}M</span></p>
          <p className="text-slate-500">Revenue: <span className="text-slate-900 font-bold">${d.revenue}M</span></p>
        </div>
      );
    }
    return null;
  };

  const metadata = STEP_METADATA[currentStep];

  return (
    <div className="h-full bg-slate-50 p-6 md:p-8 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full gap-6">
        
        {/* Educational Math Lab Panel */}
        <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm border-l-8 border-l-blue-600">
           <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-2">
               <span className="text-blue-600 text-xs font-bold">LR</span>
               <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Math Lab: {metadata.title}</h3>
             </div>
             <div className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">
                Logic Layer
             </div>
           </div>
           <p className="text-slate-600 text-sm leading-relaxed font-medium">
             {metadata.mechanics}
           </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{metadata.title}</h2>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Filter Decade:</span>
               <div className="flex bg-slate-200 p-1 rounded-lg">
                 {(['All', '1990s', '2000s', '2010s'] as DecadeFilter[]).map(d => (
                   <button key={d} onClick={() => setFilter(d)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${filter === d ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{d}</button>
                 ))}
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             {currentStep >= Step.RESIDUALS && (
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">MSE Accuracy</p>
                  <p className="text-xl font-black text-slate-900 font-mono">{Math.round(metrics.mse).toLocaleString()}</p>
                </div>
             )}
             {currentStep >= Step.BEST_FIT && (
                <div className="bg-blue-600 px-4 py-3 rounded-2xl shadow-lg text-center">
                  <p className="text-[9px] font-bold text-blue-100 uppercase mb-1">R^2 Clarity</p>
                  <p className="text-xl font-black text-white font-mono">{metrics.r2.toFixed(3)}</p>
                </div>
             )}
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="flex-1 bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm relative min-h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis type="number" dataKey="budget" name="Budget" stroke="#94a3b8" fontSize={10} domain={[0, 400]} label={{ value: 'Budget ($M)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
              <YAxis type="number" dataKey="revenue" name="Revenue" stroke="#94a3b8" fontSize={10} domain={[0, 3000]} label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
              <ZAxis type="number" range={[100, 500]} />
              <Tooltip content={<CustomTooltip />} />
              
              <Scatter name="Movies" data={filteredData} fill="#3b82f6">
                {filteredData.map((e, i) => (
                  <Cell 
                    key={i} 
                    fill={e.revenue < 200 && e.budget > 150 ? '#ef4444' : '#3b82f6'} 
                    className="cursor-crosshair" 
                  />
                ))}
              </Scatter>

              {(currentStep === Step.RESIDUALS || currentStep === Step.BEST_FIT) && 
                filteredData.map((m, i) => (
                  <ReferenceLine 
                    key={i} 
                    segment={[{ x: m.budget, y: m.revenue }, { x: m.budget, y: currentParams.m * m.budget + currentParams.b }]} 
                    stroke="#f87171" 
                    strokeDasharray="3 3" 
                    opacity={currentStep === Step.RESIDUALS ? 0.8 : 0.3} 
                  />
                ))
              }

              {currentStep >= Step.RESIDUALS && (
                <ReferenceLine 
                  segment={[{ x: 0, y: currentParams.b }, { x: 400, y: currentParams.m * 400 + currentParams.b }]} 
                  stroke={currentStep === Step.RESIDUALS ? '#ef4444' : '#2563eb'} 
                  strokeWidth={4} 
                />
              )}

              {currentStep === Step.PREDICTION && (
                <Scatter name="Pred" data={[{ budget: userBudget, revenue: predictedRevenue }]} fill={predictionColor}>
                  <Cell 
                    fill={predictionColor} 
                    stroke="#000000"
                    strokeWidth={2}
                    r={14} 
                    className="animate-pulse shadow-xl" 
                  />
                </Scatter>
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {currentStep === Step.PREDICTION && (
          <div 
            className="p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center gap-10 transition-colors duration-500"
            style={{ backgroundColor: `${predictionColor}15`, border: `1px solid ${predictionColor}40` }}
          >
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-5">
                <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Budget</span>
                <span className="text-slate-900 text-3xl font-black font-mono">${userBudget}M</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="400" 
                step="5" 
                value={userBudget} 
                onChange={(e) => setUserBudget(Number(e.target.value))} 
                className="w-full cursor-pointer" 
                style={{ accentColor: predictionColor }}
              />
            </div>
            <div className="h-12 w-px bg-slate-200 hidden md:block" />
            <div className="text-center md:text-left">
               <p className="text-slate-500 font-black uppercase text-[10px] mb-1 tracking-widest">Predicted Revenue</p>
               <h3 className="text-5xl font-black tracking-tighter" style={{ color: predictionColor }}>
                 ${predictedRevenue.toLocaleString()}M
               </h3>
               <p className="text-[11px] font-bold mt-2 uppercase tracking-tighter" style={{ color: predictionColor }}>
                 {predictionVibe}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;
