import { getPokemons } from '../services/pokemon';
import { useStore } from '../zustand/pokemon.store';
import Button from './Button';

function Pagination() {
  const { pageNumber, limit, count, previous, next, cache, updateStore, setLoading, loading } = useStore();

  const onPrevious = async () => {
    if (previous) {
      // check if data already in the cache object.
      if (cache[previous]) {
        updateStore({
          ...cache[previous],
          pageNumber: pageNumber - 1,
        });
      } else {
        setLoading(true);
        // get the the pokemon data and save in cache
        const pokemonsData = await getPokemons(previous);
        if (!pokemonsData.error) {
          updateStore({
            ...pokemonsData,
            pageNumber: pageNumber - 1,
            cache: {
              ...cache,
              [previous]: pokemonsData,
            },
            loading: false,
          });
        } else {
          // show some error message or dialog/notification
        }
      }
    }
  };
  const onNext = async () => {
    if (next) {
      // check if data already in the cache object.
      if (cache[next]) {
        updateStore({
          ...cache[next],
          pageNumber: pageNumber + 1,
        });
      } else {
        setLoading(true);
        // get the the pokemon data and save in cache
        const pokemonsData = await getPokemons(next);
        if (!pokemonsData.error) {
          updateStore({
            ...pokemonsData,
            pageNumber: pageNumber + 1,
            cache: {
              ...cache,
              [next]: pokemonsData,
            },
            loading: false,
          });
        } else {
          // show some error message or dialog/notification
        }
      }
    }
  };

  let to = limit * pageNumber;

  if (to > count) {
    to = count;
  }

  return (
    <nav className="bg-white py-3 flex items-center justify-between border-t border-gray-200" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{limit * (pageNumber - 1) || '1'}</span> to{' '}
          <span className="font-medium">{to}</span> of <span className="font-medium">{count}</span> results
        </p>
      </div>
      <div className="flex-1 flex justify-between sm:justify-end space-x-4">
        <Button disabled={!previous || loading} onClick={onPrevious}>
          Previous
        </Button>
        <Button disabled={!next || loading} onClick={onNext}>
          Next
        </Button>
      </div>
    </nav>
  );
}

export default Pagination;
