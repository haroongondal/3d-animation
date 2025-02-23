// pages/about.js
import Header from '../components/Header';

export default function About() {
  return (
    <div className='min-h-screen bg-white text-gray-800'>
      <Header />
      <main className='container mx-auto p-8'>
        <h1 className='text-4xl font-bold mb-4'>About Us</h1>
        <p className='leading-relaxed'>
          This is a minimalist website with subtle interactive 3D animations.
        </p>
      </main>
    </div>
  );
}
