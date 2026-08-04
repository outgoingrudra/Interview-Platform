import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { getFreshClerkToken } from "./clerkToken";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const token = await getFreshClerkToken();

  const request =
    typeof args === "string"
      ? {
          url: args,
          headers: {},
        }
      : {
          ...args,
          headers: {
            ...(args.headers || {}),
          },
        };

  if (token) {
    request.headers.authorization = `Bearer ${token}`;
  }

  return rawBaseQuery(request, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,

  tagTypes: [
    "Interview",
    "Session",
    "Result",
    "Security",
  ],

  endpoints: () => ({}),
});