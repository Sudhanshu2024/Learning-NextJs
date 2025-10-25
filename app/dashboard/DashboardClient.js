'use client'

import LogoutButton from '../components/LogoutButton'
import { useSearchParams } from "next/navigation";
import AddToDo from '../components/AddToDo'


    
export default function DashboardClient({ session }) {
    const params=useSearchParams();
    const message=params.get('message')
  return (
    <div>
      {message && <p>{message}</p>}
      <h1>Welcome, {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
      <AddToDo/>
      <LogoutButton/>
    </div>
  )
}
