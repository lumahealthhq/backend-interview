import type { Request, Response } from "express";

import { Controller } from "@/presentation/protocols";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      ...(req.query || {}),
    };
    const { body, statusCode } = await controller.handle(request);

    if (statusCode >= 200 && statusCode <= 299) {
      return res.status(statusCode).json(body);
    }

    res.status(statusCode).json({
      error: body.name,
      message: body.message,
    });
  };
};
