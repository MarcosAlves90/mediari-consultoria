import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSessionStorage } from "../useSessionStorage";

interface AdminFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    lastLogin: string;
}

// Mock admin credentials for demonstration
const ADMIN_CREDENTIALS = {
    email: "admin@mediari.com.br",
    password: "mediari2025",
    user: {
        id: "admin-1",
        email: "admin@mediari.com.br",
        name: "Administrador",
        role: "Super Admin",
        lastLogin: new Date().toISOString()
    }
};

export const useAdminAuth = () => {
    const { t } = useI18n();

    // Session storage for admin authentication
    const [adminSession, setAdminSession, clearAdminSession] = useSessionStorage<AdminUser | null>(
        'mediari-admin-session',
        null
    );

    // Form data
    const formData = reactive<AdminFormData>({
        email: "",
        password: "",
        rememberMe: false
    });

    // State management
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref("");

    // Check if user is authenticated
    const isAuthenticated = computed(() => {
        return adminSession.value !== null;
    });

    // Current admin user
    const currentUser = computed(() => {
        return adminSession.value;
    });

    // Login function
    const login = async (): Promise<boolean> => {
        isLoading.value = true;
        hasError.value = false;
        errorMessage.value = "";

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Validate credentials
            if (
                formData.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
                formData.password === ADMIN_CREDENTIALS.password
            ) {
                // Successful login
                const adminUser = {
                    ...ADMIN_CREDENTIALS.user,
                    lastLogin: new Date().toISOString()
                };

                setAdminSession(adminUser);

                // Clear form
                resetForm();

                // Redirect to admin dashboard
                await navigateTo('/admin/candidaturas');

                return true;
            } else {
                // Invalid credentials
                hasError.value = true;
                errorMessage.value = t("admin.login.invalid_credentials");
                return false;
            }
        } catch (error) {
            console.error("Login error:", error);
            hasError.value = true;
            errorMessage.value = t("admin.login.server_error");
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Clear session
            clearAdminSession();

            // Reset form
            resetForm();

            // Redirect to login
            await navigateTo('/admin');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Reset form
    const resetForm = (): void => {
        formData.email = "";
        formData.password = "";
        formData.rememberMe = false;
        hasError.value = false;
        errorMessage.value = "";
    };

    // Check authentication status (for middleware)
    const checkAuth = (): boolean => {
        return isAuthenticated.value;
    };

    // Validate session (check if token is still valid)
    const validateSession = async (): Promise<boolean> => {
        if (!adminSession.value) return false;

        try {
            // In a real app, you would validate the token with the server
            // For now, we'll just check if the session exists
            const sessionAge = Date.now() - new Date(adminSession.value.lastLogin).getTime();
            const maxAge = formData.rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day

            if (sessionAge > maxAge) {
                // Session expired
                clearAdminSession();
                return false;
            }

            return true;
        } catch (error) {
            console.error("Session validation error:", error);
            clearAdminSession();
            return false;
        }
    };

    // Initialize authentication state
    const initAuth = async (): Promise<void> => {
        const isValid = await validateSession();
        if (!isValid && adminSession.value) {
            clearAdminSession();
        }
    };

    return {
        // State
        formData,
        isLoading,
        hasError,
        errorMessage,
        isAuthenticated,
        currentUser,

        // Methods
        login,
        logout,
        resetForm,
        checkAuth,
        validateSession,
        initAuth,
    };
};
