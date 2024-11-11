import * as Styles from "@ijstech/style";
import { ICarouselMediaQuery } from "../carousel";
import { getControlMediaQueriesStyle, getMediaQueryRule } from "@ijstech/base";

const Theme = Styles.Theme.ThemeVars;

export const sliderStyle = Styles.style({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  $nest: {
    ".hidden": {
      display: 'none !important'
    },
    "> div": {
      flexGrow: 1
    },
    "i-carousel-item": {
      height: '100%'
    },
    ".wrapper-slider": {
      display: 'flex',
      alignItems: 'center',
    },
    ".wrapper-slider-list": {
      display: 'block',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    ".slider-arrow": {
      width: 28,
      height: 28,
      fill: Theme.colors.primary.main,
      cursor: 'pointer',
    },
    ".slider-arrow-hidden": {
      visibility: 'hidden',
    },
    ".slider-list": {
      display: 'flex',
      position: 'relative',
      transition: 'transform 500ms ease',
      height: '100%',
      touchAction: 'none'
    },
    ".slider-list > *": {
      flexShrink: '0',
    },
    ".dots-pagination": {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      marginBlock: '1rem',
      listStyle: 'none',
      gap: '0.4rem',
      position: 'absolute',
      bottom: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
      $nest: {
        ".--dot": {
          display: 'flex',
          cursor: 'pointer'
        },
        ".--dot > span": {
          display: 'inline-block',
          minWidth: '0.8rem',
          minHeight: '0.8rem',
          backgroundColor: 'transparent',
          border: `2px solid ${Theme.colors.primary.main}`,
          borderRadius: '50%',
          transition: 'background-color 0.35s ease-in-out',
          textAlign: 'center',
          fontSize: '.75rem',
          width: 'auto',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        ".--active > span": {
          backgroundColor: Theme.colors.primary.main,
        },
      }
    },
  }
})

export const getCarouselMediaQueriesStyleClass = (mediaQueries: ICarouselMediaQuery[]) => {
  let styleObj: any = getControlMediaQueriesStyle(mediaQueries);
  for (let mediaQuery of mediaQueries) {
    let mediaQueryRule = getMediaQueryRule(mediaQuery);
    if (mediaQueryRule) {
      styleObj['$nest'][mediaQueryRule] = styleObj['$nest'][mediaQueryRule] || {};
      const ruleObj = styleObj['$nest'][mediaQueryRule];
      const nestObj = styleObj['$nest'][mediaQueryRule]['$nest'] || {};
      styleObj['$nest'][mediaQueryRule] = {
        ...ruleObj,
        $nest: {
          ...nestObj,
          '.dots-pagination': {}
        }
      };
      const {
        indicators
      } = mediaQuery.properties || {};
      if (indicators !== undefined && indicators !== null) {
        styleObj['$nest'][mediaQueryRule]['$nest']['.dots-pagination']['display'] = indicators ? `flex !important` : 'none !important';
      }
    }
  }
  return Styles.style(styleObj);
}