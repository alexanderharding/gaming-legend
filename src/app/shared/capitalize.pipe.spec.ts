import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  describe('transform', () => {
    it('should capitalize a word', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('john');

      // Assert
      expect(result).toBe('John');
    });

    it('should lowercase every character except the first', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('JOHN');

      // Assert
      expect(result).toBe('John');
    });

    it('should capitalize a sentence of words', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('john DOE is the best');

      // Assert
      expect(result).toBe('John Doe Is The Best');
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
      expect(result).toBeNull();
    });

    it('should capitalize a single letter word', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('a');

      // Assert
      expect(result).toBe('A');
    });

    it('should capitalize single letter words', () => {
      // Arrange
      const pipe = new CapitalizePipe();

      // Act
      const result = pipe.transform('a b c');

      // Assert
      expect(result).toBe('A B C');
    });
  });
});
