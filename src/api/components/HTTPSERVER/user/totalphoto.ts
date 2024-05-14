import { imageExist } from "../../../../services/ImageSaveRetrive";
import {
  curSession,
  sqlQueryStatus,
  sqlQueryp,
  sqlQuerys,
} from "../../../../services/sqlfunctoin";

interface photoRecord {
  total: number;
  photoleft: number;
  photodone: number;
}
interface stdPhoto {
  section: string;
  detail: photoRecord;
}

interface classPhoto {
  NUR: any;
  LKG: any;
  UKG: any;
  I: any;
  II: any;
  III: any;
  IV: any;
  V: any;
  VI: any;
  VII: any;
  VIII: any;
  IX: any;
  X: any;
  XI: any;
  XII: any;
}

function calulatePhotse(data: any) {
  const obj: any = {};
  const total: {
    total: number;
    photoleft: number;
    photodone: number;
    totalSec: string[];
  } = {
    total: 0,
    photoleft: 0,
    photodone: 0,
    totalSec: [],
  };
  // console.log(data);
  for (let x of data) {
    if (obj[x.section] === undefined) {
      obj[x.section] = {
        total: 0,
        photoleft: 0,
        photodone: 0,
      };
      total.totalSec.push(x.section);
    }
    if (imageExist(`${x.admno}.jpg`)) {
      obj[x.section].photodone += 1;
      total.photodone += 1;
      total.total += 1;
      obj[x.section].total += 1;
    } else {
      total.photoleft += 1;
      total.total += 1;
      obj[x.section].photoleft += 1;
      obj[x.section].total += 1;
    }
  }

  obj["total"] = total;
  return obj;
}

class storeResult {
  constructor(
    private data: any = {
      total: 0,
      tphotoleft: 0,
      tphotodone: 0,
    }
  ) {}
  public saveClass(clas: string, obj: any): void {
    this.data[clas] = obj;
    this.data.total += obj.total.total;
    this.data.tphotoleft += obj.total.photoleft;
    this.data.tphotodone += obj.total.photodone;
  }
  public getdata(): any {
    return this.data;
  }
}
//
export async function getTotalPhoto(req: any, res: any) {
  const classarr = [
    "NUR",
    "LKG",
    "UKG",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];
  const classvalue: any = {
    NUR: [],
    LKG: [],
    UKG: [],
    I: [],
    II: [],
    III: [],
    IV: [],
    V: [],
    VI: [],
    VII: [],
    VIII: [],
    IX: [],
    X: [],
    XI: [],
    XII: [],
  };
  const stdPhoto = new storeResult();
  let total = 0;
  for (let x of classarr) {
    const query = `SELECT admno,section  FROM tbl_admission WHERE class="${x}" AND session="${curSession()}" AND active=1 ORDER BY section ASC;`;

    classvalue[x] = calulatePhotse(await sqlQueryp(query));
    stdPhoto.saveClass(x, classvalue[x]);
  }
  console.log(stdPhoto.getdata());
  res.status(200).send(stdPhoto.getdata());
}

// getTotalPhoto();
