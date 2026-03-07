import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: ReturnType<typeof useLoginMutation>;
    logoutMutation: ReturnType<typeof useLogoutMutation>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const {
        data: user,
        error,
        isLoading,
    } = useQuery<User>({
        queryKey: ["/api/user"],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || "";
            const res = await fetch(baseUrl + "/api/user", {
                credentials: "include"
            });
            if (!res.ok) {
                if (res.status === 401) return null;
                throw new Error("Failed to fetch user");
            }
            return res.json();
        },
    });

    const loginMutation = useLoginMutation();
    const logoutMutation = useLogoutMutation();

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error,
                loginMutation,
                logoutMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

function useLoginMutation() {
    return useMutation({
        mutationFn: async (credentials: Pick<InsertUser, "username" | "password">) => {
            const res = await apiRequest("POST", "/api/login", credentials);
            return await res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["/api/user"], data.user);
        },
    });
}

function useLogoutMutation() {
    return useMutation({
        mutationFn: async () => {
            await apiRequest("POST", "/api/logout");
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/user"], null);
        },
    });
}
