import { baseApi } from "./baseApi";

export const interviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInterview: builder.mutation({
      query: ({ body, token }) => ({
        url: "/interviews",
        method: "POST",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ["Interview"],
    }),

    getMyInterviews: builder.query({
      query: () => "/interviews/my-interviews",
      providesTags: ["Interview"],
    }),

    getDashboardStats: builder.query({
      query: () => "/interviews/dashboard/stats",
      providesTags: ["Interview"],
    }),

    getInterviewById: builder.query({
      query: (id) => `/interviews/${id}`,
      providesTags: (result, error, id) => [
        { type: "Interview", id },
      ],
    }),

    startInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}/start`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Interview", id },
        "Interview",
      ],
    }),

    cancelInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Interview", id },
        "Interview",
      ],
    }),

    deleteInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Interview"],
    }),
    completeInterview: builder.mutation({
  query: (id) => ({
    url: `/interviews/${id}/complete`,
    method: "PATCH",
  }),
  invalidatesTags: (result, error, id) => [
    { type: "Interview", id },
    "Interview",
    "Session",
  ],
}),
  }),
  
});

export const {
  useCreateInterviewMutation,
  useGetMyInterviewsQuery,
  useGetDashboardStatsQuery,
  useGetInterviewByIdQuery,
  useStartInterviewMutation,
  useCancelInterviewMutation,
  useDeleteInterviewMutation,
  useCompleteInterviewMutation,
} = interviewApi;