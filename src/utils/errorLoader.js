import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import AppError from '../errors/AppError.js';

// 상수 정의
const ERROR_FILE_SUFFIX = '_error.json';
const VALIDATION_RULES_FILE = 'validation_rules.json';

/**
 * 디렉토리 경로 유효성 검사
 * @param {string} dirPath - 검사할 디렉토리 경로
 * @throws {AppError} 경로가 유효하지 않은 경우
 */
async function validateDirectory(dirPath) {
  if (typeof dirPath !== 'string' || !dirPath.trim()) {
    throw new AppError(
      'INVALID_PATH',
      '에러 핸들러 디렉토리 경로는 비어있지 않은 문자열이어야 합니다.',
      400
    );
  }

  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      throw new AppError(
        'INVALID_PATH',
        '지정된 경로는 디렉토리가 아닙니다.',
        400
      );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'PATH_NOT_FOUND',
      `디렉토리를 찾을 수 없습니다: ${dirPath}`,
      404
    );
  }
}

/**
 * JSON 파일 파싱 헬퍼 함수
 * @param {string} filePath - 파일 경로
 * @param {string} fileName - 파일 이름 (에러 메시지용)
 * @returns {Promise<Object>} 파싱된 JSON 객체
 * @throws {AppError} 파싱 실패 시
 */
async function parseJsonFile(filePath, fileName) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (!content.trim()) {
      throw new AppError('EMPTY_FILE', `파일이 비어있습니다: ${fileName}`, 400);
    }
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.code === 'ENOENT') {
      throw new AppError(
        'FILE_NOT_FOUND',
        `파일을 찾을 수 없습니다: ${fileName}`,
        404
      );
    }
    throw new AppError(
      'PARSE_ERROR',
      `JSON 파싱 실패: ${fileName} - ${error.message}`,
      400
    );
  }
}

/**
 * 에러 핸들러 데이터 로드 함수
 * @param {string} errorHandlerDir - 에러 핸들러 디렉토리 경로
 * @returns {Promise<Object>} 로드된 에러 핸들러들 (모듈명 -> 에러 배열)
 * @throws {AppError} 로드 실패 시
 */
export async function loadErrorHandlers(errorHandlerDir) {
  const resolvedDir = resolve(errorHandlerDir);
  await validateDirectory(resolvedDir);

  const errorHandlers = {};

  try {
    const files = await fs.readdir(resolvedDir);
    const errorFiles = files.filter((file) => file.endsWith(ERROR_FILE_SUFFIX));

    // 병렬로 파일 읽기
    const filePromises = errorFiles.map(async (file) => {
      const moduleName = file.replace(ERROR_FILE_SUFFIX, '');
      const filePath = join(resolvedDir, file);

      try {
        const data = await parseJsonFile(filePath, file);
        if (!data.errors || !Array.isArray(data.errors)) {
          throw new AppError(
            'INVALID_STRUCTURE',
            `잘못된 파일 구조: ${file} (errors 배열이 필요합니다)`,
            400
          );
        }
        return { moduleName, errors: data.errors };
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
          'FILE_LOAD_ERROR',
          `파일 로드 실패: ${file} - ${error.message}`,
          500
        );
      }
    });

    const results = await Promise.allSettled(filePromises);

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { moduleName, errors } = result.value;
        errorHandlers[moduleName] = errors;
      } else {
        // 개별 파일 에러는 경고로 처리하고 계속 진행
        console.warn(`에러 핸들러 파일 로드 실패: ${result.reason.message}`);
      }
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'DIRECTORY_READ_ERROR',
      `디렉토리 읽기 실패: ${error.message}`,
      500
    );
  }

  return errorHandlers;
}

/**
 * 유효성 검사 규칙 로드 함수
 * @param {string} errorHandlerDir - 에러 핸들러 디렉토리 경로
 * @returns {Promise<Object>} 로드된 유효성 검사 규칙
 * @throws {AppError} 로드 실패 시
 */
export async function loadValidationRules(errorHandlerDir) {
  const resolvedDir = resolve(errorHandlerDir);
  await validateDirectory(resolvedDir);

  const filePath = join(resolvedDir, VALIDATION_RULES_FILE);
  const data = await parseJsonFile(filePath, VALIDATION_RULES_FILE);

  return data;
}
