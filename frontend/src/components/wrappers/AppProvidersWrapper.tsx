'use client'

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ToastContainer } from 'react-toastify'
import toast, { Toaster } from "react-hot-toast"
import dynamic from 'next/dynamic'
import { ChildrenType } from '../../types/component-props'
import { EmailProvider } from '@/context/useEmailContext'
import ProtectedRoute from '@/components/wrappers/ProtectedRoute';

const LayoutProvider = dynamic(() => import('@/context/useLayoutContext').then((mod) => mod.LayoutProvider), {
  ssr: false,
})

const AppProvidersWrapper = ({ children }: ChildrenType) => {

  return (
    <>
      <Provider store={store}> {/* ✅ THIS IS CRITICAL */}
        <LayoutProvider>
          <ProtectedRoute>
            {children}
            <Toaster position="top-right" />
          </ProtectedRoute>
        </LayoutProvider>
      </Provider>
    </>
  )
}
export default AppProvidersWrapper

