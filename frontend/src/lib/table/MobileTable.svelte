<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let headers: TableType["headers"] = [];
  export let rows: TableType["rows"] = [];

  $: headerKeys = headers.map(({ key }) => key);
  $: rowsWithCells = rows.map((row) => ({
    ...row,
    cells: headerKeys.map((key) => ({ key, value: row[key] })),
  }));
</script>

<div id="mobile-table">
  <div id="mobile-rows">
    {#each rowsWithCells as row}
      <div
        id="mobile-row"
        on:click={() => {
          dispatch("rowClick", { id: row.id });
        }}
      >
        {#each row.cells as cell, j}
          <div id="mobile-column">
            {#if headers[j].empty}
              <div id="mobile-cell">
                <slot name="cell" {row} {cell}>
                  {cell?.value || ""}
                </slot>
              </div>
            {:else}
              <div id="mobile-head">
                <h2>{headers[j]?.value}:</h2>
              </div>
              <div id="mobile-cell">
                <slot name="cell" {row} {cell}>
                  {cell?.value || ""}
                </slot>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  #mobile-table {
    text-align: center;
    color: #161616;
    width: 100%;
  }

  #mobile-rows {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    width: 100%;
  }

  #mobile-rows:last-child {
    border-bottom: 2px solid #8d8d8d;
  }

  #mobile-row {
    width: 100%;
    display: flex;
    background: #f4f4f4;
    flex-direction: column;
    align-content: center;
    align-items: center;
    border: 2px solid #8d8d8d;
    border-bottom: none;
    border-radius: 0.125rem;
    padding: 0.5rem;
    :last-child {
      border-bottom: none;
    }
  }

  #mobile-row:nth-child(even) {
    background: #fff;
  }

  #mobile-column {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding: 0.5rem;
    overflow: hidden;
    white-space: nowrap;
    width: 80%;
  }
  #mobile-head {
    font-weight: 700;
    text-overflow: ellipsis;
    h2 {
      font-size: 1rem;
    }
  }

  #mobile-cell {
    padding-top: 0.5rem;
    text-overflow: ellipsis;
    color: #525252;
  }
</style>
