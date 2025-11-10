import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * 에러 핸들러 데이터 로드 함수
 * @param {string} errorHandlerDir - 에러 핸들러 디렉토리 경로
 * @returns {Promise<Object>} 로드된 에러 핸들러들
 */
export async function loadErrorHandlers(errorHandlerDir) {
  const errorHandlers = {};

  try {
    const files = await fs.readdir(errorHandlerDir);
    for (const file of files) {
      if (file.endsWith('_error.json')) {
        const moduleName = file.replace('_error.json', '');
        const filePath = join(errorHandlerDir, file);
        try {
          const content = await fs.readFile(filePath, 'utf8');
          if (content.trim()) {
            const data = JSON.parse(content);
            errorHandlers[moduleName] = data.errors;
          }
        } catch (error) {
          console.warn(`Failed to parse ${file}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error('Error loading error handlers:', error);
  }

  return errorHandlers;
}

/**
 * 유효성 검사 규칙 로드 함수
 * @param {string} errorHandlerDir - 에러 핸들러 디렉토리 경로
 * @returns {Promise<Object>} 로드된 유효성 검사 규칙
 */
export async function loadValidationRules(errorHandlerDir) {
  try {
    const content = await fs.readFile(
      join(errorHandlerDir, 'validation_rules.json'),
      'utf8'
    );
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading validation rules:', error);
    return {};
  }
}
