const Pokedex = require("pokeapi-js-wrapper")
const P = new Pokedex.Pokedex({ cacheImages: true })

const typeContainer = document.getElementById("type-container")
const pokeContainer = document.getElementById("poke-container")
const pokeHome = document.getElementById("home")
const pokeID = document.getElementById("poke-id")
const pokeName = document.getElementById("poke-name")
const pokeGenus = document.getElementById("poke-genus")
const pokeSprite = document.getElementById("poke-sprite")
const pokeType = document.getElementById("poke-type")
const pokeDesc = document.getElementById("poke-description")
const pokeDescSource = document.getElementById("poke-description-source")
const inputID = document.getElementById('input-id')


/*
japanese (hiragana-katakana): "ja-Hrkt"
korean: "ko"
chinese (traditional): "zh-Hant"
french: "fr"
deutsch: "de"
spanish: "es"
italian: "it"
english: "en"
japanese: "ja
chinese (simplified): "zh-Hans"
*/

const lang = "fr"

let spriteStatus
let currentID
let rawPokemonName

let isShiny = false

pokeSprite.addEventListener('touchstart', function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

pokeSprite.addEventListener('touchend', function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false);


function handleGesture() {
    if (touchendX < touchstartX) {
        console.log('Swiped Left');
        currentID += 1
        getPokemon(currentID)
    }

    if (touchendX > touchstartX) {
        console.log('Swiped Right');
        currentID -= 1
        getPokemon(currentID)
    }

    if (touchendY < touchstartY) {
        console.log('Swiped Up');
    }

    if (touchendY > touchstartY) {
        console.log('Swiped Down');
    }

    if (touchendY === touchstartY) {
        console.log('Tap');
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

inputID.addEventListener("input", e => {
    isShiny = false
    const value = e.target.value
    getPokemon(value.toLowerCase())
})

pokeSprite.addEventListener("click", function() {
    if(!isShiny) {
        console.log("shiny!")
        switchShiny(currentID, true)
    }
    else {
        console.log("default...")
        switchShiny(currentID, false)
    }
    isShiny = !isShiny;
    });

document.addEventListener("keydown", function(event) {
    const key = event.key;
    switch (key){
        case "ArrowLeft":
            currentID -= 1
            getPokemon(currentID)
            break
        case "ArrowRight":
            currentID += 1
            getPokemon(currentID)
            break
    }
});

async function getPokemon(inputID){
    isShiny = false
    P.getPokemonByName(inputID).then(function(response){
        console.log(response)
        currentID = response.id
        P.getPokemonSpeciesByName(inputID).then(function(response) {
            console.log(response)
            renderPokemonSpecies(response)
        })
        renderPokemon(response)
    })
}

async function renderPokemon(pokemon){
    console.log(pokemon.id)
    console.log(pokemon.name)

    resetDisplay()
    pokeHome.classList.add("hidden")
    pokeContainer.classList.remove("hidden")

    const rawPokemonType = pokemon.types[0].type.name
    const pokemonType = rawPokemonType.charAt(0).toUpperCase() + rawPokemonType.slice(1)

    sprite = pokemon.sprites.front_default

    pokeID.innerHTML = "#" + pokemon.id
    pokeSprite.src = sprite
    pokeType.innerHTML = pokemonType

    pokemon.types.forEach(type => {
        console.log("type created")
        const rawPokemonType = type.type.name
        const pokemonType = rawPokemonType.charAt(0).toUpperCase() + rawPokemonType.slice(1)
        const h1 = document.createElement("h1")
        h1.innerText = pokemonType
        h1.id = "poke-type"
        h1.classList.add("pokemon-type")
        h1.classList.add(type.type.name)

        typeContainer.appendChild(h1)
    })
}

async function renderPokemonSpecies(pokemon){
    var rawPokemonName
    var pokemonGenus
    const pokemonDescriptions = [[], []]
    
    pokemon.genera.forEach(element => {
        if(element.language.name == lang){
            console.log(element.genus)
            pokemonGenus = element.genus
        }
    })

    pokeGenus.innerHTML = pokemonGenus

    pokemon.names.forEach(element => {
        if(element.language.name == lang){
            console.log(element.name)
            rawPokemonName = element.name
        }
    })

    pokeName.innerHTML = rawPokemonName

    pokemon.flavor_text_entries.forEach(element => {
        if(element.language.name == lang){
            console.log(element.flavor_text + "\n" + element.version.name)
            pokemonDescriptions[0].push(element.flavor_text)
            pokemonDescriptions[1].push(element.version.name)
        }
    })

    console.log(pokemonDescriptions)
    const randomDesc = getRandomInt(pokemonDescriptions[0].length)
    
    pokeDesc.innerHTML = pokemonDescriptions[0][randomDesc]
    pokeDescSource.innerHTML = "(" + pokemonDescriptions[1][randomDesc] + ")"
}

function switchShiny(id, shinyStatus){
    P.getPokemonByName(id).then(pokemon => {
        if(shinyStatus){
            sprite = pokemon.sprites.front_shiny
            pokeSprite.src = sprite
        }
        else{
            sprite = pokemon.sprites.front_default
            pokeSprite.src = sprite
        }
    })
}

function resetDisplay(){
    Array.from(typeContainer.children).forEach(element => {
        if(element.getAttribute("id") == "poke-type"){
            element.outerHTML = ""
        }
    })
}

