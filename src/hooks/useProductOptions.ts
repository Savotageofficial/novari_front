import { useMemo, useState } from 'react'
import { COLOR_OPTIONS } from '../data/colors'
import type { ColorOption } from '../data/colors'
import { DEFAULT_SIZE } from '../data/sizes'
import type { SizeOption } from '../data/sizes'
import type { Product } from '../data/products'

function getAvailableColors(product: Product | undefined): ColorOption[] {
  if (!product) return COLOR_OPTIONS
  return COLOR_OPTIONS.filter((color) => product.colors.includes(color.name))
}

function getDefaultColor(availableColors: ColorOption[]): ColorOption {
  return availableColors[0] ?? COLOR_OPTIONS[0]
}

export function useProductOptions(product: Product | undefined) {
  const availableColors = useMemo(
    () => getAvailableColors(product),
    [product]
  )
  const defaultColor = useMemo(
    () => getDefaultColor(availableColors),
    [availableColors]
  )

  const [colorOverride, setColorOverride] = useState<ColorOption | null>(null)
  const [selectedSize, setSelectedSize] = useState<SizeOption>(DEFAULT_SIZE)

  const selectedColor = useMemo(() => {
    if (
      colorOverride &&
      availableColors.some((color) => color.name === colorOverride.name)
    ) {
      return colorOverride
    }
    return defaultColor
  }, [colorOverride, availableColors, defaultColor])

  return {
    selectedColor,
    setSelectedColor: setColorOverride,
    selectedSize,
    setSelectedSize,
    availableColors,
  }
}
