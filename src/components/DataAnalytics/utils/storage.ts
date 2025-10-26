import type { SavedView } from "../types/types";

const STORAGE_KEY = 'fermix_saved_views_v1';

const loadSavedViews = (): SavedView[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as SavedView[];
    } catch (e) {
        console.error('Error loading saved views:', e);
        return [];
    }
};

const saveSavedViews = (views: SavedView[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
    } catch (e) {
        console.error('Error saving views:', e);
    }
};

export {
    loadSavedViews,
    saveSavedViews
}