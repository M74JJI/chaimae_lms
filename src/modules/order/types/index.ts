import { Prisma } from "@prisma/client";
import { getOrder } from "../actions/order";

export type OrderFulltType = Prisma.PromiseReturnType<typeof getOrder>;
