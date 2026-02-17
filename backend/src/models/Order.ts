import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color?: string;
    size?: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactNumber: string;
  paymentInfo: {
    id: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    method: 'card' | 'upi' | 'cod';
    amount: number;
    paidAt?: Date;
  };
  priceBreakdown: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    couponDiscount: number;
    coinsDiscount: number;
    total: number;
  };
  couponCode?: string;
  coinsUsed: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingStatus: 'pending' | 'packed' | 'shipped' | 'in_transit' | 'delivered';
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    color: String,
    size: String
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  contactNumber: {
    type: String,
    required: true
  },
  paymentInfo: {
    id: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'cod'],
      required: true
    },
    amount: { type: Number, required: true },
    paidAt: Date
  },
  priceBreakdown: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    coinsDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  couponCode: {
    type: String
  },
  coinsUsed: {
    type: Number,
    default: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'packed', 'shipped', 'in_transit', 'delivered'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
  deliveredAt: Date
}, {
  timestamps: true
});

// Index for querying orders by user
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

export default mongoose.model<IOrder>('Order', orderSchema);