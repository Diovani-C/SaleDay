<script type="ts">
  import Table from "$lib/table/Table.svelte";
  import customersStore from "$lib/stores/customers";
  import salesStore from "$lib/stores/sales";
  import { goto } from "$app/navigation";
  import { InlineNotification } from "carbon-components-svelte";

  function fromCustomersToTable(customers: Customer[]): {
    headers: TableType["headers"];
    rows: TableType["rows"];
  } {
    try {
      const headers = [
        { key: "name", value: "Nome" },
        { key: "cellphone", value: "Celular" },
        { key: "phone", value: "Telefone" },
        { key: "email", value: "Email" },
      ];

      if (customers.length == 0) {
        return { headers, rows: [] };
      }

      const rows = customers.map(({ _id, name, cellphone, phone, email }) => {
        return {
          id: _id,
          name,
          phone,
          cellphone,
          email,
        };
      });

      return { headers, rows };
    } catch (err) {
      console.error(err);
    }
  }

  $: customersTable = fromCustomersToTable($customersStore);
</script>

{#if $salesStore.salesGroupId === ""}
  <InlineNotification
    hideCloseButton
    title="Aviso:"
    kind="warning"
    subtitle="Nenhum grupo de vendas selecionado!"
  />
{/if}

<Table
  headers={customersTable?.headers}
  rows={customersTable?.rows}
  on:add={() => {
    if ($salesStore.salesGroupId === "" || !$salesStore.salesGroupId) {
      goto("/");
    } else {
      goto("/input/customer-add-0");
    }
  }}
  on:edit={(event) => {
    const _id = event.detail.id;
    goto(`/input/customer-edit-${_id}`);
  }}
  on:remove={(event) => {
    const _id = event.detail.id;
    goto(`/input/customer-remove-${_id}`);
  }}
  on:rowClick={({ detail }) => {
    if ($salesStore.salesGroupId === "" || !$salesStore.salesGroupId) {
      goto("/");
    } else {
      goto(`/input/sale-add-0-${detail.id}`);
    }
  }}
/>
