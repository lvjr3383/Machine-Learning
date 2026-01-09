
import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import VisualizationPanel from './components/VisualizationPanel';
import { Step } from './types';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SCATTER);

  const nextStep = () => {
    if (currentStep < Step.PREDICTION) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > Step.SCATTER) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden">
      {/* Left Sidebar: 35% */}
      <div className="w-[35%] min-w-[420px] h-full shadow-2xl z-20">
        <ChatPanel 
          currentStep={currentStep} 
          onNextStep={nextStep} 
          onPrevStep={prevStep}
        />
      </div>

      {/* Main Workspace: 65% */}
      <div className="flex-1 h-full z-10">
        <VisualizationPanel currentStep={currentStep} />
      </div>
    </div>
  );
};

export default App;
