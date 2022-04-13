import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getSalesGroupById } from "$lib/helpers/getter";

function createSalesGroup() {
  const { subscribe, update } = writable<SalesGroupRequest["data"]>({
    _id: "",
    createdAt: "",
    productsInfo: [],
  });

  return {
    subscribe,
    set: (salesGroup: SalesGroupRequest["data"]) => {
      update(() => salesGroup);
    },
    add: (newsalesGroup: SalesGroupRequest["data"]) => {
      update((salesGroup) => {
        if (salesGroup._id === "")
          getSalesGroupById.notifyAll(newsalesGroup._id);

        return salesGroup;
      });
    },

    edit: (newsalesGroup: SalesGroupRequest["data"]) => {
      update((salesGroup) => {
        if (salesGroup._id === newsalesGroup._id)
          salesGroup.productsInfo = newsalesGroup.productsInfo;
        return salesGroup;
      });
    },
    remove: (oldsalesGroup: SalesGroupRequest["data"]) => {
      update((salesGroup) => {
        if (salesGroup._id === oldsalesGroup._id)
          getSalesGroupById.notifyAll("");

        return salesGroup;
      });
    },
  };
}

const salesGroup = createSalesGroup();

socket.on("salesGroup", (response: SalesGroupRequest) => {
  console.log("[salesGroupStore] event:");
  console.log(response);
  salesGroup[response.operation](response.data);
});

function onSalesGroupChange(salesGroupId: SalesGroup["_id"]) {
  if (salesGroupId === "") {
    salesGroup.set({ _id: "", createdAt: "", productsInfo: [] });
    return;
  }

  socket.emit(
    "salesGroup",
    { operation: "get", data: { _id: salesGroupId } },
    (response: SalesGroupRequest["data"]) => {
      console.log("[salesGroupStore] get:");
      console.log(response);
      if (response as SalesGroupRequest["data"]) {
        salesGroup.set(response);
      }
    }
  );
}

getSalesGroupById.subscribe(onSalesGroupChange);

export default { subscribe: salesGroup.subscribe };
