import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getSalesGroupById } from "$lib/helpers/getter";

function createSales() {
  const { subscribe, update } = writable<{
    sales: Sale[];
    salesGroupId: SalesGroup["_id"];
  }>({
    salesGroupId: "",
    sales: [],
  });

  return {
    subscribe,
    set: (newSales: SaleResponse["data"]) => {
      update(() => newSales);
    },
    add: (sales: SaleResponse) => {
      update((salesGroup) => {
        if (sales.data.salesGroupId === salesGroup.salesGroupId)
          return sales.data;
        return salesGroup;
      });
    },
    edit: (sales: SaleResponse) => {
      update((salesGroup) => {
        if (sales.data.salesGroupId === salesGroup.salesGroupId)
          return sales.data;
        return salesGroup;
      });
    },
    remove: (sales: SaleResponse) => {
      update((salesGroup) => {
        if (sales.data.salesGroupId === salesGroup.salesGroupId)
          return sales.data;
        return salesGroup;
      });
    },
  };
}

const sales = createSales();

socket.on("sale", (response: SaleResponse) => {
  console.log("[salesStore] event:");
  console.log(response);
  sales[response.operation](response);
});

function onSalesGroupChange(salesGroupId: SalesGroup["_id"]) {
  if (salesGroupId === "") {
    sales.set({ salesGroupId: "", sales: [] });
    return;
  }

  socket.emit(
    "sale",
    { operation: "get", data: { salesGroupId } },
    (response: SaleResponse["data"]) => {
      console.log("[salesStore] get:");
      console.log(response);
      if (response as SaleResponse["data"]) {
        sales.set(response);
      }
    }
  );
}

getSalesGroupById.subscribe(onSalesGroupChange);

export default { subscribe: sales.subscribe };
