import { ConvertToSpacesPipe } from './convert-to-spaces.pipe';

describe('ConvertToSpacesPipe', () => {
  describe('transform', () => {
    it('should convert the value to spaces', () => {
      const pipe = new ConvertToSpacesPipe();

      const result = pipe.transform('alex', 'e');

      expect(result).toBe('al x');
    });

    it('should not break when the string is empty', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform('', '');

      // Assert
      expect(result).toBe('');
    });

    it('should not break when the string is null', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform(null, null);

      // Assert
      expect(result).toBe(null);
    });
  });
});
