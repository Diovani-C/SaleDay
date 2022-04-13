<script context="module">
  /** @type {import('@sveltejs/kit').Load}*/
  export async function load({ page }) {
    return {
      props: {
        operation: page.params.opr,
        id: page.params.id,
      },
    };
  }
</script>

<script type="ts">
  import socket from "$lib/services/socket";
  import productsStore from "$lib/stores/products";
  import subproductsStore from "$lib/stores/subproducts";
  import { goto } from "$app/navigation";
  import { inputError } from "$lib/helpers/common";
  import {
    TextInput,
    NumberInput,
    Form,
    FormGroup,
    Button,
    Select,
    SelectItem,
    InlineNotification,
    Tile,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import allSalesGroups from "$lib/stores/allSalesGroups";
  import {
    updateProdInf,
    extractPriceFromBarcode,
    extractSubproductIdFromBarcode,
  } from "$lib/input/salesGroup";

  export let id: SalesGroup["_id"];
  export let operation: SalesGroupRequest["operation"];

  let createdAt: SalesGroup["createdAt"] = "";
  let productsInfo: SalesGroup["productsInfo"] = updateProdInf(
    [],
    [],
    $productsStore
  );
  let oldProductsInfo = [];

  let disableActionButton = false;
  let disabled = operation === "remove";
  let errors: { message: string; path: string }[] = [];

  let selectedTag: number[] = new Array($productsStore.length).fill(1);

  onMount(() => {
    if (createdAt === "") createdAt = dayjs().format("DD/MM/YYYY HH:mm");
  });

  if (operation === "remove" || operation === "edit") {
    const currentSalesGroup = $allSalesGroups.find(({ _id }) => _id === id);

    createdAt = dayjs(currentSalesGroup.createdAt).format("DD/MM/YYYY HH:mm");

    oldProductsInfo = currentSalesGroup.productsInfo;

    productsInfo = updateProdInf(
      currentSalesGroup.productsInfo,
      currentSalesGroup.productsInfo.map((prod) => {
        return { ...prod };
      }),
      $productsStore
    );
  }

  function submit() {
    errors = [];
    disableActionButton = true;
    console.log("[input] " + operation);
    console.log({ _id: id, productsInfo, createdAt });
    socket.emit(
      "salesGroup",
      {
        operation,
        data: { _id: id, productsInfo, createdAt },
      },
      (res) => {
        console.log("[input] response:");
        console.log(res);

        errors = inputError(res);

        if (errors.length === 0) goto("/");

        if (errors.length > 0) window.scrollTo(0, 0);

        disableActionButton = false;
      }
    );
  }
</script>

<h1>Grupo de vendas</h1>

<Form>
  {#if errors.length > 0}
    {#each errors as { message, path }}
      <InlineNotification hideCloseButton title={path} subtitle={message} />
    {/each}
  {/if}

  {#if id !== "0"}
    <h2>ID: {id}</h2>
  {/if}
  <h2>Criado em: {createdAt}</h2>

  {#each productsInfo as { max, productId, subproductTags }, index}
    <Tile light={index % 2 !== 0}>
      <h3>
        {$productsStore.find(({ _id }) => _id === productId).name}
      </h3>
      <FormGroup>
        <NumberInput
          light={index % 2 === 0}
          label="Máximo"
          bind:value={max}
          min={0}
          {disabled}
          on:change={() => {
            productsInfo = updateProdInf(
              oldProductsInfo,
              productsInfo,
              $productsStore
            );
          }}
        />
      </FormGroup>
      <FormGroup>
        <Select
          light={index % 2 === 0}
          labelText="Etiquetas"
          {disabled}
          on:change={({ detail }) => {
            selectedTag[index] = Number(detail);
          }}
          selected={selectedTag[index].toString()}
        >
          {#each subproductTags as { tag }}
            <SelectItem value={tag.toString()} text={tag.toString()} />
          {/each}
        </Select>
      </FormGroup>

      {#each subproductTags as { barcode, price, tag, subproductId }}
        {#if tag === selectedTag[index]}
          <h3>Etiqueta:{tag}</h3>
          {#if subproductId}
            <h4>
              Subproduto: {$subproductsStore.find(
                ({ _id }) => _id === subproductId
              )?.name || "Não encontrado"}
            </h4>
          {/if}
          <FormGroup
            messageText={errors.find(({ path }) => path === "productsInfo")
              ?.message || ""}
            invalid={errors.some((e) => e.path === "productsInfo")}
            message={errors.some((e) => e.path === "productsInfo")}
          >
            <TextInput
              light={index % 2 === 0}
              labelText="Código de barras"
              placeholder="Insira o código de barras..."
              {disabled}
              bind:value={barcode}
              on:change={() => {
                if (barcode.length === 13) {
                  price = extractPriceFromBarcode(barcode);
                  subproductId = extractSubproductIdFromBarcode(barcode);
                } else {
                  subproductId = "";
                }
              }}
            />
            <NumberInput
              light={index % 2 === 0}
              step={0.01}
              placeholder="Insira o preço R$..."
              label="Preço"
              on:input={() => {
                price = Number.parseFloat(price.toFixed(2));
              }}
              {disabled}
              min={0}
              bind:value={price}
            />
          </FormGroup>
        {/if}
      {/each}
    </Tile>
  {/each}

  <FormGroup>
    <Button
      kind="secondary"
      on:click={() => {
        goto("/");
      }}>Cancelar</Button
    >
    <Button
      on:click={submit}
      type="submit"
      disabled={disableActionButton}
      kind={operation === "remove" ? "danger" : "primary"}>{operation}</Button
    >
  </FormGroup>
</Form>
