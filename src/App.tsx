import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios";

export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [namePokemon, setNamePokemon] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    api.get("pokemon").then((res) => {
        setPokemons(res.data.results);
        setNext(res.data.next);
        setPrev(res.data.previous);
    }).catch((err) => console.warn(err));
  },[]);

  const sairBusca = () => {
    window.location.href = '/';
  };

  const buscarPokemon = () => {
    if(namePokemon){
      axios({
        method: "GET",
        url: `https://pokeapi.co/api/v2/pokemon/${namePokemon}`
      })
        .then(response => {
          //console.log('response.data >>> ', response.data);

          if(response){
            const nome = response.data.name;
            const firstNamecharAt = nome.charAt(0);
            const habilidades = response.data.abilities.map(ability => ability.ability.name).join(', ').toString();
            const urlImg = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+response.data.id+'.png';

            const card = `<div class="rounded-xl border bg-card text-card-foreground shadow pokemon w-[350px] mb-5 mt-5" rel="${nome}">
              <div class="space-y-1.5 p-6 w-[100%] flex flex-row flex-wrap justify-items-center justify-center">
                <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mr-5">
                  <span class="flex h-full w-full items-center justify-center rounded-full bg-muted">${firstNamecharAt}</span>
                </span>
                <div>
                  <h3 class="font-semibold leading-none tracking-tight w-full nomePokemon">${nome}</h3>
                  <p class="text-sm text-muted-foreground habilidades w-full" rel="${nome}">${habilidades}</p>
                </div>
                <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ml-5">
                  <img class="aspect-square h-full w-full" alt="${nome}" src="${urlImg}">
                </span>
              </div>
            </div>`;
            
            document.querySelector(".wrapperCards").innerHTML = ''+card+'';
            setIsActive(current => !current);
          }
        })
        .catch(error => {
          alert('Erro ao obter informações do Pokémon: '+error.message+'');
        });
      }else{
        alert('Digite um nome válido de Polemon!');
      }
  };

  const getPokemonInfo = (name) => {
    axios({
      method: "GET",
      url: `https://pokeapi.co/api/v2/pokemon/${name}`
    })
      .then(response => {
        console.log('response >> ',response);
        const nome = response.data.name;
        const habilidades = response.data.abilities.map(ability => ability.ability.name).join(', ').toString();
      
        document.querySelector("p.habilidades[rel="+nome+"]").innerHTML = ''+habilidades+'';
      })
      .catch(error => {
        console.error('Erro ao obter informações do Pokémon:', error.message);
      });
  };

  const seeNext = (next) => {
    api.get(next).then((res) => {
      setPokemons(res.data.results);
      setNext(res.data.next);
      setPrev(res.data.previous);
    });
    window.scrollTo(0, 0);
  };

  const seePrev = (prev) => {
    api.get(prev).then((res) => {
      setPokemons(res.data.results);
      setNext(res.data.next);
      setPrev(res.data.previous);
    });
    window.scrollTo(0, 0);
  };

  const buildImgUrl = (url) => {
    const id = url.split("/");
    const idx = id.length - 2;
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id[idx]}.png`;

    return imgUrl;
  };

  return (
    <div className="relative min-h-[100vh]">
      <div className="absolute bottom-0 left-0 right-0 top-0 grid place-items-center">

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            className="inputPokemon"
            type="text"
            placeholder="Buscar Pokemon"
            value={namePokemon == null ? '' : namePokemon}
            onChange={(input) => {setNamePokemon(input?.target?.value)}
            }
          />
          <Button
            onClick={() => buscarPokemon(namePokemon)}
            className="buscarPokemon"
            type="submit">
            Buscar
          </Button>
        </div>

        <ScrollArea className="h-[380px] w-[380px] rounded-md border p-4 wrapperCards">
          {pokemons.map((pokemon) => {
            const firstName = pokemon.name;
            const firstNamecharAt = firstName.charAt(0);
        
            return (
              <Card rel={pokemon.name} className="pokemon w-[350px] mb-5 mt-5">
                <CardHeader className="w-[100%] flex flex-row flex-wrap justify-items-center justify-center">
                  <Avatar className="mr-5">
                    <AvatarFallback>{firstNamecharAt}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="w-full nomePokemon">{pokemon.name}</CardTitle>
                    <CardDescription rel={pokemon.name} className="habilidades w-full">{getPokemonInfo(pokemon.name)}</CardDescription>
                  </div>
                  <Avatar className="ml-5">
                    <AvatarImage src={buildImgUrl(pokemon.url)} alt={pokemon.name} />
                  </Avatar>
                </CardHeader>
              </Card>
            );
          })}
        </ScrollArea>

        <div className={isActive ? '"rounded-md border p-5 paginacao hidden' : '"rounded-md border p-5 paginacao'}>
          <Button
            onClick={() => seePrev(prev)}
            disabled={prev === null ? true : false}
            className={prev === null ? "btn-disabled" : ""}
          >
            Anteriores
          </Button>

          <Button
            onClick={() => seeNext(next)}
            disabled={next === null ? true : false}
            className={next === null ? "btn-disabled" : "ml-5"}
          >
            Próximos
          </Button>
        </div>
        {/*"rounded-md border p-5 sairbusca"*/}
        <div className={isActive ? 'rounded-md border p-5 sairbusca' : 'rounded-md border p-5 sairbusca hidden'}>
          <Button 
            onClick={() => sairBusca()}
            className="sairBusca">
            Limpar Busca
          </Button>
        </div>
      </div>
    </div>
  ) 
}

export default App;