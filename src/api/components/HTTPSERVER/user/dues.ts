import { getImage } from "../../../../services/ImageSaveRetrive";
import { curSession } from "../../../../services/sqlfunctoin";
import { databaseID } from "../../../../services/variables";
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
async function sqlQuery(query: string) {
  const db = mysql.createConnection(databaseID);
  try {
    await new Promise((resolve, reject) => {
      db.connect((err: any) => {
        if (err) reject(err);
        resolve("done");
        console.log("Connected to database");
      });
    });

    const value: [] = await new Promise((resolve, reject) => {
      db.query(query, (err: any, result: any) => {
        if (err) reject(err);
        resolve(result);
      });
    });
    db.end();
    console.log("conection end");
    return value;
  } catch (err) {
    console.error("Error:", err);
    db.end();
    console.log("conection end");
    return [];
  }
}

interface FeeStructure {
  admno: string;
  apr: number | null;
  may: number | null;
  jun: number | null;
  jul: number | null;
  aug: number | null;
  sep: number | null;
  oct: number | null;
  nov: number | null;
  dece: number | null;
  jan: number | null;
  feb: number | null;
  mar: number | null;
  billdues: number;
  session: string | null;
}
interface stdFeeMaster {
  admno: string;
  monthfee: number;
  transportfee: number;
  hostelfee: number;
  session: string;
  hostel: string;
  transport: string;
}
interface Dues {
  name: string;
  fees: number;
}
class StdDuesCal {
  private transfee: any[] = [];
  private hostelfee: any[] = [];
  private monthfee: any[] = [];
  private monthdues: Dues[] = [];
  private transport: string = "NO";
  private hostel: string = "NO";
  private basicdetail: {
    name: string;
    fname: string;
    fmob: string;
    class: string;
    roll: string;
    section: string;
    session: string;
    hostel: string;
    transport: string;
  } = {
    name: "",
    fname: "",
    fmob: "",
    class: "",
    roll: "",
    section: "",
    session: "",
    hostel: "",
    transport: "",
  };
  private transdues: Dues[] = [];
  private hosteldues: Dues[] = [];
  private fine: {
    fine: number;
    transfine: number;
    hostelfine: number;
  } = {
    fine: 0,
    transfine: 0,
    hostelfine: 0,
  };
  private tbl_admduesamt: number = 0;
  private tbl_itemduesamt: number = 0;
  private tbl_sessionfee: number = 0;
  private lday: number = 0;
  private stdfeemaster: stdFeeMaster = {
    admno: "",
    monthfee: 0,
    transportfee: 0,
    hostelfee: 0,
    session: "",
    hostel: "",
    transport: "",
  };
  private billdues = 0;
  constructor(private admno: string) {}
  private nextSession(): string {
    const date = new Date();
    const year = date.getFullYear() + 1;
    return `${year}-${new Date().getFullYear() + 2}`;
  }
  public curSession(): string {
    const date = new Date();
    const year = date.getFullYear() + 1;
    return `${new Date().getFullYear()}-${year}`;
  }
  private curMonthIndex = () => {
    const mnum = new Date().getMonth();
    const busnessMonth = [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
      "jan",
      "feb",
      "mar",
    ];
    const month = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const index = busnessMonth.find((m: string) => month[mnum] === m);
    return busnessMonth.indexOf(`${index}`);
  };
  private getMonthIndex = (index: string) => {
    const busnessMonth = [
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
      "jan",
      "feb",
      "mar",
    ];
    if (index === "dece") index = "dec";
    return busnessMonth.indexOf(`${index}`);
  };
  public async setAdmDuesAmt() {
    const tempdata: { duesamt: number }[] = await sqlQuery(
      `SELECT duesamt FROM tbl_admissionfeepmt WHERE admno="${
        this.admno
      }" AND session in("${this.curSession()}","${this.nextSession()}") AND duesstatus='NP';`
    );
    if (tempdata.length > 0) this.tbl_admduesamt = tempdata[0].duesamt;
  }
  public async setItemDuesAmt() {
    const query = `SELECT dues
        FROM tbl_itemreceipt 
        WHERE admno="${this.admno}" 
        AND srno = (SELECT MAX(srno) FROM tbl_itemreceipt WHERE admno="${this.admno}");`;
    const tempdata: any = await sqlQuery(query);
    if (tempdata.length > 0) this.tbl_itemduesamt = tempdata[0].dues;
    // console.log(query, [tempdata]);
  }
  public async setSessionFee() {
    const tempdata: any = await sqlQuery(
      `SELECT dues FROM tbl_sessionfee WHERE admno="${
        this.admno
      }" AND session="${this.curSession()}" AND duesstatus="NP";`
    );
    if (tempdata.length > 0) this.tbl_sessionfee = tempdata[0].sessionfee;
  }
  public async setStdFee() {
    const tempdata = await sqlQuery(
      `SELECT * FROM tbl_stdfeemaster where admno="${
        this.admno
      }" AND session="${this.curSession()}";`
    );
    // console.log(tempdata);
    if (tempdata.length > 0) this.stdfeemaster = tempdata[0];
    // console.log(tempdata);
  }
  public async setBasicDetail() {
    const q = `select admno,name,fname,fmob,class,roll,section,session,transport,hostel from tbl_admission where admno = "${
      this.admno
    }" and session = "${this.curSession()}" and active=1;`;

    const classs: any[] = await sqlQuery(q);
    console.log(classs);
    this.basicdetail = classs[0];
  }
  public async setFine() {
    const query = `SELECT * FROM tbl_monthlyfeesetup WHERE class="${this.basicdetail.class}";`;
    const result: {
      fine: number;
      transfine: number;
      hostelfine: number;
    } = (await sqlQuery(query))[0];
    if (result.hostelfine !== undefined) {
      this.fine.hostelfine = result.hostelfine;
    }
    this.fine.transfine = result.transfine;
    this.fine.fine = result.fine;
    // console.log(this.fine);
  }

  public async setLday() {
    const tempdata: { lday: number }[] = await sqlQuery(
      "SELECT * FROM `tbl_latefinedate`"
    );
    if (tempdata.length > 0) this.lday = tempdata[0].lday;
  }
  public async setMonthFee() {
    this.monthfee = [];
    const query = `SELECT * FROM tbl_monthfee  WHERE admno="${
      this.admno
    }" AND session="${this.curSession()}";`;
    const data: FeeStructure[] = await sqlQuery(query);
    // console.log("setMontFee :", data, this.curSession());
    if (data.length > 0) {
      for (let [keys, value] of Object.entries(data[0])) {
        if (keys.length < 5) {
          if (keys === "dece") keys = "dec";
          this.monthfee.push([keys, value]);
        }
      }
      this.billdues = data[0].billdues;
    }
  }
  public async setTransFee() {
    this.transfee = [];
    const query = `SELECT * FROM tbl_transportfee  WHERE admno="${
      this.admno
    }" AND session="${this.curSession()}";`;
    const data: any[] = await sqlQuery(query);

    if (data.length > 0 && this.basicdetail.transport === "YES") {
      for (let [keys, value] of Object.entries(data[0])) {
        if (keys.length < 5) {
          if (keys === "dece") keys = "dec";
          this.transfee.push([keys, value]);
        }
      }
    }
  }
  public async setHostelFee() {
    this.hostelfee = [];
    const query = `SELECT * FROM tbl_hostelfee  WHERE admno="${
      this.admno
    }" AND session="${this.curSession()}";`;
    const data: any[] = await sqlQuery(query);
    if (data.length > 0 && this.basicdetail.hostel === "YES") {
      for (let [keys, value] of Object.entries(data[0])) {
        if (keys.length < 5) {
          if (keys === "dece") keys = "dec";
          this.hostelfee.push([keys, value]);
        }
      }
    }
  }
  public setTransDues() {
    this.transdues = [];
    const day = new Date().getDate();
    if (this.basicdetail.transport === "YES") {
      for (let v of this.transfee) {
        if (this.getMonthIndex(v[0]) <= this.curMonthIndex() && v[1] === 0) {
          let fine =
            day < this.lday && this.getMonthIndex(v[0]) === this.curMonthIndex()
              ? 0
              : this.fine.transfine;
          this.transdues.push({
            name: v[0],
            fees: this.stdfeemaster.transportfee + fine,
          });
        }
      }
    }

    // console.log("transDues :", this.transdues);
  }
  public setHostelDues() {
    this.hosteldues = [];
    const day = new Date().getDate();
    if (this.basicdetail.hostel === "YES") {
      for (let v of this.hostelfee) {
        if (this.getMonthIndex(v[0]) <= this.curMonthIndex() && v[1] === 0) {
          let fine =
            day < this.lday && this.getMonthIndex(v[0]) === this.curMonthIndex()
              ? 0
              : this.fine.hostelfine;
          this.hosteldues.push({
            name: v[0],
            fees: this.stdfeemaster.hostelfee + fine,
          });
        }
      }
    }
  }
  public setMonthDues() {
    const day = new Date().getDate();
    this.monthdues = [];
    for (let v of this.monthfee) {
      if (this.getMonthIndex(v[0]) <= this.curMonthIndex() && v[1] === 0) {
        let fine =
          day < this.lday && this.getMonthIndex(v[0]) === this.curMonthIndex()
            ? 0
            : this.fine.fine;
        this.monthdues.push({
          name: v[0],
          fees: this.stdfeemaster.monthfee + fine,
        });
      }
    }
  }
  public async getAllDues() {
    await this.setBasicDetail();
    await this.setLday();
    await this.setStdFee();
    await this.setFine();
    await this.setMonthFee();
    if (this.basicdetail.transport === "YES") await this.setTransFee();
    if (this.basicdetail.hostel === "YES") await this.setHostelFee();
    await this.setAdmDuesAmt();
    await this.setItemDuesAmt();
    await this.setSessionFee();
    this.setMonthDues();
    if (this.basicdetail.transport === "YES") this.setTransDues();
    if (this.basicdetail.hostel === "YES") this.setHostelDues();
    // console.log("hostel :", this.hosteldues);
    const obj = {
      admno: this.admno,
      stdfeemaster: this.stdfeemaster,
      billdues: this.billdues,
      basic: this.basicdetail,
      total: 0,
      image: getImage(`${this.admno}.jpg`),
      fine: {
        fine: this.fine.fine === undefined ? 0 : this.fine.fine,
        transfine: this.fine.transfine === undefined ? 0 : this.fine.transfine,
        hostelfine:
          this.fine.hostelfine === undefined ? 0 : this.fine.hostelfine,
      },
      fee: {
        month: this.monthfee === undefined ? 0 : this.monthfee,
        trans: this.transfee === undefined ? 0 : this.transfee,
        hostel: this.hostelfee === undefined ? 0 : this.hostelfee,
      },
      dues: {
        month: this.monthdues === undefined ? [] : this.monthdues,
        trans: this.transdues === undefined ? [] : this.transdues,
        hostel: this.hosteldues === undefined ? [] : this.hosteldues,
      },
      amt: {
        amount: this.tbl_admduesamt === undefined ? 0 : this.tbl_admduesamt,
        item: this.tbl_itemduesamt === undefined ? 0 : this.tbl_itemduesamt,
        session: this.tbl_sessionfee === undefined ? 0 : this.tbl_sessionfee,
      },
    };
    // const tfine = obj.fine.fine + obj.fine.transfine + obj.fine.hostelfine;
    const amt = obj.amt.amount + obj.amt.item + obj.amt.session;
    const mdues = this.monthdues.reduce((a: any, b: any) => {
      return a + b.fees;
    }, 0);

    const tdues = this.transdues.reduce((a: any, b: any) => {
      return this.basicdetail.transport === "YES" ? a + b.fees : 0;
    }, 0);
    const hdues = this.hosteldues.reduce((a: any, b: any) => {
      return this.basicdetail.hostel === "YES" ? a + b.fees : 0;
    }, 0);
    const total = mdues + tdues + hdues + amt;
    obj.total = total;
    if (parseInt(obj.basic.roll) === 5)
      console.log([
        obj,
        obj.dues.month,
        obj.dues.trans,
        obj.dues.hostel,
        this.transfee,
        this.monthfee,
        this.hostelfee,
      ]);
    return obj;
  }
}
export const dueslist = async (req: any, res: any) => {
  const clas = req.query.class;
  // const section = req.query.section;
  console.log(req.query);

  const query = `select admno from tbl_admission where class="${clas}"  AND session="${curSession()}" AND active=1 ORDER BY roll ASC;`;
  const data = await sqlQuery(query);
  const arrays = await Promise.all(
    data.map((val: any) => new StdDuesCal(val.admno).getAllDues())
  );
  const marray = arrays.filter((x) => x.total > 0);
  console.log("send sucess fully");
  res.status(200).send({ data: marray });
};
