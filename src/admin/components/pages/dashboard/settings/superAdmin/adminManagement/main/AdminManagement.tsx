import React from 'react'
import { useAllAdminForSuperAdmin } from '../../../../../../../../shared/redux/hooks/shared/getUserProfile'

const AdminManagement = () => {
    const {admin} = useAllAdminForSuperAdmin()
    // console.log("admin",admin)
  return (
    <div>AdminManagement</div>
  )
}

export default AdminManagement