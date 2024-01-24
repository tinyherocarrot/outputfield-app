import type { Metadata } from 'next'
import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase"
import { getAdmins, getNominees } from "@/lib/firebase/firestore";
import { NomineeWithId } from "@/ts/interfaces/nominee.interfaces";
import { AuthWrapper } from "@/components/auth-wrapper";
import { DataTable } from "./data-table";
import generateColumnDef from './columns';
import { updateNomineeStatus } from '../actions';
import { NomineeStatus } from '@/ts/enums/nomineeStatus.enums';
 
export const metadata: Metadata = {
  title: 'OPF | Admin',
}

export const dynamic = "force-dynamic";

export type updateNomineeFn = (str: string, status: NomineeStatus) => Promise<void>;

export default async function Admin() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const nominees = await getNominees() as NomineeWithId[];
  const allowList = await getAdmins()

  return (
      <AuthWrapper initialUser={currentUser?.toJSON()} allowList={allowList}>
        <main className="flex min-h-screen flex-col items-center p-12">
          <h1 className="text-2xl mt-4 mb-2">Admin View</h1>
          <DataTable 
            generateColumnDef={generateColumnDef}
            updateNominee={updateNomineeStatus}
            data={nominees}
          />
        </main>
      </AuthWrapper>
    )
}
