<template>
    <div class="form-group">
        <label :for="id" :class="labelClasses">
            {{ label }}
            <span class="text-accent-color">*</span>
        </label>

        <!-- Custom File Upload Area -->
        <div
            class="file-upload-area"
            :class="[
                'relative border-2 border-dashed rounded-sm p-1.5 text-center cursor-pointer transition-all duration-200',
                hasError ? 'border-accent-color border-solid' : 'border-secondary-text',
                modelValue ? 'border-accent-color border-solid file-selected' : '',
                'hover:border-accent-color hover:border-solid hover:shadow-md hover:-translate-y-0.5'
            ]"
            @click="() => fileInput?.click()"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
        >
            <!-- Cloud Upload Icon -->
            <div class="flex flex-col items-center justify-center py-1">
                <svg
                    class="w-6 h-6 mb-0.5"
                    :class="modelValue ? 'text-white' : 'text-secondary-text'"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                </svg>

                <!-- Upload Text -->
                <div v-if="!modelValue" class="text-sm text-primary-text">
                    <span class="font-medium">Clique para enviar</span>
                    <span class="text-secondary-text"> ou arraste o arquivo aqui</span>
                </div>

                <!-- File Selected -->
                <div v-else class="text-sm">
                    <div class="font-medium text-white mb-0.5">
                        ✓ Arquivo selecionado
                    </div>
                    <div class="text-white">
                        {{ modelValue.name }}
                    </div>
                    <div class="text-xs text-gray-200 mt-0.25">
                        {{ formatFileSize(modelValue.size) }}
                    </div>
                </div>
            </div>

            <!-- Hidden File Input -->
            <input
                :id="id"
                ref="fileInput"
                type="file"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :accept="accept"
                @change="onFileChange"
                :required="required"
            />
        </div>

        <span class="text-xs text-secondary-text mt-0.5 block">
            {{ helpText }}
        </span>
        <span v-if="errorMessage" class="text-xs text-accent-color mt-0.5">
            {{ errorMessage }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
    id: string;
    label: string;
    modelValue: File | null;
    accept: string;
    maxSize?: number; // in bytes
    required?: boolean;
    helpText?: string;
    errorMessage?: string;
    labelClasses?: string;
}

interface Emits {
    (e: 'update:modelValue', value: File | null): void;
    (e: 'error', message: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    maxSize: 5 * 1024 * 1024, // 5MB
    required: false,
    helpText: 'Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)',
    labelClasses: 'mb-0.75 text-sm font-medium text-primary-text max-md:mb-0.5',
});

const emit = defineEmits<Emits>();

const fileInput = ref<HTMLInputElement | null>(null);

const hasError = computed(() => !!props.errorMessage);

const processFile = (file: File) => {
    // Validate file size
    if (file.size > props.maxSize) {
        emit('error', 'Arquivo muito grande. Tamanho máximo permitido: 5MB');
        if (fileInput.value) {
            fileInput.value.value = "";
        }
        return;
    }

    // Validate file type
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
        emit('error', 'Tipo de arquivo inválido. Formatos aceitos: PDF, DOC, DOCX');
        if (fileInput.value) {
            fileInput.value.value = "";
        }
        return;
    }

    emit('update:modelValue', file);
    emit('error', '');
};

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        processFile(file);
    }
};

const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "copy";
};

const onDragLeave = (event: DragEvent) => {
    event.preventDefault();
};

const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        const file = files[0];
        processFile(file);

        // Update the hidden input
        if (fileInput.value) {
            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.value.files = dt.files;
        }
    }
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
/* File upload area styling */
.file-upload-area {
    min-height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.file-upload-area:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-upload-area.file-selected {
    box-shadow: 0 0 0 1px var(--color-accent-color), 0 2px 8px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, var(--color-accent-color), rgba(var(--color-accent-color-rgb), 0.8));
}

.file-upload-area.dragover {
    border-color: var(--color-accent-color);
    border-style: solid;
    transform: scale(1.02);
    box-shadow: 0 0 0 3px rgba(var(--color-accent-color-rgb), 0.1), 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
    .file-upload-area {
        min-height: 60px;
        padding: 0.625rem;
    }

    .file-upload-area svg {
        width: 1.25rem;
        height: 1.25rem;
    }
}
</style>
