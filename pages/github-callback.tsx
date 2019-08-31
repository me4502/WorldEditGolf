import React, {useEffect, useState} from 'react';
import router from 'next/router';
import {Layout} from '../src/containers/Layout/Layout';
import {useSetToken} from '../src/components/Auth';

const Page = () => {

  const [errorMessage, setError] = useState<string>();

  const setToken = useSetToken();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');

    if (!code) {
      setError("Could not find code in query params!");
      return;
    }

    fetch('/api/github-oauth', {method: 'POST', headers: {"content-type": "application/json"}, body: JSON.stringify({code})})
      .then(res => res.json() as Promise<{error?: string, token?: string}>)
      .then(({error, token}) => {
        if (token) {
          setToken(token);
          router.push('/');
        } else if (error) {
          setError(error);
        } else {
          setError("An unexpected error occurred");
        }
      });
  }, []);

  return errorMessage ? <h1>{errorMessage}</h1> : <h1>Logging in...</h1>;
}

export default () => (<Layout>
  <Page />
</Layout>);
