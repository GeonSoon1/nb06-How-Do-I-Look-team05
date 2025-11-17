import { assert } from 'superstruct'

export const curationVaildator = (structs) => {
  return async (req, res, next) => {
    try {
      assert(req.body, structs)
      next();
    } catch (e) {
      next();
    }
  }
}