<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "carbon-components-svelte";
  import Edit16 from "carbon-icons-svelte/lib/Edit16";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Edit24 from "carbon-icons-svelte/lib/Edit24";
  import TrashCan24 from "carbon-icons-svelte/lib/TrashCan24";

  const dispatch = createEventDispatcher();
  export let size: "default" | "small" = "default";

  let editIcon = size === "default" ? Edit24 : Edit16;
  let removeIcon = size === "default" ? TrashCan24 : TrashCan16;

  export let rowId: string;
</script>

<Button
  icon={editIcon}
  hasIconOnly
  {size}
  iconDescription={"edit"}
  kind="secondary"
  on:click={(event) => {
    dispatch("edit", { id: rowId });
    event.stopImmediatePropagation();
  }}
/>
<Button
  icon={removeIcon}
  hasIconOnly
  {size}
  iconDescription={"remove"}
  kind={"danger"}
  on:click={(event) => {
    dispatch("remove", { id: rowId });
    event.stopImmediatePropagation();
  }}
/>
