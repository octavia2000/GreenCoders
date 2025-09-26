import leftMain from "../../assets/images/bigsale-3.svg"
import leftTop from "../../assets/images/bigsale-5.svg"
import leftBack from "../../assets/images/bigsale-4.svg"
import rightPhone from "../../assets/images/image-7.svg"
import rightWatch from "../../assets/images/bigsale-2.svg"

export function PreFooterShowcase() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-[#303430] to-[#4A4C4A]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(0,0,0,0.55)_60%,rgba(0,0,0,0.7)_100%)]" />
      <div className="relative container mx-auto px-6 lg:px-16 xl:px-28 py-16 lg:py-20">
        <img src={leftMain} alt="" className="absolute left-[6%] z-40 bottom-0 w-[18rem]" />
        <img src={leftTop} alt="" className="absolute left-[14rem] top-0 w-[14rem]" />
        <img src={leftBack} alt="" className="absolute left-20 bottom-1/2 w-48" />
        <img src={rightPhone} alt="" className="absolute right-20 top-[52%] z-40 w-64" />
        <img src={rightWatch} alt="" className="absolute right-0 bottom-0 w-56" />
        <div className="text-center relative z-10">
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
        </div>
      </div>
    </section>
  )
}
