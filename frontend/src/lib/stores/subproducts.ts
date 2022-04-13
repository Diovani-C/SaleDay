import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getAll } from "$lib/helpers/getter";

function createsubproducts() {
  const { subscribe, update } = writable<Subproduct[]>([]);

  return {
    subscribe,
    set: (setSubproduct: Subproduct[]) => {
      update(() => setSubproduct);
    },
    add: (subproduct: Subproduct) => {
      update((subproducts) => {
        subproducts.push(subproduct);
        return subproducts;
      });
    },
    edit: (newSubproduct: Subproduct) => {
      update((subproducts) => {
        subproducts = subproducts.map((subproduct) =>
          subproduct._id !== newSubproduct._id ? subproduct : newSubproduct
        );
        return subproducts;
      });
    },
    remove: (remSubproduct: Subproduct) => {
      update((subproducts) => {
        subproducts = subproducts.map((subproduct) =>
          subproduct._id !== remSubproduct._id ? subproduct : remSubproduct
        );
        return subproducts;
      });
    },
  };
}

const subproducts = createsubproducts();

getAll.subscribe((_) => {
  socket.emit(
    "subproduct",
    { operation: "get", data: {} },
    (response: Subproduct[]) => {
      console.log("[subproductsStore] get:");
      console.log(response);
      if (response as Subproduct[]) {
        subproducts.set(response);
      }
    }
  );
});

socket.on("subproduct", (response: SubproductRequest) => {
  console.log("[subproductsStore] event:");
  console.log(response);
  subproducts[response.operation](response.data);
});

export default { subscribe: subproducts.subscribe };
