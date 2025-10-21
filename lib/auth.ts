export const isAuthenticated = (req: Request): boolean => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return false;
  }
  const cookies = cookieHeader.split("; ");
  const sessionCookie = cookies.find((cookie) => cookie.startsWith("Token="));
  return !!sessionCookie;
};
