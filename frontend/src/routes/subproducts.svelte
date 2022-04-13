<script type="ts">
  import Table from "$lib/table/Table.svelte";
  import subproductsStore from "$lib/stores/subproducts";
  import { goto } from "$app/navigation";

  function fromSubproductsToTable(subproducts: Subproduct[]): {
    headers: TableType["headers"];
    rows: TableType["rows"];
  } {
    try {
      const headers = [
        { key: "_id", value: "ID" },
        { key: "name", value: "Nome" },
        { key: "price", value: "Preço" },
      ];

      if (subproducts.length == 0) {
        return { headers, rows: [] };
      }

      const rows = subproducts.map(({ _id, name, price }) => {
        return { id: _id, _id, name, price: price.toString() };
      });

      return { headers, rows };
    } catch (err) {
      console.error(err);
    }
  }

  $: subproductsTable = fromSubproductsToTable($subproductsStore);
</script>

<Table
  headers={subproductsTable.headers}
  rows={subproductsTable.rows}
  on:add={() => {
    goto("/input/subproduct-add-0");
  }}
  on:edit={(event) => {
    const _id = event.detail.id;
    goto(`/input/subproduct-edit-${_id}`);
  }}
  on:remove={(event) => {
    const _id = event.detail.id;
    goto(`/input/subproduct-remove-${_id}`);
  }}
/>
