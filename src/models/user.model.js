import db from "../config/databases.js";

export const findUserByEmail = async (email) => {
  try {
    const [result] = await db.query(
      "select id, name, email, password, status, role from users where email = ?",
      [email],
    );
    return result[0] || null;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};

export const findUserById = async (id, includePass) => {
  try {
    const column = includePass
      ? "id, name, email, password, status, role"
      : "id, name, email, status, role";
    const [result] = await db.query(
      `select ${column} from users where id = ?`,
      [id],
    );
    return result[0] || null;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};

export const findAllUsers = async () => {
  try {
    const [result] = await db.query(
      "select id, name, email, status, role from users",
    );
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const findWorkerAssignable = async () => {
  try {
    const [result] = await db.query(
      "select id, name, email, status, role from users where role = ? and status = ?",
      ["field_worker", "active"],
    );
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const addUser = async (user) => {
  try {
    console.log(user, "user");
    const [result] = await db.query(
      "insert into users (name, email, password, role) values (?, ?, ?, ?)",
      [user.name, user.email, user.password, user.role],
    );
    console.log(db);
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};

export const changemMyPass = async (id, newPass) => {
  try {
    const [result] = await db.query(
      "update users set password = ? where id = ?",
      [newPass, id],
    );
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const changeStatus = async (id, status) => {
  try {
    const [result] = await db.query(
      "update users set status = ? where id = ?",
      [status, id],
    );
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
