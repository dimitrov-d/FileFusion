import Image from 'next/image';
import { Inter } from 'next/font/google';
import StarsCanvas from '@/components/StarBackground';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/Hero';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className={`${inter.className}  w-full`}>
      <Navbar />
      <StarsCanvas />

      <div className='pt-6'>
        <Hero />
      </div>
    </div>
  );
}
