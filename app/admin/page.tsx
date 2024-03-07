import type { Metadata } from 'next'
import { getAuthenticatedAppForUser } from "@/lib/firebase/firebase"
import { getNominees } from "@/lib/firebase/firestore";
import { AuthWrapper } from '@/components/auth-wrapper';
import { DataTable } from './data-table';
import generateColumnDef from './columns';
import { updateNomineeStatus } from '../actions';
import { NomineeWithId } from '@/ts/interfaces/nominee.interfaces';

export const metadata: Metadata = {
  title: 'OPF | Admin',
}

export type updateNomineeFn = (nomineeId: string, f: FormData) => void;

export default async function Page() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const nominees = await getNominees() as NomineeWithId[];

  return (
      <AuthWrapper
        initialUser={currentUser?.toJSON()}
      >
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
