export abstract class HashComparer {
  /**
   * @abstract compare
   * @param {string} plain
   * @param {string} hashed
   * @return {Promise<boolean>}
   * @description Method to compare a plain text with a hashed text
   * @async
   * @access public
   * @example
   * const plain = 'plain_text'
   * const hashed = 'hashed_text'
   * const response = await hashComparer.compare(plain, hashed)
   * console.log(response) // Output: false
   * @throws {Error} This method must be implemented
   * **/
  abstract compare(plain: string, hashed: string): Promise<boolean>
}
