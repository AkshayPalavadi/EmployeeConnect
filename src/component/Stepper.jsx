import React from "react";
import "./Stepper.css";

/**
 * Steps displayed horizontally. currentStep is a zero-based index.
 * This markup uses class names compatible with your App.css stepper rules.
 */
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((label, idx) => (
        <div key={idx} className="step">
          <div
            className={`circle ${
              idx === currentStep ? "current" : idx < currentStep ? "active" : ""
            }`}
          >
            {idx < currentStep ? "✔" : ""}
          </div>
          <p className={`label ${idx === currentStep ? "current-label" : idx < currentStep ? "active-label" : ""}`}>
            {label}
          </p>
          {idx < steps.length - 1 && <div className={`line ${idx < currentStep ? "filled" : ""}`}></div>}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
