// BARRA DESPLEGABLE

function toggleMenu() {
    var navbarMenu = document.getElementById('navbarMenu');
    navbarMenu.classList.toggle('show');
}


// DARK MODE
var modoBoton = document.getElementById('modoBoton');
var ventanaEmergente = document.getElementById("miVentanaEmergente");

// Agrega un listener al botón para cambiar el modo
modoBoton.addEventListener('click', function() {
    // Alternar la clase "dark-mode" en el elemento body
    document.body.classList.toggle('dark-mode');
    
    // Alternar la clase "dark-mode" en la ventana emergente
    ventanaEmergente.classList.toggle("dark-mode");
});


/** VENTANA EMERGENTE */
// Obtén el elemento de la ventana emergente
const miVentanaEmergente = document.getElementById('miVentanaEmergente');

// Función para mostrar la ventana emergente
function mostrarVentanaEmergente() {
    miVentanaEmergente.style.display = 'block';
}

// Mostrar la ventana emergente automáticamente después de cinco segundos
setTimeout(mostrarVentanaEmergente, 5000);

// Obtén el elemento del botón para cerrar la ventana emergente
const cerrarPopup = document.getElementById('cerrarPopup');

// Función para cerrar la ventana emergente
function cerrarVentanaEmergente() {
    miVentanaEmergente.style.display = 'none';
    miVentanaEmergente.scrollTop = 0;
}

// Agrega un evento de clic al botón para cerrar la ventana emergente
cerrarPopup.addEventListener('click', cerrarVentanaEmergente);

////****** */
// script.js

document.addEventListener("DOMContentLoaded", function () {
    // Cargar los datos del archivo JSON
    fetch("datos.json")
      .then((response) => response.json())
      .then((data) => {
        // Almacenar los datos en el almacenamiento local
        localStorage.setItem("pokemonData", JSON.stringify(data));
  
        // Asignar eventos de clic a los enlaces
        const verMasButtons = document.querySelectorAll(".ver-mas-button");
        verMasButtons.forEach((button) => {
          button.addEventListener("click", mostrarInformacionPokemon);
        });
      });
  });
  
  function mostrarInformacionPokemon(event) {
    // Obtener el ID del Pokémon desde el atributo data-id
    const pokemonId = event.currentTarget.getAttribute("data-id");

    // Obtener los datos de los Pokémon desde el almacenamiento local
    const pokemonData = JSON.parse(localStorage.getItem("pokemonData"));
  
    // Buscar el Pokémon correspondiente por su ID
    const pokemon = pokemonData.find((p) => p.nombre === pokemonId);
  
    // Mostrar la información del Pokémon en el div pokemon-info
    const pokemonInfoDiv = document.getElementById("pokemon-info");
    pokemonInfoDiv.innerHTML = `
      <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
      <h2>${pokemon.nombre}</h2>
      <p>${pokemon.descripcion}</p>
      <h3>Características:</h3>
      <ul>
          <li>Tipo: ${pokemon.caracteristicas.tipo}</li>
          <li>Habilidad: ${pokemon.caracteristicas.habilidad}</li>
          <li>Poder: ${pokemon.caracteristicas.poder}</li>
          <li>Velocidad: ${pokemon.caracteristicas.velocidad}</li>
      </ul>
      <p>${pokemon.compra}</p>
      <p>Precio: $${pokemon.precio}</p>
      <p>Votación: ${pokemon.votacion}</p>
      <button class="compra-button">Compra</button>
      <button onclick="goBackToIndex()" class="volver-button">Volver Atrás</button>
    `;
  }

  function goBackToIndex() {
    window.location.href = 'index.html';
  }


/*//*/
// Función para cambiar el modo oscuro
function cambiarModo() {
  const modoBoton = document.getElementById('modoBoton');
  const body = document.body;

  if (body.classList.contains('modo-oscuro')) {
    // Cambia a modo claro
    body.classList.remove('modo-oscuro');
    modoBoton.innerText = 'Modo claro';
  } else {
    // Cambia a modo oscuro
    body.classList.add('modo-oscuro');
    modoBoton.innerText = 'Modo oscuro';
  }
}
  
  function goBackToIndex() {
    window.location.href = 'index.html';
  }


