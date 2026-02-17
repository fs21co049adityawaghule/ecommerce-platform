import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import NewLaunches from '@/components/home/NewLaunches';
import TrendingProducts from '@/components/home/TrendingProducts';
import MostSelling from '@/components/home/MostSelling';
import FeaturedReviews from '@/components/home/FeaturedReviews';
import CouponCenter from '@/components/home/CouponCenter';
import CoinsRewards from '@/components/home/CoinsRewards';
import AboutPreview from '@/components/home/AboutPreview';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <NewLaunches />
      <TrendingProducts />
      <MostSelling />
      <FeaturedReviews />
      <CouponCenter />
      <CoinsRewards />
      <AboutPreview />
    </main>
  );
}