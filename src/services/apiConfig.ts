import mockApi from './api';
import realApi from './realApi';

// Флаг для выбора API (мок или реальное API)
const USE_REAL_API = true;

// Экспортируем выбранный API
export default USE_REAL_API ? realApi : mockApi; 