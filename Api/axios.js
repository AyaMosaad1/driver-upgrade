import { View, Text } from "react-native";
import React from "react";
import axios from "axios";
export const instance = axios.create({
  baseURL: "https://api.shorex.green/api/v1/",
});
