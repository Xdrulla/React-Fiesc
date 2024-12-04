import React from "react"
import MaskedInput from "react-text-mask"

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={ref}
      mask={[
        "+",
        "5",
        "5",
        " ",
        /\d/,
        /\d/,
        " ",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"_"}
      showMask
      onChange={(e) => onChange(e)}
    />
  )
})

export default TextMaskCustom
