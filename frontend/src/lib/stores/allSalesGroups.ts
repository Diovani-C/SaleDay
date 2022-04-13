import { writable } from "svelte/store";
import socket from "$lib/services/socket";
import { getSalesGroupsByDate, getAll } from "$lib/helpers/getter";

function createAllSalesGroup() {
  const { subscribe, update } = writable<SalesGroup[]>([]);

  return {
    subscribe,
    set: (salesGroups: SalesGroup[]) => {
      update(() => salesGroups);
    },
    add: (salesGroup: SalesGroup) => {
      update((allSalesGroups) => {
        allSalesGroups.push(salesGroup);

        return allSalesGroups;
      });
    },
    edit: (salesGroup: SalesGroup) => {
      update((allSalesGroups) => {
        allSalesGroups = allSalesGroups.map((group) =>
          group._id !== salesGroup._id ? group : salesGroup
        );
        return allSalesGroups;
      });
    },
    remove: (salesGroup: SalesGroup) => {
      update((allSalesGroups) => {
        allSalesGroups = allSalesGroups.filter(
          (group) => group._id !== salesGroup._id
        );

        return allSalesGroups;
      });
    },
  };
}

const allSalesGroupStore = createAllSalesGroup();

getAll.subscribe((_) => {
  socket.emit(
    "getSalesGroups",
    { operation: "getNewests", data: {} },
    (response: SalesGroup[]) => {
      console.log("[allSalesStores] getNewests");
      console.log(response);
      if (response as SalesGroup[]) {
        allSalesGroupStore.set(response);
      }
    }
  );
});

socket.on("salesGroup", (response: SalesGroupRequest) => {
  console.log("[allSalesGroupStore] event:");
  console.log(response);
  allSalesGroupStore[response.operation](response.data);
});

getSalesGroupsByDate.subscribe((data: { from: string; to: string }) => {
  socket.emit(
    "getSalesGroups",
    { operation: "getByDate", data },
    (response: SalesGroup[]) => {
      console.log("[allSalesStores] getByDate");
      console.log(response);
      if (response as SalesGroup[]) {
        allSalesGroupStore.set(response);
      }
    }
  );
});

export default { subscribe: allSalesGroupStore.subscribe };
