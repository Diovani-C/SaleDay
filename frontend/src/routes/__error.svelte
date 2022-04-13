<script context="module">
  export function load({ error, status }) {
    return {
      props: {
        errorMessage: `${status}: ${error.message}`,
      },
    };
  }
</script>

<script type="ts">
  export let errorMessage: string;
  import { ToastNotification } from "carbon-components-svelte";
  import dayjs from "dayjs";
</script>

<ToastNotification
  title="Alguma coisa deu errado:"
  subtitle={errorMessage}
  hideCloseButton
  caption={dayjs().format("DD/MM/YYYY HH:mm")}
/>
