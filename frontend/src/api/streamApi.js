import { baseApi } from "./baseApi";

export const streamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStreamToken: builder.query({
      query: () => "/stream/token",
    }),

    getInterviewRoom: builder.query({
      query: (interviewId) =>
        `/stream/room/${interviewId}`,
    }),
  }),
});

export const {
  useGetStreamTokenQuery,
  useGetInterviewRoomQuery,
} = streamApi;