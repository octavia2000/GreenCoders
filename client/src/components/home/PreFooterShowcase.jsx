import leftMain from '../../assets/images/bigsale-1.svg';
import leftTop from '../../assets/images/bigsale-5.svg';
import leftBack from '../../assets/images/bidsale-2.svg';
import rightPhone from '../../assets/images/bigsale-3.svg';
import rightWatch from '../../assets/images/bigsale-4.svg';

export function PreFooterShowcase() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Gradient backdrop matching Popular on demand cards */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#303430] to-[#4A4C4A]" />
      {/* Subtle radial vignette like the reference */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.7)_100%)]" />

      <div className="relative container mx-auto px-6 lg:px-16 xl:px-28 py-16 lg:py-20">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Left cluster: tablet stack (green-circled) */}
          <div className="relative flex justify-center lg:justify-start min-h-[12rem] lg:min-h-[18rem]">
            {/* Back image */}
            <img src={leftBack} alt="Device back" className="hidden lg:block absolute -left-10 -top-8 h-24 lg:h-28 opacity-90 object-contain" />
            {/* Main device */}
            <img src={leftMain} alt="Device main" className="h-48 lg:h-72 object-contain drop-shadow-2xl" />
            {/* Small overlay */}
            <img src={leftTop} alt="Accessory" className="hidden lg:block absolute left-16 -top-12 h-20 lg:h-24 object-contain drop-shadow-xl" />
          </div>

          {/* Text + Right images */}
          <div className="relative min-h-[14rem] lg:min-h-[20rem] text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
              Big Summer <span className="text-green-400 font-bold">Sale</span>
            </h2>
            <p className="mt-3 mx-auto text-sm sm:text-base text-gray-200 max-w-md">
              Commodo fames vitae vitae leo mauris in. Eu consequat.
            </p>
            <div className="mt-6">
              <button className="mx-auto inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-2 text-sm font-medium hover:bg-white hover:text-gray-900 transition">
                Shop Now
              </button>
            </div>

            {/* Right cluster: phone + watch (white-circled) */}
            <img src={rightPhone} alt="Phone" className="hidden lg:block absolute -right-4 -top-20 h-40 object-contain drop-shadow-xl" />
            <img src={rightWatch} alt="Watch" className="hidden lg:block absolute right-8 top-8 h-60 object-contain drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

