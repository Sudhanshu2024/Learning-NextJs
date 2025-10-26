
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardClient from "./DashboardClient";
import TodoList from "../components/ToDoList";

export default async function DashboardPage() {
   
  const session = await getServerSession(authOptions);

  return (
    <div>
   <DashboardClient session={session}/>
   <TodoList/>
   </div>
   
  );
}
