import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperCore } from 'swiper/types'
import { EffectCoverflow, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { products } from '~/dummyData/product'

export default function CustomizeProduct() {
  const swiperRef = useRef<SwiperCore | null>(null)
  const colors = [
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ffffff',
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00'
  ] // Array of colors

  const [quantity, setQuantity] = useState(1)

  const handleColorSelect = (index: number) => {
    if (swiperRef.current) {
      const swiper = swiperRef.current // Get Swiper instance
      const newProgress = index / (colors.length - 1) // Calculate progress based on color index
      //0 to 1
      swiper.setProgress(newProgress, 500) // 500ms speed for transition
    }
  }

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1))
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen px-[1%]'>
      <div className='slider-container basis-[55%] grid grid-rows-6 '>
        <div className='row-span-2'></div>
        <Swiper
          speed={500}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className='h-[80%] w-full relative row-span-4'
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 100,
            depth: 0,
            modifier: 1,
            scale: 0.8,
            slideShadows: false
          }}
          breakpoints={{
            640: {},
            768: {},
            1024: {}
          }}
          navigation={{ nextEl: '.next-slide-controller', prevEl: '.back-slide-controller' }}
          modules={[EffectCoverflow, Navigation]}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index} className='w-[50%] h-full'>
              <img className='object-contain w-full h-full' src={product.img} alt={product.name} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='flex justify-around row-span-2 slider-controler py-[2%]'>
          <svg
            className='p-2 bg-black rounded-full cursor-pointer back-slide-controller'
            xmlns='http://www.w3.org/2000/svg'
            height='48px'
            viewBox='0 -960 960 960'
            width='48px'
            fill='#e8eaed'
          >
            <path d='m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z' />
          </svg>
          <svg
            className='p-2 bg-black rounded-full cursor-pointer next-slide-controller'
            xmlns='http://www.w3.org/2000/svg'
            height='48px'
            viewBox='0 -960 960 960'
            width='48px'
            fill='#e8eaed'
          >
            <path d='M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z' />
          </svg>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center  customize basis-[45%] gap-2 my-3'>
        <div className='border-solid border-black w-[90%]  h-[80%] border-2 py-[2%]'>
          <div className='flex flex-col w-full h-full gap-10 text-center justify-evenly item-center'>
            <div className='w-1/2 relative after:absolute after:bottom-[-25%] after:left-[50%] after:translate-x-[-50%] after:bg-black after:h-[2px] text-4xl font-bold mx-auto after:lg:w-96 after:sm:w-40'>
              Customize
            </div>
            <div className='w-3/4 relative flex flex-col gap-3 colors after:absolute after:bottom-[-25%] after:left-[50%] after:translate-x-[-50%] after:bg-black after:h-[2px] mx-auto after:lg:w-96 after:sm:w-40'>
              <label className='text-2xl text-left'>Color:</label>
              <div className='flex justify-around gap-2 colorbutton'>
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className='w-6 h-6 lg:w-8 lg:h-8'
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(index)}
                  ></button>
                ))}
              </div>
            </div>
            <div className='w-3/4 relative flex flex-col gap-3 colors after:absolute after:bottom-[-25%] after:left-[50%] after:translate-x-[-50%] after:bg-black after:h-[2px] mx-auto after:lg:w-96 after:sm:w-40'>
              <label className='text-2xl text-left'>Item:</label>
              <div className='flex justify-center gap-8 colorbutton'>
                <img className='w-10 h-10 lg:w-16 lg:h-16 bg-gray-50' alt='' />
                <img className='w-10 h-10 lg:w-16 lg:h-16 bg-gray-50' alt='' />
                <img className='w-10 h-10 lg:w-16 lg:h-16 bg-gray-50' alt='' />
              </div>
            </div>
            <div className='flex items-center justify-evenly'>
              <div className='flex gap-10 size'>
                <button className='w-6 h-6 bg-gray-300 lg:w-8 lg:h-8'></button>
                <button className='w-6 h-6 bg-gray-300 lg:w-8 lg:h-8'></button>
                <button className='w-6 h-6 bg-gray-500 lg:w-8 lg:h-8'></button>
              </div>
              <div className='text-3xl'>|</div>

              <div className='relative flex items-center max-w-[8rem]'>
                <button
                  type='button'
                  id='decrement-button'
                  onClick={decrementQuantity}
                  data-input-counter-decrement='quantity-input'
                  className='p-3 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 rounded-s-lg h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none'
                >
                  <svg
                    className='w-3 h-3 text-gray-900 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 2'
                  >
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M1 1h16'
                    />
                  </svg>
                </button>
                <input
                  type='text'
                  id='quantity-input'
                  value={quantity}
                  data-input-counter
                  aria-describedby='helper-text-explanation'
                  className='bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='999'
                  required
                />
                <button
                  type='button'
                  id='increment-button'
                  onClick={incrementQuantity}
                  data-input-counter-increment='quantity-input'
                  className='p-3 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 rounded-e-lg h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none'
                >
                  <svg
                    className='w-3 h-3 text-gray-900 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 18'
                  >
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M9 1v16M1 9h16'
                    />
                  </svg>
                </button>
              </div>

              {/* <div className='flex quantity justify-evenly gap-9'>
                <button onClick={decrementQuantity}>-</button>
                <input
                  type='number'
                  className='w-8 h-8 text-center bg-white border border-black appearance-none'
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button onClick={incrementQuantity}>+</button>
              </div> */}
            </div>
          </div>
        </div>
        <button className='p-4 text-white bg-black lg:mx-9 lg:self-end addtocart'>Them vao gio hàng</button>
      </div>
    </div>
  )
}