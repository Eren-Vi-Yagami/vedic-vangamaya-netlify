'use client';
import { useState } from 'react';

export default function Page() {
  const [showDiv1, setShowDiv1] = useState(true);

  return (
    <main>
      <button
        onClick={() => setShowDiv1(false)}
        className="px-4 py-2 bg-blue-600 text-white"
      >
        Toggle Content
      </button>

      {showDiv1 ? (
        <div>
          <div>Some content</div>
        </div>
      ) : (
        <div>
          <div>Some content 2</div>
        </div>
      )}
    </main>
  );
}
