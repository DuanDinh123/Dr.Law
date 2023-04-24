// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import user from '@src/views/apps/user/store'
import role from '@src/views/apps/role/store'
import patient from '@src/views/apps/patient/store'
import supplie from '@src/views/apps/supplie/store'
import tip from '@src/views/apps/tip/store'
import supplier from '@src/views/apps/supplier/store'
import medical from '@src/views/apps/medical/store'
import salary from '@src/views/apps/salary/store'
import advice from '@src/views/apps/advice/store'
import groupSupplie from '@src/views/apps/group-supplie/store'
import categoryTip from '@src/views/apps/category-tip/store'
import prescription from '@src/views/apps/prescription/store'
import bank from '@src/views/apps/bank/store'
import status from '@src/views/apps/status/store'
import dashboard from '@src/views/dashboard/store'
import tipByUser from '@src/views/apps/tip-by-user/store'
import medicalHistory from '@src/views/apps/medical-history/store'
import root from '@src/views/apps/root/store'
import potential from '@src/views/apps/potential/store'

const rootReducer = {
  dashboard,
  auth,
  user,
  navbar,
  layout,
  role,
  patient,
  supplie,
  supplier,
  groupSupplie,
  categoryTip,
  medical,
  advice,
  prescription,
  status,
  tip,
  salary,
  bank,
  tipByUser,
  medicalHistory,
  root,
  potential
}

export default rootReducer
