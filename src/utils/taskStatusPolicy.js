const validStatuses = [
  "draft",
  "assigned",
  "on progress",
  "submitted",
  "completed",
  "cancelled",
];

export const assertTaskStatusUpdateAllowed = (
  task,
  status,
  userId,
  userRole,
) => {
  if (!validStatuses.includes(status)) {
    const error = new Error("Invalid task status");
    error.status = 400;
    throw error;
  }

  if (userRole === "field_worker") {
    if (Number(task.assigned_to) !== Number(userId)) {
      const error = new Error("This task is not assigned to you");
      error.status = 403;
      throw error;
    }

    if (!["on progress", "submitted"].includes(status)) {
      const error = new Error(
        "Worker can only set status to on progress or submitted",
      );
      error.status = 403;
      throw error;
    }

    return;
  }

  if (!["admin", "supervisor"].includes(userRole)) {
    const error = new Error("You cannot update task status");
    error.status = 403;
    throw error;
  }
};
