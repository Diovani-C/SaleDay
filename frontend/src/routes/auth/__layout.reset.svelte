<script context="module">
  /** @type {import('@sveltejs/kit').Load}*/

  export async function load({ session }) {
    if (session.authenticated)
      return {
        status: 302,
        redirect: "/",
      };

    return {};
  }
</script>

<script>
  import "carbon-components-svelte/css/white.css";
</script>

<main>
  <slot />
</main>

<style type="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    width: 100%;
    height: 100%;
    padding: 0.25rem;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
