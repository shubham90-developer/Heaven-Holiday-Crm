'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import useQueryParams from '@/hooks/useQueryParams'
import toast from "react-hot-toast";
import { useLoginMutation } from '../../../../../store/services/auth/authApi'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { push } = useRouter()

  const queryParams = useQueryParams()

  const [loginUser] = useLoginMutation()

  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: 'user@demo.com',
      password: '123456',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const login = handleSubmit(async (values) => {
    try {
      setLoading(true)

      const res = await loginUser(values).unwrap()

      toast.success(
        res.message || 'Login successful'
      )

      push(
        queryParams['redirectTo'] ??
        '/settings/company-profile'
      )

    } catch (error: any) {
      toast.error(
        error?.data?.message || 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  })

  return { loading, login, control }
}

export default useSignIn
