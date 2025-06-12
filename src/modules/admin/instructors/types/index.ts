import { Prisma } from "@prisma/client";
import { getAllStudentsAction } from "../actions/students.actions";

export type StudentType = Prisma.PromiseReturnType<
  typeof getAllStudentsAction
>[0];
