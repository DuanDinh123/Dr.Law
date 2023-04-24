// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { store } from '@store/store'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Renders Client Columns
const renderClient = row => {
  if (row.avatar.length) {
    return <Avatar className='me-1' img={row.avatar} width='32' height='32' />
  } else {
    return (
      <Avatar
        initials
        className='me-1'
        color={row.avatarColor || 'light-primary'}
        content={row.fullName || 'John Doe'}
      />
    )
  }
}

const currentUser = JSON.parse(localStorage.getItem("userData"));

export const columns = (toggle, userSelected, setUserSelected) => [
  // {
  //   name: 'User',
  //   sortable: true,
  //   minWidth: '300px',
  //   sortField: 'fullName',
  //   selector: row => row.fullName,
  //   cell: row => (
  //     <div className='d-flex justify-content-left align-items-center'>
  //       {renderClient(row)}
  //       <div className='d-flex flex-column'>
  //         <Link
  //           to={`/apps/user/view/${row.id}`}
  //           className='user_name text-truncate text-body'
  //           onClick={() => store.dispatch(getUser(row.id))}
  //         >
  //           <span className='fw-bolder'>{row.fullName}</span>
  //         </Link>
  //         <small className='text-truncate text-muted mb-0'>{row.email}</small>
  //       </div>
  //     </div>
  //   )
  // },
  {
    name: 'Tên',
    sortable: true,
    minWidth: '172px',
    sortField: 'name',
    cell: row => {
      return(
        <span className={row.email === 'superadmin@gmail.com' ? 'opacity-50' : ''}>{row.name}</span>
      )
    }
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '172px',
    sortField: 'email',
    cell: row => <span className={row.email === 'superadmin@gmail.com' ? 'opacity-50' : ''}>{row.email}</span>
  },
  {
    name: 'Trạng thái',
    sortable: true,
    minWidth: '172px',
    sortField: 'active',
    cell: row => <span className={row.email === 'superadmin@gmail.com' ? 'opacity-50' : ''}>{row.email === 'superadmin@gmail.com' ? 'Đây là tài khoản mặc định!' : row.active ? 'Đang làm việc' : 'Đang nghỉ việc'}</span>
  },
  {
    name: 'Chức năng',
    minWidth: '100px',
    cell: row => (
      <Fragment>
        {
          row.email !== 'superadmin@gmail.com' ? (
            <div className='column-action'>
              <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                  <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                <DropdownMenu>
                  {/* <DropdownItem
                    tag={Link}
                    className='w-100'
                    to={`/apps/user/detail/${row._id}`}
                  >
                    <FileText size={14} className='me-50' />
                    <span className='align-middle'>Chi tiết</span>
                  </DropdownItem> */}
                  <DropdownItem
                    tag={Link}
                    to={`/apps/user/edit/${row._id}`}
                    className='w-100'
                  >
                    <Archive size={14} className='me-50' />
                    <span className='align-middle'>Chỉnh sửa</span>
                  </DropdownItem>
                  <DropdownItem
                    tag='a'
                    href='/'
                    className='w-100'
                    onClick={e => {
                      setUserSelected({
                        ...userSelected,
                        id: row._id,
                        email: row.email
                      })
                      toggle()
                      e.preventDefault()
                    }}
                  >
                    <Trash2 size={14} className='me-50' />
                    <span className='align-middle'>Xóa</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          ) : null
        }
      </Fragment>
    )
  }

]
