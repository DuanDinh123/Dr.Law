import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))

const DashboardRoutes = [
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />
  },
]

export default DashboardRoutes
