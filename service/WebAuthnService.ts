import axios from "axios";
import { API_URL } from "../api";

export const startRegistration = async (username: String) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/webauthn/register/start`,
      { username },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error starting registration", error);
  }
};

export const startAuthentication = async (username: String) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/webauthn/authenticate/start`,
      { username },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error starting authentication", error);
  }
};

export const finishRegistration = async (credential: any) => {
  console.log(credential);
  try {
    const response = await axios.post(
      `${API_URL}/auth/webauthn/register/finish`,
      credential,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error finishing registration", error);
  }
};

export const finishAuthentication = async (assertion: any) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/webauthn/authenticate/finish`,
      assertion,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error finishing authentication", error);
  }
};
