export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body

    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password is required'
      })
    }

    // Simple password check for MVP
    const isValid = password === 'iamharald'

    if (!isValid) {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      }
    }

    // Set simple session flag in cookie
    setCookie(event, 'verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 // 1 hour
    })

    return {
      success: true,
      message: 'Password verified successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Password verification failed'
    })
  }
})