<script type="ts">
  import salesGroupStore from "$lib/stores/salesGroup";
  import subproductsStore from "$lib/stores/subproducts";
  import productsStore from "$lib/stores/products";
  import MobileTable from "$lib/table/MobileTable.svelte";
  import {
    Select,
    SelectItem,
    InlineNotification,
    Form,
    FormGroup,
  } from "carbon-components-svelte";
  import { selectedTag } from "$lib/stores/selectedTags";
  import { goto } from "$app/navigation";

  function fromProductsInfoToStatus(
    productsInfo: SalesGroup["productsInfo"],
    products: Product[],
    filter: "all" | "sold" | "available"
  ): TableType[] {
    try {
      const headers = [
        { key: "tag", value: "Etiqueta" },
        { key: "subproduct", value: "Subproduto" },
        { key: "weight", value: "Peso Kg" },
        { key: "price", value: "Preço R$" },
        { key: "barcode", value: "Código de barras" },
        { key: "sold", value: "Vendido" },
      ];

      const filteredProdsInf: SalesGroup["productsInfo"] = productsInfo.map(
        ({ productId, max, subproductTags }) => {
          if (filter === "all") return { productId, max, subproductTags };

          let newSubproductTags = [];

          if (filter === "available")
            newSubproductTags = subproductTags.filter(({ sold }) => !sold);

          if (filter === "sold")
            newSubproductTags = subproductTags.filter(({ sold }) => sold);

          return { productId, max, subproductTags: newSubproductTags };
        }
      );

      return products.map((prod) => {
        const currentProInf = filteredProdsInf.find(
          ({ productId }) => prod._id === productId
        );

        const rows =
          currentProInf?.subproductTags.map(
            ({ tag, price, barcode, sold, subproductId }) => {
              const currentSubproduct = $subproductsStore.find(
                ({ _id }) => _id === subproductId
              );

              return {
                id: tag.toString(),
                tag: tag.toString(),
                subproduct: currentSubproduct?.name || "",
                weight: (price / currentSubproduct?.price).toFixed(2) || "",
                price: price.toString(),
                barcode,
                sold: sold ? "Sim" : "Não",
              };
            }
          ) || [];

        return { headers, rows };
      });
    } catch (err) {
      console.error(err);
    }
  }

  $: prodStatus = fromProductsInfoToStatus(
    $salesGroupStore.productsInfo,
    $productsStore,
    filterProds
  );

  let selectedProduct = "";
  let filterProds: "all" | "sold" | "available" = "all";
</script>

{#if $salesGroupStore.productsInfo.length !== 0}
  <Form>
    <FormGroup>
      <Select bind:selected={selectedProduct}>
        {#each $productsStore as { name }, index}
          <SelectItem value={index.toString()} text={name} />
        {/each}
      </Select>

      <Select bind:selected={filterProds}>
        <SelectItem value="all" text="Todos" />
        <SelectItem value="sold" text="Vendidos" />
        <SelectItem value="available" text="Disponíveis" />
      </Select>
    </FormGroup>
  </Form>

  <MobileTable
    on:rowClick={({ detail }) => {
      const currentProductId = $productsStore[Number(selectedProduct)]._id;

      const currentProInf = $salesGroupStore.productsInfo.find(
        ({ productId }) => currentProductId === productId
      );

      if (
        !currentProInf.subproductTags.find(
          ({ tag }) => tag.toString() === detail.id
        ).sold
      ) {
        selectedTag.set({
          productId: currentProInf.productId,
          tag: Number(detail.id),
        });
        goto("/customers");
      }
    }}
    headers={prodStatus[Number(selectedProduct)].headers}
    rows={prodStatus[Number(selectedProduct)].rows}
  />
{:else}
  <InlineNotification
    hideCloseButton
    title="Aviso:"
    kind="warning"
    subtitle="Nenhum grupo de vendas selecionado!"
  />
{/if}
