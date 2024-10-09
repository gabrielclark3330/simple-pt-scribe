import { useRef } from 'react';
import BookDemo from './BookDemo';
import Contact from './Contact';
import Demo from './Demo';
import Footer from './Footer';
import Header from './Header';
import HeroSection from './HeroSection';
import Percentages from './Percentages';
import Pricing from './Pricing';


function LandingPage() {
  const topRef = useRef(null);
  const pricingRef = useRef(null);
  const contactRef = useRef(null);
      /*
      <div ref={contactRef}>
        <Contact/>
      </div>
      */
  return (
    <div className='bg-[#f5f5f7]'>
      <div ref={topRef}>
        <Header items={["Home", "Pricing", "Contact"]} links={[topRef, pricingRef, contactRef]} itemSelected={0}/>
      </div>
      <HeroSection/>
      <Demo/>
      <div ref={pricingRef}>
        <Pricing/>
      </div>
      <div ref={contactRef}>
        <BookDemo/>
      </div>
      <Footer/>
    </div>
  );
}

export default LandingPage;
