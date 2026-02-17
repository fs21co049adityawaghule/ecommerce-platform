import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              New Collection 2024
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Premium
              <span className="text-gradient block">Products</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Explore our curated collection of high-quality products. From electronics to fashion, 
              find everything you need with exclusive deals and rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop" className="btn-primary text-center">
                Shop Now
              </Link>
              <Link href="/about" className="btn-outline text-center">
                Learn More
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">99%</p>
                <p className="text-gray-600">Satisfaction</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="Premium Products"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <p className="text-2xl font-bold text-primary-600">50% OFF</p>
                <p className="text-gray-600">On First Order</p>
              </div>
              {/* Another Badge */}
              <div className="absolute -top-6 -right-6 bg-secondary-500 text-white rounded-2xl shadow-xl p-6">
                <p className="text-3xl font-bold">★</p>
                <p className="text-sm">Top Rated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}