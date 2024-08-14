import { NextFunction, Request, Response } from "express";

export const contentType = (_: Request, res: Response, next: NextFunction) => {
  res.type("json");
  next();
};
