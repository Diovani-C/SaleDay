<script type="ts">
  import Table from "$lib/table/Table.svelte";
  import productsStore from "$lib/stores/products";
  import { goto } from "$app/navigation";

  function fromProductsToTable(products: Product[]): {
    headers: TableType["headers"];
    rows: TableType["rows"];
  } {
    try {
      const headers = [
        { key: "_id", value: "ID" },
        { key: "name", value: "Nome" },
        { key: "price", value: "Preço" },
        { key: "barcode", value: "Código de barras" },
      ];

      if (products.length == 0) {
        return { headers, rows: [] };
      }

      const rows = products.map(({ _id, name, barcode, price }) => {
        return { id: _id, _id, name, price: price.toString(), barcode };
      });

      return { headers, rows };
    } catch (err) {
      console.error(err);
    }
  }

  $: productsTable = fromProductsToTable($productsStore);
</script>

<Table
  headers={productsTable.headers}
  rows={productsTable.rows}
  on:add={() => {
    goto("/input/product-add-0");
  }}
  on:edit={(event) => {
    const _id = event.detail.id;
    goto(`/input/product-edit-${_id}`);
  }}
  on:remove={(event) => {
    const _id = event.detail.id;
    goto(`/input/product-remove-${_id}`);
  }}
/>
