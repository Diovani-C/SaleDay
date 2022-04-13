import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getAll } from "$lib/helpers/getter";

function createProducts() {
  const { subscribe, update } = writable<Product[]>([]);

  return {
    subscribe,
    set: (setproduct: Product[]) => {
      update((products) => {
        products = setproduct;
        return products;
      });
    },
    add: (product: Product) => {
      update((products) => {
        products.push(product);
        return products;
      });
    },
    edit: (newproduct: Product) => {
      update((products) => {
        products = products.map((product) =>
          product._id !== newproduct._id ? product : newproduct
        );
        return products;
      });
    },
    remove: (remproduct: Product) => {
      update((products) => {
        products = products.map((product) =>
          product._id !== remproduct._id ? product : remproduct
        );
        return products;
      });
    },
  };
}

const products = createProducts();

socket.on("product", (response: ProductRequest) => {
  console.log("[productsStore] event:");
  console.log(response);
  products[response.operation](response.data);
});

getAll.subscribe((_) => {
  socket.emit(
    "product",
    { operation: "get", data: {} },
    (response: Product[]) => {
      console.log("[productsStore] get:");
      console.log(response);
      if (response as Product[]) {
        products.set(response);
      }
    }
  );
});

export default { subscribe: products.subscribe };
