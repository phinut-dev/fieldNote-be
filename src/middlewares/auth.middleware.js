import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      const error = new Error("Authentication required");
      error.status = 401;
      throw error;
    }
    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      const error = new Error(
        "You do not have permission to access this resource",
      );

      error.status = 403;
      return next(error);
    }
    console.log(req.user, allowedRoles);

    next();
  };
};
