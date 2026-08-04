import { baseApi } from "./baseApi";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInterviewSessions: builder.query({
      query: (interviewId) =>
        `/sessions/interview/${interviewId}`,

      providesTags: (result, error, interviewId) => [
        { type: "Session", id: interviewId },
      ],
    }),

    joinInterview: builder.mutation({
      query: (interviewId) => ({
        url: `/sessions/join/${interviewId}`,
        method: "POST",
      }),

      invalidatesTags: ["Session"],
    }),

    getSessionById: builder.query({
      query: (sessionId) =>
        `/sessions/${sessionId}`,

      providesTags: (result, error, sessionId) => [
        { type: "Session", id: sessionId },
      ],
    }),

    submitInterview: builder.mutation({
      query: ({ sessionId, answers }) => ({
        url: `/sessions/${sessionId}/submit`,
        method: "POST",
        body: {
          answers,
        },
      }),

      invalidatesTags: (result, error, { sessionId }) => [
        { type: "Session", id: sessionId },
        { type: "Result", id: sessionId },
      ],
    }),

    expireSession: builder.mutation({
      query: (sessionId) => ({
        url: `/sessions/${sessionId}/expire`,
        method: "PATCH",
      }),

      invalidatesTags: (result, error, sessionId) => [
        { type: "Session", id: sessionId },
      ],
    }),

    getCandidateResult: builder.query({
      query: (sessionId) =>
        `/sessions/result/${sessionId}`,

      providesTags: (result, error, sessionId) => [
        { type: "Result", id: sessionId },
      ],
    }),
    getMySessions: builder.query({
  query: () => "/sessions/my-sessions",

  providesTags: ["Session"],
}),
  }),
});

export const {
  useGetInterviewSessionsQuery,
  useJoinInterviewMutation,
  useGetSessionByIdQuery,
  useSubmitInterviewMutation,
  useExpireSessionMutation,
  useGetCandidateResultQuery,
  useGetMySessionsQuery,
} = sessionApi;