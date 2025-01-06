import { Styles } from "@ijstech/components";

export const customScrollbarCss = Styles.style({
  $nest: {
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
})