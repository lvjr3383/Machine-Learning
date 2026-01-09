
import React from 'react';
import { Step, ModelWeights } from '../types';
import { STEP_INFO } from '../constants';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { BookOpen } from 'lucide-react';

interface WorkspaceProps {
  currentStep: Step;
  demoStats: { dance: number; energy: number };
  setDemoStats: React.Dispatch<React.SetStateAction<{ dance: number; energy: number }>>;
  weights: ModelWeights;
  setWeights: React.Dispatch<React.SetStateAction<ModelWeights>>;
}

const Workspace: React.FC<WorkspaceProps> = ({ currentStep, demoStats, setDemoStats, weights, setWeights }) => {
  const renderStep = () => {
    switch (currentStep) {
      case Step.SoundCheck:
        return <Step1 />;
      case Step.SCurve:
        return <Step2 />;
      case Step.VelvetRope:
        return <Step3 weights={weights} setWeights={setWeights} />;
      case Step.DemoTape:
        return <Step4 demoStats={demoStats} setDemoStats={setDemoStats} weights={weights} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 animate-fadeIn">
      {/* Educational Blurb */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4 shadow-sm animate-fadeIn">
        <div className="p-2 bg-indigo-600 rounded-lg text-white shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-1">Step Notes</h4>
          <p className="text-sm text-indigo-600 leading-relaxed font-medium">
            {STEP_INFO[currentStep].blurb}
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {renderStep()}
      </div>
    </div>
  );
};

export default Workspace;
