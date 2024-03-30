import axios from 'axios'
import { NextResponse } from 'next/server'
import * as yup from 'yup'

const authSchema = yup.object({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})

export async function POST(req: Request) {
  try {
    const params = await req.json()
    const { email, firstName, lastName } = await authSchema.validate({
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
    })

    try {
      const authRes = await axios.post('https://app.regendata.xyz/api/session', {
        username: process.env.USERNAME as string,
        password: process.env.PASSWORD as string,
      })
      const sessionId = authRes.data.id as string

      try {
        const createUserRes = await axios.post(
          'https://app.regendata.xyz/api/user',
          {
            email: email,
            first_name: firstName,
            last_name: lastName,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Metabase-Session': sessionId,
            },
          }
        )

        return NextResponse.json({
          message: 'User created successfully',
          data: createUserRes.data,
          success: true,
        })
      } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json(
          { message: 'Failed to create user', success: false },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { message: 'Authentication failed', success: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { message: 'Invalid request data', success: false },
      { status: 400 }
    )
  }
}
