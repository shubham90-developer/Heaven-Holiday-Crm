"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/assets/images/logo.png'
import { currentYear } from '@/context/constants'
import { Card, Col, Row } from 'react-bootstrap'
import Link from 'next/link'
// import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import { useRegisterMutation } from '../../../../store/services/auth/authApi'
import toast from 'react-hot-toast'

// export const metadata: Metadata = { title: 'Sign Up' }

const RegisterPage = () => {
  const router = useRouter()

  const [registerUser, { isLoading }] = useRegisterMutation()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (
    e: any
  ) => {
    e.preventDefault()

    try {
      const res = await registerUser(formData).unwrap()

      toast.success(res.message || 'Registration successful')

      router.push('/settings/company-profile')

    } catch (error: any) {
      toast.error(
        error?.data?.message || 'Registration failed'
      )
    }
  }
  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
      <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
        <Col xl={4} lg={5} md={6}>
          <Card className="overflow-hidden text-center h-100 p-xxl-4 p-3 mb-0">
            <a href="/" className="auth-brand mb-4">
              <Image src={logo} alt="dark logo" height={26} className="logo-dark" />
              <Image src={logo} alt="logo light" height={26} className="logo-light" />
            </a>
            <h4 className="fw-semibold mb-2 fs-18">Welcome to Greeva Admin</h4>
            <p className="text-muted mb-4">Enter your name , email address and password to access account.</p>
            <form onSubmit={handleRegister} className="text-start mb-3">
              <div className="mb-3">
                <label className="form-label" htmlFor="example-name">Your Name</label>
                <input type="text" id="example-name" className="form-control" placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="example-email">Email</label>
                <input type="email" id="example-email" name="email" className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="example-password">Password</label>
                <input type="password" id="password" className="form-control"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange} />
              </div>
              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="checkbox-signin" />
                  <label className="form-check-label" htmlFor="checkbox-signin">I agree to all <Link href="" className="link-dark text-decoration-underline">Terms &amp; Condition</Link> </label>
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary fw-semibold" type="submit"
                  disabled={isLoading}> {
                    isLoading
                      ? 'Signing Up...'
                      : 'Sign Up'
                  }</button>
              </div>
            </form>
            <p className="text-nuted fs-14 mb-4">Already have an account? <Link href="/auth/login" className="fw-semibold text-danger ms-1">Login !</Link></p>
            <p className="mt-auto mb-0">
              {currentYear} © Greeva - By <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">Coderthemes</span>
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RegisterPage