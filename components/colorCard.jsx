import {useEffect, useState} from "react";
import {TwitterPicker} from 'react-color'
import {ColorConfig} from '../apis/colorConfig'

import 'bootstrap/dist/css/bootstrap.min.css'
export default function ColorCard({colorConfig, setColorConfig}) {
    const [accounts, setAccounts] = useState([])

    useEffect(() => {
        const arr = (colorConfig?.accountColor || []).map(item => {
            return {
                ...item,
                showPicker: false
            }
        })
        arr.unshift({
            _id: 'defaultId',
            email: 'Mặc định',
            color: colorConfig?.defaultColor || 'red'
        })
        setAccounts(arr)
    }, [colorConfig])

    const showColorPicker = (item) => {
        setAccounts(arr => {
            (arr || []).forEach(i => {
                i.showPicker = i._id === item._id
            })
            return [...arr]
        })
    }

    const hideColorPicker = (item) => {
        setAccounts(arr => {
            (arr || []).forEach(i => {
                i.showPicker = false
            })
            return [...arr]
        })
    }

    const onChangeColor = async (item, color) => {
        const qq = item
        qq.color = color.hex
        const zz = await ColorConfig.changeColorConfig({dataChange: qq})
        setColorConfig(zz)
        setAccounts(arr => {
            (arr || []).forEach(i => {
                if (i._id === item._id) {
                    i.color = color.hex
                }
            })
            return [...arr]
        })
    }

    const popover = {
        position: 'absolute',
        zIndex: '2',
    }
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    }

    return (
        <div className={'py-3'}>
            <div className={'font-semibold'}>Lịch của tôi</div>
            {
                (accounts || []).map(item => {
                    return (
                        <div className={'flex gap-2 items-center mt-2'} key={item._id}>
                            <div className={`w-[40px] h-[40px] rounded-md cursor-pointer`}
                                 style={{backgroundColor: item.color}} onClick={() => showColorPicker(item)}>
                            </div>
                            {
                                item.showPicker ?
                                    <div style={popover} onClick={() => hideColorPicker(item)}>
                                        <div style={cover}></div>
                                        <TwitterPicker onChange={(val) => onChangeColor(item, val)}/>
                                    </div> : <></>
                            }
                            <span>{item.email}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}
