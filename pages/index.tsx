import { Inter } from 'next/font/google';
import StarsCanvas from '@/components/StarBackground';
import Navbar from '@/components/layout/Navbar';
import Main from '@/components/Main';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="h-full w-full ">
      <div className="flex flex-col gap-20">
        <Navbar />
        <StarsCanvas />

        <div className="pt-6">
          <Main />
        </div>
      </div>
    </main>
  );
}
