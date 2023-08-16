import React, {useEffect, useState} from "react";
import {TwitterPicker} from 'react-color'
import {ColorConfig} from '../apis/colorConfig'
import {RadioGroup, Radio} from 'react-radio-group'
import 'bootstrap/dist/css/bootstrap.min.css'
import eventEmitter from "../utils/eventEmitter";
import {Form} from "react-bootstrap";

export default function ColorCard({colorConfig, setColorConfig}) {
    const [accounts, setAccounts] = useState([])
    const [selected, setSelected] = useState("1")
    const [dataSearch, setDataSearch] = useState([])
    const [data, setData] = useState(null)

    async function handleSelected(value) {
        setSelected(value)
        const qq = {}
        if (+value === 2) qq.level = 2
        eventEmitter.emit('search', qq)
    }

    useEffect(() => {
        eventEmitter.on('dataSearch', da => {
            setData(da)
        })
    }, [])
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
    const search = (e) => {
        const text = e.target.value
        if(text === ''){
            setDataSearch([])
            return
        }
        const ok = data.filter(value => {
            return value.title.includes(text)
        })
        setDataSearch(ok)
    }
    const searchTitle = (value) => {
        console.log(value)
        eventEmitter.emit('searchTitle', value.start)
    }
    return (
        <>
            <div className={'py-3'}>
                <div className={'font-semibold'}>Lịch của tôi</div>
                {
                    (accounts || []).map(item => {
                        return (
                            <div className={'flex gap-2 items-center mt-2'} key={item._id}>
                                <div className={`w-[40px] h-[40px] rounded-md cursor-pointer shrink-0`}
                                     style={{backgroundColor: item.color}} onClick={() => showColorPicker(item)}>
                                </div>
                                {
                                    item.showPicker ?
                                        <div style={popover} onClick={() => hideColorPicker(item)}>
                                            <div style={cover}></div>
                                            <TwitterPicker onChange={(val) => onChangeColor(item, val)}/>
                                        </div> : <></>
                                }
                                <span className={'whitespace-nowrap text-ellipsis overflow-hidden'}>{item.email}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className={'py-3'}>
                <div className={'font-semibold'}>Lọc sự kiện</div>
                <RadioGroup name="fruit" selectedValue={selected} onChange={(value) => handleSelected(value)}>
                    <div className={'mt-2 flex gap-2'}>
                        <Radio className={'w-[20px]'} value="1"/>Tất cả
                    </div>
                    <div className={'flex gap-2 mt-2'}>
                        <Radio className={'w-[20px]'} value="2"/>Quan trọng
                    </div>
                </RadioGroup>
            </div>
            <div className={'py-3'}>
                <Form.Group controlId="formInput">
                    <Form.Control
                        className={'input-new-calendar'}
                        type="text" placeholder="tìm kiếm"
                        style={{border: 'none', borderBottom: '2px solid blue', borderRadius: '0px'}}
                        onChange={(e) => search(e)}
                    />
                    <div className={' h-[165px] px-3 py-3 overflow-y-auto overflow-x-hidden'}>
                        {(dataSearch || []).map(item => {
                            return (
                                <div key={item._id} onClick={() => searchTitle(item)}>
                                    {item.title}
                                </div>
                            )
                        })}
                    </div>

                </Form.Group>
            </div>
        </>
    )
}
