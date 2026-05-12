import Cookies from "js-cookie";

const DEVICE_COOKIE = "device_id";

export const getDeviceId = () => {
  let deviceId = Cookies.get(DEVICE_COOKIE);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    Cookies.set(DEVICE_COOKIE, deviceId, {
      expires: 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return deviceId;
};
