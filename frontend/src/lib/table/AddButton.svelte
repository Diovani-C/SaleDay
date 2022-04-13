<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import Add32 from "carbon-icons-svelte/lib/Add32";

  const dispatch = createEventDispatcher();

  export let isDesktop: boolean = false;
  export let text: string = "Add";
</script>

{#if !isDesktop}
  <div id="mobile-add">
    <Button
      icon={Add32}
      hasIconOnly
      iconDescription={text}
      on:click={() => {
        dispatch("add");
      }}
    />
  </div>
{:else if isDesktop}
  <Button
    icon={Add32}
    on:click={() => {
      dispatch("add");
    }}>{text}</Button
  >
{/if}

<style lang="scss">
  #mobile-add {
    position: fixed;
    top: 85%;
    left: 80%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
</style>
