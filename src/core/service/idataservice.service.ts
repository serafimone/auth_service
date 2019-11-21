import { DeleteResult } from "typeorm";

export interface IDataService<T> {
  
  put(value: T): Promise<T>
  
  get(id: number): Promise<T | undefined>
  
  update(value: T): Promise<T>
  
  delete(id: number): Promise<DeleteResult>

}