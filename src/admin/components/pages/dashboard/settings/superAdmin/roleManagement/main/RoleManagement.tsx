import React from 'react'
import { Link } from 'react-router-dom'
import transaction from "../../../../../../../../assets/svg/Transaction.svg";
import { button } from "../../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../../assets/svg/plus.svg";

const RoleManagement = () => {
  return (
    <main className="font-outfit px-[1em]">
    <div className="relative">
      <header className="flex items-center justify-between">
        <h1 className="font-medium text-xl">Admin Management</h1>
        <div className="flex gap-2">
          <Link to="/admin/dashboard/settings/role_management/new_role">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Role
            </button.PrimaryButton>
          </Link>
        </div>
      </header>
    </div>
  </main>
  )
}

export default RoleManagement