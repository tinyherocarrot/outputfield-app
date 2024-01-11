import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase"
import { getAdmins, getNominees } from "@/lib/firebase/firestore";
import { Nominee } from "@/ts/interfaces/nominee.interfaces";
import { AuthWrapper } from "../../components/auth-wrapper";
import { DataTable } from "./data-table";
import { columns } from './columns';

export const dynamic = "force-dynamic";

export default async function Admin() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const nominees = await getNominees() as Nominee[];
  const allowList = await getAdmins()

  return (
      <AuthWrapper initialUser={currentUser?.toJSON()} allowList={allowList}>
        <main className="flex min-h-screen flex-col items-center p-12">
          <h1>Admin View</h1>
          <DataTable columns={columns} data={nominees} />
        </main>
      </AuthWrapper>
    )
}