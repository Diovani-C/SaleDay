<script type="ts">
  import {
    Form,
    PasswordInput,
    TextInput,
    FormGroup,
    Button,
    InlineNotification,
  } from "carbon-components-svelte";

  let messageText: string = "";
  let invalid: boolean = false;

  let username: string;
  let password: string;

  async function register() {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        invalid = false;
        console.log("[register] success");
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

<h1>Register</h1>

{#if invalid}
  <InlineNotification
    kind="error"
    title="Error:"
    subtitle={messageText}
    hideCloseButton
  />
{/if}

<Form on:submit={register}>
  <FormGroup>
    <TextInput
      bind:value={username}
      placeholder="username"
      labelText="Username"
    />
  </FormGroup>
  <FormGroup>
    <PasswordInput
      bind:value={password}
      placeholder="password"
      labelText="Password"
    />
  </FormGroup>
  <FormGroup>
    <Button type="submit">Register</Button>
  </FormGroup>
</Form>
