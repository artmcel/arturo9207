import { User, UserPublic } from '@shared/types';

class UserModel {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async updateBalance(userId: string, newBalance: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.balance = newBalance;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  toPublic(user: User): UserPublic {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}

export const userModel = new UserModel();