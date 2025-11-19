import * as s from 'superstruct';

export const CreateCuration = s.object({
  nickname: s.size(s.string(), 1, 10),
  content: s.string(),
  password: s.string(),
  trendy: s.max(s.min(s.number(), 0), 10),
  personality: s.max(s.min(s.number(), 0), 10),
  practicality: s.max(s.min(s.number(), 0), 10),
  costEffectiveness: s.max(s.min(s.number(), 0), 10)
});

export const PatchCuration = s.object({
  nickname: s.size(s.string(), 1, 10),
  content: s.string(),
  password: s.string(),
  trendy: s.max(s.min(s.number(), 0), 10),
  personality: s.max(s.min(s.number(), 0), 10),
  practicality: s.max(s.min(s.number(), 0), 10),
  costEffectiveness: s.max(s.min(s.number(), 0), 10)
});

