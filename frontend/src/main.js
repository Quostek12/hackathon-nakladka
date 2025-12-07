import Popup from "./popup.svelte";

const app = new Popup({
  target: document.getElementById("app"), // Wstawienie komponentu do elementu o id "app"
});

export default app;
