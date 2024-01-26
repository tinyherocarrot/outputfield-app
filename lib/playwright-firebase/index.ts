/**
 * Module from https://github.com/nearform/playwright-firebase/tree/master
 * (Had issues with package import, reinstall once https://github.com/nearform/playwright-firebase/issues/179 is resolved)
 */

import type { ServiceAccount } from 'firebase-admin'
import type { FirebaseOptions } from 'firebase/app'
import type {
  TestType,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions
} from '@playwright/test'
import { Authentication } from './Authentication'

export type Credentials = {
  auth: Authentication
  UID: string
  serviceAccount: ServiceAccount
  options: FirebaseOptions
}

interface AuthenticationParams {
  UID: string
  options: FirebaseOptions
  serviceAccount: ServiceAccount
  version: string
}

export default function playwrightFirebasePlugin(
  serviceAccount: ServiceAccount,
  options: FirebaseOptions,
  UID: string,
  base: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions,
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
  version = '10.5.0'
) {
  return base.extend<{ auth: Authentication } & AuthenticationParams>({
    UID: [UID, { option: true }],
    serviceAccount: [serviceAccount, { option: true }],
    options: [options, { option: true }],
    version: [version, { option: true }],
    auth: (
      { UID, options, serviceAccount, version }: AuthenticationParams,
      use: (authentication: Authentication) => Promise<void>
    ) => use(new Authentication(UID, options, serviceAccount, version))
  })
}