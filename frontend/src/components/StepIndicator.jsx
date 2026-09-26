import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, setStep, steps }) {
    return (
        <div className="wizard-progress">
            {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;

                return (
                    <React.Fragment key={step.id}>
                        <div 
                            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            onClick={() => {
                                // Allow jumping back to completed steps
                                if (isCompleted) setStep(stepNum);
                            }}
                            style={{ cursor: isCompleted ? 'pointer' : 'default' }}
                        >
                            <div className="step-number">
                                {isCompleted ? <Check size={16} /> : stepNum}
                            </div>
                            <span className="step-title">{step.title}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`step-divider ${currentStep > stepNum ? 'completed' : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
