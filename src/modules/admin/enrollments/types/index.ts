import { Prisma } from "@prisma/client";
import { getAllEnrollmentsAction } from "../actions/instructors.actions";

export type EnrollmentType = Prisma.PromiseReturnType<
  typeof getAllEnrollmentsAction
>[0];
