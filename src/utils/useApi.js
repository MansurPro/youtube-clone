import { useState, useEffect } from 'react';
import { fetchFromAPI } from './fetchFromAPI';

// Each page used to run this effect itself with no .catch(), so a failed request
// became an unhandled rejection and the page sat on the spinner forever — which
// looks exactly like "still loading". Errors now reach the caller.
export const useApi = (path, pick = (data) => data?.items) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setData(null);
    setError(null);

    fetchFromAPI(path)
      .then((res) => { if (active) setData(pick(res)); })
      .catch((err) => { if (active) setError(err); });

    // stops a slow response from overwriting state after the route already changed
    return () => { active = false; };
    // `pick` is deliberately not a dependency: callers pass an inline function,
    // so a new identity every render would refetch in a loop.
  }, [path]);

  return { data, error };
};
