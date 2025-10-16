import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAdminStore } from "./context/AdminContext"
import { useNavigate } from "react-router-dom"
import { MenuLateralAdmin } from '../admin/AdminMenuLateral.tsx'
import AdminHeader from './AdminHeader.tsx'


export default function AdminLayout() {
  const { admin } = useAdminStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(admin).length == 0) {
      navigate("/admin/login", { replace: true })
    }
  }, [])

  if (Object.keys(admin).length == 0) {
    return null
  }

  return (
    <>
      <AdminHeader />
      <MenuLateralAdmin />
      <div className="p-4 sm:ml-64 bg-[#F5F7FA] rounded-tl-3xl ">
        <Outlet />
      </div>
    </>
  )
}
