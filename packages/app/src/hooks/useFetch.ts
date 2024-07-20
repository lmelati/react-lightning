import { useEffect, useState } from 'react';
import api from '../services/api';

export const useFetch = ({ path }: { path: string }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(path)
      .then(({ data }: any) => {
        setResponse(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return { loading, response };
};

export default useEffect;
