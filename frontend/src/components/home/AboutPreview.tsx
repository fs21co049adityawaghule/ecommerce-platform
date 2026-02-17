import Link from 'next/link';
import Image from 'next/image';

export default function AboutPreview() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800"
                alt="About ShopEase"
                fill
                className="object-cover"
              />
            </div>
            {/* Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6">
              <p className="text-4xl font-bold text-primary-600">5+</p>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>

          <div>
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              About Us
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Trusted Shopping Partner
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              At ShopEase, we believe in delivering quality products with exceptional service. 
              Our curated collection brings you the best from around the world, 
              backed by our commitment to customer satisfaction.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-3xl font-bold text-primary-600">50K+</p>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">10K+</p>
                <p className="text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">99%</p>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary-600">24/7</p>
                <p className="text-gray-600">Customer Support</p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center btn-primary"
            >
              Learn More About Us
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}