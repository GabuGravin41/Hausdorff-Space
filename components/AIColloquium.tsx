import React, { useState } from 'react';
import { separateIdeas } from '../services/geminiService';
import { IdeaSeparation, AnalysisStatus } from '../types';

const AIColloquium: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<IdeaSeparation | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setStatus(AnalysisStatus.THINKING);
    try {
      const data = await separateIdeas(input);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (e) {
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <section className="py-20 px-6 border-t border-haus-gray bg-neutral-900/30 scroll-mt-20" id="colloquium">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-serif text-white mb-2">The Virtual Colloquium</h2>
            <p className="text-gray-400 font-mono text-sm">
                AI-ASSISTED RIGOR TEST (POWERED BY GEMINI)
            </p>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                Submit an argument. We will topologically separate the distinct points, remove the noise, and grade the rigor.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Area */}
            <div className="flex flex-col gap-4">
                <textarea
                    className="w-full h-64 bg-haus-black border border-haus-gray p-4 text-haus-text font-serif focus:outline-none focus:border-haus-accent transition-colors resize-none placeholder-gray-700"
                    placeholder="Enter your thesis, argument, or philosophical proposition here for rigor analysis..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={status === AnalysisStatus.THINKING || !input.trim()}
                    className={`
                        py-3 px-6 font-mono text-sm uppercase tracking-widest border transition-all
                        ${status === AnalysisStatus.THINKING 
                            ? 'bg-haus-gray border-haus-gray text-gray-500 cursor-not-allowed' 
                            : 'bg-transparent border-haus-accent text-haus-accent hover:bg-haus-accent hover:text-white'}
                    `}
                >
                    {status === AnalysisStatus.THINKING ? 'Analyzing Topology...' : 'Separate Ideas'}
                </button>
            </div>

            {/* Output Area */}
            <div className="border border-haus-gray bg-haus-black p-6 min-h-[16rem] relative overflow-hidden">
                {status === AnalysisStatus.IDLE && (
                    <div className="flex items-center justify-center h-full text-gray-700 font-mono text-xs">
                        AWAITING INPUT_
                    </div>
                )}
                
                {status === AnalysisStatus.THINKING && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="w-12 h-12 border-t-2 border-l-2 border-haus-accent rounded-full animate-spin"></div>
                        <p className="text-haus-accent font-mono text-xs animate-pulse">APPLYING HAUSDORFF AXIOMS...</p>
                    </div>
                )}

                {status === AnalysisStatus.ERROR && (
                    <div className="flex items-center justify-center h-full text-red-400 font-mono text-xs">
                        ERROR: COULD NOT CONVERGE. TRY AGAIN.
                    </div>
                )}

                {status === AnalysisStatus.COMPLETE && result && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <span className="text-haus-accent font-mono text-xs uppercase block mb-1">Core Axiom</span>
                            <p className="text-white font-serif italic border-l-2 border-haus-accent pl-3">
                                "{result.coreArgument}"
                            </p>
                        </div>

                        <div>
                            <span className="text-haus-accent font-mono text-xs uppercase block mb-1">Distinct Points (U ∩ V = ∅)</span>
                            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                {result.distinctPoints.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                ))}
                            </ul>
                        </div>

                         <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                             <div>
                                <span className="text-gray-500 font-mono text-xs uppercase block mb-1">Entropy Removed</span>
                                <p className="text-gray-600 text-xs italic">
                                    {result.noiseReduction.length > 0 ? result.noiseReduction.join(", ") : "Minimal noise detected."}
                                </p>
                             </div>
                             <div className="text-right">
                                <span className="block text-4xl font-mono font-bold text-white">
                                    {result.rigorScore}
                                </span>
                                <span className="text-haus-accent text-xs font-mono">RIGOR SCORE</span>
                             </div>
                         </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default AIColloquium;