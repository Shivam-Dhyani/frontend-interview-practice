import { useState } from "react";

export default function JSRunner() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(String(result));
    } catch (err: any) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md max-w-xl mx-auto mt-6">
      <h2 className="font-semibold text-lg mb-2">JavaScript Runner</h2>

      <textarea
        className="w-full p-2 border rounded-md font-mono text-sm"
        rows={6}
        placeholder="// Write JS code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={runCode}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Run Code
      </button>

      <div className="mt-4 p-3 bg-white border rounded-md font-mono text-sm">
        <strong>Output:</strong>
        <pre className="whitespace-pre-wrap mt-1">{output}</pre>
      </div>
    </div>
  );
}
