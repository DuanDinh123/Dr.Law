// ** React Imports
import { lazy } from 'react'

const UserList = lazy(() => import('../../views/apps/user/list'))
const UserCreate = lazy(() => import('../../views/apps/user/create'))

const RoleList = lazy(() => import('../../views/apps/role/list'))
const RoleCreate = lazy(() => import('../../views/apps/role/create'))

const PatientList = lazy(() => import('../../views/apps/patient/list'))
const PatientCreate = lazy(() => import('../../views/apps/patient/create'))

const AdviceList = lazy(() => import('../../views/apps/advice/list'))
const AdviceCreate = lazy(() => import('../../views/apps/advice/create'))

const GroupSupplieList = lazy(() => import('../../views/apps/group-supplie/list'))
const GroupSupplieCreate = lazy(() => import('../../views/apps/group-supplie/create'))

const SupplierList = lazy(() => import('../../views/apps/supplier/list'))
const SupplierCreate = lazy(() => import('../../views/apps/supplier/create'))

const PrescriptionList = lazy(() => import('../../views/apps/prescription/list'))
const PrescriptionCreate = lazy(() => import('../../views/apps/prescription/create'))

const SupplieList = lazy(() => import('../../views/apps/supplie/list'))
const SupplieCreate = lazy(() => import('../../views/apps/supplie/create'))

const MedicalCreate = lazy(() => import('../../views/apps/medical/create'))
const MedicalEdit = lazy(() => import('../../views/apps/medical/edit'))
const MedicalDetail = lazy(() => import('../../views/apps/medical/detail'))

const StatusCreate = lazy(() => import('../../views/apps/status/create'))
const StatusList = lazy(() => import('../../views/apps/status/list'))

const ReportEmployeeTurnover = lazy(() => import('../../views/dashboard/employee-turnover/list'))
const CategoryTipList = lazy(() => import('../../views/apps/category-tip/list'))
const CategoryTipCreate = lazy(() => import('../../views/apps/category-tip/create'))

const TipList = lazy(() => import('../../views/apps/tip/list'))
const TipCreate = lazy(() => import('../../views/apps/tip/create'))

const PaymentCreate = lazy(() => import('../../views/apps/payment/create'))

const TipByUser = lazy(() => import('../../views/apps/tip-by-user/list'))

const MedicalHistoryList = lazy(() => import('../../views/apps/medical-history/list'))
const MedicalHistoryCreate = lazy(() => import('../../views/apps/medical-history/create'))

const RootList = lazy(() => import('../../views/apps/root/list'))
const RootCreate = lazy(() => import('../../views/apps/root/create'))

const PotentialList = lazy(() => import('../../views/apps/potential/list'))

const AppRoutes = [
  {
    element: <UserList />,
    path: '/apps/user/list'
  },
  {
    element: <UserCreate />,
    path: '/apps/user/create'
  },
  {
    element: <UserCreate />,
    path: '/apps/user/edit/:id'
  },
  {
    element: <RoleList />,
    path: '/apps/role/list'
  },
  {
    element: <RoleCreate />,
    path: '/apps/role/create'
  },
  {
    element: <RoleCreate />,
    path: '/apps/role/edit/:id'
  },
  {
    element: <PatientList />,
    path: '/apps/patient/list'
  },
  {
    element: <PatientCreate />,
    path: '/apps/patient/create'
  },
  {
    element: <PatientCreate />,
    path: '/apps/patient/edit/:id'
  },
  {
    element: <AdviceCreate />,
    path: '/apps/advice/create'
  },
  {
    element: <AdviceList />,
    path: '/apps/advice/list'
  },
  {
    element: <AdviceCreate />,
    path: '/apps/advice/edit/:id'
  },
  {
    element: <PrescriptionList />,
    path: '/apps/prescription/list'
  },
  {
    element: <PrescriptionCreate />,
    path: '/apps/prescription/create'
  },
  {
    element: <PrescriptionCreate />,
    path: '/apps/prescription/edit/:id'
  },
  {
    element: <SupplieList />,
    path: '/apps/supplie/list'
  },
  {
    element: <SupplieCreate />,
    path: '/apps/supplie/edit/:id'
  },
  {
    element: <SupplieCreate />,
    path: '/apps/supplie/create'
  },
  {
    element: <MedicalCreate />,
    path: '/apps/medical/create/:id'
  },
  {
    element: <MedicalEdit />,
    path: '/apps/medical/edit/:id'
  },
  {
    element: <MedicalDetail />,
    path: '/apps/medical/detail/:id'
  },
  {
    element: <GroupSupplieCreate />,
    path: '/apps/group-supplie/create'
  },
  {
    element: <GroupSupplieList />,
    path: '/apps/group-supplie/list'
  },
  {
    element: <GroupSupplieCreate />,
    path: '/apps/group-supplie/edit/:id'
  },
  {
    element: <SupplierCreate />,
    path: '/apps/supplier/create'
  },
  {
    element: <SupplierList />,
    path: '/apps/supplier/list'
  },
  {
    element: <SupplierCreate />,
    path: '/apps/supplier/edit/:id',
  },
  {
    element: <StatusList />,
    path: '/apps/status/list'
  },
  {
    element: <StatusCreate />,
    path: '/apps/status/create'
  },
  {
    element: <StatusCreate />,
    path: '/apps/status/edit/:id'
  },
  {
    element: <PaymentCreate />,
    path: '/apps/payment/create/:id'
  },
  {
    element: <ReportEmployeeTurnover />,
    path: '/apps/report/employee-turnover/list'
  }, {
    element: <CategoryTipCreate />,
    path: '/apps/category-tip/create'
  },
  {
    element: <CategoryTipList />,
    path: '/apps/category-tip/list'
  },
  {
    element: <CategoryTipCreate />,
    path: '/apps/category-tip/edit/:id'
  },
  {
    element: <TipCreate />,
    path: '/apps/tip/create'
  },
  {
    element: <TipList />,
    path: '/apps/tip/list'
  },
  {
    element: <TipCreate />,
    path: '/apps/tip/edit/:id'
  },
  {
    element: <TipByUser />,
    path: '/apps/tip-by-user'
  },
  {
    element: <MedicalHistoryList />,
    path: '/apps/medical-history/list'
  },
  {
    element: <MedicalHistoryCreate />,
    path: '/apps/medical-history/create'
  },
  {
    element: <MedicalHistoryCreate />,
    path: '/apps/medical-history/edit/:id'
  },
  {
    element: <RootList />,
    path: '/apps/root/list'
  },
  {
    element: <RootCreate />,
    path: '/apps/root/create'
  },
  {
    element: <RootCreate />,
    path: '/apps/root/edit/:id'
  },
  {
    element: <PotentialList />,
    path: '/apps/potential/list'
  },
]

export default AppRoutes
