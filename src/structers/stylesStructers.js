import * as s from 'superstruct';
import isUuid from 'is-uuid';
import isEmail from 'is-email';

const styleStruct = {
  nickName: s.size(s.string(), 1, 30),
  title: s.size(s.string(), 1, 100),
  description: s.string(),
  password: s.string(),
  trendyAverage: s.number(),
  uniqueAverage: s.number(),
  practicalAverage: s.number(),
  costEffectiveAverage: s.number(),
  totalAverage: s.number(),
  viewCount: s.number(),
  tags: s.optional(s.array(s.string())),
  images: s.optional(s.array(s.string())),
  items: s.array(s.string()),
  curations: s.array(s.string()),
};
