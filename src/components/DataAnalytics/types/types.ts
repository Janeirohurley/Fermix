type SavedView = {
    id: string;
    name: string;
    formName: string;
    visibleFields: string[];
    filters?: Record<string, unknown>;
    createdAt: string;
};
export type { SavedView };