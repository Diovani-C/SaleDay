<script lang="ts">
  import MobileTable from "$lib/table/MobileTable.svelte";
  import EditRemoveButtons from "$lib/table/EditRemoveButtons.svelte";
  import AddButton from "$lib/table/AddButton.svelte";
  import {
    PaginationNav,
    DataTable,
    ToolbarContent,
    Toolbar,
    ToolbarSearch,
    Search,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";

  export let headers: TableType["headers"];
  export let rows: TableType["rows"];

  let search: string = "";
  let isDesktop = false;

  onMount(() => {
    isDesktop = window.matchMedia("(min-width: 768px)").matches;
  });

  function filterRows(
    rows: TableType["rows"],
    currentPage: number,
    perPage: number,
    searchString: string
  ) {
    let pageStart = currentPage * perPage;
    let pageEnd = (currentPage + 1) * perPage - 1;

    let searchFilteredRows = rows.filter((row) => {
      let columnsIncludes = [];
      for (const property in row) {
        if (property !== "id" && property !== "_id")
          if (typeof row[property] === "string") {
            const value = String(row[property]).toLowerCase();
            columnsIncludes.push(value?.includes(searchString.toLowerCase()));
          }
      }
      return columnsIncludes.includes(true);
    });

    const filteredPaginatedRows = searchFilteredRows.filter(
      (Row, index) => index >= pageStart && index <= pageEnd
    );

    return filteredPaginatedRows;
  }

  function recalculateTotalPages(
    rows: TableType["rows"],
    perPage: number
  ): number {
    return Math.ceil(rows.length / perPage);
  }

  const perPage = 10;
  $: currentPage = 0;
  $: totalPages = recalculateTotalPages(filteredRows, perPage);
  $: filteredRows = filterRows(rows, currentPage, perPage, search);

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage += 1;
    }
  }

  function previousPage() {
    if (currentPage > 0) {
      currentPage -= 1;
    }
  }

  $: headersWithOption = [...headers, { key: "options", empty: true }];
</script>

<div id="table-container">
  {#if !isDesktop}
    <Search size="sm" bind:value={search} placeholder="Pesquisar..." />
    <MobileTable on:rowClick rows={filteredRows} headers={headersWithOption}>
      <span slot="cell" let:row let:cell>
        {#if cell.key === "options"}
          <EditRemoveButtons on:edit on:remove rowId={row.id} />
        {:else if typeof cell.value != "string"}
          <svelte:component this={cell.value} />
        {:else}
          {cell?.value}
        {/if}
      </span>
    </MobileTable>
    <AddButton on:add {isDesktop} />
  {:else if isDesktop}
    <DataTable
      zebra
      rows={filteredRows}
      headers={headersWithOption}
      size="tall"
    >
      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch bind:value={search} />
          <AddButton on:add {isDesktop} />
        </ToolbarContent>
      </Toolbar>
      <span slot="cell" let:row let:cell>
        {#if cell.key === "options"}
          <EditRemoveButtons on:edit on:remove rowId={row.id} />
        {:else if typeof cell.value != "string"}
          <svelte:component this={cell.value} />
        {:else}
          {cell.value}
        {/if}
      </span>
    </DataTable>
  {/if}
  {#if totalPages >= 2}
    <PaginationNav
      page={currentPage}
      total={totalPages}
      shown={5}
      on:click:button--previous={previousPage}
      on:click:button--next={nextPage}
      on:change={(event) => {
        currentPage = event.detail.page;
      }}
    />
  {/if}
</div>

<style lang="scss">
  #table-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    width: 100%;
  }
</style>
