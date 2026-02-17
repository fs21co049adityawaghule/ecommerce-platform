import mongoose, { Document, Schema } from 'mongoose';

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    color?: string;
    size?: string;
    addedAt: Date;
  }[];
  couponCode?: string;
  coinsToUse: number;
  updatedAt: Date;
  createdAt: Date;
}

const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    color: String,
    size: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  couponCode: {
    type: String
  },
  coinsToUse: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for user lookup
cartSchema.index({ user: 1 });

export default mongoose.model<ICart>('Cart', cartSchema);