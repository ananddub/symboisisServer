import { sqlQueryStatus } from "./sqlfunctoin";

export interface sdb {
  admno: string;
  socketid: string;
  class?: string;
  sec?: string;
}
export const dbActive: sdb[] = [];

export function removeDup(arr: sdb[], admno: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].admno === admno) {
      arr.splice(i, 1);
      break;
    }
  }
}
