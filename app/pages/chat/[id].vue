<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { useChat, type Message } from '@ai-sdk/vue'
import { useClipboard } from '@vueuse/core'
import ProseStreamPre from '../../components/prose/PreStream.vue'
import PasswordForm from '../../components/content/PasswordForm.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent,
  PasswordForm: PasswordForm as unknown as DefineComponent
}

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard()
const { model } = useLLM()

const { data: chat } = await useFetch(`/api/chats/${route.params.id}`, {
  cache: 'force-cache'
})
if (!chat.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found', fatal: true })
}

const { messages, input, handleSubmit, reload, stop, status, error } = useChat({
  id: chat.value.id,
  api: `/api/chats/${chat.value.id}`,
  initialMessages: chat.value.messages.map(message => ({
    id: message.id,
    content: message.content,
    role: message.role
  })),
  body: {
    model: model.value
  },
  onResponse(response) {
    if (response.headers.get('X-Chat-Title')) {
      refreshNuxtData('chats')
    }
  },
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

const copied = ref(false)

function copy(e: MouseEvent, message: Message) {
  clipboard.copy(message.content)

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// Helper functions for secure data request detection
function hasSecureDataRequest(content: string): boolean {
  return content.includes('**[SECURE_DATA_REQUEST]**')
}

function getContentBeforeSecureRequest(content: string): string {
  const parts = content.split('**[SECURE_DATA_REQUEST]**')
  const beforeMatch = parts[0]
  return beforeMatch ? beforeMatch.trim() : ''
}

function getContentAfterSecureRequest(content: string): string {
  const parts = content.split('**[/SECURE_DATA_REQUEST]**')
  const afterMatch = parts[1]
  return afterMatch ? afterMatch.trim() : ''
}

function getSecureDataQuestion(content: string): string {
  const match = content.match(/\*\*\[SECURE_DATA_REQUEST\]\*\*\s*Question:\s*(.+?)\s*\*\*\[\/SECURE_DATA_REQUEST\]\*\*/)
  return match && match[1] ? match[1].trim() : ''
}

onMounted(() => {
  if (chat.value?.messages.length === 1) {
    reload()
  }
})
</script>

<template>
  <UDashboardPanel id="chat" class="relative" :ui="{ body: 'p-0 sm:p-0' }">
    <template #header>
      <DashboardNavbar />
    </template>

    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <UChatMessages
          :messages="messages"
          :status="status"
          :assistant="{ actions: [{ label: 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] }"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
          :spacing-offset="160"
        >
          <template #content="{ message }">
            <div v-if="hasSecureDataRequest(message.content)">
              <!-- Render content before secure request -->
              <MDCCached
                :value="getContentBeforeSecureRequest(message.content)"
                :cache-key="message.id + '-before'"
                unwrap="p"
                :components="components"
                :parser-options="{ highlight: false }"
              />

              <!-- Render password form -->
              <PasswordForm :question="getSecureDataQuestion(message.content)" />

              <!-- Render content after secure request -->
              <MDCCached
                :value="getContentAfterSecureRequest(message.content)"
                :cache-key="message.id + '-after'"
                unwrap="p"
                :components="components"
                :parser-options="{ highlight: false }"
              />
            </div>

            <MDCCached
              v-else
              :value="message.content"
              :cache-key="message.id"
              unwrap="p"
              :components="components"
              :parser-options="{ highlight: false }"
            />
          </template>
        </UChatMessages>

        <UChatPrompt
          v-model="input"
          :error="error"
          variant="subtle"
          class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
          @submit="handleSubmit"
        >
          <UChatPromptSubmit
            :status="status"
            color="neutral"
            @stop="stop"
            @reload="reload"
          />

          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
