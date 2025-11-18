import { assert } from 'superstruct';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const images = (req.files || []).map((file) => `/uploads/${file.filename}`);

      if (images.length > 10) {
        const error = new Error('이미지는 최대 10개까지 업로드할 수 있습니다.');
        error.statusCode = 400;
        throw error;
      }
      const { tags, categories, nickname, content, ...styleData } = req.body;

      const parsedCategories =
        categories && typeof categories === 'string' ? JSON.parse(categories) : categories || {};
      const parsedTags = tags && typeof tags === 'string' ? JSON.parse(tags) : tags || [];

      if (parseTags.length > 3) {
        const error = new Error('태그는 최대 3개까지 추가할 수 있습니다.');
        error.statusCode = 400;
        throw error;
      }
      const items = Object.entries(parsedCategories).map(([category, details]) => ({
        category,
        itemName: details.name,
        brandName: details.brand,
        price: Number(details.price)
      }));

      const dataForValidation = {
        ...styleData,
        nickname,
        content,
        tags: parsedTags,
        images,
        items
      };

      assert(dataForValidation, schema);
      console.log('유효성 검사 완료!');

      const processedData = {
        ...dataForValidation,
        images: dataForValidation.images.map((imageUrl, index) => ({
          url: imageUrl,
          isThumbnail: index === 0
        }))
      };

      req.body = processedData;
      next();
    } catch (err) {
      console.error('Validation Error: ', err);
      next(err);
    }
  };
};
