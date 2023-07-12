import Image from 'next/image'
import React, {Fragment} from 'react'
import icon_google from '../assets/googel.svg'
import background from '../assets/img/home.png'
import {signIn} from 'next-auth/react'

export default function Home() {
    async function handlerSignGoogle() {
        console.log('zzzzzzzzzzzzz')
        localStorage.setItem('account', false)
        const qq = await signIn('google')
        console.log(qq)
    }

    return (
        <div
            className={'flex items-center justify-end'}
            style={{
                backgroundImage: `url(${background.src})`,
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div
                className="px-6 py-8 w-[500px] rounded-lg lg:box-shadow mx-auto lg:ml-60 !mt-60 lg:my-0 my-8">
                <div>Chào mừng bạn đến với iCalendar - nền tảng đồng bộ nhanh chóng và dễ dàng cho nhiều tài khoản cloud
                    của
                    bạn.
                </div>
                <div className={'font-semibold text-center'}>Đăng nhập ngay</div>
                <Fragment>
                    <div className="flex flex-col gap-y-1 py-2"></div>

                </Fragment>
                <div className="text-center flex flex-col gap-y-2">
                    <div
                        className="flex bg-white items-center justify-center gap-x-2 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-200 border-gray-300 border-[1px]"
                    >
                        <Image
                            src={icon_google}
                            alt={'icon-google'}
                            width={30}
                            height={30}
                        />
                        <span>Google</span>

                    </div>
                </div>
            </div>
            <button onClick={handlerSignGoogle}>asadasdasd</button>
        </div>)
}
