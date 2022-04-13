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
  import subproductsStore from "$lib/stores/subproducts";
  import { goto } from "$app/navigation";
  import { inputError } from "$lib/helpers/common";
  import {
    TextInput,
    NumberInput,
    Form,
    Button,
    FormGroup,
  } from "carbon-components-svelte";

  export let id: Subproduct["_id"];
  export let operation: SubproductRequest["operation"];

  let name: Subproduct["name"] = "";
  let price: Subproduct["price"] = 0;

  let disableActionButton = false;
  let disabled = operation === "remove";
  let errors: { message: string; path: string }[] = [];

  $: id = Number(id).toFixed();
  $: price = Number.parseFloat(price.toFixed(2));

  if (operation === "remove" || operation === "edit") {
    let subproduct = $subproductsStore.find(({ _id }) => _id === id);
    name = subproduct.name;
    price = subproduct?.price || 0;
  }

  function submit() {
    errors = [];
    disableActionButton = true;

    console.log("[input] " + operation);
    console.log({ _id: id, name, price });
    socket.emit(
      "subproduct",
      {
        operation,
        data: { _id: id, name, price },
      },
      (res) => {
        console.log("[input] response:");
        console.log(res);

        errors = inputError(res);

        if (errors.length === 0) goto("/subproducts");

        if (errors.length > 0) window.scrollTo(0, 0);

        disableActionButton = false;
      }
    );
  }
</script>

<h1>Subproduto</h1>

<Form on:submit={submit}>
  <FormGroup>
    <TextInput
      bind:value={id}
      placeholder="Insira o identificador..."
      labelText="ID"
      required
      {disabled}
      invalidText={errors.find(({ path }) => path === "_id")?.message || ""}
      invalid={errors.some((e) => e.path === "_id")}
    />
  </FormGroup>
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
    <NumberInput
      bind:value={price}
      step={0.1}
      min={0}
      required
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
        goto("/subproducts");
      }}>Cancelar</Button
    >
    <Button
      type="submit"
      disabled={disableActionButton}
      kind={operation === "remove" ? "danger" : "primary"}>{operation}</Button
    >
  </FormGroup>
</Form>
