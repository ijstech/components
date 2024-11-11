import * as Styles from '@ijstech/style';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('i-data-grid', {
    border: '0.5px solid #dadada',
    $nest: {
        '.container': {
            position: 'absolute',
            overflow: 'hidden',
            height: '100%',
            width: '100%'
        },
        '.scrollBox': {
            overflow: 'auto',
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            zIndex: 4
        },
        '.grid': {
            position: 'absolute',
            fontSize: '12px',
            fontFamily: '"Segoe UI", Tahoma, Arial, Helvetica, sans-serif',
            color: '#5A5757',
            // borderCollapse: 'seperate',
            borderSpacing: 0,
            tableLayout: 'fixed',
            // backgroundColor: 'white',
            // width: '100%'
        },
        '.grid tr': {
            overflow: 'hidden'
        },
        '.grid tr div': {
            /* border-box: border-box; */
            paddingLeft: '2px',
            paddingRight: '2px',
        },
        '.grid_cell_hidden': {
            display: 'none'
        },
        '.grid_fixed_cell': {
            background:'#F9F9F9',
            borderBottom: '0.5px solid #dadada',
            borderRight: '0.5px solid #dadada',
            // outline: '0.5px solid #dadada',
            boxSizing: 'border-box'    
            /*border-left: none;*/
        },
        '.grid_curr_cell': {
            border: '2px solid #5f5f5f',/* #4285f4;*/
            boxSizing: 'border-box'
            /*pointer-events: none;*/
        },
        '.grid_selected_cell': {
            backgroundColor: 'rgb(160, 195, 255)',
            pointerEvents: 'none',
            opacity: 0.2
        },
        '.grid_cell': {  
            borderBottom: '0.5px solid #dadada',
            borderRight: '0.5px solid #dadada',
            // outline: '0.5px solid #dadada',
            boxSizing: 'border-box',
            background: 'white',
            cursor: 'default',
            // overflow: 'hidden'
        },
        '.grid_cell_value': {
            textOverflow: 'ellipsis',
            wordWrap: 'break-word',
            whiteSpace: 'pre',
            width: '100%'
        },
        '.grid_cell_value.image img': {
            maxHeight: '100%',
            maxWidth: '100%'
        },
        '.grid_header_splitter': {
            position: 'relative',
            zoom: 1,
            filter: 'alpha(opacity=50)',        
            opacity: 0.5,
            float: 'right',
            cursor: 'e-resize'	
        },
        'input': {
            border: 'none',
            outline: 'none'
        },
        'table': {
            marginLeft: '1px',
            marginTop: '1px'
        }
    }
})