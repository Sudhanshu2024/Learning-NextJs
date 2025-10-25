'use client'
import { signOut } from "next-auth/react";
export default function LogoutButton() {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' })
      }
    return (
        <div>
    <button onClick={handleSignOut}>LOGOUT</button>
        </div>
    );
}