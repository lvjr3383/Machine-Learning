
import React, { useState } from 'react';
import { Step, ModelWeights } from './types';
import ChatPanel from './components/ChatPanel';
import Workspace from './components/Workspace';
import { STEP_INFO } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SoundCheck);
  const [demoStats, setDemoStats] = useState({ dance: 50, energy: 50 });
  const [weights, setWeights] = useState<ModelWeights>({ dance: 1.0, energy: 1.0 });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar Chat (35%) */}
      <div className="w-[35%] h-full border-r border-gray-200 bg-white flex flex-col shadow-xl z-10">
        <ChatPanel 
          currentStep={currentStep} 
          onStepChange={setCurrentStep}
        />
      </div>

      {/* Interactive Workspace (65%) */}
      <div className="w-[65%] h-full overflow-y-auto p-8 flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-5xl w-full h-full flex flex-col">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {STEP_INFO[currentStep].title}
              </h1>
              <p className="text-slate-500 text-sm">Step {currentStep} of 4</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 transition-all font-medium text-sm"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                disabled={currentStep === 4}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 transition-all font-medium text-sm shadow-md"
              >
                Next Step
              </button>
            </div>
          </header>

          <main className="flex-grow bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
            <Workspace 
              currentStep={currentStep} 
              demoStats={demoStats}
              setDemoStats={setDemoStats}
              weights={weights}
              setWeights={setWeights}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
