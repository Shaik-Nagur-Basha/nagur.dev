import { useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/health");
      const result = await res.json();
      setData(result);
      console.log("✅ Response:", result);
    } catch (err) {
      setData({ error: err.message });
      console.error("❌ Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 gap-6">
      <h1 className="text-4xl font-bold text-white">Frontend ↔ Backend Test</h1>

      <button
        onClick={fetchData}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition"
        disabled={loading}
      >
        {loading ? "Loading..." : "Test Connection"}
      </button>

      {data && (
        <div className="bg-white p-6 rounded-lg text-center min-w-80">
          <p className="text-gray-800 font-semibold">
            {data.error ? "❌ " + data.error : "✅ " + data.status}
          </p>
          <code className="text-sm text-gray-600 mt-2 block whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </code>
        </div>
      )}
    </div>
  );
}

export default App;
