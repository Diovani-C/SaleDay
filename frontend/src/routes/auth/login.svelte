<script type="ts">
  import {
    Form,
    PasswordInput,
    TextInput,
    FormGroup,
    Button,
  } from "carbon-components-svelte";

  let username: string;
  let password: string;

  let messageText: string = "";
  let invalid: boolean = false;

  async function login() {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        invalid = false;
        console.log("[login] success");
        location.reload();
      } else {
        invalid = true;
        const body = await res.json();
        messageText = JSON.parse(body.message);
        console.log(`[login] ${messageText}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

<h1>Login</h1>

<Form on:submit={login}>
  <FormGroup>
    <TextInput
      {invalid}
      bind:value={username}
      placeholder="usuário..."
      labelText="Usuário"
      invalidText={messageText}
    />
  </FormGroup>
  <FormGroup>
    <PasswordInput
      {invalid}
      bind:value={password}
      invalidText={messageText}
      placeholder="senha..."
      labelText="Senha"
    />
  </FormGroup>

  <FormGroup>
    <Button type="submit">Login</Button>
  </FormGroup>
</Form>
