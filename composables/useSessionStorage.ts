import { ref, watch, type Ref } from 'vue'

/**
 * Composable para gerenciar dados no sessionStorage com reatividade
 * Os dados persistem enquanto a aba do navegador estiver aberta
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      read: (value: string) => T
      write: (value: T) => string
    }
  } = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    serializer = {
      read: (v: string) => {
        try {
          return JSON.parse(v)
        } catch {
          return v as T
        }
      },
      write: (v: T) => JSON.stringify(v)
    }
  } = options

  // Função para ler do sessionStorage
  const read = (): T => {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = window.sessionStorage.getItem(key)
      if (item === null) return defaultValue
      return serializer.read(item)
    } catch (error) {
      console.warn(`Erro ao ler sessionStorage para chave "${key}":`, error)
      return defaultValue
    }
  }

  // Função para escrever no sessionStorage
  const write = (value: T): void => {
    if (typeof window === 'undefined') return

    try {
      window.sessionStorage.setItem(key, serializer.write(value))
    } catch (error) {
      console.warn(`Erro ao escrever no sessionStorage para chave "${key}":`, error)
    }
  }

  // Função para remover do sessionStorage
  const remove = (): void => {
    if (typeof window === 'undefined') return

    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.warn(`Erro ao remover do sessionStorage para chave "${key}":`, error)
    }
  }

  // Ref reativo
  const storedValue = read()
  const state = ref<T>(storedValue) as Ref<T>

  // Observar mudanças e sincronizar com sessionStorage
  watch(
    state,
    (newValue) => {
      write(newValue)
    },
    { deep: true }
  )

  // Função para atualizar o estado
  const setState = (value: T) => {
    state.value = value
  }

  // Função para limpar
  const clearState = () => {
    remove()
    state.value = defaultValue
  }

  return [state, setState, clearState]
}
