// Mock secure data for July 5th
const SECURE_DATA = {
  activities: [
    '9:00 AM - Started the day with morning yoga session',
    '10:30 AM - Had a productive team meeting about Q3 planning',
    '12:00 PM - Lunch at Central Cafe with Sarah from Marketing',
    '2:00 PM - Worked on the new product roadmap presentation',
    '4:00 PM - 1:1 meeting with manager about career development',
    '6:00 PM - Finished reviewing code for the authentication feature'
  ],
  meetings: [
    {
      time: '10:30 AM',
      title: 'Q3 Planning Team Meeting',
      attendees: ['John Smith', 'Emily Chen', 'Michael Rodriguez'],
      location: 'Conference Room B'
    },
    {
      time: '12:00 PM',
      title: 'Lunch Meeting',
      attendees: ['Sarah Johnson'],
      location: 'Central Cafe'
    },
    {
      time: '4:00 PM',
      title: 'Career Development 1:1',
      attendees: ['Manager - David Wilson'],
      location: 'Office'
    }
  ],
  schedule: [
    '9:00 AM - 10:00 AM: Personal time (Yoga)',
    '10:30 AM - 11:30 AM: Q3 Planning Meeting',
    '12:00 PM - 1:00 PM: Lunch with Sarah',
    '2:00 PM - 3:30 PM: Product roadmap work',
    '4:00 PM - 4:30 PM: 1:1 with manager',
    '5:00 PM - 6:00 PM: Code review',
    'Evening: Family dinner at home'
  ]
}

function formatSecureDataResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes('what did i do') || lowerQuestion.includes('activities')) {
    return `**Your Activities on July 5th:**

${SECURE_DATA.activities.map(activity => `• ${activity}`).join('\n')}`
  } else if (lowerQuestion.includes('who did i meet') || lowerQuestion.includes('meetings')) {
    return `**People You Met on July 5th:**

${SECURE_DATA.meetings.map(meeting =>
  `**${meeting.time}** - ${meeting.title}
  Attendees: ${meeting.attendees.join(', ')}
  Location: ${meeting.location}`
).join('\n\n')}`
  } else if (lowerQuestion.includes('schedule') || lowerQuestion.includes('calendar')) {
    return `**Your Schedule for July 5th:**

${SECURE_DATA.schedule.map(item => `• ${item}`).join('\n')}`
  } else {
    // Default response with all data
    return `**Complete Information for July 5th:**

**Activities:**
${SECURE_DATA.activities.slice(0, 3).map(activity => `• ${activity}`).join('\n')}

**Key Meetings:**
${SECURE_DATA.meetings.map(meeting => `• ${meeting.time} - ${meeting.title}`).join('\n')}`
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Check simple verification cookie
    const verified = getCookie(event, 'verified')

    if (verified !== 'true') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Password verification required'
      })
    }

    // Get query parameters to determine what data to return
    const query = getQuery(event)
    const question = query.question as string || ''

    const formattedData = formatSecureDataResponse(question)

    return {
      success: true,
      data: formattedData,
      timestamp: new Date().toISOString()
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch secure data'
    })
  }
})
