export interface FormFieldSchema {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "date" | "email" | "password";
    required?: boolean;
    options?: { label: string; value: any }[];
    grid?: { xs?: number; sm?: number; md?: number };
    defaultValue?: any;
    showIf?: (values: Record<string, any>) => boolean;
}

export interface ViewFieldSchema {
    name: string;
    label: string;
    type?: "text" | "chip" | "date" | "currency" | "boolean";
    colorMap?: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning">;
}

export interface ShellConfig {
    id: string;
    showSidebar: boolean;
    showTopbar: boolean;
    sidebarPosition: "left" | "right";
    sidebarCollapsible: boolean;
}

export interface ModuleAppConfig {
    id: string;
    label: string;
    path: string;
    icon: string;
    permission: string;
    shellId: string;
    layout: {
        type: "dashboard" | "crud" | "custom";
        blocks?: any[];
        resource?: string;
        columns?: any[];
        formSchema?: FormFieldSchema[];
        viewSchema?: ViewFieldSchema[];
    };
}

export interface AppConfig {
    settings: {
        brandName: string;
        logoText: string;
    };
    shells: Record<string, ShellConfig>;
    modules: ModuleAppConfig[];
}
