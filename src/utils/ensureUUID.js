import { Utils } from '../utils.js';

// ensure UUID exists in localStorage
export async function ensureUUID() {
    if (!localStorage.getItem('vertex_uuid')) {
        localStorage.setItem('vertex_uuid', await Utils.getFingerprint());
    }
}