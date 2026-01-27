import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Code } from 'lucide-react';

/**
 * Interactive Coding Sandbox Component
 * Allows students to write and execute code with real-time feedback
 */
const CodingSandbox = ({ 
  initialCode = '', 
  language = 'javascript',
  title,
  description,
  testCases = [],
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const executeCode = () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Create a safe execution environment
      const logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.join(' ')),
        error: (...args) => logs.push('Error: ' + args.join(' ')),
      };

      // Execute the code
      const func = new Function('console', code);
      func(customConsole);

      setOutput(logs.join('\n') || 'Code executed successfully (no output)');

      // Run test cases if provided
      if (testCases.length > 0) {
        const results = testCases.map(test => {
          try {
            const testFunc = new Function('console', code + `\nreturn ${test.expression};`);
            const result = testFunc(customConsole);
            const passed = result === test.expected;
            return {
              ...test,
              result,
              passed,
            };
          } catch (error) {
            return {
              ...test,
              result: error.message,
              passed: false,
            };
          }
        });
        setTestResults(results);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setTestResults([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-innova-teal-200 dark:border-innova-teal-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-innova-teal-500 to-innova-teal-600 p-4">
        <div className="flex items-center gap-3">
          <Code className="w-6 h-6 text-white" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title || 'Code Sandbox'}</h3>
            {description && (
              <p className="text-sm text-innova-teal-50 mt-1">{description}</p>
            )}
          </div>
          <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
            {language}
          </span>
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Code:
          </label>
          <div className="flex gap-2">
            <button
              onClick={resetCode}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="px-4 py-1 bg-innova-teal-500 hover:bg-innova-teal-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Run Code
            </button>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-innova-teal-500 focus:border-transparent resize-none"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>

      {/* Output */}
      {output && (
        <div className="px-4 pb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Output:
          </label>
          <pre className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="px-4 pb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Test Results:
          </label>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  test.passed
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {test.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {test.description}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Expected: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{JSON.stringify(test.expected)}</code>
                      {' | '}
                      Got: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{JSON.stringify(test.result)}</code>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {testResults.filter(t => t.passed).length} / {testResults.length} tests passed
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          💡 Write your code, click "Run Code" to see results, and learn by doing!
        </p>
      </div>
    </div>
  );
};

export default CodingSandbox;

// Example usage:
/*
const testCases = [
  {
    description: 'Should return sum of two numbers',
    expression: 'add(2, 3)',
    expected: 5,
  },
  {
    description: 'Should handle negative numbers',
    expression: 'add(-5, 3)',
    expected: -2,
  },
];

<CodingSandbox
  title="Function Practice: Addition"
  description="Write a function called 'add' that takes two numbers and returns their sum"
  initialCode="function add(a, b) {\n  // Your code here\n  return 0;\n}"
  language="javascript"
  testCases={testCases}
/>
*/
