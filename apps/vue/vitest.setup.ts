import '@testing-library/jest-dom';
import { vi } from 'vitest';

window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.alert = vi.fn();
