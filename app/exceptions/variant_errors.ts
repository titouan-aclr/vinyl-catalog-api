export class VariantNotFoundError extends Error {
  constructor() {
    super('Variant not found')
    this.name = 'VariantNotFoundError'
  }
}

export class InsufficientStockError extends Error {
  constructor(available: number, requested: number) {
    super(`Insufficient stock: ${available} available, ${requested} requested`)
    this.name = 'InsufficientStockError'
  }
}

export class DuplicateSkuError extends Error {
  constructor() {
    super('A variant with this SKU already exists')
    this.name = 'DuplicateSkuError'
  }
}
