import { createPublisher } from "$lib/helpers/common";

export const getSalesGroupById = createPublisher<SalesGroup["_id"]>();
export const getSalesGroupsByDate =
  createPublisher<{ from: string; to: string }>();
export const getAll = createPublisher<SalesGroup["_id"]>();
