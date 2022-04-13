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
  import { goto } from "$app/navigation";
  import { inputError } from "$lib/helpers/common";
  import {
    TextInput,
    NumberInput,
    Form,
    Button,
    FormGroup,
  } from "carbon-components-svelte";

  export let id: Product["_id"];
  export let operation: ProductRequest["operation"];

  let name: Product["name"] = "";
  let barcode: Product["barcode"] = "";
  let price: Product["price"] = 0;

  let disableActionButton = false;
  let disabled = operation === "remove";
  let errors: { message: string; path: string }[] = [];

  $: price = Number.parseFloat(price.toFixed(2));

  if (operation === "remove" || operation === "edit") {
    let product = $productsStore.find(({ _id }) => _id === id);
    name = product.name;
    barcode = product?.barcode || "";
    price = product?.price || 0;
  }

  function submit() {
    errors = [];
    disableActionButton = true;

    console.log("[input] " + operation);
    console.log({ _id: id, name, barcode, price });
    socket.emit(
      "product",
      {
        operation,
        data: { _id: id, name, barcode, price },
      },
      (res) => {
        console.log("[input] response:");
        console.log(res);

        errors = inputError(res);

        if (errors.length === 0) goto("/products");

        if (errors.length > 0) window.scrollTo(0, 0);

        disableActionButton = false;
      }
    );
  }
</script>

<h1>Produto</h1>

<Form on:submit={submit}>
  <FormGroup>
    <TextInput
      bind:value={name}
      placeholder="Insira o nome..."
      labelText="Nome"
      required
      {disabled}
      invalidText={errors.find(({ path }) => path === "name")?.message || ""}
      invalid={errors.some((e) => e.path === "name")}
    />
  </FormGroup>
  <FormGroup>
    <TextInput
      bind:value={barcode}
      placeholder="Insira o código de barras..."
      labelText="Código de barras"
      {disabled}
      invalidText={errors.find(({ path }) => path === "barcode")?.message || ""}
      invalid={errors.some((e) => e.path === "barcode")}
    />
  </FormGroup>
  <FormGroup>
    <NumberInput
      bind:value={price}
      step={0.1}
      min={0}
      placeholder="Insira o preço R$..."
      label="Preço"
      {disabled}
      invalidText={errors.find(({ path }) => path === "price")?.message || ""}
      invalid={errors.some((e) => e.path === "price")}
    />
  </FormGroup>
  <FormGroup>
    <Button
      kind="secondary"
      on:click={() => {
        goto("/products");
      }}>Cancelar</Button
    >
    <Button
      type="submit"
      disabled={disableActionButton}
      kind={operation === "remove" ? "danger" : "primary"}>{operation}</Button
    >
  </FormGroup>
</Form>
