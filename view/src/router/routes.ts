import type { RouteRecordRaw } from "vue-router"
import MainLayout from "layouts/MainLayout.vue"
import InvolvementSummaryForm from "pages/InvolvementSummaryForm.vue"
import LearnMore from "pages/LearnMore.vue"
import ErrorNotFound from "pages/ErrorNotFound.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        component: InvolvementSummaryForm
      },
      {
        path: "savoirplus",
        component: LearnMore
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: ErrorNotFound
  }
]

export default routes
