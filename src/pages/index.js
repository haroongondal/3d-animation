import dynamic from 'next/dynamic';
import '../styles/globals.css';

const ThreeScene = dynamic(() => import('../components/ThreeScene'), {
  ssr: false // Disable server-side rendering
});

export default function Home() {
  return (
    <>
      <ThreeScene />;<h1>Testing</h1>
    </>
  );
}
