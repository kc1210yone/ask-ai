import type { ReactNode } from 'react';
import ChatWidget from '#src/components/ChatWidget';

const App = (): ReactNode => {
  const envUrl: unknown = import.meta.env['VITE_BFF_URL'];
  const bffUrl = typeof envUrl === 'string' ? envUrl : 'http://localhost:3000';
  return (
    <div className="min-h-screen bg-white">
      <ChatWidget bffUrl={bffUrl} />
    </div>
  );
};

export default App;
