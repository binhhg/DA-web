import React, {useEffect} from "react";
import eventEmitter from '../utils/eventEmitter'
export default function ModalDaysiui(){
    const closeModal = () => {
        const modal = document.getElementById('my_modal_2')
        modal.classList.remove('modal-open')
    }

    useEffect(() => {
        eventEmitter.on('testDaysi', () => {
            console.log('vao day chua')
            const modal = document.getElementById('my_modal_2')
            modal.classList.add('modal-open')
        })
    }, [])
    return (
        <dialog id="my_modal_2" className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click outside to close</p>
                <div className="modal-action">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </div>
            </form>
            <form method="dialog" className=" modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
