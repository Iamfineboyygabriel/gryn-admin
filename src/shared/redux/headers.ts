export default function authHeader() {
  const user = sessionStorage.getItem("userData");
  const userId = sessionStorage.getItem("userId");

  if (user) {
    return {
      Authorization: "Bearer " + user,
      ...(userId && { "user-id": userId }),
    };
  } else {
    return {};
  }
}

