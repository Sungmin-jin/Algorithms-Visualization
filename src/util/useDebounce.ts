import React from 'react';

const useDebounce = <T>(term: T, delay = 500) => {
  const [isAfterMount, setIsAfterMount] = React.useState(false);
  const [debouncedTerm, setDebouncedTerm] = React.useState(term);
  const timeout = React.useRef<any>();

  React.useEffect(() => {
    if (isAfterMount) {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setDebouncedTerm(term);
      }, delay);
    } else {
      setIsAfterMount(true);
    }

    return () => clearTimeout(timeout.current);
  }, [term]);

  return debouncedTerm;
};

export default useDebounce;
