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
  import customersStore from "$lib/stores/customers";
  import { goto } from "$app/navigation";
  import { inputError } from "$lib/helpers/common";
  import { TextInput, Form, Button, FormGroup } from "carbon-components-svelte";
  import { phoneAdjust } from "$lib/input/customer";

  export let id: Customer["_id"];
  export let operation: CustomerRequest["operation"];

  let name: Customer["name"] = "";
  let phone: Customer["phone"] = "";
  let cellphone: Customer["cellphone"] = "";
  let email: Customer["email"] = "";

  let disableActionButton = false;
  let disabled = operation === "remove";
  let errors: { message: string; path: string }[] = [];

  $: cellphone = phoneAdjust(cellphone);
  $: phone = phoneAdjust(phone);

  if (operation === "remove" || operation === "edit") {
    let customer = $customersStore.find(({ _id }) => _id === id);
    name = customer.name;
    phone = customer?.phone || "";
    cellphone = customer?.cellphone || "";
    email = customer?.email || "";
  }

  function submit() {
    errors = [];
    disableActionButton = true;
    console.log("[input] " + operation);
    console.log({ _id: id, name, phone, cellphone, email });
    socket.emit(
      "customer",
      {
        operation,
        data: { _id: id, name, phone, cellphone, email },
      },
      (res) => {
        console.log("[input] response:");
        console.log(res);

        errors = inputError(res);

        if (errors.length === 0) {
          if (operation === "add") goto(`/input/sale-add-0-${res._id}`);
          else goto("/customers");
        }

        if (errors.length > 0) window.scrollTo(0, 0);

        disableActionButton = false;
      }
    );
  }
</script>

<h1>Cliente</h1>

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
      type="tel"
      bind:value={cellphone}
      placeholder="Insira o celular..."
      labelText="Celular"
      {disabled}
      invalidText={errors.find(({ path }) => path === "cellphone")?.message ||
        ""}
      invalid={errors.some((e) => e.path === "cellphone")}
    />
  </FormGroup>
  <FormGroup>
    <TextInput
      type="tel"
      bind:value={phone}
      placeholder="Insira o telefone..."
      labelText="Telefone"
      {disabled}
      invalidText={errors.find(({ path }) => path === "phone")?.message || ""}
      invalid={errors.some((e) => e.path === "phone")}
    />
  </FormGroup>
  <FormGroup>
    <TextInput
      type="email"
      bind:value={email}
      placeholder="Insira o email..."
      labelText="Email"
      {disabled}
      invalidText={errors.find(({ path }) => path === "email")?.message || ""}
      invalid={errors.some((e) => e.path === "email")}
    />
  </FormGroup>
  <FormGroup>
    <Button
      kind="secondary"
      on:click={() => {
        goto("/customers");
      }}>Cancelar</Button
    >
    <Button
      type="submit"
      disabled={disableActionButton}
      kind={operation === "remove" ? "danger" : "primary"}>{operation}</Button
    >
  </FormGroup>
</Form>
