"use client";

import React from "react";

type PackageStepNavProps = {
    step: number;
    onChange: (step: number) => void | Promise<void>;
};

const PackageStepNav = ({ step, onChange }: PackageStepNavProps) => {
    return (
        <div className="pkg-steps">
            {[1, 2, 3].map((s) => (
                <button
                    key={s}
                    type="button"
                    className={`pkg-step${step === s ? " is-active" : ""}`}
                    onClick={() => onChange(s)}
                >
                    Step {s}
                </button>
            ))}
        </div>
    );
};

export default PackageStepNav;
