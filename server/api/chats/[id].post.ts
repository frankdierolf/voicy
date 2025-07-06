import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { tables, and, eq } from '../../utils/drizzle'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  const { id } = getRouterParams(event)
  // TODO: Use readValidatedBody
  const { model, messages } = await readBody(event)

  const db = useDrizzle()

  // Initialize OpenAI client
  const openai = createOpenAI({
    apiKey: useRuntimeConfig().openaiApiKey
  })

  const chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => and(eq(chat.id, id as string), eq(chat.userId, session.user?.id || session.id)),
    with: {
      messages: true
    }
  })
  if (!chat) {
    throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
  }

  if (!chat.title) {
    try {
      const titleResponse = await streamText({
        model: openai('gpt-3.5-turbo'),
        messages: [{
          role: 'system',
          content: `You are a title generator for a chat:
          - Generate a short title based on the first user's message
          - The title should be less than 30 characters long
          - The title should be a summary of the user's message
          - Do not use quotes (' or ") or colons (:) or any other punctuation
          - Do not use markdown, just plain text`
        }, {
          role: 'user',
          content: chat.messages[0]?.content || 'Untitled chat'
        }],
        maxTokens: 50
      })

      let title = ''
      for await (const delta of titleResponse.textStream) {
        title += delta
      }

      title = title.replace(/:/g, '').split('\n')[0]?.trim() || 'Untitled'
      setHeader(event, 'X-Chat-Title', title)
      await db.update(tables.chats).set({ title }).where(eq(tables.chats.id, id as string))
    } catch (error) {
      console.error('Failed to generate title:', error)
      // Continue without title if generation fails
    }
  }

  const lastMessage = messages[messages.length - 1]
  if (lastMessage.role === 'user' && messages.length > 1) {
    await db.insert(tables.messages).values({
      chatId: id as string,
      role: 'user',
      content: lastMessage.content
    })
  }

  // Check if the user is asking about secure data (July 5th questions)
  const userQuestion = lastMessage.content.toLowerCase()
  const isSecureDataQuestion
    = userQuestion.includes('july 5')
      || userQuestion.includes('what did i do')
      || userQuestion.includes('who did i meet')
      || userQuestion.includes('what was my schedule')

  if (isSecureDataQuestion) {
    // Return pre-built response with password form
    const secureResponse = `I can help you access your secure data for July 5th. Please verify your identity first:

::password-form
---
question: "${lastMessage.content}"
---
::

Once you enter the correct password ("iamharald"), I'll show you your confidential information for that day.`

    // Store the response in the database
    await db.insert(tables.messages).values({
      chatId: chat.id,
      role: 'assistant',
      content: secureResponse
    })

    // Return the pre-built response as a stream
    return new Response(secureResponse, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  }

  // Clean messages to ensure OpenAI compatibility (remove parts array if present)
  const cleanedMessages = messages.map((message: any) => ({
    role: message.role,
    content: message.content
  }))

  return streamText({
    model: openai(model || 'gpt-4o'),
    maxTokens: 4000,
    system: 'You are Voicy, a helpful assistant for secure voice-based data access. You help users access their personal information after proper authentication.',
    messages: cleanedMessages,
    async onFinish(response) {
      await db.insert(tables.messages).values({
        chatId: chat.id,
        role: 'assistant',
        content: response.text
      })
    }
  }).toDataStreamResponse()
})
