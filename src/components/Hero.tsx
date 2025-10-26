import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import HeroCarousel from './HeroCarousel';


export default function Hero() {

  return (
    <section className='grid grid-cols-1 lg:grid-cols-2 gap-24 items-center'>

      <div>
        <h1 className='max-w-2xl text-4xl font-bold tracking-tight  sm:text-6xl '>
          We’re changing the way people shop.
        </h1>

        <p className='mt-8 max-w-xl text-lg leading-8'>
          When you shop with us, you're not just buying a product, you're 
          supporting a movement toward mindful consumption and a more sustainable future.
          <br />
          Our goal? Great products. Fair prices. Fast service.
        </p>

        <Button asChild size='lg' className='mt-10'>
          <Link to='/products'>Our Products</Link>
        </Button>
      </div>

      {/* hero carousel */}
      <HeroCarousel />

    </section>
  )
}