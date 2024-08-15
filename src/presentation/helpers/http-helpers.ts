import { ServerError } from "@/presentation/errors";
import { HttpResponse } from "@/presentation/protocols";

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
});

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error),
});
