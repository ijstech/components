import { getControlMediaQueriesStyle } from "@ijstech/base";
import * as Styles from "@ijstech/style";
import { IGridLayoutMediaQuery, IStackMediaQuery, StackDirectionType } from "../index";
import { IHover } from "../interfaces";
import { getMediaQueryRule, getSpacingValue } from "@ijstech/base";

export const panelStyle = Styles.style({
    display: 'block',
    clear: 'both',
    position: 'relative'
})

export const overflowStyle = Styles.style({
    overflow: 'hidden'
})

export const vStackStyle = Styles.style({
    display: 'flex',
    flexDirection: 'column'
})

export const hStackStyle = Styles.style({
    display: 'flex',
    flexDirection: 'row'
})

export const gridStyle = Styles.style({
    display: 'grid'
})

export const getStackDirectionStyleClass = (direction: StackDirectionType, reverse: boolean) => {
    const flexDirection = direction == 'vertical' ? 'column' : 'row';
    return Styles.style({
        display: 'flex',
        flexDirection: reverse ? `${flexDirection}-reverse` : flexDirection
    });
}

export const getStackMediaQueriesStyleClass = (mediaQueries: IStackMediaQuery[], currentDirection: StackDirectionType) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries);
    for (let mediaQuery of mediaQueries) {
        let mediaQueryRule = getMediaQueryRule(mediaQuery);
        if (mediaQueryRule) {
            styleObj['$nest'][mediaQueryRule] = styleObj['$nest'][mediaQueryRule] || {};
            const {
                direction,
                justifyContent,
                alignItems,
                alignSelf,
                gap,
                reverse
            } = mediaQuery.properties || {};
            if (direction) {
                styleObj['$nest'][mediaQueryRule]['flexDirection'] = `${direction == 'vertical' ? 'column' : 'row'} !important`;
            }
            if (justifyContent) {
                styleObj['$nest'][mediaQueryRule]['justifyContent'] = `${justifyContent} !important`;
            }
            if (alignItems) {
                styleObj['$nest'][mediaQueryRule]['alignItems'] = `${alignItems} !important`;
            }
            if (alignSelf) {
                styleObj['$nest'][mediaQueryRule]['alignSelf'] = `${alignSelf} !important`;
            }
            if (gap !== undefined && gap !== null) {
                styleObj['$nest'][mediaQueryRule]['gap'] = `${getSpacingValue(gap)} !important`;
            }
            if (reverse !== undefined && reverse !== null) {
                const direct = direction || currentDirection || 'horizontal';
                styleObj['$nest'][mediaQueryRule]['flexDirection'] = `${direct === 'vertical' ? 'column' : 'row'}${reverse ? '-reverse' : ''} !important`;
            }
        }
    }
    return Styles.style(styleObj);
}

export const justifyContentStartStyle = Styles.style({
    justifyContent: 'flex-start'
})

export const justifyContentCenterStyle = Styles.style({
    justifyContent: 'center'
})

export const justifyContentEndStyle = Styles.style({
    justifyContent: 'flex-end'
})

export const justifyContentSpaceBetweenStyle = Styles.style({
    justifyContent: 'space-between'
})

export const justifyContentSpaceAroundStyle = Styles.style({
    justifyContent: 'space-around'
})

export const justifyContentSpaceEvenlyStyle = Styles.style({
    justifyContent: 'space-evenly'
})

export const alignItemsStretchStyle = Styles.style({
    alignItems: 'stretch'
})

export const alignItemsBaselineStyle = Styles.style({
    alignItems: 'baseline'
})

export const alignItemsStartStyle = Styles.style({
    alignItems: 'flex-start'
})

export const alignItemsCenterStyle = Styles.style({
    alignItems: 'center'
})

export const alignItemsEndStyle = Styles.style({
    alignItems: 'flex-end'
})

export const alignSelfAutoStyle = Styles.style({
    alignSelf: 'auto'
})

export const alignSelfStretchStyle = Styles.style({
    alignSelf: 'stretch'
})

export const alignSelfStartStyle = Styles.style({
    alignSelf: 'flex-start'
})

export const alignSelfCenterStyle = Styles.style({
    alignSelf: 'center'
})

export const alignSelfEndStyle = Styles.style({
    alignSelf: 'flex-end'
})

export const alignContentSpaceBetweenStyle = Styles.style({
    alignContent: 'space-between'
})

export const alignContentSpaceAroundStyle = Styles.style({
    alignContent: 'space-around'
})

export const alignContentStretchStyle = Styles.style({
    alignContent: 'stretch'
})

export const alignContentStartStyle = Styles.style({
    alignContent: 'flex-start'
})

export const alignContentCenterStyle = Styles.style({
    alignContent: 'center'
})

export const alignContentEndStyle = Styles.style({
    alignContent: 'flex-end'
})

export const getTemplateColumnsStyleClass = (columns: string[]) => {
    return Styles.style({
        gridTemplateColumns: columns.join(' ')
    });
}

export const getTemplateRowsStyleClass = (rows: string[]) => {
    return Styles.style({
        gridTemplateRows: rows.join(' ')
    });
}

export const getTemplateAreasStyleClass = (templateAreas: string[][]) => {
    let templateAreasStr = '';
    for (let i = 0; i < templateAreas.length; i++) {
        templateAreasStr += '"' + templateAreas[i].join(' ') + '" ';
    } 
    return Styles.style({
        gridTemplateAreas: templateAreasStr
    });
}

export const getGridLayoutMediaQueriesStyleClass = (mediaQueries: IGridLayoutMediaQuery[]) => {
    let styleObj: any = getControlMediaQueriesStyle(mediaQueries, { display: 'grid' });
    for (let mediaQuery of mediaQueries) {
        let mediaQueryRule = getMediaQueryRule(mediaQuery);
        if (mediaQueryRule) {
            styleObj['$nest'][mediaQueryRule] = styleObj['$nest'][mediaQueryRule] || {};
            const {
                templateColumns,
                templateRows,
                templateAreas,
                gap
            } = mediaQuery.properties || {};
            if (templateColumns) {
                const templateColumnsStr = templateColumns.join(' ');
                styleObj['$nest'][mediaQueryRule]['gridTemplateColumns'] = `${templateColumnsStr} !important`;
            }
            if (templateRows) {
                const templateRowsStr = templateRows.join(' ');
                styleObj['$nest'][mediaQueryRule]['gridTemplateRows'] = `${templateRowsStr} !important`;
            }
            if (templateAreas) {
                let templateAreasStr = '';
                for (let i = 0; i < templateAreas.length; i++) {
                    templateAreasStr += '"' + templateAreas[i].join(' ') + '" ';
                } 
                styleObj['$nest'][mediaQueryRule]['gridTemplateAreas'] = `${templateAreasStr} !important`;
            }
            if (gap !== undefined && gap !== null) {
                if (gap.row) {
                    styleObj['$nest'][mediaQueryRule]['rowGap'] = `${getSpacingValue(gap.row)}!important`;
                }
                if (gap.column) {
                    styleObj['$nest'][mediaQueryRule]['columnGap'] = `${getSpacingValue(gap.column)}!important`;
                }
            }
        }
    }
    return Styles.style(styleObj);
}

export const getHoverStyleClass = (hover: IHover) => {
    return Styles.style({
        $nest: {
            '&:hover': {
                backgroundColor: hover.backgroundColor,
                color: hover.fontColor,
                opacity: hover.opacity
            }
        }
    });
}