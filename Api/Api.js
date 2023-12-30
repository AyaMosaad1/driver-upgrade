import Config from "../Api/Config";
import axios from "axios";
import axiosRetry from "axios-retry";
import OwnStorage from "./StorageController";
class Api {
  constructor() {
    this.localdata = new OwnStorage();
    this.apiUrl = Config.BaseUrl;
    let service = axios.create({
      headers: {
        csrf: "token",
        accept: "application/json",
      },
    });

    const retryDelay = (retryNumber = 0) => {
      const seconds = Math.pow(2, retryNumber) * 1000;
      const randomMs = 1000 * Math.random();
      return seconds + randomMs;
    };

    axiosRetry(service, {
      retries: 2,
      retryDelay,
      // retry on Network Error & 5xx responses
      retryCondition: axiosRetry.isRetryableError,
    });

    service.interceptors.response.use(this._handleSuccess, this._handleError);
    this.service = service;
  }

  _handleSuccess(response) {
    return response;
  }

  _handleError = (error) => {
    switch (error.response && error.response.status) {
      case 401:
        // toast.error('Unauthorized, check console for details');
        break;
      case 404:
        // toast.error('Route not found, check console for details');
        break;
      default:
        // toast.error('Server/Unknown error occurred, check console for details');
        break;
    }
    return Promise.reject(error);
  };

  _redirectTo = (document, path) => {
    document.location = path;
  };

  /**
   * Method to handle api requests.
   * @param {string} type
   * @param {string} path
   * @param {Object} [payload]
   */
  async request(type, path, payload, bearerToken) {
    type = type.toLowerCase();

    //Check if this is dev URL request
    // let isTest = false;

    // let userName;
    //If this is login request
    // if (path == "public/auth") {
    //   userName = payload.username;
    // } else {
    //   userName = await Storage.getData("username");
    // }

    if (path.includes("http") || path.includes("https")) {
      if (path.startsWith("/")) path = path.substr(path.indexOf("/") + 1);
    } else {
      path = this.apiUrl + path;
    }

    //Load token from local storage if not available in request
    if (typeof bearerToken === "undefined") {
      bearerToken = await this.localdata.GetLoginPref();
    }

    if (bearerToken) {
      this.service.defaults.headers.Authorization = `Bearer ${bearerToken}`;
    }

    if (type === "get") {
      return this.service.get(path).then((response) => response.data);
    }

    return this.service
      .request({
        method: type,
        url: path,
        responseType: "json",
        data: payload,
      })
      .then((response) => response.data);
  }
}
// {api call}
// let path = "profile";
// Api.request("patch", path, profiledata)
//   .then((response) => {
//     console.log("updated response status", response);

//     setshowloaderM(false);

//     console.log("updated response", response.data);
//     dispatch(DriverDetails(response.data));
//     Toast.show(response.message);

//     navigation.navigate("BottomTabNavigation", { screen: "Profile" });
//   })
//   .catch((error) => {
//     setshowloaderM(false);

//     console.log("error", error);
//     for (const [key, value] of Object.entries(
//       error.response.data.errors
//     )) {
//       console.log(`${key}: ${value}`);
//       Toast.show(`${key}: ${value}`);
//     }
//   });
// {api call}

export default new Api();
