document.addEventListener("DOMContentLoaded", function () {
    // --- Theme persistence ---
    const themeKey = 'theme-preference';
    const modoBoton = document.getElementById('modoBoton');

    const applyTheme = (theme) => {
        const isDarkMode = theme === 'dark';
        document.body.classList.toggle('dark-mode', isDarkMode);
        if (modoBoton) {
            modoBoton.textContent = isDarkMode ? 'Modo oscuro' : 'Modo claro';
        }
        // Also toggle for popup if it exists on the page
        const ventanaEmergente = document.getElementById("miVentanaEmergente");
        if (ventanaEmergente) {
            ventanaEmergente.classList.toggle("dark-mode", isDarkMode);
        }
    };

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem(themeKey);
    applyTheme(savedTheme);

    // Navbar toggle (replaces inline onclick)
    const navbarToggle = document.getElementById('navbarToggle');
    if (navbarToggle) {
        navbarToggle.addEventListener('click', () => {
            const navbarMenu = document.getElementById('navbarMenu');
            if (navbarMenu) {
                navbarMenu.classList.toggle('show');
            }
        });
    }

    // Dark Mode button listener (replaces old logic)
    if (modoBoton) {
        modoBoton.addEventListener('click', () => {
            // Determine the new theme by checking the current state
            const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            // Save the new preference
            localStorage.setItem(themeKey, newTheme);
            // Apply the new theme visually
            applyTheme(newTheme);
        });
    }

    // --- Page specific functionality ---

    // For index.html (popup)
    const miVentanaEmergente = document.getElementById('miVentanaEmergente');
    const cerrarPopup = document.getElementById('cerrarPopup');
    if (miVentanaEmergente && cerrarPopup) {
        const mostrarVentanaEmergente = () => {
            miVentanaEmergente.classList.remove('hidden');
        };

        const cerrarVentanaEmergente = () => {
            miVentanaEmergente.classList.add('hidden');
            miVentanaEmergente.scrollTop = 0;
        };

        setTimeout(mostrarVentanaEmergente, 5000);
        cerrarPopup.addEventListener('click', cerrarVentanaEmergente);
    }

    // For index-picachu.html (loading pokemon data)
    // This logic was scattered and incomplete in the original script.
    // It is better to have separate scripts or ensure elements exist.
    if (document.querySelector(".ver-mas-button")) {
        // This check assumes .ver-mas-button only exists on the catalog page.
        fetch("datos.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                localStorage.setItem("pokemonData", JSON.stringify(data));
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
});

// For index.html (dynamic pokemon list)
const pokemonListHome = document.getElementById('pokemon-list-home');
if (pokemonListHome) {
    fetch('datos.json')
        .then(response => response.json())
        .then(data => {
            pokemonListHome.innerHTML = ''; // Limpiar contenido estático
            data.forEach(pokemon => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `detalle.html?id=${pokemon.nombre.toLowerCase()}`;

                const img = document.createElement('img');
                img.src = pokemon.imagen;
                img.alt = pokemon.nombre;

                link.appendChild(img);
                link.appendChild(document.createTextNode(pokemon.nombre));

                listItem.appendChild(link);
                pokemonListHome.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error al cargar la lista de Pokémon:', error);
            pokemonListHome.innerHTML = '<li>No se pudo cargar la lista de Pokémon. Inténtalo de nuevo más tarde.</li>';
        });
}

// NOTE: The original script.js had several global functions like `realizarCompra`,
// `goBackToIndex`, etc., which were duplicated or conflicting.
// They were likely used by inline `onclick` attributes in `detalle.html` and `index-picachu.html`.
// By centralizing event handling inside the 'DOMContentLoaded' listener and removing
// inline `onclick` attributes from HTML, the code becomes cleaner and less error-prone.
// The functionality of those global functions should be moved into event listeners
// specific to the pages where they are used (e.g., inside the script tags of `detalle.html`).
