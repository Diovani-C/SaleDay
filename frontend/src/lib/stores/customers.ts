import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getAll } from "$lib/helpers/getter";

function createCustomers() {
  const { subscribe, update } = writable<Customer[]>([]);

  return {
    subscribe,
    set: (setCustomer: Customer[]) => {
      update((customers) => {
        customers = setCustomer;
        return customers;
      });
    },
    add: (customer: Customer) => {
      update((customers) => {
        customers.push(customer);
        return customers;
      });
    },
    edit: (newCustomer: Customer) => {
      update((customers) => {
        customers = customers.map((customer) =>
          customer._id !== newCustomer._id ? customer : newCustomer
        );
        return customers;
      });
    },
    remove: (remCustomer: Customer) => {
      update((customers) => {
        customers = customers.map((customer) =>
          customer._id !== remCustomer._id ? customer : remCustomer
        );
        return customers;
      });
    },
  };
}

const customers = createCustomers();

socket.on("customer", (response: CustomerRequest) => {
  console.log("[customerStore] event:");
  console.log(response);
  customers[response.operation](response.data);
});

getAll.subscribe((_) => {
  socket.emit(
    "customer",
    { operation: "get", data: {} },
    (response: Customer[]) => {
      console.log("[customerStore] get:");
      console.log(response);
      if (response as Customer[]) {
        customers.set(response);
      }
    }
  );
});

export default { subscribe: customers.subscribe };
