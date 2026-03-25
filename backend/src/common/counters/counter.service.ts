import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(@InjectModel(Counter.name) private counterModel: Model<CounterDocument>) {}

  async generateItemId(sequencePattern: string): Promise<string> {
    const counter = await this.counterModel
      .findOneAndUpdate(
        { sequencePattern },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true },
      )
      .exec();

    if (!counter) {
      throw new NotFoundException('Counter not found');
    }

    // Format the itemId if needed
    const itemId = `I-MAK-${counter.sequenceValue.toString().padStart(4, '0')}`;
    return itemId;
  }
}
