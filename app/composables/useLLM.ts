export function useLLM() {
  const models = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo'
  ]
  const model = useCookie<string>('llm-model', { default: () => 'gpt-4o' })

  return {
    models,
    model
  }
}
