export abstract class HashGenerator {
  abstract compare(plain: string, hashed: string): Promise<boolean>
}
