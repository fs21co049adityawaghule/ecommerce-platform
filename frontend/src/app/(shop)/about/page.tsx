import Image from 'next/image';
import { FiAward, FiUsers, FiTruck, FiHeadphones } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, value: '50,000+', label: 'Happy Customers' },
  { icon: FiAward, value: '10,000+', label: 'Products' },
  { icon: FiTruck, value: '99%', label: 'On-Time Delivery' },
  { icon: FiHeadphones, value: '24/7', label: 'Customer Support' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-gradient">ShopEase</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted destination for premium products and exceptional shopping experiences.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At ShopEase, we believe everyone deserves access to high-quality products at 
                fair prices. Our mission is to curate the best selection of items from around 
                the world, ensuring authenticity and value in every purchase.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We are committed to sustainable practices, supporting local artisans, and 
                creating a shopping experience that brings joy to our customers while 
                respecting our planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality First',
                description: 'We never compromise on quality. Every product is carefully vetted.',
              },
              {
                title: 'Customer Focus',
                description: 'Your satisfaction is our priority. We are here to help 24/7.',
              },
              {
                title: 'Integrity',
                description: 'Honest pricing, transparent policies, and ethical practices.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center p-8 bg-gray-50 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}