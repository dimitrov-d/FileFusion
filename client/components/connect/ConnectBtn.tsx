import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '@/context/AuthContext';

const ConnectBtn = () => {
  const [loading, setLoading] = useState(false);
  const { email, setEmail, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const oAuthWindow = useRef<Window | null>(null);
  const oAuthInterval = useRef<NodeJS.Timeout | null>(null);

  const getAuthToken = async (): Promise<string> => {
    const response = await fetch('http://localhost:3000/session-token', {
      method: 'GET',
    });
    const { data } = await response.json();
    return data.sessionToken;
  };

  const openOAuthPopup = async () => {
    setLoading(true);
    const sessionToken = await getAuthToken();
    oAuthWindow.current = window.open(
      `https://oauth.apillon.io/?embedded=1&token=${sessionToken}`,
      'Apillon OAuth Form',
      `height=${900},width=${450},resizable=no`
    );

    oAuthInterval.current = setInterval(() => {
      if (oAuthWindow.current && oAuthWindow.current.closed) {
        setLoading(false);
        clearInterval(oAuthInterval.current!);
      }
    }, 1000);
  };

  const verifyUserLogin = async (oAuthToken: string) => {
    try {
      const response = await fetch(`http://localhost:3000/verify-login`, {
        method: 'POST',
        body: JSON.stringify({ token: oAuthToken }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      const { data } = await response.json();
      setEmail(data.email);
      localStorage.setItem('authToken', oAuthToken);
      setIsAuthenticated(!!data.email);

      if (oAuthWindow.current) {
        oAuthWindow.current.close();
      }
      clearInterval(oAuthInterval.current!);
      router.push('/');
    } catch (error) {
      console.error('Failed to verify user login:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const messageHandler = async (event: MessageEvent) => {
      if (!event.origin?.includes('apillon.io')) return;
      if (!event.data.verified) {
        setLoading(false);
        throw new Error('Invalid verification');
      }

      await verifyUserLogin(event.data.authToken);
    };

    window.addEventListener('message', messageHandler, false);

    const token = localStorage.getItem('authToken');
    if (token) {
      verifyUserLogin(token).catch(() => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      });
    }

    return () => {
      window.removeEventListener('message', messageHandler, false);
      if (oAuthInterval.current) {
        clearInterval(oAuthInterval.current);
      }
    };
  }, [setIsAuthenticated]);

  return (
    <div>
      <button
        onClick={openOAuthPopup}
        className="flex w-[100px] items-center justify-center text-center bg-black text-white border-primer rounded-lg text-sm font-bold h-8 ml-3 transition-all cursor-pointer"
        disabled={loading}
      >
        {loading ? <ClipLoader color="white" size={20} /> : 'Connect'}
      </button>
    </div>
  );
};

export default ConnectBtn;
