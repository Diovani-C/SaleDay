<script type="ts">
  import productsStore from "$lib/stores/products";
  import { goto } from "$app/navigation";
  import EditRemoveButtons from "$lib/table/EditRemoveButtons.svelte";
  import {
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarBatchActions,
    Button,
    UnorderedList,
    ListItem,
    DatePicker,
    DatePickerInput,
  } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import Add16 from "carbon-icons-svelte/lib/Add16";
  import { getSalesGroupById, getSalesGroupsByDate } from "$lib/helpers/getter";
  import allSalesGroups from "$lib/stores/allSalesGroups";
  import Search16 from "carbon-icons-svelte/lib/Search16";
  import dayjs from "dayjs";

  function fromSalesGroupsToTable(salesGroups: SalesGroup[]): {
    headers: TableType["headers"];
    rows: TableType["rows"];
  } {
    try {
      const headers = [
        { key: "_id", value: "ID" },
        { key: "createdAt", value: "Criado em:" },
      ];

      if (salesGroups.length == 0 || typeof salesGroups != "object") {
        return { headers: headers, rows: [] };
      }

      const rows = salesGroups.map((salesGroup) => {
        return {
          id: salesGroup._id,
          _id:
            salesGroup._id.slice(0, 8) +
            "\n" +
            salesGroup._id.slice(8, 16) +
            "\n" +
            salesGroup._id.slice(16),
          sales: salesGroup.sales.length.toString(),
          createdAt: dayjs(salesGroup.createdAt).format("DD/MM/YYYY HH:mm"),
        };
      });

      return { headers, rows };
    } catch (err) {
      console.error(err);
    }
  }

  $: salesGroupsTable = fromSalesGroupsToTable($allSalesGroups);

  let selectedRowIds = [];

  $: headersWithOption = [
    ...salesGroupsTable.headers,
    { key: "options", empty: true },
  ];

  let from = "";
  let to = "";
</script>

<DataTable
  expandable
  radio
  bind:selectedRowIds
  headers={headersWithOption}
  rows={salesGroupsTable.rows}
  zebra
>
  <Toolbar>
    <ToolbarBatchActions>
      <Button
        size="small"
        icon={Save16}
        on:click={() => {
          console.log("SalesGroup selected:");
          console.log(selectedRowIds[0]);
          getSalesGroupById.notifyAll(selectedRowIds[0]);
          goto("/sales");
        }}>Selecionar</Button
      >
    </ToolbarBatchActions>
    <ToolbarContent>
      <DatePicker
        datePickerType="range"
        on:change
        dateFormat="D/M/Y"
        valueFrom={from}
        valueTo={to}
      >
        <DatePickerInput labelText="De" placeholder="dd/mm/aaaa" />
        <DatePickerInput labelText="Até" placeholder="dd/mm/aaaa" />
      </DatePicker>
      <Button
        on:click={() => {
          getSalesGroupsByDate.notifyAll({ from, to });
        }}
        icon={Search16}
        size="small"
        type="submit"
      />

      <Button
        size="small"
        icon={Add16}
        on:click={() => {
          goto("/input/salesGroup-add-0");
        }}>Adicionar</Button
      >
    </ToolbarContent>
  </Toolbar>
  <div slot="expanded-row" let:row>
    <h3>Vendas:</h3>
    <p>{row.sales}</p>

    {#each $allSalesGroups.find(({ _id }) => _id === row.id)?.productsInfo as { productId, max, subproductTags }}
      <h3>{$productsStore.find(({ _id }) => _id === productId).name}:</h3>
      <UnorderedList>
        <ListItem>Máximo: {max}</ListItem>
        <ListItem
          >Vendido: {subproductTags.filter(({ sold }) => sold).length}</ListItem
        >
      </UnorderedList>
    {/each}
  </div>
  <div slot="cell" let:row let:cell>
    {#if cell.key === "options"}
      <EditRemoveButtons
        size="small"
        on:edit={() => {
          goto(`/input/salesGroup-edit-${row.id}`);
        }}
        on:remove={() => {
          goto(`/input/salesGroup-remove-${row.id}`);
        }}
        rowId={row.id}
      />
    {:else}
      {cell.value}
    {/if}
  </div>
</DataTable>

<style>
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
  }
</style>
