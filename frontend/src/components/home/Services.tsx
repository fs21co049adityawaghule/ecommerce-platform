import { FiTruck, FiHeadphones, FiCreditCard, FiRefreshCw, FiGift } from 'react-icons/fi';

const services = [
  {
    icon: FiTruck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders over ₹999',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Round the clock customer service',
  },
  {
    icon: FiCreditCard,
    title: 'Secure Payment',
    description: '100% secure payment methods',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Returns',
    description: '7-day hassle-free returns',
  },
  {
    icon: FiGift,
    title: 'Gift Packaging',
    description: 'Beautiful gift wrapping available',
  },
];

export default function Services() {
  return (
    <section className="py-12 bg-white border-b">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <service.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}