import { useEffect, useState } from 'react';
import { SCOPES } from '../config/constants';
import api from '../services/api';

export const usePageBuilder = (): [any[], boolean] => {
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);

  const sectionsPaths = [
    {
      title: 'Trending',
      path: SCOPES.TRENDING,
    },
    {
      title: 'Series Top Rated',
      path: SCOPES.TV.TOP_RATED,
    },
    {
      title: 'Popular',
      path: SCOPES.MOVIE.POPULAR,
    },
    {
      title: 'Movies Top Rated',
      path: SCOPES.MOVIE.TOP_RATED,
    },
  ];

  async function getSections() {
    const promises = [];

    for (let y = 0; y < sectionsPaths.length; y++) {
      const section = sectionsPaths[y];
      const promise = api.get(section.path);
      promises.push(promise);
      setSections((prev) => [...prev, { title: section.title }]);
    }

    try {
      const promisesResults = await Promise.all(promises);

      for (let x = 0; x < promisesResults.length; x++) {
        const { results } = promisesResults[x].data;

        setSections((prev) => {
          const newSections = [...prev];
          newSections[x].data = results;
          return newSections;
        });
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getSections();
  }, []);

  return [sections, isLoading];
};
