import React from "react";
import { instance } from "../Api/axios";

class ApiController {
  constructor() {}
  Login = async (username, password) => {
    // console.log("1phoneNumbr:", username);
    // console.log("2password:", password);
    var response = await instance.post("public/auth", {
      username: username,
      password: password,
    });
    return response;
  };
  getProfile = async (token) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.get("profile", {
      headers: { Authorization: AuthStr },
    });
    return response;
  };
  getproductitems = async (token) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.get("products?limit=9999999", {
      headers: { Authorization: AuthStr },
    });
    return response;
  };

  ResetPassword = async (data) => {
    var response = await instance.post("public/reset-password", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
      },
    });
    return response;
  };
  ForgetPassword = async (userEmail) => {
    var response = await instance.post("public/forget-password", {
      email: userEmail,
    });
    return response;
  };
  ForgetPasswordPhone = async (userPhone) => {
    var response = await instance.post("public/forget-password", {
      phone: userPhone,
    });
    return response;
  };
  VerifyOTP = async (pin) => {
    var response = await instance.post("public/otp-verify", {
      otp: pin,
    });
    return response;
  };
  updateprofile = async (token, email, mobile, bankname, IBAN) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post(
      "profile",
      {
        email: email,
        mobile: mobile,
        bank_name: bankname,
        iban: IBAN,
        _method: "PATCH",
      },
      {
        headers: {
          Authorization: AuthStr,
        },
      }
    );
    return response;
  };
  RecycleRequest = async (data, token) => {
    const AuthStr = "Bearer ".concat(token);

    var response = await instance.post("recycles", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  sendFCM = async (token, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post("notification-device", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  transfer = async (token, id, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post("recycles/" + id + "/transfer", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  falserequest = async (token, id, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post("recycles/" + id + "/false", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  Ongoing = async (token, id, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post("recycles/" + id + "/onGoing", data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  ReceiveItems = async (token, path, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post(path, data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };

  DeliverItems = async (token, path, data) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post(path, data, {
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    return response;
  };
  UploadPicture = async (token, file) => {
    const AuthStr = "Bearer ".concat(token);

    let res = await fetch("https://api.shorex.green/api/v1/avatar", {
      method: "post",
      body: file,
      headers: {
        "Content-Type": "multipart/form-data; ",
        Authorization: AuthStr,
      },
    });
    let responseJson = await res.json();
    console.log("response fetch:", responseJson);
  };

  Getprivacypolicy = async (token) => {
    var response = await instance.get("public/privacy-policy");

    return response;
  };
  GetTermsandConditions = async (token) => {
    var response = await instance.get("public/terms-and-conditions");

    return response;
  };
  ChangePassword = async (token, confpass, newpass) => {
    const AuthStr = "Bearer ".concat(token);
    var response = await instance.post(
      "update-password",
      {
        password: newpass,
        password_confirmation: confpass,
        _method: "PATCH",
      },
      { headers: { Authorization: AuthStr } }
    );
    return response;
  };
}
export default ApiController;
