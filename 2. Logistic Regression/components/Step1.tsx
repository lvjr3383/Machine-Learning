
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts';
import { SONG_DATA, COLORS } from '../constants';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-100 rounded-xl shadow-xl">
        <p className="text-xs font-black text-indigo-600 uppercase mb-1 tracking-tighter">{data.title}</p>
        <div className="space-y-0.5">
          <p className="text-[10px] text-slate-500 flex justify-between gap-4 font-medium">Danceability: <span className="font-bold text-slate-700">{data.dance}%</span></p>
          <p className="text-[10px] text-slate-500 flex justify-between gap-4 font-medium">Energy: <span className="font-bold text-slate-700">{data.energy}%</span></p>
          <p className="text-[10px] text-slate-500 flex justify-between gap-4 font-medium">Label: <span className={`font-bold ${data.label === 1 ? 'text-green-600' : 'text-slate-500'}`}>{data.label === 1 ? 'CLASS 1' : 'CLASS 0'}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const Step1: React.FC = () => {
  const hits = SONG_DATA.filter(s => s.label === 1);
  const flops = SONG_DATA.filter(s => s.label === 0);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Scatter Plot</h3>
        <p className="text-sm text-slate-500">Visualize how the two classes distribute in feature space.</p>
      </div>
      
      <div className="flex-grow min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              type="number" 
              dataKey="dance" 
              name="Danceability" 
              unit="%" 
              domain={[0, 100]} 
              stroke="#94a3b8" 
              fontSize={10} 
            >
              <Label value="Danceability (%)" position="insideBottom" offset={-25} fill="#64748b" fontWeight="600" />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="energy" 
              name="Energy" 
              unit="%" 
              domain={[0, 100]} 
              stroke="#94a3b8" 
              fontSize={10} 
            >
              <Label value="Energy (%)" angle={-90} position="insideLeft" offset={0} fill="#64748b" fontWeight="600" />
            </YAxis>
            <ZAxis type="number" range={[100, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Class 1" data={hits} fill={COLORS.primary}>
              {hits.map((entry, index) => (
                <Cell key={`hit-${index}`} strokeWidth={0} className="cursor-pointer" />
              ))}
            </Scatter>
            <Scatter name="Class 0" data={flops} fill="none">
              {flops.map((entry, index) => (
                <Cell key={`flop-${index}`} stroke={COLORS.fail} strokeWidth={2} className="cursor-pointer" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-8 text-xs font-medium text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span>Class 1 (Positive)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full border-2 border-slate-400"></div>
          <span>Class 0 (Negative)</span>
        </div>
      </div>
    </div>
  );
};

export default Step1;
