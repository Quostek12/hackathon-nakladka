<script>
  import { onMount } from 'svelte';

  let url = '';
  let sslStatus = 'Ładowanie...';
  let qrCodeDataUrl = '';
  let loading = true;

  // Inicjalizacja po załadowaniu popupu
  onMount(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      url = currentTab.url;
      sslStatus = await checkSSLStatus(url);
      loading = false;
      qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url + '\n' + sslStatus)}&size=200x200`;
    });
  });

  // Funkcja sprawdzająca SSL
  async function checkSSLStatus(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return 'Strona używa certyfikatu SSL (HTTPS)';
      }
    } catch (error) {
      return 'Strona NIE używa certyfikatu SSL';
    }
    return 'Nie można sprawdzić SSL';
  }
</script>

<style>
  .container {
    padding: 10px;
    text-align: center;
    max-width: 300px;
  }
  .qr-code {
    margin-top: 20px;
  }
</style>

<div class="container">
  {#if loading}
    <p>Ładowanie...</p>
  {:else}
    <p><strong>Link:</strong> {url}</p>
    <p><strong>Status SSL:</strong> {sslStatus}</p>
    <img src={qrCodeDataUrl} alt="QR Code" class="qr-code" />
  {/if}
</div>
