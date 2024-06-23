import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewCalculation, setIsNewCalculation] = useState(true);

  const handleNumberClick = (num) => {
    if (isNewCalculation) {
      setDisplay(num);
      setEquation(num);
      setIsNewCalculation(false);
    } else {
      setDisplay(prevDisplay => prevDisplay === '0' ? num : prevDisplay + num);
      setEquation(prevEquation => prevEquation + num);
    }
  };

  const handleOperatorClick = (operator) => {
    if (isNewCalculation) {
      setEquation(display + operator);
      setDisplay('0');
      setIsNewCalculation(false);
    } else if (equation.length > 0 && !isNaN(equation.slice(-1))) {
      setEquation(prevEquation => prevEquation + operator);
      setDisplay('0');
    }
  };

  const handleEqualsClick = () => {
    try {
      const result = eval(equation.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(result.toString());
      setEquation(result.toString());
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
      setEquation('');
      setIsNewCalculation(true);
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setEquation('');
    setIsNewCalculation(true);
  };

  const handleBackspaceClick = () => {
    if (!isNewCalculation) {
      setDisplay(prevDisplay => prevDisplay.length > 1 ? prevDisplay.slice(0, -1) : '0');
      setEquation(prevEquation => prevEquation.length > 1 ? prevEquation.slice(0, -1) : '0');
    }
  };

  const buttonClass = "w-16 h-16 m-1 rounded-full bg-gray-200 text-black text-2xl font-medium flex items-center justify-center";
  const operatorClass = "bg-orange-500 text-white";
  const clearClass = "bg-gray-400 text-black";

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden p-4">
      {/* Calculator display */}
      <div className="bg-white p-4 mb-4 rounded-lg shadow-inner">
        <div className="text-black text-right text-4xl h-10 font-light">{display}</div>
      </div>

      {/* Calculator buttons */}
      <div className="grid grid-cols-4 gap-2">
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${clearClass}`} onClick={handleClearClick}>AC</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => handleOperatorClick('%')}>%</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={buttonClass} onClick={handleBackspaceClick}>⌫</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${operatorClass}`} onClick={() => handleOperatorClick('/')}>÷</motion.button>

        {['7', '8', '9'].map(num => (
          <motion.button key={num} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => handleNumberClick(num)}>{num}</motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${operatorClass}`} onClick={() => handleOperatorClick('*')}>×</motion.button>

        {['4', '5', '6'].map(num => (
          <motion.button key={num} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => handleNumberClick(num)}>{num}</motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${operatorClass}`} onClick={() => handleOperatorClick('-')}>-</motion.button>

        {['1', '2', '3'].map(num => (
          <motion.button key={num} whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => handleNumberClick(num)}>{num}</motion.button>
        ))}
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${operatorClass}`} onClick={() => handleOperatorClick('+')}>+</motion.button>

        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} col-span-2`} onClick={() => handleNumberClick('0')}>0</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={buttonClass} onClick={() => handleNumberClick('.')}>.</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} className={`${buttonClass} ${operatorClass}`} onClick={handleEqualsClick}>=</motion.button>
      </div>
    </div>
  );
};

export default Calculator;