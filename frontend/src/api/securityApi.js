import { baseApi } from "./baseApi";

export const securityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSecurityEvent: builder.mutation({
      query: ({ sessionId, event }) => ({
        url: `/security-events/${sessionId}`,
        method: "POST",
        body: event,
      }),

      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Session", id: sessionId },
        "Security",
      ],
    }),
  }),
});

export const { useCreateSecurityEventMutation } = securityApi;