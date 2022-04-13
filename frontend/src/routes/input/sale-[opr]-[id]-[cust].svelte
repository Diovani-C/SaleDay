<script context="module">
  /** @type {import('@sveltejs/kit').Load}*/
  export async function load({ page }) {
    return {
      props: {
        operation: page.params.opr,
        id: page.params.id,
        customerId: page.params.cust,
      },
    };
  }
</script>

<script type="ts">
  import socket from "$lib/services/socket";
  import salesStore from "$lib/stores/sales";
  import salesGroupStore from "$lib/stores/salesGroup";
  import productsStore from "$lib/stores/products";
  import customersStore from "$lib/stores/customers";
  import subproductsStore from "$lib/stores/subproducts";
  import { selectedTag } from "$lib/stores/selectedTags";
  import { goto } from "$app/navigation";
  import { inputError } from "$lib/helpers/common";
  import {
    calculateTotal,
    shouldFilterItem,
    fromCustomersToItems,
    createSaleProducts,
    generateAvailables,
  } from "$lib/input/sale";
  import {
    Form,
    Button,
    FormGroup,
    ComboBox,
    Toggle,
    MultiSelect,
    InlineNotification,
    Tile,
  } from "carbon-components-svelte";

  export let id: Sale["_id"];
  export let operation: SaleRequest["operation"];
  export let customerId: Sale["customerId"];

  let paid: Sale["paid"] = false;
  let products: Sale["products"] = [];
  products = createSaleProducts(products, $salesGroupStore.productsInfo);
  $: total = calculateTotal(products, $salesGroupStore.productsInfo);

  let disableActionButton = false;
  let disabled = operation === "remove";
  let errors: { message: string; path: string }[] = [];

  $: customerItems = fromCustomersToItems($customersStore);

  if (operation === "add") {
    const selecTag = selectedTag.get();
    if (selecTag.productId !== "") {
      products = products.map((product) => {
        if (product.productId === selecTag.productId)
          product.tags.push(selecTag.tag);

        return product;
      });
      selectedTag.clear();
    }
  }

  if (operation === "remove" || operation === "edit") {
    let sale = $salesStore.sales.find(({ _id }) => _id === id);
    customerId = sale.customerId;
    paid = sale?.paid || false;
    total = sale?.total || 0;
    products = createSaleProducts(
      sale?.products || products,
      $salesGroupStore.productsInfo
    ).map((product) => {
      return { ...product };
    });
  }

  function submit() {
    errors = [];
    disableActionButton = true;

    console.log("[input] " + operation);
    console.log({
      operation,
      data: {
        salesGroupId: $salesStore.salesGroupId,
        sale: { _id: id, customerId, products, paid, total },
      },
    });
    socket.emit(
      "sale",
      {
        operation,
        data: {
          salesGroupId: $salesStore.salesGroupId,
          sale: { _id: id, customerId, products, paid, total },
        },
      },
      (res) => {
        console.log("[input] response:");
        console.log(res);

        errors = inputError(res);

        if (errors.length === 0) goto("/customers");

        if (errors.length > 0) window.scrollTo(0, 0);

        disableActionButton = false;
      }
    );
  }
</script>

<h1>Venda</h1>
{#if errors.length > 0}
  {#each errors as { message, path }}
    <InlineNotification hideCloseButton title={path} subtitle={message} />
  {/each}
{/if}

<h2>Total: R${total}</h2>

<Form on:submit={submit}>
  <FormGroup>
    <ComboBox
      placeholder="Selecione o cliente..."
      label="Cliente"
      items={customerItems}
      selectedIndex={$customersStore.findIndex(({ _id }) => _id === customerId)}
      on:select={({ detail }) => {
        customerId = detail.selectedId;
      }}
      required
      {shouldFilterItem}
      {disabled}
      invalidText={errors.find(({ path }) => path === "customerId")?.message ||
        ""}
      invalid={errors.some((e) => e.path === "customerId")}
    />
  </FormGroup>

  <FormGroup>
    <Toggle
      bind:toggled={paid}
      labelA="Não"
      labelB="Sim"
      labelText="Pago"
      {disabled}
    />
  </FormGroup>

  {#each products as { productId, tags }, index}
    <Tile light={index % 2 !== 0}>
      <FormGroup
        messageText={errors.find(({ path }) => path === "products")?.message ||
          ""}
        invalid={errors.some((e) => e.path === "products")}
        message={errors.some((e) => e.path === "products")}
      >
        <MultiSelect
          light={index % 2 === 0}
          {disabled}
          selectedIds={tags.map(String)}
          items={generateAvailables(
            $salesGroupStore.productsInfo.find(
              (prodInf) => prodInf.productId === productId
            )?.subproductTags,
            productId,
            $salesStore.sales,
            $subproductsStore,
            operation,
            id
          )}
          on:select={({ detail }) => {
            tags = detail.selectedIds.map(Number);
          }}
          titleText={$productsStore.find(({ _id }) => _id === productId)?.name}
          label="Selecione as etiquetas..."
        />
      </FormGroup>
    </Tile>
  {/each}

  <FormGroup>
    <Button
      kind="secondary"
      on:click={() => {
        goto("/sales");
      }}>Cancelar</Button
    >
    <Button
      type="submit"
      disabled={disableActionButton}
      kind={operation === "remove" ? "danger" : "primary"}>{operation}</Button
    >
  </FormGroup>
</Form>
