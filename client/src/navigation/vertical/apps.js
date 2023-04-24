// ** Icons Import
import { Users, Speaker, Truck, Sun, PieChart, Circle, Shuffle, User, Shield, File, List, Package, Bookmark, Sliders, Settings, AlertCircle, Briefcase, Archive, ExternalLink } from 'react-feather'

export default [
  {
    header: 'Quản lý phòng khám'
  },
  {
    id: 'users',
    title: 'Tài khoản',
    icon: <User size={20} />,
    navLink: '/apps/user/list'
  },
  {
    id: 'patient',
    title: 'Hồ sơ bệnh nhân',
    icon: <File size={20} />,
    children: [
      {
        id: 'list',
        title: 'Bệnh nhân',
        icon: <List size={12} />,
        navLink: '/apps/patient/list'
      }
    ]
  },
  {
    id: 'tip',
    title: 'Thủ thuật',
    icon: <Sun size={20} />,
    children: [
      {
        id: 'tip',
        title: 'Danh sách thủ thuật',
        icon: <List size={20} />,
        navLink: '/apps/tip/list'
      },
      {
        id: 'category-tip',
        title: 'Nhóm thủ thuật',
        icon: <Briefcase size={20} />,
        navLink: '/apps/category-tip/list'
      },
      {
        id: "tipByUser",
        title: 'Thủ thuật theo nhân viên',
        icon: <Shuffle size={20} />,
        navLink: '/apps/tip-by-user'
      }
    ]
  },
  {
    id: "template",
    title: 'Mẫu',
    icon: <Package size={20} />,
    children: [
      {
        id: 'advice',
        title: 'Lời dặn',
        icon: <Speaker size={20} />,
        navLink: '/apps/advice/list'
      },
      {
        id: 'prescription',
        title: 'Đơn thuốc',
        icon: <Bookmark size={20} />,
        navLink: '/apps/prescription/list'
      }
    ]
  },
  {
    id: 'supplie',
    title: 'Vật tư',
    icon: <Sliders size={20} />,
    children: [
      {
        id: 'supplie',
        title: 'Danh sách vật tư',
        icon: <List size={20} />,
        navLink: '/apps/supplie/list'
      },
      {
        id: 'groupsupplie',
        title: 'Nhóm vật tư',
        icon: <Briefcase size={20} />,
        navLink: '/apps/group-supplie/list'
      },
      {
        id: 'supplier',
        title: 'Nhà cung cấp',
        icon: <Truck size={20} />,
        navLink: '/apps/supplier/list'
      }
    ]
  },
  {
    id: 'report',
    title: 'Báo cáo',
    icon: <PieChart size={20} />,
    children: [
      {
        id: 'potential',
        title: 'Khách hàng tiềm năng',
        icon: <Users size={20} />,
        navLink: '/apps/potential/list'
      },
    ]
  },
  {
    id: 'setting',
    title: 'Thiết lập',
    icon: <Settings size={20} />,
    children: [
      {
        id: 'status',
        title: 'Trạng thái',
        icon: <AlertCircle size={20} />,
        navLink: '/apps/status/list'
      },
      {
        id: 'medical-history',
        title: 'Tiểu sử bệnh',
        icon: <Archive size={20} />,
        navLink: '/apps/medical-history/list'
      },
      {
        id: 'root',
        title: 'Nguồn giới thiệu',
        icon: <ExternalLink size={20} />,
        navLink: '/apps/root/list'
      },
      {
        id: 'security',
        title: 'Bảo mật',
        icon: <Shield size={20} />,
        children: [
          {
            id: 'roles',
            title: 'Phân quyền',
            icon: <List size={12} />,
            navLink: '/apps/role/list'
          }
        ]
      },
    ]
  },
]
