import * as s from 'superstruct';

export const CreateStyle = s.object({
  nickName: s.size(s.string(), 1, 30),
  title: s.size(s.string(), 1, 100),
  description: s.optional(s.string()),
  password: s.string(),
  tags: s.optional(s.array(s.string())),
  images: s.optional(s.array(s.string())),
  items: s.array(
    s.object({
      category: s.string(),
      itemName: s.string(),
      brandName: s.string(),
      price: s.number()
    })
  )
});

export const PatchStyle = s.partial(CreateStyle);
