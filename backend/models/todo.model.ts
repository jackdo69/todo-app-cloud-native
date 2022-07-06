export enum Status {
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}
export interface ITodo {
  type: string;
  id: string;
  content: string;
  status: Status;
  created: string;
  updated: string;
}
