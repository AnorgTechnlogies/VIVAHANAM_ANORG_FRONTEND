import React, { useEffect, useRef } from 'react';

const VivahanamPage = () => {
  const topRef = useRef(null);
  // Auto-scroll to top when component mounts
  useEffect(() => {
    // Smooth scroll to the top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="bg-amber-100 text-gray-800 min-h-screen p-6 md:p-8 mt-13 md:mt-16 lg:mt-20 font-serif">
      {/* Add these to your head section or CSS file */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;500;600;700&family=Noto+Serif:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .vedic-font {
          font-family: 'Noto Serif Devanagari', 'Noto Serif', 'Playfair Display', serif;
        }
        
        .vedic-heading {
          font-family: 'Playfair Display', 'Noto Serif Devanagari', serif;
          font-weight: 700;
        }
        
        .vedic-number {
          font-family: 'Noto Serif Devanagari', serif;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with ref for auto-scroll */}
        <div ref={topRef}>
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-red-700 vedic-heading tracking-wide">
              विवाहनम्: किमर्थम्?<br />
              <span className="py-5 text-2xl md:text-3xl lg:text-4xl mt-2 block">Why Vivahanam?</span>
            </h1>
            <div className="w-32 h-1.5 bg-red-600 mx-auto mb-6 rounded-full"></div>
          </header>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Point 1 */}
              <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-red-600">
            <div className="flex items-start">
              <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">१</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  Many parents and families in North America are in deep emotional pain and are 
                  searching for spiritually guided platforms where their children can connect with 
                  like-minded individuals who value dharma, commitment, and lifelong partnership.
                </p>
              </div>
            </div>
          </section>

        

          {/* Point 2 */}
          <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-amber-600">
            <div className="flex items-start">
              <div className="bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">२</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  Marriage is increasingly being treated as a materialistic showcase rather than a 
                  sacred union of souls. This shift in mindset often results in emotional disconnect, 
                  lack of values alignment, and break-ups within just 2–3 years.
                </p>
              </div>
            </div>
          </section>

          {/* Point 3 */}
      
  <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-red-600">
            <div className="flex items-start">
              <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">३</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  For a long time, spiritually inclined parents have been deeply concerned about the 
                  ever-increasing cost of marriages. The blind adoption of destination weddings and 
                  extravagant celebrations leads to an enormous waste of money and resources for 
                  events that last only 2–3 hours. As of today, no platform actively encourages simple 
                  and affordable marriages—instead, extravagance has become the norm.
                </p>
              </div>
            </div>
          </section>


          {/* Point 4 */}
          <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-amber-600">
            <div className="flex items-start">
              <div className="bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">४</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  There is growing concern over the "use-and-throw" culture prevalent in Western 
                  societies, where even human relationships are treated as disposable—contributing 
                  significantly to the rising number of divorces.
                </p>
              </div>
            </div>
          </section>

          {/* Point 5 */}
          <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-red-600">
            <div className="flex items-start">
              <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">५</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  Like-minded communities such as Gayatri Parivar Parijans, Jain families, Arya Samaj 
                  followers, Chinmay Mission, Swami Narayan Gujarati samaj and other spiritually 
                  rooted groups wish to find brides and grooms within the same value system. At present, 
                  there is no dedicated platform that truly supports such community-aligned matchmaking.
                </p>
              </div>
            </div>
          </section>

          {/* Point 6 */}
          <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-amber-600">
            <div className="flex items-start">
              <div className="bg-amber-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">६</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  No existing platform promotes or facilitates Samuhik Vivah (Collective Community 
                  Wedding Ceremony)—a sacred and time-tested tradition that reduces financial burden, 
                  promotes equality, and strengthens community bonds.
                </p>
              </div>
            </div>
          </section>

          {/* Point 7 */}
          <section className="bg-white/80 p-6 rounded-2xl shadow-md border-l-4 border-red-600">
            <div className="flex items-start">
              <div className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1 shadow-lg">
                <span className="text-lg font-semibold vedic-number">७</span>
              </div>
              <div>
                <p className="text-lg leading-relaxed vedic-font text-justify">
                  At present, there is no holistic platform that upholds the Vedic vision of life by offering 
                  end-to-end support—from spiritually aligned matchmaking rooted in dharma to sacred, 
                  scripture-guided wedding ceremonies and simple, affordable wedding preparations.
                  Moreover, no platform nurtures the continuity of Vedic living by promoting post-marital 
                  sanskars such as Punsavan Sanskar, Garbha Sanskar, Birth Sanskar, Namkaran 
                  Sanskar, and other essential life-journey rituals that sanctify family life.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Vedic Symbols Section */}
        <div className="mt-12 py-8 border-t-2 border-amber-300">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-red-700 vedic-heading">
              सनातन संस्कार: वैदिक मार्गदर्शन<br />
              <span className="text-xl md:text-2xl">Sanatan Sanskar: Vedic Guidance</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-red-700 p-4 rounded-lg shadow-sm">
                <div className="text-3xl mb-2 vedic-number text-white">ॐ</div>
                <p className="text-sm font-semibold text-white">Cosmic Unity</p>
              </div>
              <div className="bg-red-700 p-4 rounded-lg shadow-sm">
                <div className="text-3xl mb-2 vedic-number text-white">श्री</div>
                <p className="text-sm font-semibold text-white">Prosperity</p>
              </div>
              <div className="bg-red-700 p-4 rounded-lg shadow-sm">
                <div className="text-3xl mb-2 vedic-number text-white">ह</div>
                <p className="text-sm font-semibold text-white">Divine Bliss</p>
              </div>
              <div className="bg-red-700 p-4 rounded-lg shadow-sm ">
                <div className="text-3xl mb-2 vedic-number text-white">स्वस्ति</div>
                <p className="text-sm font-semibold text-white">Well-being</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VivahanamPage;