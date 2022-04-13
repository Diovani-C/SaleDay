<script context="module">
  /** @type {import('@sveltejs/kit').Load}*/
  export async function load({ session }) {
    if (!session.authenticated)
      return {
        status: 302,
        redirect: "/auth/login",
      };

    return { props: { username: session.username } };
  }
</script>

<script type="ts">
  import "carbon-components-svelte/css/white.css";
  import "$lib/stores/sales";
  import "$lib/stores/salesGroup";
  import "$lib/stores/allSalesGroups";
  import "$lib/stores/customers";
  import "$lib/stores/products";
  import "$lib/stores/subproducts";
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavLink,
    SideNavDivider,
  } from "carbon-components-svelte";

  import { page } from "$app/stores";

  export let username: string;

  const Links = [
    { text: "Grupos de vendas", href: "/" },
    { text: "Vendas", href: "/sales" },
    { text: "Clientes", href: "/customers" },
    { text: "Produtos", href: "/products" },
    { text: "Catálogo", href: "/productsInfo" },
    { text: "Subprodutos", href: "/subproducts" },
  ];

  $: currentPage = Links.find(({ href }) => href == $page.path);

  let isSideNavOpen = false;
</script>

<Header
  company={username}
  platformName={currentPage?.text || ""}
  bind:isSideNavOpen
  persistentHamburgerMenu={true}
>
  <SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
      {#each Links as { text, href }}
        <SideNavLink
          {text}
          {href}
          on:click={() => {
            isSideNavOpen = false;
          }}
        />
      {/each}
      <SideNavDivider />
      <SideNavLink text="Logout" href="/api/logout" />
    </SideNavItems>
  </SideNav>
</Header>
<main>
  <slot />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: stretch;
    width: 100%;
    height: 100%;
    padding: 0.25rem;
    max-width: 768px;
    margin-top: 3rem;
    margin-left: auto;
    margin-right: auto;
  }
</style>
