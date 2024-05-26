import { useEffect, useState } from 'react';

const ConnectBtn = () => {
  let oAuthWindow: Window | null = null;

  const getAuthToken = async (): Promise<string> => {
    const response = await fetch('http://localhost:3000/session-token', {
      method: 'GET',
    });
    const { data } = await response.json();
    return data.sessionToken;
  };

  const openOAuthPopup = async () => {
    const sessionToken = await getAuthToken();
    oAuthWindow = window.open(
      `https://oauth.apillon.io/?embedded=1&token=${sessionToken}`,
      'Apillon OAuth Form',
      `height=${900},width=${450},resizable=no`
    );
  };

  useEffect(() => {
    const messageHandler = async (event: MessageEvent) => {
      if (!event.origin?.includes('apillon.io')) return;
      if (!event.data.verified) {
        throw new Error('Invalid verification');
      }

      oAuthWindow?.close();

      await verifyUserLogin(event.data.authToken);
    };

    window.addEventListener('message', messageHandler, false);

    return () => {
      window.removeEventListener('message', messageHandler, false);
    };
  }, []);

  const verifyUserLogin = async (oAuthToken: string) => {
    const response = await fetch(`http://localhost:3000/verify-login`, {
      method: 'POST',
      body: JSON.stringify({ token: oAuthToken }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const { data } = await response.json();
    // Handle user email data response here
    console.log({ email: data.email });
    const emailElement = document.getElementById('email');
    if (emailElement) {
      emailElement.innerHTML = `Success! Email: ${data.email}`;
    }
  };

  return (
    <div>
      <button
        onClick={openOAuthPopup}
        className="flex w-[100px] items-center justify-center text-center bg-black text-white border-primer rounded-lg text-sm font-bold h-8 ml-3  transition-all cursor-pointer"
      >
        Connect
      </button>
    </div>
  );
};

export default ConnectBtn;
