// @flow
import React from 'react'

type SVGElement = HTMLElement & {
  fonts: [],
  fillOpacity: number,
}

export default function GetIcon({
  icon,
  className,
  width,
}: {
  icon: SVGElement,
  className: string,
  width: number,
}): React$Element<React$FragmentType> {
  return (
    <>
      <img src={icon} className={className} alt={`icon`} style={{ width: width }} />
    </>
  )
}
