export async function sendResponse(res, status, message, data = null) {
  const result = {
    status,
    message,
    data,
  };
  return res.status(status).json(result);
}
