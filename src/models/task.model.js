import db from "../config/databases.js";

const taskSelect = `
  SELECT
    tasks.*,
    creator.name AS created_by_name,
    assignee.name AS assigned_to_name
  FROM tasks
  LEFT JOIN users AS creator ON creator.id = tasks.created_by
  LEFT JOIN users AS assignee ON assignee.id = tasks.assigned_to
`;

const dateFields = ["due_date", "completed_at", "created_at", "updated_at"];

const formatTaskDates = (task) => {
  if (!task) return task;

  return {
    ...task,
    ...Object.fromEntries(
      dateFields
        .filter((field) => task[field] != null)
        .map((field) => [
          field,
          task[field] instanceof Date
            ? task[field].toISOString().slice(0, 10)
            : String(task[field]).slice(0, 10),
        ]),
    ),
  };
};

export const insertTask = async (taskData) => {
  try {
    const [result] = await db.query("INSERT INTO tasks SET ?", [taskData]);
    return {
      id: result.insertId,
      ...taskData,
    };
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const findTasks = async () => {
  try {
    const [result] = await db.query(taskSelect);
    return result.map(formatTaskDates);
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const findTasksByAssigneeId = async (userId) => {
  try {
    const [result] = await db.query(
      `${taskSelect} WHERE tasks.assigned_to = ?`,
      [userId],
    );
    return result.map(formatTaskDates);
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const findTaskById = async (id) => {
  try {
    const [result] = await db.query(`${taskSelect} WHERE tasks.id = ?`, [id]);
    return formatTaskDates(result[0]);
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
export const changeStatusTask = async (status, id) => {
  try {
    const [result] = await db.query("UPDATE tasks set status=? WHERE id=?", [
      status,
      id,
    ]);
    return result;
  } catch (err) {
    throw new Error(err.sqlMessage || err.message);
  }
};
