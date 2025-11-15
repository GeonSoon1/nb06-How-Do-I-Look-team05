import * as s from 'superstruct';

export const CreateComment = s.object({
  content: s.size(s.string(), 1, 50),
  password: s.size(s.string(), 1, 10)
});

export const PatchComment = s.object({
  content: s.size(s.string(), 1, 50),
  password: s.size(s.string(), 1, 10)
});

export const DeleteComment = s.object({
  password: s.size(s.string(), 1, 10)
});
