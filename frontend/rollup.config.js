import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/main.js", // Główny plik wejściowy (gdzie zaimportujesz komponenty Svelte)
  output: {
    format: "iife", // Używamy formatu IIFE (Immediately Invoked Function Expression) dla przeglądarki
    file: "build/bundle.js", // Ścieżka do skompilowanego pliku
    sourcemap: true,
  },
  plugins: [
    svelte({
      compilerOptions: {
        dev: false, // Wyłącz tryb deweloperski w produkcji
      },
    }),
    resolve(), // Pomaga Rollup znaleźć moduły z `node_modules`
    commonjs(), // Obsługuje moduły CommonJS
    terser(), // Minifikacja kodu (opcjonalne, ale zalecane w produkcji)
  ],
};
