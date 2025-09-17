const pokemonDataManager = {
    _data: null,
    _dataVersion: '1.1', // Incrementa esta versión si cambias la estructura de datos.json
    _storageKey: null,
    _isFetching: false,
    _fetchPromise: null,

    getData: function() {
        console.log('[DataManager] getData() called.');
        if (this._data) {
            console.log('[DataManager] Returning data from memory cache.');
            return Promise.resolve(this._data);
        }

        if (this._isFetching) {
            console.log('[DataManager] A fetch is already in progress. Returning existing promise.');
            return this._fetchPromise;
        }

        this._storageKey = `pokemonData-v${this._dataVersion}`;
        const storedData = localStorage.getItem(this._storageKey);
        if (storedData) {
            console.log('[DataManager] Found data in localStorage.');
            try {
                this._data = JSON.parse(storedData);
                console.log('[DataManager] Successfully parsed localStorage data. Preloading images.');
                this.preloadImages(this._data);
                return Promise.resolve(this._data);
            } catch (e) {
                console.error(`[DataManager] Failed to parse ${this._storageKey} from localStorage. Removing corrupt data.`, e);
                localStorage.removeItem(this._storageKey);
            }
        }

        console.log(`[DataManager] Cache key: ${this._storageKey}`);
        console.log('[DataManager] No cached data found. Starting network fetch for datos.json.');
        this._isFetching = true;
        this._fetchPromise = fetch('datos.json')
            .then(response => {
                console.log('[DataManager] Fetch response received. Status:', response.status);
                if (!response.ok) throw new Error(`Network response was not ok. Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('[DataManager] Successfully fetched and parsed JSON data.');
                this._data = data;
                this._isFetching = false;
                localStorage.setItem(this._storageKey, JSON.stringify(data));
                console.log('[DataManager] Data stored in localStorage. Preloading images.');
                this.preloadImages(data);
                return data;
            })
            .catch(error => {
                this._isFetching = false;
                console.error('[DataManager] Fetch failed.', error);
                throw error;
            });
        
        return this._fetchPromise;
    },

    preloadImages: function(data) {
        if (!data) return;
        const imageUrls = data.map(pokemon => pokemon.imagen);
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
};

document.addEventListener("DOMContentLoaded", function () {
    // --- Initialize Data Manager ---
    // This will start fetching/loading data from localStorage and preloading images
    pokemonDataManager.getData().catch(() => {
        // Catch the error here so it doesn't show up as an uncaught promise rejection in the console
        // The page-specific scripts will handle showing an error message to the user.
        console.log("[DataManager] Initial pre-load fetch failed. Page-specific logic will handle retry.");
    });

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
});

// NOTE: The original script.js had several global functions like `realizarCompra`,
// `goBackToIndex`, etc., which were duplicated or conflicting.
// They were likely used by inline `onclick` attributes in `detalle.html` and `index-picachu.html`.
// By centralizing event handling inside the 'DOMContentLoaded' listener and removing
// inline `onclick` attributes from HTML, the code becomes cleaner and less error-prone.
// The functionality of those global functions should be moved into event listeners
// specific to the pages where they are used (e.g., inside the script tags of `detalle.html`).
