<script type="ts">
  import Table from "$lib/table/Table.svelte";
  import salesStore from "$lib/stores/sales";
  import productsStore from "$lib/stores/products";
  import customersStore from "$lib/stores/customers";
  import { goto } from "$app/navigation";
  import CheckboxCheckedFilled16 from "carbon-icons-svelte/lib/CheckboxCheckedFilled16";
  import CloseOutline16 from "carbon-icons-svelte/lib/CloseOutline16";
  import { InlineNotification } from "carbon-components-svelte";

  function fromSalesGroupToTable(
    sales: Sale[],
    products: Product[],
    customers: Customer[]
  ): { headers: TableType["headers"]; rows: TableType["rows"] } {
    try {
      const defaultHeaders = [
        { key: "customer", value: "Cliente" },
        { key: "total", value: "Total R$" },
        { key: "paid", value: "Pago" },
      ];

      if (sales?.length === 0 || !sales) {
        return { headers: defaultHeaders, rows: [] };
      }

      let productsHeaders = [];

      const rows: TableType["rows"] = sales.map((sale) => {
        let row = { id: "", customer: "", paid: {}, total: "" };

        row.id = sale._id;

        const saleCustomer = customers.find(
          (client) => client._id == sale.customerId
        );
        row.customer = saleCustomer.name;

        // const paid = sale.paid ? paidIcon.true : paidIcon.false;
        row.paid = sale.paid ? CheckboxCheckedFilled16 : CloseOutline16;

        row.total = sale.total.toString();

        sale.products.forEach((saleProduct) => {
          if (saleProduct.tags.length === 0 || saleProduct.tags == undefined) {
            return;
          }

          if (!productsHeaders.includes(saleProduct.productId))
            productsHeaders.push(saleProduct.productId);

          row[saleProduct.productId] = saleProduct.tags.join(" - ");
        });

        return row;
      });

      productsHeaders = productsHeaders.map((productId) => {
        return {
          key: productId,
          value: products.find(({ _id }) => _id === productId).name,
        };
      });

      const headers = [...defaultHeaders, ...productsHeaders];

      return { headers, rows };
    } catch (err) {
      console.error(err);
    }
  }

  $: salesTable = fromSalesGroupToTable(
    $salesStore.sales,
    $productsStore,
    $customersStore
  );
</script>

{#if $salesStore.salesGroupId === ""}
  <InlineNotification
    hideCloseButton
    title="Aviso:"
    kind="warning"
    subtitle="Nenhum grupo de vendas selecionado!"
  />
{:else}
  <Table
    headers={salesTable.headers}
    rows={salesTable.rows}
    on:add={() => {
      if ($salesStore.salesGroupId === "" || !$salesStore.salesGroupId) {
        goto("/");
      } else {
        goto("/input/sale-add-0-0");
      }
    }}
    on:edit={(event) => {
      const _id = event.detail.id;
      goto(`/input/sale-edit-${_id}-0`);
    }}
    on:remove={(event) => {
      const _id = event.detail.id;
      goto(`/input/sale-remove-${_id}-0`);
    }}
  />
{/if}
