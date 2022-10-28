export function buildResponse<T extends Record<string, unknown>>(
  status: "success",
  message?: string,
  data?: T
): { status: "success"; message?: string; data: T };
export function buildResponse(
  status: "fail",
  message: string
): { status: "fail"; message: string };
export function buildResponse(
  status: "error",
  message: string
): { status: "error"; message: string };
export function buildResponse<T>(
  status: string,
  message?: string,
  data?: T
): { status: string; message?: string; data?: T } {
  const res = { status };
  Object.assign(res, message && { message });
  Object.assign(res, data && { data });
  return res;
}
