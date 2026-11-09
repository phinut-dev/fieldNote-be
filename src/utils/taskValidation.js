const allowedPriorities = ["low", "medium", "high"];

export const validateTaskInput = ({
  title,
  location,
  assigned_to,
  due_date,
  priority,
}) => {
  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof location !== "string" ||
    !location.trim() ||
    assigned_to == null ||
    assigned_to === "" ||
    !due_date
  ) {
    const error = new Error(
      "Title, location, assigned_to, and due_date are required",
    );
    error.status = 400;
    throw error;
  }

  if (!Number.isInteger(Number(assigned_to)) || Number(assigned_to) <= 0) {
    const error = new Error("assigned_to must be a valid user ID");
    error.status = 400;
    throw error;
  }

  if (Number.isNaN(Date.parse(due_date))) {
    const error = new Error("due_date must be a valid date");
    error.status = 400;
    throw error;
  }

  const normalizedPriority = priority ?? "medium";
  if (!allowedPriorities.includes(normalizedPriority)) {
    const error = new Error("Priority must be low, medium, or high");
    error.status = 400;
    throw error;
  }

  return {
    title: title.trim(),
    location: location.trim(),
    assigned_to: Number(assigned_to),
    due_date,
    priority: normalizedPriority,
  };
};
