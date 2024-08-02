import '../../index.css'
import { ClientOnly } from './client'
import { Suspense } from 'react'
 
export function generateStaticParams() {
  return [{ slug: [''] }, { slug: ['courses'] }]
}
 
export default function Page({ params }: { params: { slug?: string[] } }) {
  return <Suspense><ClientOnly params={params} /></Suspense>
}