import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperCore } from 'swiper/types'
import { EffectCoverflow, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { products } from '~/dummyData/product'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/containers/store'
import { getAccessories } from '~/redux/actions/accessory.action'
import { getColors } from '~/redux/actions/color.action'
import { getSizes } from '~/redux/actions/size.action'
import { addCartItem } from '~/types/cartItem.type'
import { createCartItem2 } from '~/redux/actions/cartItem.action'
import { CartItem } from '~/types/product.type'
import { getMaterials, getProductMaterial, getProductMaterialDetail } from '~/redux/actions/material.action'
import { material } from '~/types/material.type'

export default function CustomizeProduct() {
  const color = useSelector((state: RootState) => state.color.colorList)
  const size = useSelector((state: RootState) => state.size.sizeList)
  const accessoryData = useSelector((state: RootState) => state.accessory.accessoryList)
  const material = useSelector((state: RootState) => state.material.material)

  const dispatch = useAppDispatch()
  const swiperRef = useRef<SwiperCore | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedAccess, setSelectedAccess] = useState<number | null>(null)
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [product, setProduct] = useState({
    id: 0,
    name: 'Custom product',
    price: 0,
    coverImage: ''
  })
  const [cartInfo, setCartInfo] = useState<addCartItem>({
    colorId: 0,
    sizeId: 0,
    accessoryId: 0,
    quantity: 0
  })
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    dispatch(getAccessories({ signal }))
    dispatch(getColors({ signal }))
    dispatch(getSizes({ signal }))
    // dispatch(getMaterials({ signal }))
    dispatch(getProductMaterial(11))

    return () => {
      abortController.abort()
    }
  }, [dispatch])

  const updateMaterialId = () => {
    if (selectedColor !== null && selectedSize !== null && selectedAccess !== null && Array.isArray(material)) {
      const foundMaterial = material.find(
        (material: material) =>
          material.colorId === selectedColor &&
          material.sizeId === selectedSize &&
          material.accessoryId === selectedAccess
      )

      if (foundMaterial) {
        setSelectedMaterialId(foundMaterial.id)
        setProduct((prevProduct) => ({
          ...prevProduct,
          price: totalPrice
        }))

        dispatch(getProductMaterialDetail(foundMaterial.id))
      }
    }
  }

  useEffect(() => {
    updateMaterialId()
  }, [selectedColor, selectedSize, selectedAccess])

  // const generateUniqueId = (product: any, cartInfo: addCartItem): string => {
  //   return `${product.id}-${cartInfo.colorId}-${cartInfo.sizeId}-${cartInfo.accessoryId}`;
  // };

  // const addToCart = (): Omit<CartItem, 'quantity'> | null => {
  //   if (product) {
  //     const productInCart = {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price || 0,
  //       image: product.coverImage
  //     }

  //     return productInCart
  //   }
  //   return null
  // }

  const addToCart = (): Omit<CartItem, 'quantity'> | null => {
    if (product && selectedMaterialId !== null && Array.isArray(material)) {
      const selectedMaterial = material.find((material) => material.id === selectedMaterialId);
      if (selectedMaterial) {
        const productInCart = {
          id: product.id,
          name: product.name,
          price: selectedMaterial.price || 0,
          image: product.coverImage
        }
        return productInCart;
      }
    }
    return null;
  };
  

  const [activeColor, setActiveColor] = useState<number | null>(null)
  const [activeSize, setActiveSize] = useState<number | null>(null)
  const handleColorSelect = (colorId: number) => {
    setSelectedColor(colorId)
    setActiveColor(colorId)
    updateSelectedMaterialId(colorId, activeSize)
  }

  const handleSizeSelect = (sizeId: number) => {
    setSelectedSize(sizeId)
    setActiveSize(sizeId)
    updateSelectedMaterialId(activeColor, sizeId)
  }

  const handleAccessSelect = (id: number, index: number) => {
    setSelectedAccess(id)
    swiperRef.current?.slideTo(index)
  }

  // const updateSelectedMaterialId = (colorId: number | null, sizeId: number | null) => {
  //   if (colorId !== null && sizeId !== null && Array.isArray(material)) {
  //     const selectedMaterial = material.find(
  //       (material: material) => material.colorId === colorId && material.sizeId === sizeId
  //     )
  //     if (selectedMaterial) {
  //       setSelectedMaterialId(selectedMaterial.id)
  //       setTotalPrice(quantity * selectedMaterial.price)
  //     }
  //   }
  // }
  const updateSelectedMaterialId = (colorId: number | null, sizeId: number | null) => {
    if (colorId !== null && sizeId !== null && Array.isArray(material)) {
      const selectedMaterial = material.find(
        (material: material) => material.colorId === colorId && material.sizeId === sizeId
      )
      if (selectedMaterial) {
        console.log('Found selected material:', selectedMaterial);
        setSelectedMaterialId(selectedMaterial.id);
        setTotalPrice(quantity * selectedMaterial.price);
      } else {
        console.log('No selected material found');
      }
    }
  }
  
  const formatPriceToVND = (price: number): string => {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} ₫`
  }

  console.log('MATE: ', material)

  // const incrementQuantity = () => {
  //   setQuantity((prevQuantity) => prevQuantity + 1)
  // }

  const incrementQuantity = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)

    if (selectedMaterialId !== null && Array.isArray(material)) {
      const selectedMaterial = material.find((material) => material.id === selectedMaterialId)
      if (selectedMaterial) {
        setTotalPrice(newQuantity * selectedMaterial.price)
      }
    }
  }

  // const decrementQuantity = () => {
  //   setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1))
  // }

  const decrementQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)

      if (selectedMaterialId !== null && Array.isArray(material)) {
        const selectedMaterial = material.find((material) => material.id === selectedMaterialId)
        if (selectedMaterial) {
          setTotalPrice(newQuantity * selectedMaterial.price)
        }
      }
    }
  }

  useEffect(() => {
    if (selectedColor !== null && selectedSize !== null && selectedAccess !== null) {
      setCartInfo({
        colorId: selectedColor,
        sizeId: selectedSize,
        accessoryId: selectedAccess,
        quantity: quantity
      })
    }
  }, [selectedColor, selectedSize, selectedAccess, quantity])

  // console.log('Access: ', accessoryData)

  console.log('Cart info: ', cartInfo)

  const handleAddToCart = () => {
    const productInCart = addToCart()
    if (!productInCart) {
      return
    }
    // const uniqueId = generateUniqueId(product, cartInfo);
    dispatch(createCartItem2(cartInfo))

    let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')

    const newLocalStorageCartItem = {
      ...productInCart,
      quantity: cartInfo.quantity,
      sizeId: cartInfo.sizeId,
      colorId: cartInfo.colorId,
      accessId: cartInfo.accessoryId
    }

    const existingProductIndex = cartItems.findIndex(
      (item: addCartItem) =>
        // item.productId === newLocalStorageCartItem.id &&
        item.sizeId === newLocalStorageCartItem.sizeId &&
        item.colorId === newLocalStorageCartItem.colorId &&
        item.accessoryId === newLocalStorageCartItem.accessId
    )

    // const existingProductIndex = cartItems.findIndex((item: CartItem) => item.id === newLocalStorageCartItem.id);

    if (existingProductIndex !== -1) {
      cartItems[existingProductIndex].quantity += newLocalStorageCartItem.quantity
    } else {
      cartItems.push(newLocalStorageCartItem)
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems))
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
          {accessoryData.map((accessories, index) => (
            <SwiperSlide key={index} className='w-[50%] h-full'>
              <img className='object-contain w-full h-full' src={accessories.image} alt={accessories.name} />
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
              <div></div>
              <div className='flex justify-around gap-2 colorbutton'>
                {color.map((color, index) => (
                  <button
                    key={index}
                    className='w-6 h-6 lg:w-8 lg:h-8'
                    style={{ backgroundColor: color.name }}
                    // onClick={() => handleColorSelect(index)}
                    onClick={() => handleColorSelect(color.id!)}
                  ></button>
                ))}
              </div>
            </div>
            <div className='w-3/4 relative flex flex-col gap-3 colors after:absolute after:bottom-[-25%] after:left-[50%] after:translate-x-[-50%] after:bg-black after:h-[2px] mx-auto after:lg:w-96 after:sm:w-40'>
              <label className='text-2xl text-left'>Item:</label>
              <div className='grid grid-cols-5 gap-6 colorbutton'>
                {accessoryData.map((item, index) => (
                  <button key={item.id} onClick={() => handleAccessSelect(item.id, index)}>
                    <img className='w-10 h-10 lg:w-16 lg:h-16 bg-gray-50' src={item.image} alt={item.name} />
                  </button>
                ))}
              </div>
            </div>
            <div className='flex items-center justify-evenly mt-[30px]'>
              <div className='flex gap-4 size'>
                {size.map((size, index) => (
                  <button
                    key={index}
                    className='w-6 h-6 bg-gray-300 lg:w-8 lg:h-8'
                    onClick={() => handleSizeSelect(size.id!)}
                  >
                    {size.name!}
                  </button>
                ))}
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
            </div>
          </div>
        </div>
        <h3 className='md:text-2xl text-xl'>
          Thành tiền: {selectedMaterialId !== null ? formatPriceToVND(totalPrice) : 'Chọn màu và kích thước'}
        </h3>
        <button onClick={handleAddToCart} className='p-4 text-white bg-black lg:mx-9 lg:self-end addtocart'>
          Them vao gio hàng
        </button>
      </div>
    </div>
  )
}
