import { Request, Response } from "express";

export interface IAuthController {

  authorize(req: Request, res: Response): Promise<void>

  authenticate(req: Request, res: Response): Promise<void>

  register(req: Request, res: Response): Promise<void>

}