import { assert } from 'superstruct';

export const curationValidator = (structs) => {
  return async (req, res, next) => {
    try {
      //form-data는 모든 값이 string이라 숫자 필드를 먼저 number로 변환
      const numberFields = [
        'trendy',
        'personality',
        'practicality',
        'costEffectiveness'
      ];

      numberFields.forEach((field) => {
        if (req.body[field] !== undefined && req.body[field] !== '') {
          req.body[field] = Number(req.body[field]);
        }
      });

      // 변환된 body를 superstruct로 검사
      assert(req.body, structs);

      next();
    } catch (e) {
      next(e);
    }
  };
};
