import { cn } from 'tailwind-variants';
import reactSvg from '#src/assets/react.svg';

const App = () => {
  return (
    <>
      <h1 className={cn('text-3xl text-red-500')}>Example Page</h1>
      <img src={reactSvg} width={100} height={100} />
    </>
  );
};

export default App;
