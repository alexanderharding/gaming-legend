import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  describe('transform', () => {
    it('should capitalize a word', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('alex');

      // Assert
      expect(result).toBe('Alex');
    });

    it('should capitalize a sentence of words', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('alex harding is the best');

      // Assert
      expect(result).toBe('Alex Harding Is The Best');
    });

    it('should not break when the string is empty', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('');

      // Assert
      expect(result).toBe('');
    });

    it('should not break when the string is null', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform(null);

      // Assert
      expect(result).toBe(null);
    });

    it('should capitalize a sinlge letter word', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('a');

      // Assert
      expect(result).toBe('A');
    });

    it('should capitalize a single letter words', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('a b c');

      // Assert
      expect(result).toBe('A B C');
    });
  });
});
