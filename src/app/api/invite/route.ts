import axios from 'axios'
import { NextResponse } from 'next/server'
import * as yup from 'yup'

const authSchema = yup.object({
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
})

export async function POST(req: Request) {
  const params = await req.json()

  const { email, firstName, lastName } = await authSchema.validate({
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName,
  })

  const authRes = await axios.post('https://regendata.xyz/api/session', {
    username: process.env.USERNAME as string,
    password: process.env.PASSWORD as string,
  })

  const sessionId = authRes.data.id as string
  // const sessionId = process.env.METABASE_SESSION as string

  await axios.post(
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

  return NextResponse.json({ message: 'Invite sent', success: true })
}
