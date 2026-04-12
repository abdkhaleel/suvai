'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');

    const res = await fetch('/api/gemma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setResponse(prev => prev + chunk);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SuvAI 🍛</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask your Tamil chef anything..."
          className="w-full h-32 p-4 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Chef is thinking...' : 'Ask Chef'}
        </button>
      </form>

      {(response || loading) && (
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-3" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-2 mt-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-semibold mb-2 mt-3" {...props} />,
              p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
              code: ({node, ...props}) => <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 italic my-3" {...props} />,
            }}
          >
            {response}
          </ReactMarkdown>
          {loading && <span className="animate-pulse">▌</span>}
        </div>
      )}
    </div>
  );
}