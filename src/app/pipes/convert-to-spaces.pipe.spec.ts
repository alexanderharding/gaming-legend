import { ConvertToSpacesPipe } from './convert-to-spaces.pipe';

describe('ConvertToSpacesPipe', () => {
  describe('transform', () => {
    it('should convert the value to spaces', () => {
      const pipe = new ConvertToSpacesPipe();

      const result = pipe.transform('john', 'o');

      expect(result).toBe('j hn');
    });

    it('should not break when the string is empty', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform('', '-');

      // Assert
      expect(result).toBe('');
    });

    it('should not break when the string is null', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform(null, '-');

      // Assert
      expect(result).toBeNull();
    });

    it('should not break when the character is empty', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform('john', '');

      // Assert
      expect(result).toBe('john');
    });

    it('should not break when the character is null', () => {
      // Arrange
      const pipe = new ConvertToSpacesPipe();

      // Act
      const result = pipe.transform('', null);

      // Assert
      expect(result).toBe('');
    });
  });
});
