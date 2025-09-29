<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-accent-color/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div
      class="bg-body-bg border-2 border-accent-color rounded p-1 sm:p-1.5 w-full max-w-xl mx-1 sm:mx-4"
      @click.stop
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">
          {{ t('admin.users.create_user') }}
        </h2>
        <button
          @click="closeModal"
          class="common-button"
          :title="t('common.close')"
        >
          <Icon name="mdi:close" class="text-[1.2em]" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-2">
        <div>
          <label for="email" class="block text-sm font-medium mb-0.5">
            {{ t('admin.users.email') }} *
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
            :placeholder="t('admin.users.email_placeholder')"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-0.5">
            {{ t('admin.users.password') }} *
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full pr-10 px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
              :placeholder="t('admin.users.password_placeholder')"
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="toggleShowPassword"
              class="absolute cursor-pointer inset-y-0 right-0 pr-0.75 flex items-center justify-center text-gray-400 hover:text-primary-text transition-colors duration-200"
              :aria-label="
                showPassword
                  ? t('admin.users.hide_password')
                  : t('admin.users.show_password')
              "
              :disabled="isLoading"
            >
              <Icon
                :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-1.25 w-1.25"
                aria-hidden="true"
              />
            </button>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ t('admin.users.password_help') }}
          </p>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium mb-0.5">
            {{ t('admin.users.confirm_password') || 'Confirmar senha' }} *
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full pr-10 px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
              :placeholder="
                t('admin.users.confirm_password_placeholder') ||
                t('admin.users.password_placeholder')
              "
              :disabled="isLoading"
            />
            <button
              type="button"
              @click="toggleShowConfirm"
              class="absolute cursor-pointer inset-y-0 right-0 pr-0.75 flex items-center justify-center text-gray-400 hover:text-primary-text transition-colors duration-200"
              :aria-label="
                showConfirm
                  ? t('admin.users.hide_password') || 'Ocultar senha'
                  : t('admin.users.show_password') || 'Mostrar senha'
              "
              :disabled="isLoading"
            >
              <Icon
                :name="showConfirm ? 'mdi:eye-off' : 'mdi:eye'"
                class="h-1.25 w-1.25"
                aria-hidden="true"
              />
            </button>
          </div>
          <p
            v-if="
              formData.confirmPassword &&
              formData.confirmPassword !== formData.password
            "
            class="text-xs text-red-500 mt-0.5"
          >
            {{
              t('admin.users.password_mismatch') || 'As senhas não coincidem.'
            }}
          </p>
        </div>

        <div>
          <label for="displayName" class="block text-sm font-medium mb-0.5">
            {{ t('admin.users.display_name') }}
          </label>
          <input
            id="displayName"
            v-model="formData.displayName"
            type="text"
            class="w-full px-0.75 py-0.5 bg-body-bg rounded focus:outline-none focus:ring-accent-color focus:border-accent-color text-sm border-2 border-accent-color"
            :placeholder="t('admin.users.display_name_placeholder')"
            :disabled="isLoading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-0.5 max-sm:mb-1">{{
            t('admin.users.role') || 'Tipo de administrador'
          }}</label>
          <div class="flex gap-3 items-start max-sm:flex-col max-sm:gap-1">
            <label class="flex items-start gap-1 text-sm cursor-pointer">
              <input
                type="radio"
                name="role"
                value="super"
                v-model="formData.role"
                :disabled="isLoading"
              />
              <div>
                <div class="font-medium">
                  {{ t('admin.users.role_super') || 'Super admin' }}
                </div>
                <div class="text-xs text-gray-400">
                  {{
                    t('admin.users.role_super_help') ||
                    'Tem permissão plena (criar/excluir outros admins)'
                  }}
                </div>
              </div>
            </label>

            <label class="flex items-start gap-1 text-sm cursor-pointer">
              <input
                type="radio"
                name="role"
                value="restricted"
                v-model="formData.role"
                :disabled="isLoading"
              />
              <div>
                <div class="font-medium">
                  {{
                    t('admin.users.role_restricted') ||
                    'Administrador (restrito)'
                  }}
                </div>
                <div class="text-xs text-gray-400">
                  {{
                    t('admin.users.role_restricted_help') ||
                    'Não pode criar ou deletar outros administradores'
                  }}
                </div>
              </div>
            </label>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <div class="flex gap-3 sm:pt-1 max-sm:gap-1">
          <button
            type="button"
            @click="closeModal"
            class="common-button w-full"
            :disabled="isLoading"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            type="submit"
            class="common-button w-full flex items-center justify-center gap-1"
            :disabled="isLoading || !isFormValid"
          >
            <ButtonLoader v-if="isLoading" />
            <Icon v-else name="mdi:plus" />
            {{ t('admin.users.create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import ButtonLoader from '~/components/atoms/ButtonLoader.vue'

  interface CreateUserData {
    email: string
    password: string
    displayName?: string | undefined
    confirmPassword?: string | undefined
    role: 'super' | 'restricted'
  }

  interface Props {
    isOpen: boolean
    isLoading: boolean
    error: string | null
  }

  interface Emits {
    (e: 'close'): void
    (e: 'submit', userData: CreateUserData): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  const { t } = useI18n()

  const formData = ref<CreateUserData>({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
    role: 'restricted',
  })

  const isFormValid = computed(() => {
    return (
      formData.value.email.trim() !== '' &&
      formData.value.password.length >= 6 &&
      formData.value.confirmPassword === formData.value.password &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
    )
  })

  const showPassword = ref(false)
  const showConfirm = ref(false)

  const toggleShowPassword = () => {
    showPassword.value = !showPassword.value
  }

  const toggleShowConfirm = () => {
    showConfirm.value = !showConfirm.value
  }

  const closeModal = () => {
    emit('close')
  }

  const handleSubmit = () => {
    if (!isFormValid.value || props.isLoading) return

    const userData: CreateUserData = {
      email: formData.value.email.trim(),
      password: formData.value.password,
      displayName: formData.value.displayName?.trim() || undefined,
      role: formData.value.role,
    }

    emit('submit', userData)
  }

  // Reset form when modal closes
  watch(
    () => props.isOpen,
    (isOpen) => {
      if (!isOpen) {
        formData.value = {
          email: '',
          password: '',
          displayName: '',
          confirmPassword: '',
          role: 'restricted',
        }
        showPassword.value = false
        showConfirm.value = false
      }
    }
  )
</script>
