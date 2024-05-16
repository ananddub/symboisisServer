const mysql = require("mysql");

const databaseID = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "colleage",
};
export async function sqlQueryUpdate(query) {
  const db = mysql.createConnection(databaseID);
  console.log("updated process :", query);
  try {
    await new Promise((resolve, reject) => {
      db.connect((err) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve("done");
        console.log("Connected to database");
      });
    });
    const value = await new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        try {
          if (err) {
            console.log(err);
            reject(false);
          }
          resolve(true);
        } catch (err) {
          console.log(err);
          resolve(false);
        }
      });
    });
    db.end();
    // console.log("conection end");
    // console.log("result of sql :", value);
    return { status: value };
  } catch (err) {
    console.error("Error:", err);
    db.end();
    console.log("conection end");
    return { status: false };
  }
}

export async function sqlQuery(query) {
  const db = mysql.createConnection(databaseID);

  try {
    await new Promise((resolve, reject) => {
      db.connect((err) => {
        if (err) reject(err);
        resolve("done");
        console.log("Connected to database");
      });
    });

    const value = await new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
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
    return { status: "error" };
  }
}
