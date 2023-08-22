import { writable } from 'svelte/store';
export const season = writable('Spring'); // Default value can be empty or a specific season

export const shouldChangePipe = writable(false);
export const shouldAlternate = writable(false);
export const gamePaused = writable(false);
export const showDialog = writable(false);
export const selectedEffect = writable(null);
export const loadingDialog = writable(false);

