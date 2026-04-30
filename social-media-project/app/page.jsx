"use client";
import { useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>Home Page</h2>
      <p>This is my first Next.js page.</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
    </div>
  );
}

export default App;
