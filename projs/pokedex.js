function fetchPokemonData(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      return response.json();
    })
    .then(data => {
      updateJsonDisplay(data);
    })
    .catch(error => {
      console.error('Error fetching Pokemon data:', error.message);
      updateJsonDisplay({ error: error.message });
    });
}