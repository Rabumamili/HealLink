// Base Repository with generic CRUD operations
export abstract class BaseRepository<T extends { id: number }> {
  protected items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const newItem = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as T;
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, data: Partial<T>): T | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString()
    } as T;
    return this.items[index];
  }

  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  private generateId(): number {
    return Date.now();
  }
}