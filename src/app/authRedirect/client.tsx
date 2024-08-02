'use client'

import { AuthRedirect } from "pageComponents";
import { Suspense } from 'react'

export function ClientOnly() {
  return  <Suspense><AuthRedirect /> </Suspense>
}