import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPokemon } from '../types/pokemon.types';
import { getBaseUrl } from '../utils';
import { useStore } from '../zustand/pokemon.store';

function CardWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div>
      <h3 className="text-3xl leading-6 font-medium text-gray-900 capitalize">{title}</h3>
      <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">{children}</dl>
    </div>
  );
}

function Card({ name }: { name: string }) {
  return (
    <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
      <dd className="mt-1 text-2xl tracking-tight font-semibold text-gray-900">{name}</dd>
    </div>
  );
}

function Pokemon() {
  const { getPokemonById, loading, setLoading } = useStore();
  const { id } = useParams();

  const [pokemon, setPokemon] = useState<
    | {
        data: IPokemon;
        url: string;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (id) {
      // take out the pokemon from the states if exits
      const savedPokemonData = getPokemonById(parseInt(id));
      if (savedPokemonData) {
        setPokemon(savedPokemonData);
      } else {
        // if no pokemon was found of this id then we fetch the new data
        const getPokemon = async () => {
          try {
            setLoading(true);
            const url = `${getBaseUrl()}/${id}/`;
            const res = await fetch(url);
            const data = (await res.json()) as IPokemon;
            setPokemon({
              data,
              url,
            });
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          } finally {
            setLoading(false);
          }
        };
        getPokemon();
      }
    }
  }, [getPokemonById, id, setLoading]);

  if (loading) {
    return <>loading...</>;
  }

  return (
    <div>
      <div className="lg:flex space-x-4">
        <div className="">
          <h1 className="text-3xl font-semibold capitalize text-center">{pokemon?.data.name}</h1>
          <img
            src={pokemon?.data.sprites.front_default}
            className="w-[30rem] h-[30rem] mx-auto"
            alt={pokemon?.data.name}
          />
        </div>
        <div className="flex-1 space-y-8">
          <div className="bg-indigo-300 p-4 rounded-md text-lg lg:w-[50%]">
            <div className="flex justify-between">
              <div>
                <p className="text-white">height</p>
                <p className="font-medium ">{pokemon?.data.height}</p>
              </div>
              <div>
                <p className="text-white">Weight</p>
                <p className="font-medium ">{pokemon?.data.weight}</p>
              </div>
            </div>
          </div>
          <CardWrapper title="Abilities">
            {pokemon?.data.abilities.map(({ ability }) => (
              <Card name={ability.name} key={ability.name} />
            ))}
          </CardWrapper>

          <CardWrapper title="Moves">
            {pokemon?.data.moves.map(({ move }) => (
              <Card name={move.name} key={move.name} />
            ))}
          </CardWrapper>
          <CardWrapper title="stat">
            {pokemon?.data.stats.map(({ stat }) => (
              <Card name={stat.name} key={stat.name} />
            ))}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
