import { Request } from "express";

import { adaptRoute } from "../../../src/main/adapters";
import type {
  Controller,
  HttpResponse,
} from "../../../src/presentation/protocols";

const makeResponse = () => {
  class ResponseStub {
    statusCode?: number;
    body?: any;

    json(body: any) {
      this.body = body;
      return this;
    }

    status(code: number) {
      this.statusCode = code;
      return this;
    }
  }

  return new ResponseStub();
};

const makeControllerSpy = () => {
  class AnyControllerSpy implements Controller {
    input?: any;
    response?: HttpResponse;

    async handle(request: any): Promise<HttpResponse> {
      this.input = request;

      return (
        this.response || {
          statusCode: 200,
          body: {},
        }
      );
    }
  }

  return new AnyControllerSpy();
};

const makeSut = () => {
  const controllerSpy = makeControllerSpy();

  const sut = adaptRoute(controllerSpy);

  return { sut, controllerSpy } as const;
};

describe("adaptRoute", () => {
  it("Should call controller.handle", async () => {
    const { sut, controllerSpy } = makeSut();

    const actualSpy = jest.spyOn(controllerSpy, "handle");

    await sut({} as any, makeResponse() as any);

    expect(actualSpy).toHaveBeenCalled();
  });
  it("Should compose request from req.params and req.body and call controller with it", async () => {
    const { sut, controllerSpy } = makeSut();

    const request = {
      params: { a: "1", b: "2" },
      body: { c: 3, d: 5 },
    } as unknown as Request;

    await sut(request, makeResponse() as any);

    expect(controllerSpy.input).toEqual({
      ...request.body,
      ...request.params,
    });
  });
});
