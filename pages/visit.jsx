import React, { useState } from 'react';
import {Menu, MenuItem, MenuButton,SubMenu, MenuDivider} from '@szhsin/react-menu'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRight, faUserCircle} from '@fortawesome/free-solid-svg-icons'

export default function Visit() {

    return (
        <>
            <Menu menuButton={<MenuButton>Open menu</MenuButton>}>
                <MenuItem>New File</MenuItem>
                <MenuItem>Save</MenuItem>
                <SubMenu label="Edit">
                    <MenuItem>Cut</MenuItem>
                    <MenuItem>Copy</MenuItem>
                    <MenuItem>Paste</MenuItem>
                </SubMenu>
                <MenuItem>Print...</MenuItem>
            </Menu>
        </>
    );
}
