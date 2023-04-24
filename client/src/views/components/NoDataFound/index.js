import React from 'react'
import NoDataImage from '@src/assets/images/pages/no-data.webp'

function NoDataFound({content}) {
  return (
    <div className='pb-5 align-items-center flex-column d-flex'>
      <img src={NoDataImage} alt="No Data Found" style={{ width: "180px"}} />
      <h6 className='fw-bolder'>{content}</h6>
    </div>
  )
}

export default NoDataFound