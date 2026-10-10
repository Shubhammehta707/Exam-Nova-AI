import React from 'react';

interface FormulaTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text with enhanced formatting for CBSE Class 12 formulas,
 * chemical equations, subscripts, superscripts, and mathematical notations.
 */
export const FormulaText: React.FC<FormulaTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Process text to format common math and chemical notations
  const formatSegment = (str: string) => {
    // Replace common superscripts pattern: e.g. x^2, 10^-3, cm^-1, etc.
    const parts = str.split(/(\^[0-9a-zA-Z+-]+|_[0-9a-zA-Z+-]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('^')) {
        return (
          <sup key={index} className="text-[0.75em] font-semibold text-blue-900">
            {part.substring(1)}
          </sup>
        );
      }
      if (part.startsWith('_')) {
        return (
          <sub key={index} className="text-[0.75em] font-semibold text-blue-900">
            {part.substring(1)}
          </sub>
        );
      }

      // Check for standalone chemical / math entities like [Ni(CO)4] or H2O
      // We can preserve standard text while giving mathematical symbols clear font support
      return <span key={index}>{part}</span>;
    });
  };

  // If text contains multi-line steps, format line by line
  const lines = text.split('\n');

  if (lines.length > 1) {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Check if line is a step (e.g. "Step 1:", "Step 2:", or "-")
          const isStep = /^(step\s*\d+|case\s*\d+|\d+\.|\*|-)/i.test(trimmed);

          return (
            <div
              key={idx}
              className={`leading-relaxed ${
                isStep ? 'pl-2 border-l-2 border-blue-400/60' : ''
              }`}
            >
              {formatSegment(line)}
            </div>
          );
        })}
      </div>
    );
  }

  return <span className={className}>{formatSegment(text)}</span>;
};
