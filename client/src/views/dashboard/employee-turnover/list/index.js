// ** React Imports
import { Fragment } from 'react'

// ** Role List Component
import Table from './Table'

const ReportEmployeeTurnover = () => {
    return (
        <Fragment>
            <h3>Doanh thu theo nhân viên</h3>
            <div className='app-user-list'>
                <Table />
            </div>
        </Fragment>
    )
}

export default ReportEmployeeTurnover
